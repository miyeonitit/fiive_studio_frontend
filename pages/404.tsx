import React from 'react'
import Image from 'next/image'
import Head from 'next/head'

const not_found = () => {
  return (
    <div className='not_found'>
      <Head>
        <title>404 error</title>
      </Head>
      <div className='title_box'>
        <div className='image_box'></div>
        <div className='main_title'>페이지를 찾을 수 없어요!</div>
        <div className='sub_title'>
          페이지가 사라졌거나 주소가 변경됐을 수 있어요.
          <br />
          이전 페이지로 이동 또는 페이지 주소를 다시 확인해 주세요.
        </div>
      </div>
      <div className='button_box'>
        <button className='prev_button'>이전으로</button>
        <button className='home_button'>홈으로</button>
      </div>
    </div>
  )
}

export default not_found