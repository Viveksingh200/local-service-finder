import { useState } from 'react'
import Login from './pages/login';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
 
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
