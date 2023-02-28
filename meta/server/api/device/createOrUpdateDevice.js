import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";
import { v4 as uuidV4 } from 'uuid';
import { httpConstants } from "../../constants/httpConstants";
import { call, getTableName, prepareQueryObj } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
export const handler = async (event, context, callback) => {
  try {
    let claims = getClaims(event);
    if (!(claims && Object.keys(claims) && Object.keys(claims).length > 0))
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
    postData.deviceName
  )) {
    throw new Error("Required fields is missing");
  }
  const deviceId = uuidV4();
  const expressionAttributeValues = {
    ":deviceName": postData.deviceName,
    ":deviceId": deviceId
  };
  const key = {
    "PK": "DEV#",
    "SK": "DEV#" + deviceId,
  };
  const updateExpression = "Set deviceId =:deviceId, deviceName =:deviceName";
  const createDeviceParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "UPDATED_NEW");
  return await call('update', createDeviceParams);
};

const updateDevice = async (postData, tableName) => {
  if (!(
    postData.deviceId &&
    postData.deviceName
  )) {
    throw new Error("Required fields is missing");
  }
  const expressionAttributeValues = {
    ":deviceId": postData.deviceId,
    ":deviceName": postData.deviceName
  };
  const key = {
    "PK": "DEV#",
    "SK": "DEV#" + postData.deviceId,
  };
  const updateExpression = "Set deviceId =:deviceId, deviceName =:deviceName";
  const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
  const updateDeviceParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
  return await call('update', updateDeviceParams);
};