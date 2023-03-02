import { success, failure } from "../../libs/response-lib";
import { isAuthorizedUser } from "../../libs/auth-lib";
import { v4 as uuidV4 } from 'uuid';
import { httpConstants } from "../../constants/httpConstants";
import { call, getTableName, prepareQueryObj } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
export const handler = async (event, context, callback) => {
  try {
    if (!isAuthorizedUser(event))
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
    postData.companyId &&
    postData.cameraName &&
    postData.streamId
  )) {
    throw new Error("Required fields is missing");
  }
  const cameraId = uuidV4();
  const expressionAttributeValues = {
    ":cameraId": cameraId,
    ":deviceId": postData.deviceId,
    ":companyId": postData.companyId,
    ":cameraName": postData.cameraName,
    ":streamId": postData.streamId,
    ":GSI1PK": "DEV#" + postData.deviceId,
    ":GSI1SK": "CAM#" + cameraId
  };
  const key = {
    "PK": "CAM#",
    "SK": "CAM#" + cameraId,
  };
  const updateExpression = "Set cameraId =:cameraId, deviceId =:deviceId, companyId =:companyId, cameraName =:cameraName, streamId =:streamId, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const createCameraParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "UPDATED_NEW");
  return await call('update', createCameraParams);
};

const updateCamera = async (postData, tableName) => {
  if (!(
    postData.cameraId &&
    postData.deviceId &&
    postData.companyId &&
    postData.cameraName &&
    postData.streamId
  )) {
    throw new Error("Required fields is missing");
  }
  const expressionAttributeValues = {
    ":cameraId": postData.cameraId,
    ":deviceId": postData.deviceId,
    ":companyId": postData.companyId,
    ":cameraName": postData.cameraName,
    ":streamId": postData.streamId,
    ":GSI1PK": "DEV#" + postData.deviceId,
    ":GSI1SK": "CAM#" + postData.cameraId
  };
  const key = {
    "PK": "CAM#",
    "SK": "CAM#" + postData.cameraId,
  };
  const updateExpression = "Set cameraId =:cameraId, deviceId =:deviceId, companyId =:companyId, cameraName =:cameraName, streamId =:streamId, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
  const updateCameraParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
  return await call('update', updateCameraParams);
};