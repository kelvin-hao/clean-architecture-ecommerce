import { Container } from 'inversify'
import UserController from '~/module/user/user.controller'
import UserModel from '~/module/user/user.model'
import UserRepository from '~/module/user/user.repository'
import { redisProvider } from '~/database'
import { ContainerInjectionRegistry } from './injectionManager'
import UserService from '~/module/user/user.service'
import UploadService from '~/module/upload/upload.service'
import UploadController from '~/module/upload/upload.controller'
import PermissionModel from '~/module/rbac/permission.model'
import RoleModel from '~/module/rbac/role.model'
import RoleRepository from '~/module/rbac/role.repository'
import AuthController from '~/module/auth/auth.controller'
import AuthService from '~/module/auth/auth.service'
import CategoryModel from '~/module/category/category.model'
import CategoryRepository from '~/module/category/caterogy.repository'
import CategoryService from '~/module/category/category.service'
import CategoryController from '~/module/category/category.controller'
import ProductSKUModel from '~/module/product/product_sku.model'
import ProductSPUModel from '~/module/product/product_spu.model'
import ProductSKURepository from '~/module/product/product_sku.repository'
import ProductSPURepository from '~/module/product/product._spu.repository'
import VendorModel from '~/module/vendor/vendor.model'
import VendorRepository from '~/module/vendor/vendor.repository'
import VendorService from '~/module/vendor/vendor.service'
import VendorController from '~/module/vendor/vendor.controller'
import ProductService from '~/module/product/product.service'
import ProductController from '~/module/product/product.controller'
import CartRepository from '~/module/cart/cart.repository'
import CartService from '~/module/cart/cart.service'
import CartController from '~/module/cart/cart.controller'
import inventoryModel from '~/module/inventory/inventory.model'
import InventoryRepository from '~/module/inventory/inventory.repository'
import InventoryService from '~/module/inventory/inventory.service'
import InventoryController from '~/module/inventory/inventory.controller'
import discountModel from '~/module/discount/discount.model'
import DiscountRepository from '~/module/discount/discount.repository'
import DiscountService from '~/module/discount/discount.service'
import DiscountController from '~/module/discount/discount.controller'
import paymentModel from '~/module/payment/payment.model'
import PaymentRepository from '~/module/payment/payment.repository'
import PaymentService from '~/module/payment/payment.service'
import PaymentController from '~/module/payment/payment.controller'
import OrderModel from '~/module/order/order.model'
import OrderRepository from '~/module/order/order.repository'
import OrderService from '~/module/order/order.service'
import OrderController from '~/module/order/order.controller'

export function configureContainer(): Container {
  const container = new Container()

  container.bind(ContainerInjectionRegistry.RedisDB).toDynamicValue(redisProvider).inSingletonScope()

  // container.bind(ContainerInjectionRegistry.ElasticsearchDB).toDynamicValue(elasticSearchProvider).inSingletonScope()

  container.bind(UploadService).toSelf().inSingletonScope()

  container.bind(UploadController).toSelf().inSingletonScope()

  container.bind(ContainerInjectionRegistry.RoleModel).toConstantValue(RoleModel)

  container.bind(ContainerInjectionRegistry.PermissionModel).toConstantValue(PermissionModel)

  container.bind(ContainerInjectionRegistry.RoleRepository).to(RoleRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.UserModel).toConstantValue(UserModel)

  container.bind(ContainerInjectionRegistry.UserRepository).to(UserRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.AuthService).to(AuthService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.UserService).to(UserService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.UserController).to(UserController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.AuthController).to(AuthController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.VendorModel).toConstantValue(VendorModel)

  container.bind(ContainerInjectionRegistry.VendorRepository).to(VendorRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.VendorService).to(VendorService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.VendorController).to(VendorController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.CategoryModel).toConstantValue(CategoryModel)

  container.bind(ContainerInjectionRegistry.CategoryRepository).to(CategoryRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.CategoryService).to(CategoryService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.CategoryController).to(CategoryController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.ProductSPUModel).toConstantValue(ProductSPUModel)

  container.bind(ContainerInjectionRegistry.ProductSKUModel).toConstantValue(ProductSKUModel)

  container.bind(ContainerInjectionRegistry.ProductSKURepository).to(ProductSKURepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.ProductSPURepository).to(ProductSPURepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.ProductService).to(ProductService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.ProductController).to(ProductController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.CartRepository).to(CartRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.CartService).to(CartService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.CartController).to(CartController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.InventoryModel).toConstantValue(inventoryModel)

  container.bind(ContainerInjectionRegistry.InventoryRepository).to(InventoryRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.InventoryService).to(InventoryService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.InventoryController).to(InventoryController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.OrderModel).toConstantValue(OrderModel)

  container.bind(ContainerInjectionRegistry.OrderRepository).to(OrderRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.OrderService).to(OrderService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.OrderController).to(OrderController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.PaymentModel).toConstantValue(paymentModel)

  container.bind(ContainerInjectionRegistry.PaymentRepository).to(PaymentRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.PaymentService).to(PaymentService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.PaymentController).to(PaymentController).inSingletonScope()

  container.bind(ContainerInjectionRegistry.DiscountModel).toConstantValue(discountModel)

  container.bind(ContainerInjectionRegistry.DiscountRepository).to(DiscountRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.DiscountService).to(DiscountService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.DiscountController).to(DiscountController).inSingletonScope()

  return container
}
