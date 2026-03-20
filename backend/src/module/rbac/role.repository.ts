import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { inject, injectable } from 'inversify'
import { Model } from 'mongoose'
import { IRole } from '~/types/interface'

interface IRoleRepository extends IRepositoryBase<IRole> {
  findByName(name: string): Promise<IRole | null>
}

@injectable()
class RoleRepository extends RepositoryBase<IRole> implements IRoleRepository {
  constructor(@inject(ContainerInjectionRegistry.RoleModel) roleModel: Model<IRole>) {
    super(roleModel)
  }

  async findByName(name: string): Promise<IRole | null> {
    const role = await this.model.findOne({ name: name })
    return role
  }
}

export default RoleRepository
