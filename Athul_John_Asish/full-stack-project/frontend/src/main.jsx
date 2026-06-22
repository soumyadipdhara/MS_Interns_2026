import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, Route, RouterProvider,createRoutesFromElements } from 'react-router-dom'
import Login from './components/Login.jsx'
import Tasks from './components/Tasks.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<Login/>}></Route>
    <Route path='/tasks' element={<Tasks/>}></Route>
    </>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
