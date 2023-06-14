import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Grid from './components/Grid'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Draw labyrinth with css, using Matrix*/}
      <Grid />
    </>

  )
}

export default App
