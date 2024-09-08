import { useRef } from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

const padZero = (num) => num.toString().padStart(2, '0')

export const TurnCalendar = ({ players }) => {
  const date = new Date()
  const startDate = useRef({
    value: `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`
  })
  const endDate = useRef({
    value: `${date.getFullYear()}-${padZero(date.getMonth() + 2)}-${padZero(date.getDate())}`
  })

  const [days, setDays] = useState([])
  const [playerCountMap, setPlayerCountMap] = useState(new Map())

  const getTwoPlayers = (countMap) => {
    const entries = [...countMap.entries()]
    entries.sort(([, countA], [, countB]) => countA - countB) // 使用解構賦值提高可讀性

    const [obj1, obj2] = entries.slice(0, 2)
    return [obj1?.[0] || null, obj2?.[0] || null] // 返回預設值以避免錯誤
  }

  const handSubmit = (e) => {
    e.preventDefault()

    const start = new Date(startDate.current.value)
    const end = new Date(endDate.current.value)
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

    const playerMap = players.reduce((map, player) => map.set(player.name, 0), new Map())

    const days = Array.from({ length: dayCount }, (_, i) => {
      const [name1, name2] = getTwoPlayers(playerMap)
      if (name1 && name2) {
        playerMap.set(name1, playerMap.get(name1) + 1)
        playerMap.set(name2, playerMap.get(name2) + 1)
      }

      const day = new Date(start)
      day.setDate(start.getDate() + i)
      const dayStr = `${day.getFullYear()}-${padZero(day.getMonth() + 1)}-${padZero(day.getDate())}`

      return { dayStr, name1, name2 }
    })

    setDays(days)
    setPlayerCountMap(playerMap)
  }

  const handReset = () => {
    setDays([])
    setPlayerCountMap({})
  }

  return (
    <section className="wrap">
      <h2 className="mb-3 text-2xl font-bold">值日表</h2>
      <form onSubmit={handSubmit}>
        <label htmlFor="startDate">起始日：</label>
        <input
          type="date"
          id="startDate"
          className="input mb-4"
          defaultValue={startDate.current.value}
          ref={startDate}
        />

        <label htmlFor="endDate">結束日：</label>
        <input
          type="date"
          id="endDate"
          className="input mb-4"
          defaultValue={endDate.current.value}
          ref={endDate}
        />

        <div>
          <button type="submit" className="btn-primary">
            產生表格
          </button>
          <button type="reset" onClick={handReset} className="btn-secondary ms-2">
            重設
          </button>
        </div>

        <table className="table w-full mt-5 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-slate-300">
            <tr>
              <th>選手</th>
              <th>值日生次數</th>
            </tr>
          </thead>
          <tbody>
            {[...playerCountMap.entries()].map(([name, count]) => (
              <tr key={name} className="even:bg-slate-200 *:p-2 *:text-center">
                <td>{name}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table w-full mt-5 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-slate-300">
            <tr>
              <th>日期</th>
              <th>值日生1</th>
              <th>值日生2</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.dayStr} className="even:bg-slate-200 *:p-2 *:text-center">
                <td>{day.dayStr}</td>
                <td>{day.name1}</td>
                <td>{day.name2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </section>
  )
}

TurnCalendar.propTypes = {
  players: PropTypes.array.isRequired
}
