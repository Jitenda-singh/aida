const AWS = require('aws-sdk');

const iam = new AWS.IAM();
// Create IAM Role
export const createRole = async (streamARN) => {
  const arnArray  = streamARN.split('/');
  const streamName = arnArray.slice(-2).join('-');
  const assumeRolePolicyDocument = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'kinesisvideo.amazonaws.com'
        },
        Action: 'sts:AssumeRole'
      }
    ]
  });

  const createRoleParams = {
    AssumeRolePolicyDocument: assumeRolePolicyDocument,
    RoleName: `${streamName}-role`,
    Description: `IAM Role for Kinesis Video Stream ${streamName}`
  };

  try {
    const result = await iam.createRole(createRoleParams).promise();
    console.log(result);

    // Attach the policy created in the previous step to the new role
    const attachPolicyParams = {
      PolicyArn: `arn:aws:iam::${process.env.ACCOUNT}:policy/${streamName}-policy`,
      RoleName: `${streamName}-role`
    };
    const attachPolicyResult = await iam.attachRolePolicy(attachPolicyParams).promise();
    console.log(attachPolicyResult);
    return result.Role.Arn;
  } catch (err) {
    if(err.code === "EntityAlreadyExists"){
      return `arn:aws:iam::${process.env.ACCOUNT}:role/${streamName}-role`;
    } else throw err;
  }
};


// Create IAM Policy
export const createPolicy = async (streamARN) => {
  const arnArray  = streamARN.split('/');
  const streamName = arnArray.slice(-2).join('-');
  const params = {
    PolicyDocument: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            "kinesisvideo:GetDataEndpoint",
            "kinesisvideo:GetMedia"
          ],
          Resource: streamARN
          // Resource: `arn:aws:kinesisvideo:${process.env.REGION}:${process.env.ACCOUNT}:stream/${streamName}/*`
        }
      ]
    }),
    PolicyName: `${streamName}-policy`
  };
  try{
    const result = await iam.createPolicy(params).promise();
    console.log(result);
    return result.Policy.Arn;
  } catch(e){
    if(e.code === "EntityAlreadyExists"){
      return `arn:aws:iam::${process.env.ACCOUNT}:policy/${streamName}-policy`;
    } else throw  e;
  }
};