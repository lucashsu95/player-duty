import PropTypes from 'prop-types'
import { useRef } from 'react'
import Swal from 'sweetalert2'

export const AddPlayer = ({ setPlayers }) => {
  const playerName = useRef(null)
  const playerJob = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!playerJob.current.value || !playerName.current.value) {
      Swal.fire({
        icon: 'error',
        title: '缺少資訊',
        text: '請輸入名稱及職種'
      })
      return
    }

    const newPlayer = {
      id: Date.now(),
      name: playerName.current.value,
      job: playerJob.current.value
    }

    setPlayers((prev) => [...prev, newPlayer])

    playerName.current.value = ''
    playerJob.current.value = ''
  }

  return (
    <section className="wrap">
      <form action="" className="flex flex-col items-start" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-3">新增值日生</h2>

        <label htmlFor="player-name">名字：</label>
        <input type="text" className="input mt-1 mb-4" id="player-name" ref={playerName} />

        <label htmlFor="player-job">職種：</label>
        <input type="text" className="input mt-1 mb-4" id="player-job" ref={playerJob} />

        <div>
          <button type="submit" className="btn-primary">
            新增
          </button>
          <button type="reset" className="btn-secondary ms-2">
            重設
          </button>
        </div>
      </form>
    </section>
  )
}

AddPlayer.propTypes = {
  setPlayers: PropTypes.func.isRequired
}
