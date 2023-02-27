import { constants } from "../constants/constants";
import { cognitoClient } from "../libs/cognito-lib";
import { call, getTableName, prepareQueryObj } from "../libs/dynamodb-lib";

export const trigger = async (event, context, callback) => {
  try {
    const cognitoGroupPromise = updateCognitoGroup(event);
    const userDataPromise = addUserIntoUserTable(event);
    await cognitoGroupPromise;
    await userDataPromise;
    callback(null, event);
  } catch (e) {
    console.error("Exception ", e);
    callback(e, event);
  }
};

// update cognito group
const updateCognitoGroup = async (event) => {
  let userData = {
    UserPoolId: event.userPoolId,
    Username: event.userName,
    GroupName: `${process.env.PROJECT_NAME}-${process.env.STAGE}-user-group`
  };
  return await cognitoClient.adminAddUserToGroup(userData).promise();
};

// add user in dynamo db User table on Sign up
const addUserIntoUserTable = async (event) => {
  try {
    let tableName = await getTableName(constants.TABLE_NAME_DATA_TABLE);
    let expressionAttributeValues = {
      ":userId": event.userName,
      ":firstName": event.request.userAttributes.given_name,
      ":lastName": event.request.userAttributes.family_name,
      ":email": event.request.userAttributes.email,
      ":phone": event.request.userAttributes.phone_number
    };
    let expressionAttributeNames = {};
    let key = {
      "PK": "USR#" + event.userName,
      "SK": "USR#" + event.userName,
    };
    let updateExpression = "Set userId =:userId, firstName =:firstName, lastName =:lastName, email =:email, phone =:phone";
    let conditionExp = "attribute_not_exists(PK) and attribute_not_exists(SK)";
    const UpdateUserParams = prepareQueryObj("", "", tableName, "", key, expressionAttributeNames, expressionAttributeValues, updateExpression, conditionExp, "UPDATED_NEW");
    await call('update', UpdateUserParams);
  } catch (e) {
    console.error("Exception in addUserIntoUserTable", e);
  }
};