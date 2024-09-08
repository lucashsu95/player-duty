import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

export const Players = ({ players, setPlayers }) => {
  const exportPlayerDataToJson = () => {
    const data = JSON.stringify(players)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'players.json'
    link.click()
    URL.revokeObjectURL(url)
    Swal.fire({ icon: 'success', title: '匯出成功' })
  }

  const handleDestroyPlayer = (e) => {
    Swal.fire({ icon: 'warning', title: '確認刪除?', showCancelButton: true }).then((res) => {
      if (res.isConfirmed) {
        const id = Number(e.target.dataset.id)
        setPlayers(players.filter((p) => p.id !== id))
        Swal.fire({ icon: 'success', title: '刪除成功' })
      }
    })
  }

  return (
    <section className="wrap mt-8">
      <h2 className="mb-2 text-2xl font-bold">選手列表</h2>

      <div className='mb-3'>
        <button className="btn-success" onClick={exportPlayerDataToJson}>
          匯出選手資料
        </button>
      </div>

      <table className="table w-full rounded-lg overflow-hidden shadow-md">
        <thead className="bg-slate-300">
          <tr className="*:p-2 *:text-center">
            <th>名字</th>
            <th>職種</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="even:bg-slate-200 *:p-2 *:text-center">
              <td>{player.name}</td>
              <td>{player.job}</td>
              <td>
                <button onClick={handleDestroyPlayer} data-id={player.id} className="btn-danger">
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

Players.propTypes = {
  players: PropTypes.array.isRequired,
  setPlayers: PropTypes.func.isRequired
}
