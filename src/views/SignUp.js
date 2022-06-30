import './SignUp.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo.svg'
import back from '../assets/back.svg'

export default function SignUp() {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [email, setEmail] = useState()
    const [error, setError] = useState(false)

    const [test, setTest] = useState(false)
    const navigate = useNavigate();

    function handleInput(e) {
        if (e.target.name === 'username') {
            setUsername(e.target.value)
        } else if (e.target.name === 'password') {
            setPassword(e.target.value)
        }else if (e.target.name === 'email') {
            setEmail(e.target.value)
        }
    }

    async function inputSignUp(e) {
        e.preventDefault();
        const credentials = {
            username: username,
            email: email,
            password: password
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        };
        
        fetch('https://dramatic-bottlenose-hallway.glitch.me/api/signup/', requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(data => handleSubmit(e, data))
            .catch(err => setError(true))


    }

    function loggingIn() {
        setTest(!test)
    }
    function handleSubmit(e, data) {
        e.preventDefault();
        console.log(data)
        if (data.success === true) {
            setTimeout(() => {
                navigate('/')
            }, 2000);
        } 
    }

    function goToStart() {
        navigate('/')
    }

    return (
        <section className='login-page'>
            <img src={logo} className='logo-login' alt="shopper-logo" />
            <img src={back} className='back-icon' alt="back icon" onClick={(goToStart)} />
            <h1>Sign Up</h1>
            <form className='signup-form' onSubmit={(e) => inputSignUp(e)}>
                <article className="signup-username">
                    <input type="text" name="username" id="username" className='signup-input' placeholder=' ' required onKeyUp={(e) => { handleInput(e) }} />
                    <label htmlFor="username" className='signup-label'>Username</label>
                </article>
                <article className='signup-email'>
                    <input type="email" name="email" id="email" className='signup-input' placeholder=' ' required  onKeyUp={(e) => { handleInput(e) }} />
                    <label htmlFor="email" className='signup-label'>Email</label>
                </article>
                <article className='signup-password'>
                    <input type="password" name="password" id="password" className='signup-input' placeholder=' ' required onKeyUp={(e) => { handleInput(e) }} />
                    <label htmlFor="password" className='signup-label'>Password</label>
                </article>
                <button type='submit' className='btn btn-signup' onClick={loggingIn}>Sign Up</button>
            </form>
            {error && <h3 className='login-error'>Sorry, there's an error accessing the server</h3>}



        </section>
    )
}