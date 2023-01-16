import React, { useState, useCallback } from 'react'

const CounterButton = function ({ onClicks, count }) {
  console.log('카운터 버튼 렌더링')
  return <button onClick={onClicks}>{count.num}</button>
}

export default function Counter() {
  const [count1, setCount1] = useState({ num: 0 })

  const increament1 = useCallback(() => {
    setCount1({ num: count1.num + 1 })
  }, [count1])

  const [count2, setCount2] = useState({ num: 0 })

  const increament2 = useCallback(() => {
    setCount2({ num: count2.num + 1 })
  }, [count2])

  return (
    <div className='App'>
      <div>{count1.num}</div>
      <div>{count2.num}</div>
      <CounterButton onClicks={increament1} count={count1} />
      <CounterButton onClicks={increament2} count={count2} />
    </div>
  )
}
