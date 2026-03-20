import env from '~/config/env/dotenv.config'
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_EXPRIRE_IN, REFRESH_TOKEN_EXPRIRE_IN } from '~/utils/const.util'
import { JwtPayload } from '~/types/type'

class JsonWebToken {
  public static instance: JsonWebToken
  private readonly jwtSecret: string
  private readonly jwtRefreshSecret: string

  constructor() {
    this.jwtSecret = env.JWT_SECRET
    this.jwtRefreshSecret = env.JWT_REFRESH_SECRET
  }

  public static getInstance() {
    if (!this.instance) this.instance = new JsonWebToken()
    return this.instance
  }

  generatePairOfJWTToken(payload: JwtPayload) {
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: ACCESS_TOKEN_EXPRIRE_IN
    })

    const refreshPayload: Omit<JwtPayload, 'permissions'> = {
      id: payload.id,
      sessionId: payload.sessionId
    }

    const refreshToken = jwt.sign(refreshPayload, this.jwtRefreshSecret, {
      expiresIn: REFRESH_TOKEN_EXPRIRE_IN
    })

    return {
      accessToken,
      refreshToken
    }
  }
  verifyAccessToken(token: string) {
    return jwt.verify(token, this.jwtSecret) as JwtPayload
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.jwtRefreshSecret) as Omit<JwtPayload, 'role'>
  }

  decoded(token: string) {
    return jwt.decode(token)
  }
}

const jsonWebToken = JsonWebToken.getInstance()

export default jsonWebToken
