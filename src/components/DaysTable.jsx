import PropTypes from 'prop-types'

const DaysTable = ({ days }) => (
  <table className="mt-5 table w-full overflow-hidden rounded-lg shadow-md">
    <thead className="bg-slate-300">
      <tr className="*:py-2">
        <th>日期</th>
        <th>值日生1</th>
        <th>值日生2</th>
      </tr>
    </thead>
    <tbody>
      {days.map((day) => (
        <tr key={day.dayStr} className="*:p-2 *:text-center even:bg-slate-200">
          <td>
            {day.dayStr} (
            {['日', '一', '二', '三', '四', '五', '六'][new Date(day.dayStr).getDay()]})
          </td>
          <td>{day.name1}</td>
          <td>{day.name2}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

DaysTable.propTypes = {
  days: PropTypes.array.isRequired
}

export default DaysTable
