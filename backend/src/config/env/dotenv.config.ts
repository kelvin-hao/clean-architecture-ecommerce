import 'dotenv/config'
import { DtoEnv } from './env.dto'
import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'

/**
 * Loads, validates, and transforms environment variables.
 * Exits the process if validation fails.
 * @returns {Readonly<DtoEnv variables>} A clean, validated, and read-only config object.
 */
function initializeConfig(): DtoEnv {
  const validatteObject = plainToClass(DtoEnv, process.env)
  const errors = validateSync(validatteObject)

  if (errors.length > 0) {
    console.error(`ERROR: Invalid or missing environment variables.`)
    process.exit(1)
  }

  return validatteObject
}
const env = initializeConfig()

export default env
