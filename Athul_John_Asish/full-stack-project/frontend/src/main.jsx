import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, Route, RouterProvider,createRoutesFromElements } from 'react-router-dom'
import Login from './components/Login.jsx'
import Tasks from './components/Tasks.jsx'
import Layout from './Layout.jsx'
import Employees from './components/Employees.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<Login/>}></Route>
    <Route element={<Layout/>}>
    <Route path='/employees' element={<Employees/>}></Route>
    <Route path='/tasks' element={<Tasks/>}></Route>
    </Route>
    </>
  )
)


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router}/>
  // </StrictMode>,
)
