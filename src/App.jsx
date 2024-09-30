import { useState, useEffect, useRef } from 'react'

import AddPlayer from '@/components/AddPlayer'
import { PlayersList } from '@/components/PlayersList'
import { TurnCalendar } from '@/components/TurnCalendar'
import TeachBox from '@/components/TeachBox'

function App() {
  const player = JSON.parse(localStorage.getItem('players'))
  const [players, setPlayers] = useState(() => {
    return player && player.length > 0 ? player : [{ id: 1, name: '小恩', job: '程式選手' }]
  })

  const addPlayerRef = useRef(null)
  const playersBtnsRef = useRef(null)
  const playersListRef = useRef(null)
  const filterWeekendRef = useRef(null)
  const selectDateRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players))
  }, [players])

  return (
    <>
      <TeachBox
        addPlayerRef={addPlayerRef}
        playersBtnsRef={playersBtnsRef}
        playersListRef={playersListRef}
        filterWeekendRef={filterWeekendRef}
        selectDateRef={selectDateRef}
      />

      <h1 className="mb-10 mt-20 text-center text-3xl font-bold">選手村值日生</h1>
      <section className="grid grid-cols-1 gap-6 px-10 md:grid-cols-12">
        <article className="md:col-span-5">
          <AddPlayer divRef={addPlayerRef} setPlayers={setPlayers} />
          <PlayersList
            btnsRef={playersBtnsRef}
            divRef={playersListRef}
            players={players}
            setPlayers={setPlayers}
          />
        </article>
        <article className="md:col-span-7">
          <TurnCalendar
            filterWeekendRef={filterWeekendRef}
            selectDateRef={selectDateRef}
            players={players}
            setPlayers={setPlayers}
          />
        </article>
      </section>
    </>
  )
}

export default App
