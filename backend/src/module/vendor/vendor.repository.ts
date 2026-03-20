import { inject, injectable } from 'inversify'
import { RepositoryBase } from '~/helper'
import { IVendor } from './vendor.model'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import { Model } from 'mongoose'

@injectable()
class VendorRepository extends RepositoryBase<IVendor> {
  constructor(@inject(ContainerInjectionRegistry.VendorModel) vendorModel: Model<IVendor>) {
    super(vendorModel)
  }
}

export default VendorRepository
