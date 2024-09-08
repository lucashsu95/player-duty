import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import PlayerTable from './PlayerTable'

const padZero = (num) => num.toString().padStart(2, '0')

const formatDate = (date) =>
  `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`

// Turn Calendar Start
export const TurnCalendar = ({ players }) => {
  const date = new Date()
  const startDate = useRef(formatDate(date))
  const endDate = useRef(formatDate(new Date(date.setMonth(date.getMonth() + 1))))
  const [days, setDays] = useState([])
  const [playerCountMap, setPlayerCountMap] = useState(new Map())

  const getPlayers = (countMap) => {
    const [lowestPlayer] = [...countMap.entries()].sort(([, a], [, b]) => a - b)

    return lowestPlayer ? [lowestPlayer[0]] : [null]
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

    if (!startDate.current.value || !endDate.current.value) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請選擇日期'
      })
      return
    }

    const start = new Date(startDate.current.value)
    const end = new Date(endDate.current.value)

    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const playerMap = new Map(players.map((player) => [player.name, 0]))

    const newDays = Array.from({ length: dayCount }, (_, i) => {
      const [playerName] = getPlayers(playerMap)

      if (playerName) playerMap.set(playerName, playerMap.get(playerName) + 1)
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      return { dayStr: formatDate(day), name1: playerName }
    })

    setDays(newDays)
    setPlayerCountMap(playerMap)
  }

  const handleReset = () => {
    setDays([])
    setPlayerCountMap(new Map())
  }

  const exportPlayerDataToExcel = () => {
    const data = [['日期', '值日生'], ...days.map((day) => [day.dayStr, day.name1])]
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, 'TurnCalendar.xlsx')
  }

  return (
    <section className="wrap">
      <h2 className="mb-3 text-2xl font-bold">值日表</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="startDate">起始日：</label>
        <input
          type="date"
          className="input mb-4"
          defaultValue={startDate.current}
          ref={startDate}
        />
        <label htmlFor="endDate">結束日：</label>
        <input type="date" className="input mb-4" defaultValue={endDate.current} ref={endDate} />
        <div>
          <button type="submit" className="btn-primary">
            產生表格
          </button>

          <button type="reset" className="btn-secondary ms-2" onClick={handleReset}>
            重設
          </button>
          {days.length > 0 && (
            <button type="button" className="btn-warning ms-2" onClick={exportPlayerDataToExcel}>
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
  players: PropTypes.array.isRequired
}
// Turn Calendar End

// Days Table Start
const DaysTable = ({ days }) => (
  <table className="mt-5 table w-full overflow-hidden rounded-lg shadow-md">
    <thead className="bg-slate-300">
      <tr className="*:py-2">
        <th>日期</th>
        <th>值日生</th>
      </tr>
    </thead>
    <tbody>
      {days.map((day) => (
        <tr key={day.dayStr} className="*:p-2 *:text-center even:bg-slate-200">
          <td>{day.dayStr}</td>
          <td>{day.name1}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

DaysTable.propTypes = {
  days: PropTypes.array.isRequired
}
// Days Table End
