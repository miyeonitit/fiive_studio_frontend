import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head lang='ko'>
          <meta charSet='utf-8' />

          <meta name='description' content='fiive studio' />
          <meta property='og:type' content='website' />
          <meta property='og:title' content='fiive studio' />
          <meta property='og:site_name' content='fiive studio' />
          <meta property='og:description' content='fiive studio' />

          <meta name='twitter:title' content='fiive studio' />
          <meta name='twitter:description' content='fiive studio' />

          {/* <meta name='referrer' content='unsafe-url' /> */}
        </Head>
        <body className='root'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default MyDocument
