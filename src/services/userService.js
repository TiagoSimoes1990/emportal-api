const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const {s3, bucketName} = require('../config/s3');
const generateRandomName = require('../utils/generateRandomName');
const User = require('../models/user')

const uploadImage = async (file) => {
    console.log(file);
    
    const imageName = generateRandomName();
    try {      
        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        const result = await s3.send(command);

        // Handle success, potentially returning more data
        return {
            message: 'Photo uploaded successfully',
            key: result.Key, // Or other relevant data
            imageName: imageName,
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

const updateUserProfileImage = async (userId, imageName) => {
    try {
        const user = await User.update(userId, {photo: imageName})
        if(!user) {
            throw new Error('User not found')
        }
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    uploadImage
};