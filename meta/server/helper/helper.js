import { constants } from "../constants/constants";
import { httpConstants } from "../constants/httpConstants";
import { cognitoClient } from "../libs/cognito-lib";
// import { cognitoClient } from "../libs/cognito-lib";
import { call, prepareQueryObj } from "../libs/dynamodb-lib";
import { failure } from "../libs/response-lib";
import AWS from 'aws-sdk';

export const fetchData = async (key, tableName) => {
  let getParams = prepareQueryObj("", "", tableName, "", key);
  try {
    let { 'Item': data } = await call('get', getParams);
    return data;
  } catch (e) {
    console.log(e);
    return failure(httpConstants.STATUS_404, constants.DATA_NOT_FOUND);
  }
};

export const queryData = async (tableName, indexName, expAttrValues, keyCondExp, exclusiveStartKey, limit) => {
  let getParams = prepareQueryObj("", "", tableName, indexName, "", "", expAttrValues, "", "", "", keyCondExp, "", exclusiveStartKey, "", limit);
  try {
    let data = await call('query', getParams);
    return data;
  } catch (e) {
    console.log(e);
    return failure(httpConstants.STATUS_404, constants.DATA_NOT_FOUND);
  }
};
export const scanAndUpdate = async (obj, tableName, updateObj) => {
  try {
    const itemList = await getAllTableItems(obj, tableName);
    Promise.all(itemList.length && itemList.length > 0 && itemList.map(async item => {
      let key = {
        PK: item.PK,
        SK: item.SK
      };
      let expAttributeValues = {};
      let updateExpr = 'Set';
      Object.keys(updateObj) && Object.keys(updateObj).length > 0 && Object.keys(updateObj).map((key, index) => {
        expAttributeValues[`:${key}`] = updateObj[`${key}`];
        updateExpr += ` ${key} =:${key}`;
        if (index !== Object.keys(updateObj).length - 1) {
          updateExpr += ',';
        }
      });
      const updateParams = prepareQueryObj("", "", tableName, "", key, "", expAttributeValues, updateExpr, "", "ALL_NEW");
      await call('update', updateParams);
    }));
  } catch (e) {
    console.log("Err:", e);
  }
};

export const getAllTableItems = async (obj, tableName) => {
  let expAttributeValues = {};
  let filterExp = '';
  Object.keys(obj) && Object.keys(obj).length > 0 && Object.keys(obj).map((item, index) => {
    expAttributeValues[`:${item}`] = obj[`${item}`];
    filterExp += `${item} =:${item}`;
    if (index !== Object.keys(obj).length - 1) {
      filterExp += ', ';
    }
  });
  try {
    let preparedObj = prepareQueryObj("", "", tableName, "", "", "", expAttributeValues, "", "", "", "", "", "", "", "", "", "", filterExp);
    let lastEvaluatedKey;
    let itemList = [];
    do {
      const { Items, LastEvaluatedKey } = await call('scan', preparedObj);
      lastEvaluatedKey = LastEvaluatedKey;
      if (LastEvaluatedKey) {
        preparedObj['ExclusiveStartKey'] = LastEvaluatedKey;
      }
      itemList = itemList.concat(Items);
    } while (typeof lastEvaluatedKey != "undefined");
    return itemList;
  } catch (e) {
    console.log("Err:", e);
  }
};

export const updateItem = async (tableName, key, expAttributeValues, updateExpr) => {
  const updateParams = prepareQueryObj("", "", tableName, "", key, "", expAttributeValues, updateExpr, "", "ALL_NEW");
  await call('update', updateParams);
};

export const fetchAll = async (getObj) => {
  let lastEvaluatedKey;
  let list = [];
  do {
    const { Items, LastEvaluatedKey } = await call('query', getObj);
    lastEvaluatedKey = LastEvaluatedKey;
    if (LastEvaluatedKey) {
      getObj['ExclusiveStartKey'] = LastEvaluatedKey;
    }
    list = list.concat(Items);
  } while (typeof lastEvaluatedKey != "undefined");
  return list;
};

export const createGroup = async (groupName) => {
  const params = {
    GroupName: groupName, /* required */
    UserPoolId: process.env.USER_POOL_ID, /* required */
    Description: `AIDA ${groupName} group`,
    // RoleArn: roleArn
    // Precedence: 'NUMBER_VALUE',
  };
  cognitoClient.createGroup(params, function (err, data) {
    if (err) {
      throw err;
    } else {
      return data;
    }
  });
};
export const getStreamSessionURL = async (endpoint, StreamARN, options) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisVideoArchivedMedia.html
  const kinesisVideoArchivedMedia = new AWS.KinesisVideoArchivedMedia({
    endpoint: new AWS.Endpoint(endpoint)
  });

  // get HLSS sourse of the stream as will use HLSS player. Other option is DASH - getDASHStreamingSessionURL
  const data = await kinesisVideoArchivedMedia.getHLSStreamingSessionURL({
    StreamARN: StreamARN,
    ...options,
  }).promise();
  return data.HLSStreamingSessionURL;
};