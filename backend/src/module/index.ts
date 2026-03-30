import express, { Router } from 'express'
import routeConfig from '~/config/route.config'
import createUserRoute from './user/user.route'
import { OKResponse } from '~/helper/response/successResponse'
import createUploadRoute from './upload/upload.route'
import createAuthRoute from './auth/auth.route'
import createCategoryRoute from './category/category.route'
import createProductRoute from './product/product.route'
import createCartRoute from './cart/cart.route'
import createInventoryRoute from './inventory/inventory.route'
import createDiscountRoute from './discount/discount.route'
import createVendorRoute from './vendor/vendor.route'
import createPaymentRoute from './payment/payment.route'
import createOrderRoute from './order/order.route'

const createRoute = async (): Promise<Router> => {
  const router = express.Router()
  const uploadRoute = createUploadRoute()

  const [
    authRoute,
    userRoute,
    vendorRoute,
    categoryRoute,
    productRoute,
    cartRoute,
    inventoryRoute,
    discountRoute,
    paymentRoute,
    orderRoute
  ] = await Promise.all([
    createAuthRoute(),
    createUserRoute(),
    createVendorRoute(),
    createCategoryRoute(),
    createProductRoute(),
    createCartRoute(),
    createInventoryRoute(),
    createDiscountRoute(),
    createPaymentRoute(),
    createOrderRoute()
  ])

  router.get(routeConfig.checkHealthy.path, (req, res) => {
    return new OKResponse({
      message: 'API is working',
      url: {
        user: routeConfig.users.path,
        upload: routeConfig.upload.path,
        vendor: routeConfig.vendors.path,
        cart: routeConfig.cart.path,
        inventory: routeConfig.inventory.path,
        discount: routeConfig.discounts.path,
        payment: routeConfig.payments.path,
        order: routeConfig.orders.path
      }
    }).send(req, res)
  })
  // API
  router.use(routeConfig.upload.path, uploadRoute)
  router.use(routeConfig.auth.path, authRoute)
  router.use(routeConfig.users.path, userRoute)
  router.use(routeConfig.vendors.path, vendorRoute)
  router.use(routeConfig.categories.path, categoryRoute)
  router.use(routeConfig.products.path, productRoute)
  router.use(routeConfig.cart.path, cartRoute)
  router.use(routeConfig.inventory.path, inventoryRoute)
  router.use(routeConfig.discounts.path, discountRoute)
  router.use(routeConfig.payments.path, paymentRoute)
  router.use(routeConfig.orders.path, orderRoute)

  return router
}

export default createRoute
