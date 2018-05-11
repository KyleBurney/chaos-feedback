const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });
var dynamodb = new AWS.DynamoDB();

module.exports = {
    method: 'GET',
    path: '/feedback/rating/{propertyID}',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            var params = {
                ExpressionAttributeValues: {
                    ":propID": {
                        S: r.params.propertyID
                    }
                },
                FilterExpression: "contains (property_id, :propID)",
                ProjectionExpression: "star_rating",
                TableName: "feedback"
            };

            dynamodb.scan(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(err)
                } else {
                    var averageRating = 0

                    data.Items.forEach(function (element, index, array) {
                        var rating = parseInt(element.star_rating.N)
                        averageRating += rating
                    });
                    resolve(averageRating / data.Items.length)
                }
            });
        })
        return promise
    }
}