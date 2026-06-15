import { useState } from 'react'
import './App.css'
import Cards from './components/Cards'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
 <h1 className='bg-green-400 text-black rounded-xl'> Example Tailwind from tailwindcss.com</h1>
 <Cards text="Props passed here"/>
  <Cards/>
    </>
  )
}

export default App
