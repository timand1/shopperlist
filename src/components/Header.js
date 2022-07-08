import './Header.css'
import logo from '../assets/logo.svg'
import { useEffect, useState } from 'react';
import { useNavigate, NavLink, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { deleteSettings, logOutAction } from '../redux/actions/shoppingAction';


export default function Header(props) {
    const {setLoggedIn, menuOpen, setMenuOpen, setDeleteMode } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const shopperList = useSelector(state => state.shopperList);
    const favoriteList = useSelector(state => state.favoritesList);

    const username = localStorage.getItem('username')
    const location = useLocation()

    function openMenu() {
        setMenuOpen(!menuOpen)
    }

    function logOut() {
        setLoggedIn(false)
        setMenuOpen(false)
        dispatch(logOutAction())
        localStorage.removeItem('username')
        localStorage.removeItem('accountKey')
        localStorage.removeItem('shopperList')
        localStorage.removeItem('favoritesList')
        navigate('/shopperlist')
    }

    function changeUrl() {
        setMenuOpen(false)
        dispatch(deleteSettings(false))
    }

    function handleLogo() {
        setMenuOpen(false)
        dispatch(deleteSettings(false))
        navigate('/shoppinglist')
    }

    function deleteItemMode() {
        dispatch(deleteSettings(true))
        setMenuOpen(false)
    }

    return (
        <header>
            <img className='logo' onClick={(handleLogo)} src={logo} alt="img" />
            <div className="menu-btn" onClick={openMenu}>
                <span className={menuOpen ? 'menu-btn--top' : ''}></span>
                <span className={menuOpen ? 'menu-btn--mid' : ''}></span>
                <span className={menuOpen ? 'menu-btn--bottom' : ''}></span>
            </div>
            <nav className={menuOpen ? 'nav open' : 'nav'}>
                <ul className="link-container">
                    <h3 className='nav-headline'>{username}'s shopper</h3>
                    <NavLink className="link" onClick={changeUrl} to="/shoppinglist">Shopperlist</NavLink >
                    <NavLink className="link" onClick={changeUrl} to="/favorites">Favorites</NavLink >
                    <NavLink className="link" to="/" onClick={logOut}>Logout</NavLink>
                    {location.pathname === '/shoppinglist' && shopperList.length > 0 &&
                    <p className="link delete-mobile" onClick={deleteItemMode}>Delete Items</p>}
                    {location.pathname === '/favorites' && favoriteList.length > 0 &&
                    <p className="link delete-mobile" onClick={deleteItemMode}>Delete Items</p>}
                </ul>
            </nav>
        </header>
    )
}