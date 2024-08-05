const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const {s3, bucketName} = require('../config/s3');
const randomNameGenerator = require('../utils/randomNameGenerator');

const uploadImage = async (file) => {
    console.log(file);
    
    try {      
        const params = {
            Bucket: bucketName,
            Key: randomNameGenerator(),
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        const result = await s3.send(command);

        // Handle success, potentially returning more data
        return {
            message: 'Photo uploaded successfully',
            key: result.Key, // Or other relevant data
        };
    } catch (error) {
        // Handle specific error types if needed
        if (error.code === 'NoSuchBucket') {
          throw new Error('Bucket does not exist');
        } else if (error.code === 'AccessDenied') {
          throw new Error('Access denied');
        }
        throw error; // Re-throw for general errors
      }
};

module.exports = {
    uploadImage
};