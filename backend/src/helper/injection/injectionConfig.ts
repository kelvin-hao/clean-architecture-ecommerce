import { Container } from 'inversify'
import UserController from '~/module/user/user.controller'
import UserModel from '~/module/user/user.model'
import UserRepository from '~/module/user/user.repository'
import { elasticSearchProvider, redisProvider } from '~/database'
import { ContainerInjectionRegistry } from './injectionManager'
import UserService from '~/module/user/user.service'
import UploadService from '~/module/upload/upload.service'
import UploadController from '~/module/upload/upload.controller'
import PermissionModel from '~/module/rbac/permission.model'
import RoleModel from '~/module/rbac/role.model'
import RoleRepository from '~/module/rbac/role.repository'
import RBACService from '~/module/rbac/rbac.service'
import RBACController from '~/module/rbac/rbac.controller'
import PermissionRepository from '~/module/rbac/permission.repository'
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

export function configureContainer(): Container {
  const container = new Container()

  container.bind(ContainerInjectionRegistry.RedisDB).toDynamicValue(redisProvider).inSingletonScope()

  // container.bind(ContainerInjectionRegistry.ElasticsearchDB).toDynamicValue(elasticSearchProvider).inSingletonScope()

  container.bind(UploadService).toSelf().inSingletonScope()

  container.bind(UploadController).toSelf().inSingletonScope()

  container.bind(ContainerInjectionRegistry.RoleModel).toConstantValue(RoleModel)

  container.bind(ContainerInjectionRegistry.PermissionModel).toConstantValue(PermissionModel)

  container.bind(ContainerInjectionRegistry.RoleRepository).to(RoleRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.PermissionRepository).to(PermissionRepository).inSingletonScope()

  container.bind(ContainerInjectionRegistry.RBACService).to(RBACService).inSingletonScope()

  container.bind(ContainerInjectionRegistry.RBACController).to(RBACController).inSingletonScope()

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

  return container
}
