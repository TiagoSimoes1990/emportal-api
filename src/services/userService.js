const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, BucketAlreadyExists} = require('@aws-sdk/client-s3');
const {s3, bucketName} = require('../config/s3');
const generateRandomName = require('../utils/generateRandomName');
const User = require('../models/user')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * Uploads an image to an S3 bucket.
 *
 * @param {Object} file - The image file to be uploaded.
 * @param {string} [originalImageName] - Optional. The desired filename for the image. If not provided, a random filename will be generated.
 * @returns {Promise<Object>} A Promise resolving to an object containing the upload result.
 * @throws Error if an error occurs during the upload process.
 */
const uploadImage = async (file,originalImageName) => {    
    try {      
        const params = {
            Bucket: bucketName,
            Key: originalImageName ? originalImageName : generateRandomName(), // Check if original name is passed as a parameter
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

/**
 * Generates a pre-signed URL for accessing an image stored in the S3 bucket.
 *
 * @param {Object} imageData - An object containing the image information, with a `photo` property representing the image filename.
 * @returns {Promise<string>} A Promise resolving to the pre-signed URL for the image, or throws an error if the image is not found.
 * @throws Error if the image is not found or an error occurs during URL generation.
 */
const getImageURL = async (imageData) => {
    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key: imageData.photo,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        console.log(url);
        
        if(!url) {
            throw new Error('Image not found')
        }
        return url;
    } catch (error) {
        throw error;
    }
}

/**
 * Deletes an image from the S3 bucket.
 *
 * @param {Object} imageData - An object containing the image information, with a `photo` property representing the image filename.
 * @returns {Promise<Object>} A Promise resolving to an object containing a success message and the deleted image key.
 * @throws Error if the image is not found, the bucket does not exist, access is denied, or another error occurs during deletion.
 */
const deleteImage = async (imageData) => {
    const deleteObjectParams = {
        Bucket: bucketName,
        Key: imageData.photo
    }

    const command = new DeleteObjectCommand(deleteObjectParams);

    try {
        // S3 command to delete the image from bucket
        const result = await s3.send(command)
        // Handle success result
        return {
            message: 'Photo deleted successfuly',
            key: result.key,
        }
    } catch (error) {
        // Handle specific error types if needed
        if(error.code === 'NoSuchBucket') {
            throw new Error('Bucket does not exist');
        } else if (error.code === 'AccessDenied') {
            throw new Error('Access denied');
        }
        throw error;    // Re-throw for general errors
    }
}

module.exports = {
    uploadImage,
    getImageURL,
    deleteImage
};