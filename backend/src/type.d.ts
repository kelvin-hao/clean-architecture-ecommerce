/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import { DTOBase } from './helper'
import { JwtPayload } from './types/type'
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
      bodyValidated?: BaseDto
      queryValidated?: BaseDto
      paramsValidated?: BaseDto
      resource?: { id: string }
    }
  }
}
