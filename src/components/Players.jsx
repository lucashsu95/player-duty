import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import TheDialog from './TheDialog'

export const Players = ({ players, setPlayers }) => {
  const importPlayerData = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.readAsText(file)

    reader.onload = (e) => {
      const data = JSON.parse(e.target.result)
      setPlayers(data)
      Swal.fire({ icon: 'success', title: '匯入成功' })
    }
  }

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

  const clearPlayers = () => {
    Swal.fire({ icon: 'warning', title: '確認刪除全部選手資料?', showCancelButton: true }).then(
      (res) => {
        if (res.isConfirmed) {
          setPlayers([])
          Swal.fire({ icon: 'success', title: '刪除成功' })
        }
      }
    )
  }

  return (
    <section className="wrap mt-8">
      <h2 className="mb-2 text-2xl font-bold">選手列表</h2>

      <div className="mb-3 flex flex-col items-start gap-2">
        <TheDialog importPlayerData={importPlayerData} />
        <button className="btn-primary" onClick={exportPlayerDataToJson}>
          匯出選手資料
        </button>
        <button className="btn-warning" onClick={clearPlayers}>
          清除全部選手資料
        </button>
      </div>

      {players.length > 0 ? (
        <table className="table w-full overflow-hidden rounded-lg shadow-md">
          <thead className="bg-slate-300">
            <tr className="*:p-2 *:text-center">
              <th>名字</th>
              <th>職種</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="*:p-2 *:text-center even:bg-slate-200">
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
      ) : (
        <p>目前沒有選手資料</p>
      )}
    </section>
  )
}

Players.propTypes = {
  players: PropTypes.array.isRequired,
  setPlayers: PropTypes.func.isRequired
}
