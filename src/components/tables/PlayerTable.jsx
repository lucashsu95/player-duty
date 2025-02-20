import PropTypes from 'prop-types'

// Player Table Start
const PlayerTable = ({ playerCountMap }) => (
  <table className="mt-5 table w-full overflow-hidden rounded-lg shadow-md">
    <thead className="bg-slate-300">
      <tr className="*:py-2">
        <th>選手</th>
        <th>值日生次數</th>
      </tr>
    </thead>
    <tbody>
      {[...playerCountMap.entries()].map(([name, count]) => (
        <tr key={name} className="*:p-2 *:text-center even:bg-slate-200">
          <td>{name}</td>
          <td>{count}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

PlayerTable.propTypes = {
  playerCountMap: PropTypes.object.isRequired
}
// Player Table End

export default PlayerTable
