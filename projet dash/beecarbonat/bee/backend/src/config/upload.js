const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure S3 client
const s3Config = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret',
  },
  // endpoint: process.env.AWS_ENDPOINT // useful for MinIO/S3 compatible storage
});

const upload = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME || 'cafm-uploads',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const tenantId = req.user?.tenantId || 'common';
      const timestamp = Date.now();
      const filename = `${tenantId}/${timestamp}-${file.originalname}`;
      cb(null, filename);
    }
  })
});

module.exports = { upload, s3Config };
