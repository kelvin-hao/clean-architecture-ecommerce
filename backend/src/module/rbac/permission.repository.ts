import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { inject, injectable } from 'inversify'
import { Model } from 'mongoose'
import { IPermission } from '~/types/interface'

interface IPermissionRepository extends IRepositoryBase<IPermission> {
  findByKey(key: string): Promise<IPermission | null>
}

@injectable()
class PermissionRepository extends RepositoryBase<IPermission> implements IPermissionRepository {
  constructor(@inject(ContainerInjectionRegistry.PermissionModel) permissionModel: Model<IPermission>) {
    super(permissionModel)
  }

  async findByKey(key: string): Promise<IPermission | null> {
    const permission = await this.model.findOne({ key: key })
    return permission
  }
}

export default PermissionRepository
