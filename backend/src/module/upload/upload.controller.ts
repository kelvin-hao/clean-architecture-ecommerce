import { inject, injectable } from 'inversify'
import UploadService from './upload.service'
import { Request, Response } from 'express'
import { BadRequest } from '~/helper/response/errorResponse'
import { CreatedResponse, NoContentResponse } from '~/helper/response/successResponse'

@injectable()
class UploadController {
  constructor(@inject(UploadService) private uploadService: UploadService) {}

  async uploadSingleImage(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequest('No image file provider')
    }
    const imageUrl = await this.uploadService.uploadImage(req.file.buffer, ['temp-upload'])

    return new CreatedResponse({ secure_url: imageUrl }).send(req, res)
  }

  async uploadMultipleImages(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      throw new BadRequest('No image files provided.')
    }

    const uploadPromises = files.map((file) => this.uploadService.uploadImage(file.buffer), ['temp-upload'])
    const imageUrls = await Promise.all(uploadPromises)

    return new CreatedResponse({ secureUrl: imageUrls }).send(req, res)
  }

  async deleteImage(req: Request, res: Response) {
    const { imageUrl } = req.body
    if (!imageUrl) {
      throw new BadRequest('Image URL is required for deletion.')
    }
    await this.uploadService.deleteImage(imageUrl)

    return new NoContentResponse().send(req, res)
  }
}

export default UploadController
