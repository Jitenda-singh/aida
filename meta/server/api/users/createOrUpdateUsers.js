import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";
import { httpConstants } from "../../constants/httpConstants";
import { call, getTableName, prepareQueryObj } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
import { cognitoClient } from "../../libs/cognito-lib";
import { randomPassword, lower, upper, digits, symbols } from "secure-random-password";
export const handler = async (event, context, callback) => {
  try {
    const claims = getClaims(event);
    const isAuthorizedUser = (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].length > 0 && claims["cognito:groups"].includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-admin-group`));
    if (!isAuthorizedUser)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    const postData = JSON.parse(event.body);
    try {
      let tableName = await getTableName(constants.TABLE_NAME_DATA_TABLE);
      let userData;
      if (postData.action === constants.ACTION_CREATE) {
        const cognitoResponse = await createUserInCognito(postData);
        if (cognitoResponse && cognitoResponse.User && cognitoResponse.User.Username) {
          userData = await createUser(postData, tableName, cognitoResponse.User.Username);
        }
      } else if (postData.action === constants.ACTION_UPDATE) {
        userData = await updateUser(postData, tableName);
      }
      callback(null, success(userData && userData.Attributes ? userData.Attributes : {}));
    } catch (e) {
      console.error("Exception in createOrUpdateUser", e);
      return failure(e.statusCode, `Failed to ${postData.action} user`);
    }
  } catch (e) {
    console.log(e);
    return failure(e.statusCode, "Failed to get user");
  }
};

const createUserInCognito = async (postData) => {
  if (!(
    postData.firstName &&
    postData.lastName &&
    postData.email &&
    postData.phone
  )) {
    throw new Error("Required fields is missing");
  }
  try {
    const emailId = postData.email;
    const password = randomPassword({ length: 8, characters: [lower, upper, digits, symbols] }) + randomPassword({ characters: [lower, upper, digits, symbols] });
    const { USER_POOL_ID } = process.env;
    const cognitoParams = {
      UserPoolId: USER_POOL_ID,
      Username: emailId,
      DesiredDeliveryMediums: ['EMAIL'],
      ForceAliasCreation: false,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: "email",
          Value: emailId,
        },
        {
          Name: "given_name",
          Value: postData.firstName
        },
        {
          Name: "family_name",
          Value: postData.lastName
        },
        {
          Name: "phone_number",
          Value: postData.phone
        }
      ]
    };
    return await cognitoClient.adminCreateUser(cognitoParams).promise();
  } catch (err) {
    console.log("Error==>", err);
  }
};

const createUser = async (postData, tableName, userId) => {
  if (!(
    postData.firstName &&
    postData.lastName &&
    postData.email &&
    postData.phone &&
    userId
  )) {
    throw new Error("Required fields is missing");
  }
  const expressionAttributeValues = {
    ":userId": userId,
    ":firstName": postData.firstName,
    ":lastName": postData.lastName,
    ":email": postData.email,
    ":phone": postData.phone
  };
  const key = {
    "PK": constants.USER_HASH + userId,
    "SK": constants.USER_HASH + userId
  };
  const updateExpression = "Set userId =:userId, firstName =:firstName, lastName =:lastName, email =:email, phone =:phone";
  const updateUserParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, "", "ALL_NEW");
  return await call('update', updateUserParams);
};

const updateUser = async (postData, tableName) => {
  if (!(
    postData.userId &&
    postData.firstName &&
    postData.lastName &&
    postData.email &&
    postData.phone
  )) {
    throw new Error("Required fields is missing");
  }
  const cognitoParams = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: postData.userId
  };
  let cognitoUserData = await cognitoClient.adminGetUser(cognitoParams).promise();
  let cognitoUserNewData = [];
  if (cognitoUserData && cognitoUserData.UserAttributes) {
    cognitoUserData.UserAttributes.map((attribute) => {
      if (attribute.Name === "given_name" && attribute.Value !== postData.firstName) {
        cognitoUserNewData.push({ Name: "given_name", Value: postData.firstName });
      } else if (attribute.Name === "family_name" && attribute.Value !== postData.lastName) {
        cognitoUserNewData.push({ Name: "family_name", Value: postData.lastName });
      } else if (attribute.Name === "phone_number" && attribute.Value !== postData.phone) {
        cognitoUserNewData.push({ Name: "phone_number", Value: postData.phone });
      } else if (attribute.Name === "email" && attribute.Value !== postData.email) {
        cognitoUserNewData.push({ Name: "email", Value: postData.email });
      }
    });
  }
  if (cognitoUserNewData && cognitoUserNewData.length > 0) {
    cognitoParams.UserAttributes = cognitoUserNewData;
    await cognitoClient.adminUpdateUserAttributes(cognitoParams).promise();
  }
  const expressionAttributeValues = {
    ":userId": postData.userId,
    ":firstName": postData.firstName,
    ":lastName": postData.lastName,
    ":email": postData.email,
    ":phone": postData.phone
  };
  const key = {
    "PK": constants.USER_HASH + postData.userId,
    "SK": constants.USER_HASH + postData.userId,
  };
  const updateExpression = "Set userId =:userId, firstName =:firstName, lastName =:lastName, email =:email, phone =:phone";
  const conditionExp = "attribute_exists(PK) and attribute_exists(SK)";
  const updateUserParams = prepareQueryObj("", "", tableName, "", key, "", expressionAttributeValues, updateExpression, conditionExp, "ALL_NEW");
  return await call('update', updateUserParams);
};