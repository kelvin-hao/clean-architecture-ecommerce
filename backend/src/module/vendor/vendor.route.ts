import { Router } from 'express'
import { containerInjection, ContainerInjectionRegistry } from '~/helper/injection/injectionManager'
import VendorController from './vendor.controller'

const createVendorRoute = async (): Promise<Router> => {
  const container = containerInjection.getContainer()
  const vendorContaoller = await container.getAsync<VendorController>(ContainerInjectionRegistry.VendorController)
  const vendorRoute = Router()

  return vendorRoute
}
