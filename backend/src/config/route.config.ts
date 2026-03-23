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

      verifyRegister: {
        path: '/verify-register/:code',
        method: 'GET'
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
      }
    }
  },

  products: {
    path: '/products',
    child: {
      insert: {
        path: '/',
        method: 'POST'
      }
    }
  }
}

export default routeConfig
