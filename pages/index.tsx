import Head from 'next/head'
import { ReactElement } from 'react'
import Layout from '../components/DemoLayout'
import { NextPageWithLayout } from '../types/NextPageWithLayout'

const Home: NextPageWithLayout = () => {
  return (
    <div className='main page'>
      <Head>
        <title>LSS Main</title>
        <meta name='description' content='LSS frontend main' />
      </Head>

      <h1>LSS Demo</h1>
    </div>
  )
}

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export default Home
