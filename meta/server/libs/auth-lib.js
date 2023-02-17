import _ from "lodash";
import jwt_decode from "jwt-decode";

export const getClaims = function (event) {
  let claimClone = {};
  try {
    if (event && event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
      const data = _.cloneDeep(jwt_decode(event.headers.Authorization));
      claimClone['cognito:username'] = data['cognito:username'];
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