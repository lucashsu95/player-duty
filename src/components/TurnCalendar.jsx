import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import PlayerTable from './PlayerTable'
import DaysTable from './DaysTable'

const padZero = (num) => num.toString().padStart(2, '0')

const formatDate = (date) =>
  `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`

export const TurnCalendar = ({ filterWeekendRef, selectDateRef, players }) => {
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)

  const [days, setDays] = useState([])
  const [playerCountMap, setPlayerCountMap] = useState(new Map())

  /**
   * Get the two players with the lowest count
   * @param {Map} countMap player count map
   * @returns {array} two players with the lowest count
   */
  const getPlayers = (countMap) => {
    const lowestPlayer = [...countMap.entries()].sort(([, a], [, b]) => a - b) // 降冪排序, [name] 是指取陣列第一個值
    const [obj1, obj2] = lowestPlayer.slice(0, 2)
    return [obj1 || null, obj2 || null]
  }

  /**
   * Get days array with player info
   * @param {number} dayCount number of days
   * @param {Map} playerMap player count map
   * @param {Date} start start date
   * @returns {array} days array with player info
   */
  const getDays = (dayCount, playerMap, start) => {
    return Array.from({ length: dayCount }, (_, i) => {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      if (isFilterWeekEnd && [0, 6].includes(day.getDay())) return null

      const [player1, player2] = getPlayers(playerMap)
      const [name1, count1] = player1
      const [name2, count2] = player2

      if (name1 && name2) {
        playerMap.set(name1, count1 + 1)
        playerMap.set(name2, count2 + 1)
      }

      return {
        dayStr: formatDate(day),
        name1,
        name2
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (players.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請先新增玩家'
      })
      return
    }

    if (!startDateRef.current.value || !endDateRef.current.value) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請選擇日期'
      })
      return
    }

    const start = new Date(startDateRef.current.value)
    const end = new Date(endDateRef.current.value)

    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const playerMap = new Map(players.map((player) => [player.name, 0]))

    const newDays = getDays(dayCount, playerMap, start).filter((x) => x)
    setDays(newDays)
    setPlayerCountMap(playerMap)
  }

  const handleReset = () => {
    setDays([])
    setPlayerCountMap(new Map())
  }

  const exportPlayerDataToExcel = () => {
    const data = [
      ['日期', '值日生1', '值日生2'],
      ...days.map((day) => [day.dayStr, day.name1, day.name2])
    ]
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, 'TurnCalendar.xlsx')
  }

  const [isFilterWeekEnd, setIsFilterWeekEnd] = useState(() => {
    return localStorage.getItem('isFilterWeekEnd') === '1' || false
  })

  useEffect(() => {
    localStorage.setItem('isFilterWeekEnd', isFilterWeekEnd ? '1' : '0')
  }, [isFilterWeekEnd])

  return (
    <section className="wrap">
      <h2 className="mb-3 text-2xl font-bold">值日表</h2>

      <div className="mb-2 flex gap-3 rounded-md bg-slate-300 px-2 py-3" ref={filterWeekendRef}>
        排除假日
        <div
          className={`relative h-5 w-10 cursor-pointer rounded-full border border-gray-800 ${isFilterWeekEnd ? 'bg-gray-800' : 'bg-gray-200'}`}
          onClick={() => setIsFilterWeekEnd(!isFilterWeekEnd)}
        >
          <div
            className={`absolute left-[1px] top-[1px] h-4 w-4 rounded-full transition-all duration-500 ${isFilterWeekEnd ? 'ml-5 bg-white' : 'bg-gray-800'}`}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div ref={selectDateRef}>
          <label htmlFor="startDate">起始日：</label>
          <input
            type="date"
            className="input mb-4"
            defaultValue={formatDate(new Date())}
            ref={startDateRef}
          />
          <label htmlFor="endDate">結束日：</label>
          <input
            type="date"
            className="input mb-4"
            defaultValue={formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)))}
            ref={endDateRef}
          />
        </div>
        <div>
          <button type="submit" className="btn-primary">
            產生表格
          </button>

          <button type="reset" className="btn-secondary ms-2" onClick={handleReset}>
            重設
          </button>
          {days.length > 0 && (
            <button
              type="button"
              className="btn-warning mt-2 md:ms-2 md:mt-0"
              onClick={exportPlayerDataToExcel}
            >
              匯出表格
            </button>
          )}
        </div>
        {days.length > 0 && (
          <>
            <PlayerTable playerCountMap={playerCountMap} />
            <DaysTable days={days} />
          </>
        )}
      </form>
    </section>
  )
}

TurnCalendar.propTypes = {
  filterWeekendRef: PropTypes.object.isRequired,
  selectDateRef: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired
}
