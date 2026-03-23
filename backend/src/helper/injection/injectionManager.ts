import { Container } from 'inversify'
import { BadRequestError } from '../response/errorResponse'

export const ContainerInjectionRegistry = {
  RedisDB: Symbol.for('RedisDB'),

  UploadService: Symbol.for('UploadService'),

  UploadController: Symbol.for('UploadController'),

  UserModel: Symbol.for('UserModel'),

  UserRepository: Symbol.for('UserRepository'),

  UserService: Symbol.for('UserService'),

  AuthService: Symbol.for('AuthService'),

  UserController: Symbol.for('UserController'),

  AuthController: Symbol.for('AuthController'),

  RoleModel: Symbol.for('RoleModel'),

  PermissionModel: Symbol.for('PermissionModel'),

  PermissionRepository: Symbol.for('PermissionRepository'),

  RoleRepository: Symbol.for('RoleRepository'),

  RBACService: Symbol.for('RBACService'),

  RBACController: Symbol.for('RBACController'),

  VendorModel: Symbol.for('VendorModel'),

  VendorRepository: Symbol.for('VendorRepository'),

  VendorService: Symbol.for('VendorService'),

  VendorController: Symbol.for('VendorController'),

  CategoryModel: Symbol.for('CategoryModel'),

  CategoryRepository: Symbol.for('CategoryRepository'),

  CategoryService: Symbol.for('CategoryService'),

  CategoryController: Symbol.for('CategoryController'),

  ProductSKUModel: Symbol.for('ProductSKUModel'),

  ProductSPUModel: Symbol.for('ProductSPUModel'),

  ProductSKURepository: Symbol.for('ProductSKURepository'),

  ProductSPURepository: Symbol.for('ProductSPURepository'),

  ProductService: Symbol.for('ProductService'),

  ProductController: Symbol.for('ProductController')
}

class ContainerInjection {
  private static instance: ContainerInjection
  private container: Container | null = null

  private constructor() {}

  public static getInstance(): ContainerInjection {
    if (!this.instance) {
      this.instance = new ContainerInjection()
    }
    return this.instance
  }

  public setContainer(container: Container): void {
    this.container = container
  }

  public getContainer(): Container {
    if (!this.container) {
      throw new BadRequestError(
        'ContainerInjection has not been initialized. Please call setContainer() in your main bootstrap file.'
      )
    }
    return this.container
  }
}

export const containerInjection = ContainerInjection.getInstance()
