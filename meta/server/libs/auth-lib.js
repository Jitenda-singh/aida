import _ from "lodash";
import jwt_decode from "jwt-decode";

export const getClaims = function (event) {
  let claimClone = {};
  try {
    if (event && event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
      const data = _.cloneDeep(jwt_decode(event.headers.Authorization));
      claimClone['cognito:username'] = data['cognito:username'];
      claimClone['given_name'] = data['given_name'];
      claimClone['family_name'] = data['family_name'];
      claimClone['email'] = data.email;
      if (data && data['cognito:groups']) {
        claimClone['cognito:groups'] = data['cognito:groups'];
      }
    }
    return claimClone;
  } catch (e) {
    console.log("exception in getClaims", e);
    return claimClone;
  }
};

export const isAuthorizedUser = (event) => {
  let claims = getClaims(event);
  return (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-admin-group`));
};