import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";

export const handler = (event, context, callback) => {
  try {
    let claims = getClaims(event);
    callback(null, success(claims));
  } catch (e) {
    console.log(e);
    return failure(e.statusCode, "Failed to get user");
  }
};