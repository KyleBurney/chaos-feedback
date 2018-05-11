const AWS = require('aws-sdk');
const uuid = require('node-uuid');

AWS.config.update({ region: 'us-west-2' });
var dynamodb = new AWS.DynamoDB();

// todo: 
// - validate that the renter has checked into property
// - add logic to check if the average of last 5 ratings for this property is < 5 stars
//   call api to deactivate listing if it is
module.exports = {
    method: 'POST',
    path: '/feedback',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            var uuid1 = uuid.v1();
            var params = {
                TableName: 'feedback',
                Item: {
                    'feedback_id': { S: uuid1 },
                    'property_id': { S: r.payload.propertyID },
                    'renter_id': { S: r.payload.renterID },
                    'owner_id': { S: r.payload.ownerID },
                    'star_rating': { N: r.payload.starRating.toString() },
                    'tags': { SS: r.payload.tags },
                    'description': { S: r.payload.description }
                }
            };

            dynamodb.putItem(params, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            });
        })
        return promise
    }
}