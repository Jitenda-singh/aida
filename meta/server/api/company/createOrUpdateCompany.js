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
  const updateExpression = "Set companyId=:companyId, companyName =:companyName, mainContactUserIds =:mainContactUserIds";
  const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
  const updateCompanyParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
  return await call('update', updateCompanyParams);
};