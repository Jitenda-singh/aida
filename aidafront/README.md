# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `nvm -v`

can you verify correct version of nvm
0.39.1

### `node -v`

can you verify correct version of node
v16.15.0

### `npm -v`

can you verify correct version of npm
8.5.5

### `npm i`

Add these credentials into .env file as given below after serverless deploy:

### REACT_APP_COGNITO_APP_CLIENT_ID=AppClientId
### REACT_APP_COGNITO_DOMAIN=CognitoDomain
### REACT_APP_COGNITO_REGION=Region
### REACT_APP_COGNITO_USER_POOL_ID=UserPoolID
### REACT_APP_API_URL=ServiceEndpoint
### REACT_APP_API_REDIRECT_URL=https://CloudFrontDistributionDomainName

### `npm run build`

Builds the app for production to the `build` folder.

After successful build, go inside build folder

Copy all the files, add permission 'PublicRead' and upload it in Amazon S3 bucket: aida-develop-front and Set permissions: 