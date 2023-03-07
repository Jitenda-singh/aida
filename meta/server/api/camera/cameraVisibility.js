import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";
import { httpConstants } from "../../constants/httpConstants";
import { call, getTableName, prepareQueryObj } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
export const handler = async (event, context, callback) => {
  try {
    const claims = getClaims(event);
    const isAuthorizedUser = (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-admin-group`));
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
  const expressionAttributeValues = {
    ":userId": postData.userId,
    ":cameraId": postData.cameraId,
    ":GSI1PK": constants.CAMERA_HASH + postData.cameraId,
    ":GSI1SK": constants.USER_HASH + postData.userId
  };
  const updateExpression = "Set userId=:userId, cameraId =:cameraId, GSI1PK =:GSI1PK, GSI1SK =:GSI1SK";
  const key = {
    "PK": constants.USER_HASH + postData.userId,
    "SK": constants.CAMERA_HASH + postData.cameraId,
  };
  const createCameraVisibilityParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "ALL_NEW");
  return await call('update', createCameraVisibilityParams);
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