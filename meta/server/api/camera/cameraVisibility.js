import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";
import { httpConstants } from "../../constants/httpConstants";
import { call, getTableName, prepareQueryObj } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
import { cognitoClient } from "../../libs/cognito-lib";
export const handler = async (event, context, callback) => {
  try {
    const claims = getClaims(event);
    const isAuthorizedUser = (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].length > 0 && claims["cognito:groups"].includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-admin-group`));
    if (!isAuthorizedUser)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    const postData = JSON.parse(event.body);
    try {
      let tableName = await getTableName(constants.TABLE_NAME_DATA_TABLE);
      let cameraVisibilityData;
      if (postData.action === constants.ACTION_CREATE) {
        cameraVisibilityData = await createCameraVisibility(postData, tableName);
      }
      callback(null, success(cameraVisibilityData && cameraVisibilityData.Attributes ? cameraVisibilityData.Attributes : {}));
    } catch (e) {
      console.error("Exception in createOrUpdateCameraVisibility", e);
      return failure(e.statusCode, `Failed to ${postData.action} cameraVisibility`);
    }
  } catch (e) {
    console.log(e);
    return failure(e.statusCode, "Failed to get user");
  }
};

const createCameraVisibility = async (postData, tableName) => {
  if (!(
    postData.userId &&
    postData.cameraId
  )) {
    throw Error("Required fields is missing");
  }
  const cameraData = await fetchCameraData(postData.cameraId, tableName);
  const expressionAttributeValues = {
    ":userId": postData.userId,
    ":cameraId": postData.cameraId,
    ":cameraName": cameraData.cameraName || "",
    ":deviceId": cameraData.deviceId,
    ":deviceName": cameraData.deviceName || "",
    ":companyId": cameraData.companyId,
    ":companyName": cameraData.companyName || "",
    ":GSI1PK": constants.CAMERA_HASH + postData.cameraId,
    ":GSI1SK": constants.USER_HASH + postData.userId
  };
  const updateExpression = "Set userId=:userId, cameraId =:cameraId, cameraName=:cameraName, deviceId=:deviceId, deviceName=:deviceName, companyId=:companyId, companyName=:companyName, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const key = {
    "PK": constants.USER_HASH + postData.userId,
    "SK": constants.CAMERA_HASH + postData.cameraId,
  };
  const createCameraVisibilityParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "ALL_NEW");
  await addUserToGroup(postData.userId, constants.CAMERA_HASH + postData.cameraId);
  return await call('update', createCameraVisibilityParams);
};

const addUserToGroup = async (userName, groupName) => {
  let userData = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: userName,
    GroupName: groupName
  };
  return await cognitoClient.adminAddUserToGroup(userData).promise();
};
// const updateCameraVisibility = async (postData, tableName) => {
//   if (!(

//   )) {
//     throw new Error("Required fields is missing");
//   }
//   const expressionAttributeValues = {
//     ":deviceId": postData.deviceId,
//     ":companyId": postData.companyId,
//     ":cameraVisibilityName": postData.cameraVisibilityName,
//     ":streamId": postData.streamId
//   };
//   const key = {
//     "PK": "CAM#",
//     "SK": "CAM#" + postData.cameraVisibilityId,
//   };
//   const updateExpression = "Set deviceId =:deviceId, companyId =:companyId, cameraVisibilityName =:cameraVisibilityName, streamId =:streamId";
//   const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
//   const updateCameraVisibilityParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
//   await call('update', updateCameraVisibilityParams);
// };

const fetchCameraData = async (cameraId, tableName) => {
  let key = {
    "PK": constants.CAMERA_HASH,
    "SK": constants.CAMERA_HASH + cameraId
  };
  let getParams = prepareQueryObj("", "", tableName, "", key);
  try {
    let { 'Item': cameraData } = await call('get', getParams);
    return cameraData;
  } catch (e) {
    console.log(e);
    return failure(httpConstants.STATUS_404, constants.CAMERA_DATA_NOT_FOUND);
  }
};