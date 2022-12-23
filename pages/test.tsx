import type { GetServerSideProps, NextPage, GetStaticProps } from 'next'
import axios from 'axios'

// ### 브라우저 실행 환경(리액트 컴포넌트)
const Home: NextPage = (props) => {
  // NEXT_PUBLIC_이 없는 변수는 브라우저에서 참조할 수 없다.
  console.log(process.env.APP_ID) // undefined
  console.log(props, 'test props')

  // NEXT_PUBLIC_이 앞에 붙은 변수는 브라우저에서도 참조할 수 있다.
  console.log(process.env.NEXT_PUBLIC_APP_ID, 'hd') //default_api_key

  return (
    <>
      <main>index</main>
    </>
  )
}

// ### 서버 실행 환경 (SSR)
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // 서버에서는 모든 환경변수를 참조할 수 있다.
//   console.log(process.env.APP_ID) // default_value
//   console.log(process.env.NEXT_PUBLIC_APP_ID) // default_api_key

//   return { props: { message: `Next.js is awesome` } }
// }

export const getStaticProps: GetStaticProps = async (context) => {
  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID
  const apiToken = process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN

  const resonse = await axios.get(
    `https://api-${appId}.sendbird.com/v3/emoji_categories/53`,
    {
      headers: {
        'Api-Token': apiToken,
      },
    }
  )
  const data = await resonse.data

  return {
    props: {
      data: data,
    }, // will be passed to the page component as props
  }
}

export default Home
