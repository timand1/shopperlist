import './ListItem.css'
import addedIcon from '../assets/added.svg'
import favoriteFill from '../assets/favorite-fill.svg'
import favoriteEmpty from '../assets/favorite-empty.svg'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { updateItemDone, addFavorite, removeFavorite, updateAmount } from '../redux/actions/shoppingAction';

export default function ListItem(props) {
    const { item, accountKey, setDeletePopUp, setItemRemove } = props

    const dispatch = useDispatch();

    const favoritesList = useSelector(state => state.favoritesList);
    localStorage.setItem('favoritesList', JSON.stringify(favoritesList))
    const deleteMode = useSelector(state => state.deleteSetting);

    const filteredFavorites = favoritesList.filter(e => e.item === item.item)

    if(favoritesList.length === 0) {
        const favoriteLocal = JSON.parse(localStorage.getItem('favoritesList'))
        const filteredLocal = favoriteLocal.filter(e => e.item === item.item)
        if(filteredLocal.length === 1) {
            item.favorite = true
        }
    }

    if(filteredFavorites.length === 1) {
        item.favorite = true
    }

    async function changeFavorite(e) {
        e.stopPropagation();
        const body = JSON.stringify(item)
        const requestOptions = {
            method: 'DELETE',
            headers: { 'accountid': accountKey, 'Content-Type': 'application/json' },
            body: body
        };

        if(item.favorite) {                        
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/favorites`, requestOptions)
            .then(res => {
                if (res.ok) {
                        return res.json()
                    } else {
                        console.log('hej')
                    }
                })
                .then(dispatch(removeFavorite([item])))
                .catch(err => console.log(err))
                item.favorite = false
        } else {
           
            requestOptions.method = 'POST';
            
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/favorites`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(dispatch(addFavorite(item)))
            .catch(err => console.log(err))
            item.favorite = true
        }
        
    }

    // useEffect(() => {
    //     dispatch(updateAmount(item))
    // }, [amount])


    // const [itemDone, setItemDone] = useState(false)

    function itemIsDone(e) {        
        e.stopPropagation();        
        item.itemIsDone = !item.itemIsDone;
        const accountId = localStorage.getItem('accountKey')
        const body = JSON.stringify(item)
        const requestOptions = {
            method: 'POST',
            headers: { 'accountid': accountId, 'Content-Type': 'application/json' },
            body: body
        };
        fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist/${item.id}`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(dispatch(updateItemDone(item)))
            .catch(err => console.log(err))

    }

    let timer;
    function mouseDown() {
        timer = setTimeout(() => {
            setItemRemove(item)
            setDeletePopUp(true)
        }, 1000);    
    }

    function mouseUp() {
        clearTimeout(timer)
    }

    function addToRemoveItem(e) {
        e.stopPropagation();
        if(e.target.checked) {
            setItemRemove(prevItemRemove => [...prevItemRemove, item])
        } else {
            setItemRemove(prevItemRemove => prevItemRemove.filter(item => item.item !== e.target.value))
        }
    }

    function itemAmount(e) {
        e.stopPropagation();
        item.amount = e.target.value

        const accountId = localStorage.getItem('accountKey')
        const body = JSON.stringify(item)
        const requestOptions = {
            method: 'POST',
            headers: { 'accountid': accountId, 'Content-Type': 'application/json' },
            body: body
        };
        fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist/${item.id}`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(dispatch(updateAmount(item)))
            .catch(err => console.log(err))
    }

    return (
        <section className={item.itemIsDone ? 'list-item list-item--done' : 'list-item'} onClick={(e) => {itemIsDone(e)}} onMouseDown={mouseDown} onMouseUp={mouseUp}>
            <div className='items'>
                <p className='favorite' onClick={(e) => {changeFavorite(e)}}>
                    {item.favorite && <img src={favoriteFill} alt="filled favorite" className="favorite favorite-fill" />}
                    {!item.favorite && <img src={favoriteEmpty} alt="empty favorite" className="favorite favorite-empty" />}
                </p>
                <p>{item.item}</p>
                {!deleteMode && !item.itemIsDone && <select name="amount" id="amount" value={item.amount} onChange={(e) => {itemAmount(e)}} onClick={(e) => {e.stopPropagation()}}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="10">15</option>
                    <option value="11">16</option>
                    <option value="12">17</option>
                    <option value="13">18</option>
                    <option value="14">19</option>
                    <option value="14">20</option>
                </select>}
                {!deleteMode && item.itemIsDone && <img className='item-done' src={addedIcon} alt="added icon" />}
                {deleteMode && 
                <div className="checkbox-container">
                    <input type="checkbox" value={item.item} name="delete-checkbox" id="delete-checkbox" onClick={(e) => {addToRemoveItem(e)}} />
                    <span className='testa'></span>                    
                </div>
                }
            </div>
            {item.comment.length > 0 && 
            <p className='comment'>{item.comment}</p> }
        </section>
    )
}