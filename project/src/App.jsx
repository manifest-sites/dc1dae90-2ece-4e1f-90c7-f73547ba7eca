import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import LlamaApp from './components/LlamaApp'

function App() {

  return (
    <Monetization>
      <LlamaApp />
    </Monetization>
  )
}

export default App