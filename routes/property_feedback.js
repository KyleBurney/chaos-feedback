const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });
var dynamodb = new AWS.DynamoDB();

module.exports = {
    method: 'GET',
    path: '/feedback/property/{propertyID}',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            var params = {
                ExpressionAttributeValues: {
                    ':propID': { S: r.params.propertyID }
                },
                KeyConditionExpression: 'property_id = :propID',
                ProjectionExpression: 'feedback_id, property_id, renter_id, owner_id, star_rating, tags, description',
                TableName: 'chaos-feedback',
                IndexName: "property_id-index"
            };

            dynamodb.query(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(err)
                } else {
                    var feedbacks = []

                    data.Items.forEach(function (element, index, array) {
                        feedbacks.push({
                            feedback_id: element.feedback_id.S,
                            property_id: element.property_id.S,
                            renter_id: element.renter_id.S,
                            owner_id: element.owner_id.S,
                            star_rating: element.star_rating.N,
                            tags: element.tags.SS,
                            description: element.description.S
                        })
                    });
                    resolve(feedbacks)
                }
            });
        })
        return promise
    }
}