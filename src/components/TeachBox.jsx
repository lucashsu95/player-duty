import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const FocusBox = styled.div`
  position: absolute;
  border: 2px solid #f38;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  transition: 0.3s;
`

const focusTextList = [
  '新增值日生',
  '匯入、匯出功能、刪除值日生',
  '值日生列表、可以拖拉交換位置',
  '可選擇是否排除假日',
  '選擇日期'
]

export default function TeachBox({
  addPlayerRef,
  playersListRef,
  filterWeekendRef,
  selectDateRef,
  playersBtnsRef
}) {
  const [descriptionLevel, setDescriptionLevel] = useState(0)
  const isHidden = descriptionLevel === 5

  const focusWrapRef = useRef(null)
  const focusBoxRef = useRef(null)
  const focusTextRef = useRef(null)

  useEffect(() => {
    if (isHidden) return

    const rects = [
      addPlayerRef.current.getBoundingClientRect(),
      playersBtnsRef.current.getBoundingClientRect(),
      playersListRef.current.getBoundingClientRect(),
      filterWeekendRef.current.getBoundingClientRect(),
      selectDateRef.current.getBoundingClientRect()
    ]

    const rect = rects[descriptionLevel]
    focusTextRef.current.textContent = focusTextList[descriptionLevel]

    focusBoxRef.current.style.top = `${rect.top}px`
    focusBoxRef.current.style.left = `${rect.left}px`
    focusBoxRef.current.style.width = `${rect.width}px`
    focusBoxRef.current.style.height = `${rect.height}px`

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptionLevel, isHidden])

  return (
    <>
      {!isHidden && (
        <>
          <div
            className="bounce text-bold absolute bottom-0 right-0 z-20 mr-10 cursor-pointer rounded-full bg-[#fff9] px-3 py-1 text-xl"
            onClick={() => setDescriptionLevel(5)}
          >
            Skip
          </div>
          <div
            className="fixed inset-0 z-10"
            ref={focusWrapRef}
            onClick={() => setDescriptionLevel(descriptionLevel + 1)}
          >
            <FocusBox ref={focusBoxRef}>
              <div
                className="absolute -translate-y-full transform rounded-md bg-white px-3 py-2"
                ref={focusTextRef}
              />
            </FocusBox>
          </div>
        </>
      )}
    </>
  )
}
TeachBox.propTypes = {
  addPlayerRef: PropTypes.object.isRequired,
  playersListRef: PropTypes.object.isRequired,
  filterWeekendRef: PropTypes.object.isRequired,
  selectDateRef: PropTypes.object.isRequired,
  playersBtnsRef: PropTypes.object.isRequired
}
