/**
 * @file cloudinary.js
 * @description Why this file exists: To set up and configure Cloudinary image storage integration and Multer file upload middleware.
 * @description Responsibility: Binds Cloudinary credentials, configures Multer to receive uploads in-memory (buffers), and exports helpers to push buffer streams to Cloudinary and delete assets by public ID.
 */

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary SDK credentials using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer memory storage (buffers files in RAM instead of writing to disk)
const storage = multer.memoryStorage();

// Initialize Multer upload middleware with file constraints
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum file size limit
  },
  fileFilter: (req, file, cb) => {
    // Restrict file formats strictly to image types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

/**
 * Uploads a file buffer to Cloudinary using a stream.
 * @param {Buffer} fileBuffer - The in-memory buffer of the uploaded file.
 * @returns {Promise<Object>} The Cloudinary upload result object.
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'unithrift_listings', // Store listings inside this designated folder on Cloudinary
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    
    // Write the buffer to the Cloudinary stream and end it
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary using its public ID.
 * @param {string} publicId - The Cloudinary public ID of the image to be deleted.
 * @returns {Promise<Object>} The Cloudinary deletion result.
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Cloudinary deletion failed for ID ${publicId}:`, error.message);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
};

/**
 * Line-by-line Explanation:
 * Line 7: Imports the v2 Cloudinary SDK module.
 * Line 8: Imports Multer middleware for handling multipart/form-data.
 * Line 11-15: Connects Cloudinary configuration parameters to values in process.env.
 * Line 18: Sets up 'memoryStorage' so file data stays in memory as a Buffer before uploading to Cloudinary.
 * Line 21-34: Instantiates the Multer middleware configurations. Sets a file size limit of 5MB and a filter rejecting non-image MIME types.
 * Line 41: Defines 'uploadToCloudinary' accepting an image file buffer.
 * Line 42: Wraps the asynchronous stream operations inside a JavaScript Promise structure.
 * Line 43-45: Opens a Cloudinary 'upload_stream' and assigns a target directory folder 'unithrift_listings'.
 * Line 46-51: Evaluates the upload result callback. Rejects on error or resolves on success.
 * Line 54: Writes the binary buffer directly to Cloudinary's upload stream.
 * Line 62: Declares asynchronous function 'deleteFromCloudinary' capturing a public image key.
 * Line 64: Deletes the asset using `cloudinary.uploader.destroy(publicId)`.
 * Line 70-74: Exports Multer upload middleware and Cloudinary stream/destroy helpers.
 */
