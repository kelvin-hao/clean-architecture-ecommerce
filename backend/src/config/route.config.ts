const routeConfig = {
  checkHealthy: {
    path: '/check-status'
  },

  rbac: {
    path: '/rbac',
    child: {
      createPermission: {
        path: '/permissions',
        method: 'POST'
      },

      getPermissions: {
        path: '/permissions',
        method: 'GET'
      },

      createRole: {
        path: '/roles',
        method: 'POST'
      }
    }
  },

  upload: {
    path: '/upload',
    child: {
      singleImage: {
        path: '/image',
        method: 'POST'
      },

      multipleImages: {
        path: '/images',
        method: 'POST'
      },

      deleteImage: {
        path: '/image',
        method: 'DELETE'
      }
    }
  },

  auth: {
    path: '/auth',
    child: {
      signUp: {
        path: '/sign-up',
        method: 'POST'
      },

      signIn: {
        path: '/sign-in',
        method: 'POST'
      },

      LoginWithGoogle: {
        path: '/google',
        method: 'GET'
      },

      LoginWithGoogleCallback: {
        path: '/google-callback',
        method: 'GET'
      },

      verify2Fa: {
        path: '/verify-2fa',
        method: 'POST'
      },

      sendOtp: {
        path: '/send-otp',
        method: 'POST'
      },

      verifyRegister: {
        path: '/verify-otp',
        method: 'POST'
      },

      refreshToken: {
        path: '/refresh-token',
        method: 'POST'
      },

      logout: {
        path: '/log-out',
        method: 'DELETE'
      },

      forgotPassword: {
        path: '/forgot-password',
        method: 'POST'
      },

      resetPassword: {
        path: '/reset-password',
        method: 'POST'
      }
    }
  },

  users: {
    path: '/users',
    child: {
      makeAdminAccount: {
        path: '/admin-account',
        method: 'POST'
      },

      importUsersCSV: {
        path: '/import-users-csv',
        method: 'POST'
      },

      exporttUsersCSV: {
        path: '/export-user-csv',
        method: 'GET'
      },
      enable2FA: {
        path: '/enable-2fa',
        method: 'POST'
      },

      changePassword: {
        path: '/change-password',
        method: 'POST'
      },

      changeAvatar: {
        path: '/profile/avatar',
        method: 'POST'
      },

      getUsers: {
        path: '/',
        method: 'GET'
      },

      getProfile: {
        path: '/profile',
        method: 'GET'
      },

      editProfile: {
        path: '/profile',
        method: 'PATCH'
      },

      deleteAccount: {
        path: '/',
        method: 'DELETE'
      }
    }
  },

  vendors: {
    path: '/vendors',
    child: {
      root: {
        path: '/',
        method: 'GET'
      },

      me: {
        path: '/me',
        method: 'GET'
      },

      getById: {
        path: '/:id',
        method: 'GET'
      },

      approve: {
        path: '/:id/approve',
        method: 'PATCH'
      },

      reject: {
        path: '/:id/reject',
        method: 'PATCH'
      }
    }
  },

  categories: {
    path: '/categories',
    child: {
      insert: {
        path: '/',
        method: 'POST'
      },

      getList: {
        path: '/',
        method: 'GET'
      },

      getById: {
        path: '/:id',
        method: 'GET'
      },

      update: {
        path: '/:id',
        method: 'PATCH'
      },

      delete: {
        path: '/:id',
        method: 'DELETE'
      }
    }
  },

  products: {
    path: '/products',
    child: {
      insert: {
        path: '/',
        method: 'POST'
      },

      getList: {
        path: '/',
        method: 'GET'
      },

      getById: {
        path: '/:id',
        method: 'GET'
      },

      getSkuList: {
        path: '/:id/skus',
        method: 'GET'
      },

      bulkUpdateSkus: {
        path: '/:id/skus',
        method: 'PATCH'
      },

      getSkuById: {
        path: '/skus/:skuId',
        method: 'GET'
      },

      updateSku: {
        path: '/skus/:skuId',
        method: 'PATCH'
      },

      update: {
        path: '/:id',
        method: 'PATCH'
      },

      publish: {
        path: '/:id/publish',
        method: 'PATCH'
      },

      archive: {
        path: '/:id/archive',
        method: 'PATCH'
      },

      delete: {
        path: '/:id',
        method: 'DELETE'
      }
    }
  },

  cart: {
    path: '/cart',
    child: {
      root: {
        path: '/',
        method: 'GET'
      },

      addItem: {
        path: '/items',
        method: 'POST'
      },

      updateItem: {
        path: '/items/:sku_id',
        method: 'PATCH'
      }
    }
  },

  inventory: {
    path: '/inventory',
    child: {
      root: {
        path: '/',
        method: 'GET'
      },

      bySku: {
        path: '/sku/:skuId',
        method: 'GET'
      },

      reserve: {
        path: '/sku/:skuId/reserve',
        method: 'POST'
      },

      release: {
        path: '/sku/:skuId/release',
        method: 'POST'
      },

      commit: {
        path: '/sku/:skuId/commit',
        method: 'POST'
      }
    }
  },

  discounts: {
    path: '/discounts',
    child: {
      insert: {
        path: '/',
        method: 'POST'
      },

      getByCode: {
        path: '/code',
        method: 'GET'
      },

      apply: {
        path: '/apply',
        method: 'POST'
      },

      available: {
        path: '/available',
        method: 'GET'
      },

      getVendor: {
        path: '/vendor/:vendorId',
        method: 'GET'
      },

      update: {
        path: '/:id',
        method: 'PATCH'
      },

      disable: {
        path: '/:id/disable',
        method: 'PATCH'
      }
    }
  },

  orders: {
    path: '/orders',
    child: {
      root: {
        path: '/',
        method: 'GET|POST'
      },

      getById: {
        path: '/:id',
        method: 'GET'
      },

      markDelivery: {
        path: '/:id/ship',
        method: 'PATCH'
      },

      cancel: {
        path: '/:id/cancel',
        method: 'PATCH'
      }
    }
  },

  payments: {
    path: '/payments',
    child: {
      root: {
        path: '/',
        method: 'GET|POST'
      },

      getByOrderId: {
        path: '/order/:orderId',
        method: 'GET'
      },

      getById: {
        path: '/:id',
        method: 'GET'
      },

      markPaid: {
        path: '/:id/paid',
        method: 'PATCH'
      },

      markFailed: {
        path: '/:id/failed',
        method: 'PATCH'
      }
    }
  }
}

export default routeConfig
