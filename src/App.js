import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContext from './Contexts/UserContext';
import {ProtectedRoute} from './Components/ProtectedRoute'

import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Navigation from './Pages/Navigation/Navigation';

const App = () => {

  const { session } = useContext(UserContext);

  //console.log(session);

  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<Home />} />
      <Route path="/" element={<Home  />} />
      <Route path="/login" element={<Login session={session}  />} />
      <Route element={<ProtectedRoute isAllowed={!!session} />}>
          <Route path="/home" element={<Navigation session={session} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
