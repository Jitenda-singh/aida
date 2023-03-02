import AWS from "aws-sdk";
import _ from "lodash";
import { constants } from "../constants/constants";

export const call = (action, params) => {
  //action describeTable is not available in DocumentClient
  const dynamoDb = (action === "describeTable" ? new AWS.DynamoDB() : new AWS.DynamoDB.DocumentClient());
  return dynamoDb[action](params).promise();
};

export const getTableName = async (tableName) => {
  const stage = process.env.STAGE.toLowerCase();
  return process.env.PROJECT_NAME.toLowerCase() + stage + _.upperFirst(_.camelCase(_.join([tableName], '-')));
};

export const prepareQueryObj = (claim, removeAttribute, ...allProps) => {
  let updateProperties = ["TableName", "IndexName", "Key", "ExpressionAttributeNames", "ExpressionAttributeValues", "UpdateExpression", "ConditionExpression", "ReturnValues", "KeyConditionExpression", "ScanIndexForward", "ExclusiveStartKey", "ProjectionExpression", "Limit", "Item", (constants.ACTION_KEY), "FilterExpression"];
  let paramObj = {};
  // let action = {};

  allProps.map((value, index) => {
    if (typeof value !== "undefined" && value !== "" && updateProperties[index] === constants.ACTION_KEY) {
      // action = value;
    } else if (typeof value !== "undefined" && value !== "" && !isPlainObject(value)) {
      paramObj[updateProperties[index]] = value;
    } else if (typeof value !== "undefined" && value !== "" && isPlainObject(value)) {
      constructParamsFromObj(paramObj, updateProperties[index], value);
    }
  });
  if (removeAttribute) {
    paramObj.UpdateExpression = paramObj.UpdateExpression + removeAttribute;
  }
  return paramObj;
};

const isPlainObject = (obj) => {
  return obj && Object.prototype.toString.call(obj) === '[object Object]';
};

const constructParamsFromObj = (paramObj, targetProperty, inputObj) => {
  Object.keys(inputObj).map((key) => {
    if (typeof paramObj[targetProperty] === "undefined") {
      paramObj[targetProperty] = {};
    }
    paramObj[targetProperty][key] = inputObj[key];
  });
};