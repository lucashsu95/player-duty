import { useState, useEffect } from 'react'

import { AddPlayer } from '@/components/AddPlayer'
import { PlayersList } from '@/components/PlayersList'
import { TurnCalendar } from './components/TurnCalendar'

function App() {
  const [players, setPlayers] = useState(() => {
    return JSON.parse(localStorage.getItem('players')) || []
  })

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players))
  }, [players])

  return (
    <>
      <h1 className="mb-10 mt-20 text-center text-3xl font-bold">選手村值日生</h1>
      <section className="grid grid-cols-1 gap-6 px-10 md:grid-cols-12">
        <article className="md:col-span-5">
          <AddPlayer setPlayers={setPlayers} />
          <PlayersList players={players} setPlayers={setPlayers} />
        </article>
        <article className="md:col-span-7">
          <TurnCalendar players={players} setPlayers={setPlayers} />
        </article>
      </section>
    </>
  )
}

export default App
