const bodyParser = require('body-parser');
var path = require('path');

const multer = require('multer');
const s3Storage = require('multer-sharp-s3');
const aws = require('aws-sdk');
const randomID = parseInt(Math.random() * 10000000)

const s3 = new aws.S3({
	// "endpoint": process.env.S3_END_POINT,
	"accessKeyId": process.env.AWS_ACCESS_KEY_ID,
	"secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "Bucket": process.env.AWS_BUCKET_NAME,
	"region": process.env.AWS_REGION,
	// "s3ForcePathStyle": true
})

const storage = s3Storage({
  s3,
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: `coverImages/${randomID}-itUploaded`,
//   Key: `coverImages/${randomID}-${file.originalname}-${username}`,
//   Key: `${process.env.AWS_BUCKET_NAME}/coverImages/${Date.now()}-myImage`,
  ACL: 'public-read',
  resize: {
    height: 300
  }
})
const upload = multer({ storage: storage })

module.exports = multer({
    storage: storage,
})