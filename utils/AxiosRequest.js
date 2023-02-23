import { useCallback } from 'react'
import axios from 'axios'

const AxiosRequest = async ({ url, method, body, token }) => {
  let successData
  let errorData

  const ApiStudioProxy = process.env.NEXT_PUBLIC_API_BASE_URL
  const ApiStudio = process.env.NEXT_PUBLIC_STUDIO_URL

  const headers = { Authorization: `Bearer ${token}` }

  const axiosbody = { data: body }

  try {
    switch (method) {
      case 'GET':
        successData = await axios.get(
          `${ApiStudioProxy}${url}`,
          {
            headers,
          },
          { withCredentials: true }
        )
        break

      case 'POST':
        successData = await axios.post(
          `${ApiStudioProxy}${url}`,
          body,
          {
            headers,
          },
          { withCredentials: true }
        )
        break

      case 'PUT':
        successData = await axios.put(
          `${ApiStudioProxy}${url}`,
          body,
          {
            headers,
          },
          { withCredentials: true }
        )
        break

      case 'PATCH':
        successData = await axios.patch(
          `${ApiStudioProxy}${url}`,
          body,
          {
            headers,
          },
          { withCredentials: true }
        )
        break

      case 'DELETE':
        successData = await axios.delete(
          `${ApiStudioProxy}${url}`,
          { headers },
          { withCredentials: true }
        )
        break
    }
  } catch (error) {
    errorData = error
  }

  return successData ? successData.data : errorData
}

export default AxiosRequest
