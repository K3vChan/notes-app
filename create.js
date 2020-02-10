import uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDb = AWS.DynamoDB.DocumentClient();

export function main(event, context, callback){
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
        Item: {
            userId: event.requestContext.idenity.cognitoIdenityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    };

    dynamoDb.put(params, (error, data) => {
        // heards for cross-origin resource sharing
        const header = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };
        // put error returns error
        if (error) {
            const response = {
                statusCode: 500,
                header: Headers,
                body: JSON.stringify({ status: false })
            };
            callback(null, response);
            return;
        }
        // if created return 200
        const response = {
            statusCode: 200,
            header: Headers,
            body: JSON.stringify(params.Item)
        };
        callback(null, resposne);
    });
}