import './FavoriteItem.css'
import addedIcon from '../assets/added.svg'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addItem, checkIfItem } from '../redux/actions/shoppingAction';
import { useEffect } from 'react';

export default function FavoriteItem(props) {
    const { item, setDeletePopUp, setFavoriteDelete, setFavoritesRemove, favoritesRemove } = props
    // const [added, setAdded] = useState(false)
    const accountId = localStorage.getItem('accountKey')

    const dispatch = useDispatch();

    const shopperList = useSelector(state => state.shopperList);
    const deleteMode = useSelector(state => state.deleteSetting);
    
    const filteredList = shopperList.filter(e => e.item === item.item)
    
    if(shopperList.length === 0) {
        const shopperLocal = JSON.parse(localStorage.getItem('shopperList'))
        const filteredLocal = shopperLocal.filter(e => e.item === item.item)
        if(filteredLocal.length === 1) {
            item.added = true
        }
    }
    if(filteredList.length === 1) {
        item.added = true
    }

    async function addToItemList() {
        const newItem = {
            item: item.item,
            amount: 1,
            comment: ''
        }

        const body = JSON.stringify(newItem)
        const requestOptions = {
            method: 'POST',
            headers: { 'accountid': accountId, 'Content-Type': 'application/json' },
            body: body
        };
        fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(dispatch(addItem(newItem)))
            .then(item.added = !item.added)
            .catch(err => console.log(err))
    }


    let timer;
    function mouseDown() {
        timer = setTimeout(() => {
            setFavoriteDelete(item)
            setDeletePopUp(true)
        }, 1000);    
    }
    
    function mouseUp() {
        clearTimeout(timer)
    }

    function addToRemoveFavorites(e) {
        if(e.target.checked) {
            setFavoritesRemove(prevFavoritesRemove => [...prevFavoritesRemove, item])
        } else {
            setFavoritesRemove(prevFavoritesRemove => prevFavoritesRemove.filter(favorite => favorite.item !== e.target.value))
        }
    }

    return (
        <section className={item.added ? 'favorite-item favorite-item--added' : 'favorite-item'} onMouseDown={mouseDown} onMouseUp={mouseUp}>
            <div className='items'>
                <p>{item.item}</p>                
                {item.added && !deleteMode && <img className='added-icon' src={addedIcon} alt="added icon" />}
                {!item.added && !deleteMode && <button className='btn btn-addFavorite' onClick={addToItemList}>+</button>}        
                {deleteMode && 
                <div className="checkbox-container">
                    <input type="checkbox" value={item.item} name="delete-checkbox" id="delete-checkbox" onClick={(e) => {addToRemoveFavorites(e)}} />
                    <span className='testa'></span>                    
                </div>
                }
                {/* {deleteMode && <input type="checkbox" value={item.item} name="delete-checkbox" id="delete-checkbox" onClick={(e) => {addToRemoveFavorites(e)}} />} */}
                
            </div>
        </section>
    )
}