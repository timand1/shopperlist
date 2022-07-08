import './ShoppingList.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header.js';
import ListItem from '../components/ListItem.js';
import faq from '../assets/faq.svg'

import { getList, addItem, removeItem, emptyList, deleteSettings } from '../redux/actions/shoppingAction';

export default function ShoppingList(props) {
    const { accountKey, loggedIn, setLoggedIn, menuOpen, setMenuOpen } = props;
    const [newItem, setNewItem] = useState({ item: '', amount: '1', comment: '', favorite: false, itemIsDone: false })
    const [btnAdd, setBtnAdd] = useState(false)
    const [itemRemove, setItemRemove] = useState([]);
    const [deletePopUp, setDeletePopUp] = useState(false)
    const [exist, setExist] = useState(false)
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const deleteMode = useSelector(state => state.deleteSetting);
    
    let shopperList = useSelector(state => state.shopperList);
    localStorage.setItem('shopperList', JSON.stringify(shopperList))
    const shoppingItem = shopperList.map((item, index) => <ListItem item={item} key={index} accountKey={accountKey} setDeletePopUp={setDeletePopUp} setItemRemove={setItemRemove} />)



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
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist`, requestOptions)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        console.log('hej')
                    }
                })
                .then(data => dispatch(getList(data.list)))
                .catch(err => console.log(err))
        }

    }, [])
       
        
        // async function getLists() {
        //     const requestOptions = {
        //         method: 'GET',
        //         headers: { 'accountid': accountKey },
        //     };
        //     fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist`, requestOptions)
        //     .then(res => {
        //         if (res.ok) {
        //             return res.json()
        //         } else {
        //             console.log('hej')
        //         }
        //     })
        //     .then(data => setShoppingList(data.list[0].listItems))
        //     .catch(err => console.log(err))
        // }
        // let shoppingItem;
        // if(shopperList.length > 0) {
            //     shoppingItem = shopperList.map((item, index) => <ListItem item={item} key={index} accountKey={accountKey} />)
            // } else {
                //     shoppingItem = 'You have no favorites yet.'
                // }
         
        function deleteItem() {
            const accountKey = localStorage.getItem('accountKey')
            const body = JSON.stringify(itemRemove)

            const requestOptions = {
                method: 'DELETE',
                headers: { 'accountid': accountKey, 'Content-Type': 'application/json' },
                body: body
            };
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist/`, requestOptions)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        console.log('hej')
                    }
                })
                .then(dispatch(removeItem(itemRemove)))
                .then(dispatch(deleteSettings(false)))
                .then(setItemRemove([]))
                .then(setDeletePopUp(false))
                .then(setBtnAdd(!btnAdd))
                .catch(err => console.log(err))
        }
    
        function cancelDelete() {
            setDeletePopUp(false)
        }    

        // let shoppingItem;
        // if(shopperList.length === 0) {
        //     shopperList = localStorage.getItem('shopperList')
        // } else {
        //     localStorage.setItem('shopperList', JSON.stringify(shopperList))
        //     shoppingItem = shopperList.map((item, index) => <ListItem item={item} key={index} accountKey={accountKey} setDeletePopUp={setDeletePopUp} setItemDelete={setItemDelete} />)
        // }
        

    async function addItemToList() {
        const filteredShopper = shopperList.filter(e => e.item === newItem.item)
        if(filteredShopper.length > 0) {
            setExist(true)
            return
        }
        newItem.item = newItem.item.toLowerCase()
        newItem.amount = parseInt(newItem.amount)
        newItem.id = uuidv4();
        const accountId = localStorage.getItem('accountKey')
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
            .then(setNewItem({ item: '', amount: '1', comment: '', favorite: false, itemIsDone: false  }))
            .catch(err => console.log(err))
    }

    async function removeAllItems() {
        const accountKey = localStorage.getItem('accountKey')

        const requestOptions = {
            method: 'DELETE',
            headers: { 'accountid': accountKey, 'Content-Type': 'application/json' }
        };
        fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist/all`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(dispatch(emptyList()))
            .then(dispatch(deleteSettings(false)))
            .then(setDeletePopUp(false))
            .catch(err => console.log(err))
    }

    function closeMenu() {
        if(menuOpen) {
            setMenuOpen(false)
        }
    }

    function openForm() {
        setBtnAdd(!btnAdd)
    }

    function deleteCancel() {
        dispatch(deleteSettings(!deleteMode))
    }

    function deleteItemMode() {
        dispatch(deleteSettings(!deleteMode))
    }

    function removeAllPopup() {
        setDeletePopUp(true)
    }
    
 
    

    // function deleteAllItems() {
    //     setDeletePopUp(false)
    //     // Fetch remove all favorites
    //     dispatch(emptyList())
    // }

    function handleItem(e) {
        setNewItem((prevNewItem => ({ ...prevNewItem, item: e.target.value })))
    }

    function handleAmount(e) {
        setNewItem((prevNewItem => ({ ...prevNewItem, amount: e.target.value })))

    }
    function handleComment(e) {
        setNewItem((prevNewItem => ({ ...prevNewItem, comment: e.target.value })))
    }

    function handleEnter(e) {
        if(e.key === 'Enter' && newItem.item.length >= 2) {
            addItemToList()
        }
    }

    function clearExistError() {
        if(exist) {
            setNewItem((prevNewItem => ({ ...prevNewItem, item: '' })))
            setExist(false)
        }
    }

    const [showInfo, setShowInfo] = useState(false)

    function showFaq() {
        setShowInfo(!showInfo)
    }

    return (
        <section className='shopping-list'>
            {loggedIn &&
                <article className='shopping-container'>
                    <Header setLoggedIn={setLoggedIn} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                    <article className='shopping-list--container' onClick={closeMenu}>
                        <article className='shopping-header'>
                            <h1>shopperlist</h1>
                            <button onClick={openForm} className={ !btnAdd ? 'btn btn-add btn-add--active' : 'btn btn-add btn-add--close'}><p className={!btnAdd ? 'btn-add--plus' : 'btn-add--cross'}>+</p></button>
                        </article>
                        <form action="" className={btnAdd ? 'add-form add-form--active' : 'add-form add-form--close' }>
                            {exist && <h3 className='item-exist'>{newItem.item} is already in your list!</h3>}
                            <article className="form-item">
                                <input type="text" name="addItem" id="addItem" className='form-input' maxLength={22} placeholder=' ' value={newItem.item} required onChange={(e) => handleItem(e)} onKeyUp={(e) => {handleEnter(e)}} onClick={clearExistError} />
                                <label htmlFor="addItem" className='add-label'>Item *</label>
                            </article>
                            <article className="form-amount">
                                <input type="number" name="addAmount" id="addAmount" className='form-input' placeholder=' ' value={newItem.amount} onChange={(e) => handleAmount(e)} onKeyUp={(e) => {handleEnter(e)}} />
                                <label htmlFor="addItem" className='add-label'>Amount</label>
                            </article>
                            <article className="form-comment">
                                <input type="text" name="itemComment" id="itemComment" className='form-input' placeholder=' ' value={newItem.comment} onChange={(e) => handleComment(e)} onKeyUp={(e) => {handleEnter(e)}} />
                                <label htmlFor="itemComment" className='add-label'>Comment</label>
                            </article>
                            <input type="button" className='btn btn-add--form' value="Add" onClick={addItemToList} /> 
                        </form>
                        <article className='shopping-items'>
                        <div className='faq' style={{ backgroundImage: `url(${faq})` }} onClick={showFaq}>
                        {showInfo && <div className='faq-container'>
                            <p>You can click on an item to toggle the item complete</p>
                        </div>}
                        </div>
                            {shopperList.length > 0 && 
                            <article className="delete-section">
                                <button className='btn btn-remove' onClick={deleteItemMode}>Delete</button>
                                <button className='btn btn-remove' onClick={removeAllPopup}>Clear All</button>
                            </article> }
                            {shoppingItem}
                        </article>
                        {shopperList.length === 0 && <h3>Looks like its empty, why dont you add an item!</h3>} 
                        {deletePopUp && 
                            <section className="delete-overlay">
                                <article className='delete-popup'>
                                    <h3 className='popup-headline'>Delete {itemRemove.item} from the list?</h3>
                                    <div>
                                        <button className='btn btn-popup btn-popup--delete' onClick={deleteItem}>Delete {itemRemove.length > 0 ? itemRemove.length : ''} items</button>
                                        <button className='btn btn-popup btn-popup--cancel' onClick={cancelDelete}>Cancel</button>
                                    </div>
                                </article>  
                                <article className='delete-popup delete-popup--desktop'>
                                    <h3 className='popup-headline'>Delete everything?</h3>
                                    <div>
                                        <button className='btn btn-popup btn-popup--delete' onClick={removeAllItems}>Yes</button>
                                        <button className='btn btn-popup btn-popup--cancel' onClick={cancelDelete}>Cancel</button>
                                    </div>
                                </article>
                            </section>}
                        {deleteMode && 
                        <article className='delete-confirm'>
                            <button className='btn btn-popup btn-popup--delete btn-popup--deleteAll' onClick={removeAllItems}>Delete All</button>
                            <button className={itemRemove.length > 0 ? 'btn btn-popup btn-popup--delete' : 'btn btn-popup btn-popup--delete btn-popup--disabled'} onClick={deleteItem}>Delete {itemRemove.length > 0 ? itemRemove.length : '' } items</button>
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