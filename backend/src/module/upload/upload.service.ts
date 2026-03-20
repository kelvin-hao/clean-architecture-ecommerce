import { injectable } from 'inversify'
import 'reflect-metadata'
import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary'

import streamifier from 'streamifier'

@injectable()
export class UploadService {
  public async uploadImage(fileBuffer: Buffer, tags: string[] = []): Promise<string> {
    return this.uploadStream(fileBuffer, { resource_type: 'image', tags: tags, folder: 'user_avatar' })
  }

  public async deleteImage(secureUrl: string): Promise<void> {
    const publicId = this.extractPublicId(secureUrl)
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
  }

  public async replaceTags(secureUrl: string, newTags: string[]) {
    const publicId = this.extractPublicId(secureUrl)
    // 'replace' will remove all old tags and add the new ones.
    await cloudinary.uploader.replace_tag(newTags.join(','), [publicId])
  }

  public async replaceImage(oldSecureUrl: string, newFileBuffer: Buffer): Promise<string> {
    const publicId = this.extractPublicId(oldSecureUrl)

    // Upload the new image, telling Cloudinary to use the same public_id and overwrite it.
    return this.uploadStream(newFileBuffer, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image'
    })
  }

  /**
   * Extracts the public_id from a Cloudinary secure URL.
   * Example: 'folder/image_name' from a full URL.
   */
  private extractPublicId(secureUrl: string): string {
    const parts = secureUrl.split('/')
    // The public_id starts after the version number, which follows 'upload'
    const publicIdWithExtension = parts.slice(parts.indexOf('upload') + 2).join('/')
    // Remove the file extension (e.g., .jpg, .png)
    return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'))
  }

  private uploadStream(buffer: Buffer, options: UploadApiOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error)
        resolve((result as UploadApiResponse).secure_url)
      })
      streamifier.createReadStream(buffer).pipe(stream)
    })
  }
}

export default UploadService
