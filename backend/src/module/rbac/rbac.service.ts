import { inject, injectable } from 'inversify'
import Redis from 'ioredis'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import RoleRepository from './role.repository'
import PermissionRepository from './permission.repository'
import { CreatePermissionDTO, CreateRoleDTO } from './rbac.dto'
import { BadRequestError } from '~/helper/response/errorResponse'
import { Types } from 'mongoose'
import { ONE_MINUTES_IN_SECONDS } from '~/utils/const.util'

@injectable()
class RBACService {
  constructor(
    @inject(ContainerInjectionRegistry.RoleRepository)
    private roleRepository: RoleRepository,

    @inject(ContainerInjectionRegistry.PermissionRepository)
    private permissionRepository: PermissionRepository,

    @inject(ContainerInjectionRegistry.RedisDB)
    private redisClient: Redis,

    private CACHED_VARIAVLE = {
      permissionAll: 'permission:all'
    }
  ) {}

  /**
   * Insert permission
   * @param payload { key, resource, action}
   * @returns permission ID
   */
  async createPermission(payload: CreatePermissionDTO) {
    const { key, resource, action } = payload

    const existedPermission = await this.permissionRepository.findByKey(key)
    if (existedPermission) throw new BadRequestError('Permission already exist')

    const permission = await this.permissionRepository.create({
      key,
      resource,
      action
    })

    /**
     * invalidate permission cache
     */
    await this.redisClient.del(this.CACHED_VARIAVLE.permissionAll)

    return {
      id: permission._id
    }
  }

  /**
   * Get list of permission
   * @returns List of permissions
   */
  async getAllPermission() {
    const cached = await this.redisClient.get(this.CACHED_VARIAVLE.permissionAll)

    if (cached) return JSON.parse(cached)

    const permissions = await this.permissionRepository.findAll()

    await this.redisClient.set(
      this.CACHED_VARIAVLE.permissionAll,
      JSON.stringify(permissions),
      'EX',
      ONE_MINUTES_IN_SECONDS
    )

    return permissions
  }

  /**
   * Create new role
   * @param payload { name, description, permissions }
   * @returns role ID
   */
  async createRole(payload: CreateRoleDTO) {
    const { name, description, permissions } = payload

    const existedNameRole = await this.roleRepository.findByName(name)
    if (existedNameRole) throw new BadRequestError('Role already existed')

    const permissionDocs = await this.permissionRepository.findAll({
      key: { $in: permissions }
    })

    if (!permissionDocs || permissionDocs.length === 0) {
      throw new Error('Permissions not found')
    }

    const permissionIds = permissionDocs.map((p) => p._id)

    const role = await this.roleRepository.create({
      name,
      description,
      permissions: permissionIds as Types.ObjectId[]
    })

    return {
      id: role._id
    }
  }
}

export default RBACService
