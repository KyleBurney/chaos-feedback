const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });
var dynamodb = new AWS.DynamoDB();

module.exports = {
    method: 'GET',
    path: '/feedback/{feedbackID}',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            var params = {
                TableName: 'chaos-feedback',
                Key: {
                    'feedback_id': { S: r.params.feedbackID }
                },
                ProjectionExpression: 'feedback_id, property_id, renter_id, owner_id, star_rating, tags, description'
            };

            dynamodb.getItem(params, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    console.log(data)
                    resolve(data.Item);
                }
            });
        })
        return promise
    }
}