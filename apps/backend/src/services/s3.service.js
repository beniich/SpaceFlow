const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy'
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'beecarbonit-uploads';

/**
 * Generate a pre-signed URL for uploading a file to S3
 * @param {string} tenantId - The tenant's ID
 * @param {string} filename - The original filename
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<{ url: string, key: string }>}
 */
async function generateUploadUrl(tenantId, filename, contentType) {
  const extension = filename.split('.').pop();
  const key = `tenants/${tenantId}/${uuidv4()}.${extension}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { url, key };
}

/**
 * Generate a pre-signed URL for downloading a file from S3
 * @param {string} key - The S3 object key
 * @returns {Promise<string>}
 */
async function generateDownloadUrl(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

module.exports = {
  generateUploadUrl,
  generateDownloadUrl
};
