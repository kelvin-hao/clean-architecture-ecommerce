import axiosClient from '~/lib/axios'
import type { ApiResponse } from '~/types'

export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const res = await axiosClient.post<ApiResponse<{ secure_url: string }>>('/uploads/single-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data.data.secure_url
  }
}
