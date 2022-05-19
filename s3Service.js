const { S3 } = require('aws-sdk');
const randomID = parseInt(Math.random() * 10000000)



exports.s3Uploadv2 = async (file) => {
    const s3 = new S3()

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${randomID}-${file.originalname}`,
        // Body = buffer
        Body: file.buffer
    };
    return await s3.upload(param).promise();
}