const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const AWS = require('aws-sdk');

const bucketName = "iacademy-app"
const bucketRegion = AWS.config.region
const accessKeyId = AWS.config.credentials.accessKeyId
const secretKeyId = AWS.config.credentials.secretAccessKey

const s3 = new S3({
    bucketRegion,
    accessKeyId,
    secretKeyId
})


//s3 upload file fution
function uploadFile(file,name) {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: name
    }
    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile
