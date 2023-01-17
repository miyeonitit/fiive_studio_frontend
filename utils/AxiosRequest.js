import { useCallback } from 'react'
import axios from 'axios'

const AxiosRequest = async ({ url, method, body, token }) => {
  let successData = ''
  let errorData = ''

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL

  try {
    switch (method) {
      case 'GET':
        successData = await axios.get(`${ApiStudio}${url}`)
        break

      case 'POST':
        successData = await axios.post(`${ApiStudio}${url}`, body)
        break

      case 'PUT':
        successData = await axios.put(`${ApiStudio}${url}`, body)
        break

      case 'DELETE':
        successData = await axios.delete(`${ApiStudio}${url}`)
        break
    }
  } catch (error) {
    errorData = error
  }

  return successData ? successData.data : errorData.name
}

export default AxiosRequest
