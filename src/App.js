import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorPage from './views/ErrorPage.js';
import LoginPage from './views/LoginPage.js';
import SignUp from './views/SignUp.js';
import ShoppingList from './views/ShoppingList.js';
import Favorites from './views/Favorites'

function App() {
  // localStorage.removeItem('accountKey')
  // const localKey = localStorage.getItem('accountKey')
  const [loggedIn, setLoggedIn] = useState(true)
  const [accountKey, setAccountKey] = useState(localStorage.getItem('accountKey') || false);
  const [username, setUsername] = useState('')
  const [menuOpen, setMenuOpen] = useState()

  useEffect(() => {
    setMenuOpen(false)
  }, [])
  
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginPage setAccountKey={setAccountKey} setLoggedIn={setLoggedIn} loggedIn={loggedIn} setUsername={setUsername} username={username}/>} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/shoppinglist' element={<ShoppingList accountKey={accountKey} loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
        <Route path='/favorites' element={<Favorites accountKey={accountKey} loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>} />
        <Route path='*' element={<LoginPage setAccountKey={setAccountKey} setLoggedIn={setLoggedIn} loggedIn={loggedIn} setUsername={setUsername} username={username}/>} />

      </Routes>
    </div>
  );
}

export default App;
