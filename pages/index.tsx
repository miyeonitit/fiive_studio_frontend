import { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from '../components/DemoLayout'
import { NextPageWithLayout } from '../types/NextPageWithLayout'

const Home: NextPageWithLayout = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/404')
  }, [])

  return <div className='main page'></div>
}

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default Home
