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
                    reject(err);
                } else {
                    if (!data.Item) {
                        reject(new Error("feedback not found"))
                    } else {
                        var jsonFeedback = {
                            feedback_id: data.Item.feedback_id.S,
                            property_id: data.Item.property_id.S,
                            renter_id: data.Item.renter_id.S,
                            owner_id: data.Item.owner_id.S,
                            star_rating: data.Item.star_rating.N,
                            tags: data.Item.tags.SS,
                            description: data.Item.description.S
                        }
                        resolve(jsonFeedback);
                    }
                }
            });
        })
        return promise
    }
}