import { constants } from "../constants/constants";
import { httpConstants } from "../constants/httpConstants";
import { call, prepareQueryObj } from "../libs/dynamodb-lib";
import { failure } from "../libs/response-lib";

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