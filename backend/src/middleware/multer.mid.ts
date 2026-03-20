import multer from 'multer'
import path from 'path'
import { BadRequestError } from '~/helper/response/errorResponse'

const LITMIT_COMMON_FILE_SIZE = 1024 * 1024 * 10 // 10MB
const ALLOW_FILE_TYPE = ['image/png', 'image/jpg', 'image/jpeg', 'image/avif']

const ALLOW_FILE_CSV = ['text/csv']

export const upload = multer({
  limits: { fileSize: LITMIT_COMMON_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOW_FILE_TYPE.includes(file.mimetype)) {
      const error = new BadRequestError('File type is not supported')
      return cb(error)
    }

    cb(null, true)
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/')
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)

    cb(null, unique + path.extname(file.originalname))
  }
})

export const uploadFileCSV = multer({
  storage,
  limits: { fileSize: LITMIT_COMMON_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOW_FILE_CSV.includes(file.mimetype)) {
      const error = new BadRequestError('Only CSV files allowed')
      return cb(error)
    }

    cb(null, true)
  }
})
