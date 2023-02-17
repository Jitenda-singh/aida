

export const success = function (body) {
  return buildResponse(200, body);
};

export const failure = function (statusCode = 500, body) {
  return buildResponse(statusCode, body);
};

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
};
