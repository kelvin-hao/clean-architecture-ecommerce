/* eslint-disable @typescript-eslint/no-explicit-any */

import { plainToInstance, ClassConstructor } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import sanitizeHtml from 'sanitize-html'
import { BaseDto } from '~/helper'
import { BadRequestError } from '~/helper/response/errorResponse'
import { RequestPartEnum } from '~/types/type'

/**
 * Formats validation errors from class-validator into a structured object.
 */
function formatErrors(errors: ValidationError[]): string[] {
  const ObjArrays = errors.reduce(
    (acc, err) => {
      acc[err.property] = Object.values(err.constraints || {})
      return acc
    },
    {} as Record<string, string[]>
  )
  return Object.values(ObjArrays).flat()
}

/**
 * Recursively sanitizes an object's string properties by trimming and stripping HTML.
 */
function sanitize(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const sanitizedData: { [key: string]: any } = Array.isArray(data) ? [] : {}

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key]

      if (typeof value === 'string') {
        // 1. Trim whitespace
        const trimmedValue = value.trim()
        // 2. Strip HTML to prevent XSS
        sanitizedData[key] = sanitizeHtml(trimmedValue, {
          allowedTags: [],
          allowedAttributes: {}
        })
      } else {
        // Recurse for nested objects or arrays
        sanitizedData[key] = sanitize(value)
      }
    }
  }
  return sanitizedData
}

/**
 * A factory for creating Express middleware that sanitizes and validates request data.
 *
 * @param dtoClass The DTO class to validate against.
 * @param source The part of the request to validate ('body', 'query', or 'params').
 * @returns An Express middleware function.
 */
function validationInput<T extends BaseDto>(dtoClass: ClassConstructor<T>, source: RequestPartEnum) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Stage 1: Sanitize the raw input data from the specified source.

    const sanitizedData = sanitize(req[source])

    console.log(sanitizedData)

    // Stage 2: Transform the sanitized data into an instance of the DTO class.
    const dtoInstance = plainToInstance(dtoClass, sanitizedData)

    // Stage 3: Validate the DTO instance with strict rules.
    const errors = await validate(dtoInstance, {
      whitelist: true, // Automatically remove properties that are not in the DTO.
      forbidNonWhitelisted: true // Throw an error if non-whitelisted properties are present.
    })

    if (errors.length > 0) {
      const formattedErrors = formatErrors(errors)
      // Pass the structured error object, not a stringified version.
      return next(new BadRequestError(formattedErrors.join(' ').toString()))
    }
    // Stage 4: Replace the original request part with the sanitized and validated DTO.
    // This provides a type-safe and clean object to your controllers.

    switch (source) {
      case RequestPartEnum.BODY:
        req.bodyValidated = dtoInstance
        return next()

      case RequestPartEnum.QUERY:
        req.queryValidated = dtoInstance
        return next()

      case RequestPartEnum.PARAMS:
        req.paramsValidated = dtoInstance
        return next()
    }
  }
}

export default validationInput
