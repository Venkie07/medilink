import supabase from '../utils/supabase.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

class StorageService {
  async uploadFile(bucketName, file, destinationPath) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(destinationPath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      logger.error(`Supabase upload error in bucket ${bucketName}: ${error.message}`);
      throw new AppError(`Cloud upload failed: ${error.message}`, 500);
    }

    logger.info(`Successfully uploaded file to Supabase: ${bucketName}/${destinationPath}`);
    return data.path; // Return the path within the bucket
  }

  async getSignedUrl(bucketName, filePath, expiresSeconds = 900) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresSeconds);

    if (error) {
      logger.error(`Supabase signed URL error in bucket ${bucketName} for path ${filePath}: ${error.message}`);
      throw new AppError(`Secure URL generation failed: ${error.message}`, 500);
    }

    return data.signedUrl;
  }

  async deleteFile(bucketName, filePath) {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      logger.error(`Supabase deletion error in bucket ${bucketName} for path ${filePath}: ${error.message}`);
    }
  }
}

export default new StorageService();
