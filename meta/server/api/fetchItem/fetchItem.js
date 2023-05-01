import { success, failure } from "../../libs/response-lib";
import { getClaims } from "../../libs/auth-lib";
import { httpConstants } from "../../constants/httpConstants";
import { getTableName } from "../../libs/dynamodb-lib";
import { constants } from "../../constants/constants";
import { fetchData, getStreamSessionURL, queryData } from "../../helper/helper";
import { kinesisvideo } from "../../libs/cognito-lib";


export const handler = async (event, context, callback) => {
  const item = event.pathParameters && event.pathParameters.item;
  const itemId = event.pathParameters && event.pathParameters.itemId;
  const queryStringParam = event.queryStringParameters;
  try {
    const claims = getClaims(event);
    const userGroupInfo = (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].length > 0 && claims["cognito:groups"]);
    const isAdminUser = userGroupInfo && userGroupInfo.length && userGroupInfo.includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-admin-group`);
    const isNormalUser = !isAdminUser && userGroupInfo && userGroupInfo.length && userGroupInfo.includes(`${process.env.PROJECT_NAME}-${process.env.STAGE}-user-group`);
    if (!(isAdminUser || isNormalUser))
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    // const postData = JSON.parse(event.body);
    try {
      const tableName = await getTableName(constants.TABLE_NAME_DATA_TABLE);
      let result;
      switch (item) {
        case constants.USER_KEYWORD:
          result = await fetchUserData(claims, isAdminUser, isNormalUser, itemId, tableName, queryStringParam);
          break;
        case constants.COMPANY_KEYWORD:
          result = await fetchCompanyData(claims, isAdminUser, isNormalUser, itemId, tableName, queryStringParam);
          break;
        case constants.CAMERA_KEYWORD:
          result = await fetchCameraData(claims, isAdminUser, isNormalUser, itemId, tableName, queryStringParam);
          break;
        case constants.DEVICE_KEYWORD:
          result = await fetchDeviceData(claims, isAdminUser, isNormalUser, itemId, tableName, queryStringParam);
          break;
        case constants.CAMERA_VISIBILITY_KEYWORD:
          result = await fetchCameraVisibilityData(claims, isAdminUser, isNormalUser, itemId, tableName, queryStringParam);
          break;
        case constants.VIDEO_STREAM_KEYWORD:
          result = await fetchVideoLink(claims, isAdminUser, isNormalUser, itemId, tableName, queryStringParam);
          break;
        default:
          break;
      }
      return success(result || {});
    } catch (e) {
      console.error("Exception", e);
      return failure(e.statusCode, `Failed to get ${item}`);
    }
  } catch (e) {
    console.log(e);
    return failure(e.statusCode, `Failed to get ${item}`);
  }
};

const fetchUserData = async (claims, isAdminUser, isNormalUser, id, tableName, queryStringParam) => {
  let userData;
  if (id === "list") {
    if (!isAdminUser)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    let expAttrValues = {};
    let keyCondExp = '';
    const indexName = constants.GLOBAL_INDEX_GSI1;
    if (queryStringParam && queryStringParam.cameraId) {
      expAttrValues[':GSI1PK'] = constants.CAMERA_HASH + queryStringParam.cameraId;
      keyCondExp = 'GSI1PK=:GSI1PK';
    }
    let exclusiveStartKey = "";

    if (queryStringParam && queryStringParam.exclusiveStartKey) {
      exclusiveStartKey = JSON.parse(decodeURIComponent(queryStringParam.exclusiveStartKey));
    }
    userData = await queryData(
      tableName,
      indexName,
      expAttrValues,
      keyCondExp,
      exclusiveStartKey,
      constants.LIMIT_20
    );
    let processedData = [];
    if (queryStringParam && queryStringParam.cameraId) {
      userData && userData.Items && userData.Items.length && userData.Items.forEach(object => {
        processedData.push({ GSI1PK: object['GSI1PK'], GSI1SK: object['GSI1SK'], PK: object['PK'] });
      });
    }
    userData.Items = [...processedData];
  } else {
    if (isNormalUser && claims['cognito:username'] !== id)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    userData = await fetchData(
      {
        "PK": constants.USER_HASH + id,
        "SK": constants.USER_HASH + id
      },
      tableName
    );
  }
  return userData;
};

const fetchCompanyData = async (claims, isAdminUser, isNormalUser, id, tableName, queryStringParam) => {
  if (!isAdminUser)
    return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
  let companyData;
  if (id) {
    companyData = await fetchData(
      { "PK": constants.COMPANY_HASH, "SK": constants.COMPANY_HASH + id },
      tableName
    );
  }
  if (companyData) {
    delete companyData['GSI1PK'];
    delete companyData['GSI1SK'];
  }
  return companyData;
};

const fetchCameraData = async (claims, isAdminUser, isNormalUser, id, tableName, queryStringParam) => {
  let cameraData;
  if (id === "list") {
    if (!isAdminUser)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    let expAttrValues = {};
    let keyCondExp = '';
    const indexName = constants.GLOBAL_INDEX_GSI1;
    if (queryStringParam && queryStringParam.deviceId) {
      expAttrValues[':GSI1PK'] = constants.DEVICE_HASH + queryStringParam.deviceId;
      keyCondExp = 'GSI1PK=:GSI1PK';
    }
    let exclusiveStartKey = "";

    if (queryStringParam && queryStringParam.exclusiveStartKey) {
      exclusiveStartKey = JSON.parse(decodeURIComponent(queryStringParam.exclusiveStartKey));
    }
    cameraData = await queryData(
      tableName,
      indexName,
      expAttrValues,
      keyCondExp,
      exclusiveStartKey,
      constants.LIMIT_20
    );
    let processedData = [];
    if (queryStringParam && queryStringParam.deviceId) {
      cameraData && cameraData.Items && cameraData.Items.length && cameraData.Items.forEach(object => {
        processedData.push({ GSI1PK: object['GSI1PK'], GSI1SK: object['GSI1SK'], PK: object['SK'] });
      });
      cameraData.Items = [...processedData];
    } else {
      cameraData && cameraData.Items && cameraData.Items.length && cameraData.Items.forEach(object => {
        delete object['GSI1PK'];
        delete object['GSI1SK'];
      });
    }
  } else {
    cameraData = await fetchData(
      { "PK": constants.CAMERA_HASH, "SK": constants.CAMERA_HASH + id },
      tableName
    );
    if (cameraData) {
      delete cameraData['GSI1PK'];
      delete cameraData['GSI1SK'];
    }
  }
  return cameraData;
};

const fetchDeviceData = async (claims, isAdminUser, isNormalUser, id, tableName, queryStringParam) => {
  let deviceData;
  if (!isAdminUser)
    return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
  if (id === "list") {
    let expAttrValues = {
      ':PK': constants.DEVICE_HASH
    };
    let keyCondExp = 'PK=:PK';
    let exclusiveStartKey = "";

    if (queryStringParam && queryStringParam.exclusiveStartKey) {
      exclusiveStartKey = JSON.parse(decodeURIComponent(queryStringParam.exclusiveStartKey));
    }
    deviceData = await queryData(
      tableName,
      "",
      expAttrValues,
      keyCondExp,
      exclusiveStartKey,
      constants.LIMIT_20
    );
    deviceData && deviceData.Items && deviceData.Items.length && deviceData.Items.forEach(object => {
      delete object['GSI1PK'];
      delete object['GSI1SK'];
    });
  }
  return deviceData;
};

const fetchCameraVisibilityData = async (claims, isAdminUser, isNormalUser, id, tableName, queryStringParam) => {
  let cameraVisibilityData;
  if (id === "list") {
    let expAttrValues = {};
    let keyCondExp = '';
    if (isNormalUser && queryStringParam && claims['cognito:username'] !== queryStringParam.userId)
      return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);
    if (queryStringParam && queryStringParam.userId) {
      expAttrValues[':userId'] = constants.USER_HASH + queryStringParam.userId;
      expAttrValues[':cameraHash'] = constants.CAMERA_HASH;
      keyCondExp = 'PK=:userId and begins_with(SK, :cameraHash)';
    }
    let exclusiveStartKey = "";

    if (queryStringParam && queryStringParam.exclusiveStartKey) {
      exclusiveStartKey = JSON.parse(decodeURIComponent(queryStringParam.exclusiveStartKey));
    }
    cameraVisibilityData = await queryData(
      tableName,
      '',
      expAttrValues,
      keyCondExp,
      exclusiveStartKey,
      (queryStringParam && queryStringParam.limit) || constants.LIMIT_20
    );
  }
  cameraVisibilityData && cameraVisibilityData.Items && cameraVisibilityData.Items.length && cameraVisibilityData.Items.forEach(object => {
    delete object['GSI1PK'];
    delete object['GSI1SK'];
  });
  return cameraVisibilityData;
};

const fetchVideoLink = async (claims, isAdminUser, isNormalUser, id, tableName, queryStringParam) => {
  const userGroupInfo = (claims && Object.keys(claims) && Object.keys(claims).length > 0 && claims["cognito:groups"] && claims["cognito:groups"].length > 0 && claims["cognito:groups"]);
  const isCameraAccessible = userGroupInfo && userGroupInfo.length && userGroupInfo.includes(`${constants.CAMERA_HASH}${id}`);
  if (!isNormalUser || !isCameraAccessible)
    return failure(httpConstants.STATUS_401, constants.DEFAULT_MESSAGE_UNAUTHORIZED_USER);

  const cameraData = await fetchData(
    { "PK": constants.CAMERA_HASH, "SK": constants.CAMERA_HASH + id },
    tableName
  );
  const options = {
    // ON_DEMAND - media playlist is typically static for sessions, LIVE - media playlist is continually updated with new fragments for sessions
    PlaybackMode: constants.KVS_PLAYBACK_MODE_LIVE,
    // NEVER /ALWAYS
    DisplayFragmentTimestamp: constants.KVS_DISPLAY_FRAGMENT_TIMESTAMP_ALWAYS,
    // how much time link is valid in seconds, this value can be between 300 (5 minutes) and 43200 (12 hours).
    Expires: constants.KVS_LINKS_EXPIRE_DURATION_600, // 10 min
    // FRAGMENTED_MP4 - container format packages the media into MP4 fragments, MPEG_TS - only supported packaging on older HLS players, has a 5-25 % consts more
    ContainerFormat: constants.KVS_CONTAINER_FORMAT_MP4,
    // ALWAYS - recommended to use if fragment timestamps are not accurate,and server timestamp is selected, NEVER - option for producer timestamp, ON_DISCONTINUITY - adviced option for most cases, media player timeline is only reset when there is a significant issue with the media timeline (e.g. a missing fragment)
    DiscontinuityMode: constants.KVS_DISCONTINUITY_MODE_ALWAYS,
    HLSFragmentSelector: {
      // PRODUCER_TIMESTAMP, SERVER_TIMESTAMP
      FragmentSelectorType: constants.KVS_SERVER_TIMESTAMP,
    },
  };
  const endpointObject = await kinesisvideo.getDataEndpoint({
    // StreamName: cameraData.streamId,
    StreamARN: cameraData.streamId,
    APIName: constants.KVS_API_NAME,
  }).promise();
  const data = {
    //get stream session url, url is valid from 5 min to 12 h. depending on hereabove options
    url: await getStreamSessionURL(endpointObject.DataEndpoint, cameraData.streamId, options),
  };
  return data;
};
