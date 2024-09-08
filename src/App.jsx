import { useState, useEffect } from 'react'

import { AddPlayer } from './components/AddPlayer'
import { Players } from './components/Players'
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
      <h1 className="text-3xl font-bold mb-10 text-center mt-20">選手村值日生</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10">
        <article>
          <AddPlayer setPlayers={setPlayers} />
          <Players players={players} setPlayers={setPlayers} />
        </article>
        <article>
          <TurnCalendar players={players} />
        </article>
      </section>
    </>
  )
}

export default App
