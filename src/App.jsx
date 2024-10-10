import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import * as authService from './services/authService'
import ChildForm from './components/ChildForm/ChildForm';

const App = () => {
  const [child, setChild] = useState('')
  const [user, setUser] = useState
  (authService.getUser());

const handleSignout = () => {
  authService.signout()
  setUser(null);
}  

  return (
    <>
      <NavBar user={user} handleSignout={handleSignout} />
      <Routes>
        { user ? (
        <Route path='/' element={<Dashboard user={user} setUser={setUser} child={child} setChild={setChild} />} />
      ) : (
        <Route path='/' element={<Landing />} />
      )}
        <Route path='/signup' element={<SignupForm  setUser={setUser} />} />
        <Route path='/signin' element={<SigninForm  setUser={setUser} />} />
        <Route path='/childs' element={<ChildForm user={user} child={child} setChild={setChild}  />} />
    </Routes>
  </>
  )
}

export default App;
