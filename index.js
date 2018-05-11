const Hapi = require('hapi');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
var dynamodb = new AWS.DynamoDB();

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/feedback/rating/{propertyID}',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            // get the average rating for a property
        })
        return promise
    }
});

server.route({
    method: 'GET',
    path: '/feedback/{feedbackID}',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            console.log(r.params.feedbackID)
            var params = {
                TableName: 'feedback',
                Key: {
                    'feedback_id': { S: r.params.feedbackID },
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
});

// todo: 
// - validate that the renter has checked into property
// - add logic to check if the average of last 5 ratings for this property is < 5 stars
//   call api to deactivate listing if it is
server.route({
    method: 'POST',
    path: '/feedback',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            var params = {
                TableName: 'feedback',
                Item: {
                    'feedback_id': { S: '001' },
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
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

server.start();