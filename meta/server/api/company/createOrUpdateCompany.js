import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";
import { v4 as uuidV4 } from 'uuid';
import { httpConstants } from "../../constants/httpConstants";
import { call, getTableName, prepareQueryObj } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
import { fetchAll, fetchData, updateItem } from "../../helper/helper";
export const handler = async (event, context, callback) => {
  try {
    const claims = getClaims(event);
    const isAuthorizedUser = (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].length > 0 && claims["cognito:groups"].includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-admin-group`));
    if (!isAuthorizedUser)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    const postData = JSON.parse(event.body);
    try {
      let tableName = await getTableName(constants.TABLE_NAME_DATA_TABLE);
      let companyData;
      if (postData.action === constants.ACTION_CREATE) {
        companyData = await createCompany(postData, tableName);
      } else if (postData.action === constants.ACTION_UPDATE) {
        companyData = await updateCompany(postData, tableName);
      }
      callback(null, success(companyData && companyData.Attributes ? companyData.Attributes : {}));
    } catch (e) {
      console.error("Exception in createOrUpdateCompany", e);
      return failure(e.statusCode, `Failed to ${postData.action} company`);
    }
  } catch (e) {
    console.log(e);
    return failure(e.statusCode, "Failed to get user");
  }
};

const createCompany = async (postData, tableName) => {
  if (!(
    postData.companyName &&
    postData.mainContactUserIds && postData.mainContactUserIds.length > 0
  )) {
    throw new Error("Required fields is missing");
  }
  const companyId = uuidV4();
  const expressionAttributeValues = {
    ":companyId": companyId,
    ":companyName": postData.companyName,
    ":mainContactUserIds": postData.mainContactUserIds
  };
  const key = {
    "PK": "COM#",
    "SK": "COM#" + companyId,
  };
  const updateExpression = "Set companyId=:companyId, companyName =:companyName, mainContactUserIds =:mainContactUserIds";
  const createCompanyParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "UPDATED_NEW");
  return await call('update', createCompanyParams);
};

const updateCompany = async (postData, tableName) => {
  if (!(
    postData.companyId &&
    postData.companyName &&
    postData.mainContactUserIds && postData.mainContactUserIds.length > 0
  )) {
    throw new Error("Required fields is missing");
  }
  const expressionAttributeValues = {
    ":companyId": postData.companyId,
    ":companyName": postData.companyName,
    ":mainContactUserIds": postData.mainContactUserIds
  };
  const key = {
    "PK": "COM#",
    "SK": "COM#" + postData.companyId,
  };
  const oldCompanyData = await fetchData(
    { "PK": constants.COMPANY_HASH, "SK": constants.COMPANY_HASH + postData.companyId },
    tableName
  );
  if (oldCompanyData.companyName !== postData.companyName) {
    await updateCompanyNameInDevice(postData.companyId, tableName, postData.companyName);
  }
  const updateExpression = "Set companyId=:companyId, companyName =:companyName, mainContactUserIds =:mainContactUserIds";
  const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
  const updateCompanyParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
  const companyData = await call('update', updateCompanyParams);
  return companyData;
};

const updateCompanyNameInDevice = async (companyId, tableName, companyName) => {
  const indexName = constants.GLOBAL_INDEX_GSI1;
  const expAttrValues = {
    ':GSI1PK': constants.COMPANY_HASH + companyId
  };
  const keyCondExp = 'GSI1PK=:GSI1PK';
  let getObj = prepareQueryObj("", "", tableName, indexName, "", "", expAttrValues, "", "", "", keyCondExp);
  let deviceList = await fetchAll(getObj);
  Promise.all(deviceList && deviceList.length && deviceList.map(async item => {
    await updateCompanyNameInCamera(item.deviceId, tableName, companyName);
    const expAttributeValues = {
      ":companyName": companyName
    };
    const key = {
      "PK": item.PK,
      "SK": item.SK
    };
    const updateExpression = "Set companyName =:companyName";
    await updateItem(tableName, key, expAttributeValues, updateExpression);
  }));
};

const updateCompanyNameInCamera = async (deviceId, tableName, companyName) => {
  const indexName = constants.GLOBAL_INDEX_GSI1;
  const expAttrValues = {
    ':GSI1PK': constants.DEVICE_HASH + deviceId
  };
  const keyCondExp = 'GSI1PK=:GSI1PK';
  let getObj = prepareQueryObj("", "", tableName, indexName, "", "", expAttrValues, "", "", "", keyCondExp);
  let cameraList = await fetchAll(getObj);
  Promise.all(cameraList && cameraList.length && cameraList.map(async item => {
    await updateCompanyNameInCameraVisibility(item.cameraId, tableName, companyName);
    const expAttributeValues = {
      ":companyName": companyName
    };
    const key = {
      "PK": item.PK,
      "SK": item.SK
    };
    const updateExpression = "Set companyName =:companyName";
    await updateItem(tableName, key, expAttributeValues, updateExpression);
  }));
};
const updateCompanyNameInCameraVisibility = async (cameraId, tableName, companyName) => {
  const indexName = constants.GLOBAL_INDEX_GSI1;
  const expAttrValues = {
    ':GSI1PK': constants.CAMERA_HASH + cameraId
  };
  const keyCondExp = 'GSI1PK=:GSI1PK';
  let getObj = prepareQueryObj("", "", tableName, indexName, "", "", expAttrValues, "", "", "", keyCondExp);
  let cameraVisList = await fetchAll(getObj);
  Promise.all(cameraVisList && cameraVisList.length && cameraVisList.map(async item => {
    const expAttributeValues = {
      ":companyName": companyName
    };
    const key = {
      "PK": item.PK,
      "SK": item.SK
    };
    const updateExpression = "Set companyName =:companyName";
    await updateItem(tableName, key, expAttributeValues, updateExpression);
  }));
};