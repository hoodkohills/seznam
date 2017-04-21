SEZNAM
======

Simple shopping list application, to be integrated with Facebook Messenger.

Use [Claudia.js](https://claudiajs.com/) for deployment!

**For creation of API, IAM role, Lambda function**  
`claudia create --region eu-central-1 --api-module bot`

**Add DynamoDB policy to the role**
`aws attach-role-policy --role-name <value> --policy-arn <value>`  
You have to design your own policy (as long as you don't want to stick default `FullAccess` policies), for example:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:Get",
                "dynamodb:Put",
                "dynamodb:Delete",
                "dynamodb:Query",
                "dynamodb:Update",
                "dynamodb:Delete",
            ],
            "Effect": "Allow",
            "Resource": "arn-of-both-of-your-tables"
        }
    ]
}

```

**To configure FB application**  
`claudia update --configure-fb-bot`  
Use provided details to update your Facebook application with webhook and verification token + use Facebook application to provide you Facebook Page Access Token and Facebook App Secret. 

**Create required DynamoDB tables**  
`node ./db/createTables.js`  
Use local AWS credentials for execution and adapt AWS region in the script.
