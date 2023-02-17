import { cognitoClient } from "../libs/cognito-lib";

export const trigger = async (event, context, callback) => {
  try {
    let userData = {
      UserPoolId: event.userPoolId,
      Username: event.userName,
      GroupName: `${process.env.PROJECT_NAME}-${process.env.STAGE}-user-group`
    };
    await cognitoClient.adminAddUserToGroup(userData).promise();
    callback(null, event);
  } catch (e) {
    console.error("Exception ", e);
    callback(e, event);
  }
};