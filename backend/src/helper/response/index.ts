import { Request, Response } from 'express'
// import { cookieOptions } from '~/config/cookie.config'
import logger from '~/config/winton.config'
import { CONTEXT } from '../../utils/const.util'
import { format } from 'fast-csv'

export class ErrorResponseBase extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number
  ) {
    super(message)
  }
}

export class SuccessResponseBase<T> {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public data: Partial<T>
  ) {}

  private logSuccess(req: Request) {
    logger.info(this.message, {
      context: CONTEXT.SUSSESS,
      requestID: req.locals.requestID,
      ipAddress: req.locals.ipAddress,
      userId: req.user?.id,
      statusCode: this.statusCode,
      metaData: this.data,
      pathURL: req.originalUrl,
      body: req.body
    })
  }

  send(req: Request, res: Response) {
    this.logSuccess(req)
    res.status(this.statusCode).json(this)
  }

  // setToken(res: Response, acessToken: string, refreshToken: string) {
  //   res.cookie('accessToken', acessToken, cookieOptions)
  //   res.cookie('refreshToken', refreshToken, cookieOptions)
  //   return this
  // }

  // clearToken(res: Response) {
  //   res.clearCookie('accessToken')
  //   res.clearCookie('refreshToken')
  //   return this
  // }
}

export class CsvDownloadResponse<T> {
  constructor(
    private fileName: string,
    private data: T[]
  ) {}

  async send(res: Response) {
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Desposition', `attachment; filename=${this.fileName}`)

    const csvStream = format({ headers: true })

    csvStream.pipe(res)

    for await (const row of this.data) {
      csvStream.write(row)
    }

    csvStream.end()
  }
}
