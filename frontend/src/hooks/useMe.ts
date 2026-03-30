// import { useQuery } from '@tanstack/react-query'
// import { authApi } from '~/apis/auth.api'
// import { useAuthStore } from '~/store/auth.store'

// export const useMe = () => {
//   const setAuth = useAuthStore((s) => s.setAuth)
//   const logout = useAuthStore((s) => s.logout)

//   return useQuery({
//     queryKey: ['me'],
//     queryFn: authApi.me,
//     retry: false,

//     onSuccess: (res) => {
//       setAuth({
//         user: res.data,
//         accessToken: useAuthStore.getState().accessToken!
//       })
//     },

//     onError: () => {
//       logout()
//     }
//   })
// }
