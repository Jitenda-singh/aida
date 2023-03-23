import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";
import { v4 as uuidV4 } from 'uuid';
import { httpConstants } from "../../constants/httpConstants";
import { call, getTableName, prepareQueryObj } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
import { fetchData, queryData, updateItem } from "../../helper/helper";
export const handler = async (event, context, callback) => {
  try {
    const claims = getClaims(event);
    const isAuthorizedUser = (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].length > 0 && claims["cognito:groups"].includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-admin-group`));
    if (!isAuthorizedUser)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    const postData = JSON.parse(event.body);
    try {
      let tableName = await getTableName(constants.TABLE_NAME_DATA_TABLE);
      let cameraData;
      if (postData.action === constants.ACTION_CREATE) {
        cameraData = await createCamera(postData, tableName);
      } else if (postData.action === constants.ACTION_UPDATE) {
        cameraData = await updateCamera(postData, tableName);
      }
      callback(null, success(cameraData && cameraData.Attributes ? cameraData.Attributes : {}));
    } catch (e) {
      console.error("Exception in createOrUpdateCamera", e);
      return failure(e.statusCode, `Failed to ${postData.action} camera`);
    }
  } catch (e) {
    console.log(e);
    return failure(e.statusCode, "Failed to get user");
  }
};

const createCamera = async (postData, tableName) => {
  if (!(
    postData.deviceId &&
    postData.cameraName &&
    postData.streamId
  )) {
    throw new Error("Required fields is missing");
  }
  const cameraId = uuidV4();
  const deviceData = await fetchData(
    { "PK": constants.DEVICE_HASH, "SK": constants.DEVICE_HASH + postData.deviceId },
    tableName
  );
  const expressionAttributeValues = {
    ":cameraId": cameraId,
    ":deviceId": postData.deviceId,
    ":deviceName": deviceData.deviceName,
    ":companyId": deviceData.companyId,
    ":companyName": deviceData.companyName,
    ":cameraName": postData.cameraName,
    ":streamId": postData.streamId,
    ":GSI1PK": constants.DEVICE_HASH + postData.deviceId,
    ":GSI1SK": constants.CAMERA_HASH + cameraId
  };
  const key = {
    "PK": constants.CAMERA_HASH,
    "SK": constants.CAMERA_HASH + cameraId,
  };
  const updateExpression = "Set cameraId =:cameraId, deviceId =:deviceId, deviceName=:deviceName, companyId =:companyId, companyName=:companyName, cameraName =:cameraName, streamId =:streamId, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const createCameraParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "UPDATED_NEW");
  return await call('update', createCameraParams);
};

const updateCamera = async (postData, tableName) => {
  if (!(
    postData.cameraId &&
    postData.deviceId &&
    postData.cameraName &&
    postData.streamId
  )) {
    throw new Error("Required fields is missing");
  }
  const deviceData = await fetchData(
    { "PK": constants.DEVICE_HASH, "SK": constants.DEVICE_HASH + postData.deviceId },
    tableName
  );
  const expressionAttributeValues = {
    ":cameraId": postData.cameraId,
    ":deviceId": postData.deviceId,
    ":deviceName": deviceData.deviceName || "",
    ":companyId": deviceData.companyId,
    ":companyName": deviceData.companyName || "",
    ":cameraName": postData.cameraName,
    ":streamId": postData.streamId,
    ":GSI1PK": constants.DEVICE_HASH + postData.deviceId,
    ":GSI1SK": constants.CAMERA_HASH + postData.cameraId
  };
  const key = {
    "PK": constants.CAMERA_HASH,
    "SK": constants.CAMERA_HASH + postData.cameraId,
  };
  const oldCameraData = await fetchData(
    { "PK": constants.CAMERA_HASH, "SK": constants.CAMERA_HASH + postData.cameraId },
    tableName
  );
  if (oldCameraData.cameraName !== postData.cameraName) {
    await queryAndUpdate(postData.cameraId, tableName, postData.cameraName);
  }
  const updateExpression = "Set cameraId =:cameraId, deviceId =:deviceId, deviceName=:deviceName, companyId =:companyId, companyName=:companyName, cameraName =:cameraName, streamId =:streamId, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
  const updateCameraParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
  const cameraData = await call('update', updateCameraParams);
  return cameraData;
};

const queryAndUpdate = async (cameraId, tableName, cameraName) => {
  const indexName = constants.GLOBAL_INDEX_GSI1;
  let lastEvaluatedKey;
  // let itemList = [];
  do {
    const expAttrValues = {
      ':GSI1PK': constants.CAMERA_HASH + cameraId
    };
    const keyCondExp = 'GSI1PK=:GSI1PK';
    const { Items, LastEvaluatedKey } = await queryData(tableName, indexName, expAttrValues, keyCondExp, lastEvaluatedKey);
    lastEvaluatedKey = LastEvaluatedKey;
    // itemList = itemList.concat(Items);
    Promise.all(Items && Items.length && Items.map(async item => {
      const expAttributeValues = {
        ":cameraName": cameraName
      };
      const key = {
        "PK": item.PK,
        "SK": item.SK
      };
      const updateExpression = "Set cameraName =:cameraName";
      await updateItem(tableName, key, expAttributeValues, updateExpression);
    }));
  } while (typeof lastEvaluatedKey != "undefined");
};