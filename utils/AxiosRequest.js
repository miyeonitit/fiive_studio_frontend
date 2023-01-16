import { useCallback } from 'react'
import axios from 'axios'

const AxiosRequest = async ({ url, method, body, token }) => {
  let successData = ''
  let errorData = ''

  const ApiStudio = process.env.NEXT_PUBLIC_API_BASE_URL

  switch (method) {
    case 'GET':
      try {
        successData = await axios.get(`${ApiStudio}${url}`)
      } catch (error) {
        errorData = error
      }
      break

    case 'POST':
      try {
        successData = await axios.post(`${ApiStudio}${url}`, body)
      } catch (error) {
        errorData = error
      }
      break

    case 'PUT':
      try {
        successData = await axios.put(`${ApiStudio}${url}`, body)
      } catch (error) {
        errorData = error
      }
      break

    case 'DELETE':
      try {
        successData = await axios.delete(`${ApiStudio}${url}`)
      } catch (error) {
        errorData = error
      }
      break
  }

  return successData ? successData.data : errorData.name
}

export default AxiosRequest
