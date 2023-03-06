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

### `npm i --legacy-peer-deps`

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

Go to AWS S3. Search for 'aida-develop-front' bucket. Upload all the files inside the build folder to 'aida-develop-front' bucket by setting Permissions as "Grant public-read access".

Go to AWS CloudFront. Search for 'aida-develop-front'. Open the 'aida-develop-front' distribution. Go to Invalidations tab and Create invalidation by adding "/*" in object paths.

After that, you can use https://{CloudFrontDistributionDomainName} link to access the login page of the Front end application.