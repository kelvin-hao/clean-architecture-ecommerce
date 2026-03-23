import { inject, injectable } from 'inversify'
import { ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import VendorService from './vendor.service'

@injectable()
class VendorController {
  constructor(@inject(ContainerInjectionRegistry.VendorService) vendorService: VendorService) {}
}

export default VendorController
