import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import TheDialog from './TheDialog'
import { useState } from 'react'

export const PlayersList = ({ btnsRef, divRef, players, setPlayers }) => {
  const handleImport = (event) => {
    const file = event.target.files[0]

    const reader = new FileReader()
    reader.readAsText(file)

    reader.onload = (event) => {
      const data = JSON.parse(event.target.result)
      setPlayers(data)
      Swal.fire({ icon: 'success', title: '匯入成功' })
    }
  }

  const handleExport = () => {
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

  const handleDelete = (event) => {
    const id = Number(event.target.dataset.id)
    Swal.fire({
      icon: 'warning',
      title: '確定要刪除?',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        setPlayers(players.filter((player) => player.id !== id))
        Swal.fire({ icon: 'success', title: '刪除成功' })
      }
    })
  }

  const handleClear = () => {
    Swal.fire({
      icon: 'warning',
      title: '確定要清除所有選手資料?',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        setPlayers([])
        Swal.fire({ icon: 'success', title: '清除成功' })
      }
    })
  }

  const [dragIndex, setDragIndex] = useState(null)

  const handleDrag = (e) => {
    const idx = e.target.dataset.index
    if (idx) {
      setDragIndex(idx)
    }
  }

  const handleDrop = (e) => {
    const parent = e.target.closest('[data-index]')
    if (!parent) return

    const idx = parent.dataset.index
    if (idx && dragIndex) {
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers]
        const draggedPlayer = newPlayers[dragIndex]
        newPlayers.splice(dragIndex, 1)
        newPlayers.splice(idx, 0, draggedPlayer)
        return newPlayers
      })
    }
    setDragIndex(null)
  }

  return (
    <section className="wrap mt-8">
      <h2 className="mb-2 text-2xl font-bold">選手列表</h2>

      <div className="mb-3 flex flex-col items-start gap-2" ref={btnsRef}>
        <TheDialog onImport={handleImport} />
        <button className="btn-primary" onClick={handleExport}>
          匯出選手資料
        </button>
        <button className="btn-warning" onClick={handleClear}>
          清除選手資料
        </button>
      </div>

      <p className="my-2 text-sm text-gray-600">拖曳選手可以調整順序</p>
      {players.length > 0 ? (
        <table className="table w-full overflow-hidden rounded-lg shadow-md" ref={divRef}>
          <thead className="bg-slate-300">
            <tr className="*:p-2 *:text-center">
              <th>名稱</th>
              <th>職種</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.id}
                className="cursor-grabbing *:p-2 *:text-center even:bg-slate-200"
                data-index={index}
                draggable
                onDragStart={handleDrag}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <td>{player.name}</td>
                <td>{player.job}</td>
                <td>
                  <button data-id={player.id} onClick={handleDelete} className="btn-danger">
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>目前沒有選手</p>
      )}
    </section>
  )
}

PlayersList.propTypes = {
  btnsRef: PropTypes.object.isRequired,
  divRef: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  setPlayers: PropTypes.func.isRequired
}
