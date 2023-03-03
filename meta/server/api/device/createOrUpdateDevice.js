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
      let deviceData;
      if (postData.action === constants.ACTION_CREATE) {
        deviceData = await createDevice(postData, tableName);
      } else if (postData.action === constants.ACTION_UPDATE) {
        deviceData = await updateDevice(postData, tableName);
      }
      callback(null, success(deviceData && deviceData.Attributes ? deviceData.Attributes : {}));
    } catch (e) {
      console.error("Exception in createOrUpdateDevice", e);
      return failure(e.statusCode, `Failed to ${postData.action} device`);
    }
  } catch (e) {
    console.log(e);
    return failure(e.statusCode, "Failed to get user");
  }
};

const createDevice = async (postData, tableName) => {
  if (!(
    postData.deviceName &&
    postData.companyId
  )) {
    throw new Error("Required fields is missing");
  }
  const deviceId = uuidV4();
  const expressionAttributeValues = {
    ":deviceName": postData.deviceName,
    ":deviceId": deviceId,
    ":companyId": postData.companyId,
    ":GSI1PK": constants.COMPANY_HASH + postData.companyId,
    ":GSI1SK": constants.DEVICE_HASH + deviceId
  };
  const key = {
    "PK": constants.DEVICE_HASH,
    "SK": constants.DEVICE_HASH + deviceId
  };
  const updateExpression = "Set deviceId =:deviceId, deviceName =:deviceName, companyId =:companyId, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const createDeviceParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "UPDATED_NEW");
  return await call('update', createDeviceParams);
};

const updateDevice = async (postData, tableName) => {
  if (!(
    postData.deviceId &&
    postData.deviceName &&
    postData.companyId
  )) {
    throw new Error("Required fields is missing");
  }
  const expressionAttributeValues = {
    ":deviceId": postData.deviceId,
    ":deviceName": postData.deviceName,
    ":companyId": postData.companyId,
    ":GSI1PK": constants.COMPANY_HASH + postData.companyId,
    ":GSI1SK": constants.DEVICE_HASH + postData.deviceId
  };
  const key = {
    "PK": constants.DEVICE_HASH,
    "SK": constants.DEVICE_HASH + postData.deviceId,
  };
  const updateExpression = "Set deviceId =:deviceId, deviceName =:deviceName, companyId =:companyId, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
  const updateDeviceParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
  return await call('update', updateDeviceParams);
};