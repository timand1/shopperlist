import './LoginPage.css';
import logo from '../assets/logo.svg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getList, getFavorites } from '../redux/actions/shoppingAction';

export default function LoginPage(props) {
    const { setAccountKey, setLoggedIn, loggedIn, setUsername, username } = props;

    // const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState(false)

    const [test, setTest] = useState(false)
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        const username = localStorage.getItem('username')
        const accountId = localStorage.getItem('accountKey')
        if(username && accountId) {
            navigate('/shoppinglist')
        }
    }, [])

    function handleInput(e) {
        if (e.target.name === 'username') {
            setUsername(e.target.value)
        } else if (e.target.name === 'password') {
            setPassword(e.target.value)
        }
    }

    async function inputLogin(e) {
        e.preventDefault();
        const credentials = {
            username: username,
            password: password
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        };

        fetch('https://dramatic-bottlenose-hallway.glitch.me/api/login', requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } 
            })
            .then(data => handleSubmit(e, data))
            .catch(err => setError(true))


    }

    function loggingIn() {
        setTest(!test)
    }
    function handleSubmit(e, data) {
        setUsername(data.key[0].username)
        setAccountKey(data.key[0].accountId)
        e.preventDefault();
        if(!data.key) {
            setLoggedIn(false)
            setError(true)
        }
        if (data.success === true) {
            localStorage.setItem('username', username)
            localStorage.setItem('accountKey', data.key[0].accountId)

            const requestOptions = {
                method: 'GET',
                headers: { 'accountid': data.key[0].accountId, 'Content-Type': 'application/json' }
            };

            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist`, requestOptions)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        console.log('hej')
                    }
                })
                .then(data => {
                    if (data.success) {
                        // console.log(data)
                            localStorage.setItem('shopperList', data.list)
                            dispatch(getList(data.list))
                        
                    } else {
                        console.log('No items')
                    }
                })
                .catch(err => console.log(err))
        
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/favorites`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(data => {
                // console.log(data)
                if (data.success) {
                        localStorage.setItem('favoritesList', data.favorites)
                        dispatch(getFavorites(data.favorites))
                    
                } else {
                    console.log('No favorites')
                }
            })
            .catch(err => console.log(err))

            setLoggedIn(true)
            navigate('/shoppinglist')
        } else {
            setLoggedIn(false)
        }
    }
// LOCALSTORAGE SPARA LISTA OCH FAVORITER - HÄMTA I LISTORNA OM DET FINNS - FINNS DE INT EMÅSTE MAN JU LOGGAI N OAVSETT
    return (
        <section className='login-page'>
            <img src={logo} className='logo-login' alt="shopper-logo" />
            <form className='login-form' onSubmit={(e) => inputLogin(e)}>
                <article className="login-username">
                    <input type="text" name="username" id="username" className='login-input' placeholder=' ' required onKeyUp={(e) => { handleInput(e) }} />
                    <label htmlFor="username" className='login-label'>Username</label>
                </article>
                <article className='login-password'>
                    <input type="password" name="password" id="password" className='login-input' placeholder=' ' required onKeyUp={(e) => { handleInput(e) }} />
                    <label htmlFor="password" className='login-label'>Password</label>
                </article>
                <button type='submit' className='btn btn-login' onClick={loggingIn}>Login</button>
            </form>
            <h3 className='signup' onClick={() => {navigate('/signup')}}>Sign up</h3>
            {error &&
                <h3 className='login-error'>Error accessing the server :|</h3>}
            {!loggedIn && error &&
                <h3 className='login-error'>Wrong username and/or password</h3>}
           
        </section>
    )
}