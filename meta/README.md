## Available Scripts

In the project directory, you can run following commands:

### `nvm -v`

can you verify correct version of nvm
0.39.1 otherwise Install nvm for windows: https://github.com/coreybutler/nvm-windows/releases

### `node -v`

can you verify correct version of node
v16.15.0 otherwise Install node for windows: https://nodejs.org/en/download/releases/

### `npm -v`

can you verify correct version of npm
8.5.5

Install serverless for windows

### `npm install -g serverless`

### `serverless --version`

can you verify correct version of serverless
Framework Core: 3.27.0

Install all npm packages 

### `npm install serverless-bundle`

### `npm install`

### AWS Advanced Configuration Required

### `aws --version`

can you verify correct version of aws
aws-cli/1.22.34 Python/3.10.6 Linux/5.15.0-60-generic botocore/1.23.34


### `aws configure --profile aida`

can you verify correct region of us-east-1

### Project Deployment

### `serverless deploy --verbose --aws-profile aida`

After completion of deployment, Copy the following credentials from terminal:

### AppClientId
### CognitoDomain
### Region
### UserPoolID
### ServiceEndpoint
### CloudFrontDistributionDomainName

and add these credentials into frontend app directory: aidafront -> .env file as given below:

### REACT_APP_COGNITO_APP_CLIENT_ID=AppClientId
### REACT_APP_COGNITO_DOMAIN=CognitoDomain
### REACT_APP_COGNITO_REGION=Region
### REACT_APP_COGNITO_USER_POOL_ID=UserPoolID
### REACT_APP_API_URL=ServiceEndpoint
### REACT_APP_API_REDIRECT_URL=https://CloudFrontDistributionDomainName