import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
    const navigate = useNavigate();
    return (
        <section className='error-page'>
            <h1>Hey</h1>
            <p>Where are you going?</p>
            <p>Hello?</p>
            <p>Leave this place... and never come back!</p>
            <button className="error-button" onClick={() => { navigate('/shopperlist') }}>FINE I'LL LEAVE</button>
        </section>
    )
}