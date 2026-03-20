import { Router } from 'express'
import { containerInjection } from '~/helper/injection/injectionManager'
import UploadController from './upload.controller'
import isAuth from '~/middleware/isAuth.mid'
import { upload } from '~/middleware/multer.mid'
import routeConfig from '~/config/route.config'
import validationInput from '~/middleware/validationInput.mid'
import { DeleteImageDTO } from './upload.dto'
import { RequestPartEnum } from '~/types/type'
import catchErrorHandler from '~/middleware/catchError.mid'

function createUploadRoute(): Router {
  const container = containerInjection.getContainer()
  const uploadController = container.get<UploadController>(UploadController)
  const router = Router()

  router.post(
    routeConfig.upload.child.singleImage.path,
    isAuth,
    upload.single('image'), // Expects a field named 'image'
    catchErrorHandler(uploadController.uploadSingleImage.bind(uploadController))
  )

  router.post(
    routeConfig.upload.child.multipleImages.path,
    isAuth,
    upload.array('images', 5), // Expects a field named 'images', max 5 files
    catchErrorHandler(uploadController.uploadMultipleImages.bind(uploadController))
  )

  router.delete(
    routeConfig.upload.child.deleteImage.path,
    isAuth,
    validationInput(DeleteImageDTO, RequestPartEnum.BODY),
    catchErrorHandler(uploadController.deleteImage.bind(uploadController))
  )

  return router
}

export default createUploadRoute
