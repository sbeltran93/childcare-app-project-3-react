import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';

const App = () => {
  const [user, setUser] = useState()

  return (
    <>
    <NavBar user={user} />
    <h1>HelloWorld!</h1>
    </>
  )
}

export default App;
