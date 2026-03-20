import { IUser } from './user.model'
import { inject, injectable } from 'inversify'
import { Model } from 'mongoose'
import { IRepositoryBase, RepositoryBase } from '~/helper'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'

interface IUserRepository extends IRepositoryBase<IUser> {
  findByEmail(email: string): Promise<IUser | null>
  findByEmailAndSelectPassword(email: string): Promise<IUser | null>
  findByIdAndSelectPassword(email: string): Promise<IUser | null>
  insertMany(data: Partial<IUser>[]): Promise<IUser[]>
  getAllEmails(): Promise<string[]>
}

@injectable()
class UserRepository extends RepositoryBase<IUser> implements IUserRepository {
  constructor(@inject(ContainerInjectionRegistry.UserModel) userModel: Model<IUser>) {
    super(userModel)
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec()
  }

  async getAllEmails(): Promise<string[]> {
    const users = await this.model.find({}, { email: 1, _id: 0 }).lean()

    return users.map((u: { email: string }) => u.email)
  }

  async findByEmailAndSelectPassword(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).select('+password').exec()
  }

  async findByIdAndSelectPassword(id: string): Promise<IUser | null> {
    return this.model.findById(id).select('+password').exec()
  }

  async insertMany(data: Partial<IUser>[]): Promise<IUser[]> {
    const users = await this.model.insertMany(data, {
      ordered: false
    })

    return users
  }
}
export default UserRepository
