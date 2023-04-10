import AWS from 'aws-sdk';

export const cognitoClient = new AWS.CognitoIdentityServiceProvider();
export const kinesisvideo = new AWS.KinesisVideo();