import './Favorites.css';
import faq from '../assets/faq.svg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header'
import FavoriteItem from '../components/FavoriteItem'
import { getFavorites, deleteSettings, emptyFavorites, removeFavorite, addFavorite } from '../redux/actions/shoppingAction';

export default function Favorites(props) {
    const {accountKey, loggedIn, setLoggedIn, menuOpen, setMenuOpen} = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const deleteMode = useSelector(state => state.deleteSetting);

    const [newFavorite, setNewFavorite] = useState({item: '', added: false});
    const [error, setError] = useState(false)
    const [exist, setExist] = useState(false)
    const [favoriteDelete, setFavoriteDelete] = useState()
    const [favoritesRemove, setFavoritesRemove] = useState([])
    const [deletePopUp, setDeletePopUp] = useState(false)

    useEffect(() => {
        const username = localStorage.getItem('username')
        const accountId = localStorage.getItem('accountKey')
        if(!username && !accountId) {
            setLoggedIn(false)
            navigate('/shopperlist')
        } else {
            const requestOptions = {
                method: 'GET',
                headers: { 'accountid': accountId, 'Content-Type': 'application/json' }
            };

            fetch('https://dramatic-bottlenose-hallway.glitch.me/api/favorites', requestOptions)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        console.log('hej')
                    }
                })
                .then(data => dispatch(getFavorites(data.favorites)))
                .catch(err => console.log(err))
        }
    }, [])

    function getFavoriteInput(e) {
        setNewFavorite(prevNewFavorite => ({ ...prevNewFavorite, item: e.target.value }))
    }
    
        // let favorites = useSelector(state => state.favoritesList);
        // favorites = []
        // let favoriteItem;
        // if(favorites.length === 0) {
        //     favorites = localStorage.getItem('shopperList')
        // } else {
        //     favoriteItem = favorites.map((item, index) => <FavoriteItem item={item} key={index} setDeletePopUp={setDeletePopUp} setFavoriteDelete={setFavoriteDelete} />)
        // }
        
    // function deleteFavorite() {
    //     const accountKey = localStorage.getItem('accountKey')

    //     const body = JSON.stringify(favoriteDelete)
    //     const requestOptions = {
    //         method: 'DELETE',
    //         headers: { 'accountid': accountKey, 'Content-Type': 'application/json' },
    //         body: body
    //     };

    //     fetch('https://rocky-gorge-99639.herokuapp.com/api/favorites', requestOptions)
    //         .then(res => {
    //             if (res.ok) {
    //                 return res.json()
    //             } else {
    //                 console.log('hej')
    //             }
    //         })
    //         .then(dispatch(removeFavorite(favoriteDelete)))
    //         .catch(err => console.log(err))

    //     console.log(`${favoriteDelete} deleted`)
    //     setDeletePopUp(false)
    // }

    function cancelDelete() {
        setDeletePopUp(false)
    }

    function deleteCancel() {
        dispatch(deleteSettings(!deleteMode))
    }
        
    const favorites = useSelector(state => state.favoritesList);
    favorites.sort((a, b) => {
        if (a.item < b.item) {
            return -1;
        }
        if (a.item > b.item) {
            return 1;
        }
        return 0;
    })
    
    localStorage.setItem('favoritesList', JSON.stringify(favorites))
    const favoriteItems = favorites.map((e, index) => <FavoriteItem item={e} key={index} setDeletePopUp={setDeletePopUp} setFavoriteDelete={setFavoriteDelete} setFavoritesRemove={setFavoritesRemove} favoritesRemove={favoritesRemove}/>)


    async function addNewFavorite() {
        const filteredFavorites = favorites.filter(e => e.item === newFavorite.item)
        if(filteredFavorites.length > 0) {
            setExist(true)
            return
        }
        if(newFavorite.item.length > 1) {
            if(error) {
                setError(false)
            }
            newFavorite.item = newFavorite.item.toLowerCase()
            newFavorite.id = uuidv4();

            const accountKey = localStorage.getItem('accountKey')
            const body = JSON.stringify(newFavorite)
            const requestOptions = {
                method: 'POST',
                headers: { 'accountid': accountKey, 'Content-Type': 'application/json' },
                body: body
            };
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/favorites`, requestOptions)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        console.log('hej')
                    }
                })
                .then(dispatch(addFavorite(newFavorite)))
                .then(setNewFavorite({item: '', added: false}))
                .catch(err => console.log(err))
        } else {
            setError(true)
        }
    }

    async function removeAllFavorites() {
        const accountKey = localStorage.getItem('accountKey')

        const requestOptions = {
            method: 'DELETE',
            headers: { 'accountid': accountKey, 'Content-Type': 'application/json' }
        };
        fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/favorites/all`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(dispatch(emptyFavorites()))
            .then(dispatch(deleteSettings(false)))
            .then(setDeletePopUp(false))
            .catch(err => console.log(err))
    }

    function removeFavorites() {
        const accountKey = localStorage.getItem('accountKey')
        const body = JSON.stringify(favoritesRemove)
        const requestOptions = {
            method: 'DELETE',
            headers: { 'accountid': accountKey, 'Content-Type': 'application/json' },
            body: body
        };
        fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/favorites/`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(dispatch(removeFavorite(favoritesRemove)))
            .then(dispatch(deleteSettings(!deleteMode)))
            .then(setFavoritesRemove([]))
            .then(setDeletePopUp(false))
            .catch(err => console.log(err))
    }

    // function testing(e) {
    //     e.preventDefault();
    //     console.log(favoritesRemove)
    // }
    
    function closeMenu() {
        if(menuOpen) {
            setMenuOpen(false)
        }
    }

    function deleteItemMode() {
        dispatch(deleteSettings(!deleteMode))
    }

    function removeAllPopup() {
        setDeletePopUp(true)
    }

    // function deleteAllFavorites() {
    //     setDeletePopUp(false)
    //     // Fetch remove all favorites
    //     dispatch(emptyFavorites())
    //     console.log('Everything removed')
    // }

    function handleEnter(e) {
        if(e.key === 'Enter') {
            addNewFavorite()
        }
    }

    function clearExistError() {
        if(exist) {
            setNewFavorite(prevNewFavorite => ({ ...prevNewFavorite, item: '' }))
            setExist(false)
        }
    }

    const [showInfo, setShowInfo] = useState(false)

    function showFaq() {
        setShowInfo(!showInfo)
    }

    return (
        <section className='favorites'>
            {loggedIn &&
                <article className='favorites-container'>
                    <Header setLoggedIn={setLoggedIn} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                    <article className='favorites-section' onClick={closeMenu}>
                        <h1 className='favorites-header'>Favorites</h1>
                        {/* <article className='favorite-add'> */}
                        <article className="form-favorite">
                            <input type="text" id='favorite' placeholder=' ' maxLength={22} className="favorite-input" required value={newFavorite.item} onChange={(e) => { getFavoriteInput(e) }} onKeyUp={(e) => {handleEnter(e)}} onClick={clearExistError} />
                            <label htmlFor="favorite" className='favorite-label'>Favorite</label>
                            <button className='btn btn-favorites' onClick={addNewFavorite}>Add</button>
                            {exist && <h3 className='item-exist'>{newFavorite.item} is already in your list!</h3>}
                        </article>
                        {/* </article> */}
                        {error && 
                        <p className='error-message'>You need atleast 2 characters</p>}
                       
                        {/* {favorites.length > 0 && */}
                        <article className='favorite-list'>
                        <div className='faq' style={{ backgroundImage: `url(${faq})` }} onClick={showFaq}>
                        {showInfo && <div className='faq-container'>
                            <p>You can click on the plus to add the favorite to your list</p>
                        </div>}
                        </div>
                            {favorites.length > 0 && 
                            <article className="delete-section">
                                <button className='btn btn-remove' onClick={deleteItemMode}>Delete</button>
                                <button className='btn btn-remove' onClick={removeAllPopup}>Clear All</button>
                            </article> }
                            {favoriteItems}
                        </article>
                        {/* } */}
                        {favorites.length === 0 && <h3>Looks like its empty, why dont you add a favorite!</h3>} 

                        {deletePopUp && 
                        <section className="delete-overlay">
                            <article className='delete-popup'>
                                <h3 className='popup-headline'>Delete {favoriteDelete} from the list?</h3>
                                <div>
                                    <button className='btn btn-popup btn-popup--delete' onClick={removeFavorites}>Delete {favoritesRemove.length > 0 ? favoritesRemove.length : ''} items</button>
                                    <button className='btn btn-popup btn-popup--cancel' onClick={cancelDelete}>Cancel</button>
                                </div>
                            </article>  
                            <article className='delete-popup delete-popup--desktop'>
                                <h3 className='popup-headline'>Delete everything?</h3>
                                <div>
                                    <button className='btn btn-popup btn-popup--delete' onClick={removeAllFavorites}>Yes</button>
                                    <button className='btn btn-popup btn-popup--cancel' onClick={cancelDelete}>Cancel</button>
                                </div>
                            </article>
                        </section>}
                        {deleteMode && 
                        <article className='delete-confirm'>
                            <button className='btn btn-popup btn-popup--delete btn-popup--deleteAll' onClick={removeAllFavorites}>Delete All</button>
                            <button className={favoritesRemove.length > 0 ? 'btn btn-popup btn-popup--delete' : 'btn btn-popup btn-popup--delete btn-popup--disabled'} onClick={removeFavorites}>Delete {favoritesRemove.length > 0 ? favoritesRemove.length : '' } items</button>
                            <button className='btn btn-popup btn-popup--cancel' onClick={deleteCancel}>Cancel</button>
                        </article>}
                    </article>
                </article>}
            {!loggedIn &&
                <article>
                    <h1>Hey</h1>
                    <p>You need to log in first!</p>
                    <button className="error-button" onClick={() => { navigate('/shopperlist') }}>Log In</button>
                </article>}            
        </section>
    )
}