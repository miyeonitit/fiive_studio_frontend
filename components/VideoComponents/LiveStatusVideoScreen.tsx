import React, { useState, useEffect } from 'react'
import Image from 'next/image'

type props = {
  ivsPlayStatus: string
  thumbnailImgSrc: string
}

const LiveStatusVideoScreen = (props: props) => {
  const TEXT_LIST_GROUP_A = [
    '커피를 내리고 있어요.',
    '귀여운 고양이를 쓰다듬고 있어요.',
    '밀린 Q&A를 확인하고 있어요.',
    '수업 전 당충전을 하고 있어요',
    '수업용 태블릿을 찾았어요.',
  ]

  const TEXT_LIST_GROUP_B = [
    '강아지와 산책을 마무리했어요.',
    '교재 배송 일정을 확인했어요.',
    '가볍게 스트레칭으로 몸을 풀었어요.',
    '캠 렌즈를 닦고 있어요.',
    '마이크 테스트 하나.둘.셋.',
  ]

  const TEXT_LIST_GROUP_C = [
    '영상 콘텐츠 촬영을 마무리했어요.',
    '거울을 보며 머리 스타일을 확인했어요.',
    '캠으로 완벽한 각도를 찾고 있어요.',
    '피이브와 라이브 연동을 하고 있어요.',
    '간장공장 공장장 입을 풀어요.',
  ]

  const TEXT_LIST_GROUP_D = [
    '학부모 님과 상담을 마쳤어요.',
    '수강생 목록을 확인하고 있어요.',
    '실시간 채팅창을 준비하고 있어요.',
    '준비한 과제를 저장하고 있어요.',
    'SNS 스토리에 라이브 수업 시작을 알렸어요.',
  ]

  // rolling 할 전체 text list
  const [allRollingTextList] = useState([
    TEXT_LIST_GROUP_A,
    TEXT_LIST_GROUP_B,
    TEXT_LIST_GROUP_C,
    TEXT_LIST_GROUP_D,
  ])

  // 전체 text list 중에서 하나의 text list 만을 랜덤 선택으로 가져올 arr state
  // default text list는 TEXT_LIST_GROUP_A 로 지정
  const [randomRollingTextList, setRandomRollingTextList] =
    useState(TEXT_LIST_GROUP_A)

  // rolling 기능에서 필요한 count용 index state
  const [randomCountIndex, setRandomCountIndex] = useState(0)

  const handleSubText = (status: string) => {
    let subText = ''

    switch (status) {
      // waiting: 라이브 전 재생 대기중
      case 'waiting':
        subText = 'n회차 라이브 전'
        break

      // end: 라이브 종료
      case 'end':
        subText = 'n회차 라이브 종료'
        break

      // error : 재생 에러
      case 'error':
        subText = '잠시만 기다려 주세요.'

        break
    }

    return subText
  }
  // 수강신청생 정보 banner slider - year_info의 인덱스를 카운트해주는 메서드
  const handleRollingText = () => {
    setRandomCountIndex((randomCountIndex) => randomCountIndex + 1)
  }

  // 5000ms마다 randomRollingTextList의 인덱스를 순서대로 카운트 처리
  useEffect(() => {
    let timeCount = setInterval(handleRollingText, 5000)

    // setInterval cleanup
    return () => {
      clearInterval(timeCount)
    }
  }, [props.ivsPlayStatus])

  // 카운트 값이 바뀔 때마다, 카운트가 randomRollingTextList 배열 길이만큼 된다면 0으로 초기화 처리
  useEffect(() => {
    if (randomCountIndex == randomRollingTextList.length) {
      setRandomCountIndex(0)
    }
  }, [randomCountIndex])

  useEffect(() => {
    // 전체 text list 중에서 하나의 text list 만을 랜덤 선택으로 가져오기 위한 인덱스 구하기
    const randomIndex = Math.floor(Math.random() * allRollingTextList.length)

    // allRollingTextList 중 하나의 text list 만을 랜덤 선택
    const randomValue = allRollingTextList[randomIndex]

    // 페이지를 초기 렌더할 때마다 text list가 랜덤 지정됨
    setRandomRollingTextList(randomValue)
  }, [])

  return (
    <div className='LiveStatusVideoScreen'>
      <div className='video_screen_wrapper'>
        <div className='video_screen_image_box'>
          <img
            src={
              props?.thumbnailImgSrc
                ? props?.thumbnailImgSrc
                : '/dummy/fiive_brand_dummy.jpg'
            }
            alt='classThumbnailImage'
          />
        </div>

        {props.ivsPlayStatus === 'error' && (
          <div className='loading_spinner_box'>
            <div className='loading_spinner' />
          </div>
        )}

        <div className='video_screen_information_box'>
          <div className='video_sub_text'>
            {handleSubText(props.ivsPlayStatus)}
          </div>

          <div className='video_main_text_box'>
            <div
              className={`video_main_text ${
                props.ivsPlayStatus !== 'end' && 'rollig_text'
              }`}
            >
              {props.ivsPlayStatus !== 'end'
                ? randomRollingTextList[randomCountIndex]
                : '다음 라이브에서 만나요!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveStatusVideoScreen
