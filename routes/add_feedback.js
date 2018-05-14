const AWS = require('aws-sdk')
const uuid = require('node-uuid')
const https = require('https')

AWS.config.update({ region: 'us-west-2' })
var dynamodb = new AWS.DynamoDB()

module.exports = {
    method: 'POST',
    path: '/feedback',
    handler: (r, h) => {
        const promise = new Promise((resolve, reject) => {
            // https.get('endpoint-for-applications', (resp) => {
            //     let data = '';
            //     resp.on('data', (chunk) => {
            //         data += chunk;
            //     });

            //     resp.on('end', () => {
            //         // check if renter has checked into this property
            //         if(hasCheckedIn){
            //             addFeedback(r, resolve, reject)
            //         }else{
            //             resolve("this user has not checked in")
            //         }
            //     });

            // }).on("error", (err) => {
            //     console.log("Error: " + err.message);
            //     reject(err)
            // });
            addFeedback(r, resolve, reject)
        })
        return promise
    }
}

function addFeedback(request, resolve, reject) {
    var uuid1 = uuid.v1()
    var params = {
        TableName: 'chaos-feedback',
        Item: {
            'feedback_id': { S: uuid1 },
            'property_id': { S: request.payload.propertyID },
            'renter_id': { S: request.payload.renterID },
            'owner_id': { S: request.payload.ownerID },
            'star_rating': { N: request.payload.starRating.toString() },
            'tags': { SS: request.payload.tags },
            'description': { S: request.payload.description }
        }
    }

    dynamodb.putItem(params, function (err, putData) {
        if (err) {
            console.log(err)
            reject(err)
        } else {
            checkStarRating(request, resolve, reject)
        }
    })
}

function checkStarRating(request, resolve, reject) {
    var params = {
        ExpressionAttributeValues: {
            ':propID': { S: request.payload.propertyID }
        },
        KeyConditionExpression: 'property_id = :propID',
        ProjectionExpression: 'feedback_id, property_id, renter_id, owner_id, star_rating, tags, description',
        TableName: 'chaos-feedback',
        IndexName: "property_id-index",
        ScanIndexForward: true,
        Limit: 5
    }

    dynamodb.query(params, function (err, queryData) {
        if (err) {
            console.log("Error", err)
            reject(err)
        } else {
            var averageRating = 0
            queryData.Items.forEach(function (element, index, array) {
                var rating = parseInt(element.star_rating.N)
                averageRating += rating
            })
            averageRating /= queryData.Items.length
            if (averageRating < 2) {
                disableProperty(request)
            }
            resolve("feedback added")
        }
    })
}

function disableProperty(request){
    // call endpoint to disable property
}