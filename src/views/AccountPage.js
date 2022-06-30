import Header from '../components/Header'
import ShoppingList from "./shoppingList";
import Favorites from "./Favorites";
import { getList, getFavorites } from "../redux/actions/shoppingAction";
import { useParams } from 'react-router-dom';

export default function AccountPage(props) {
    const { accountKey, loggedIn, setLoggedIn, menuOpen, setMenuOpen } = props;
    const listType = useParams();
    useEffect(() => {
        const username = localStorage.getItem('username')
        const accountId = localStorage.getItem('accountKey')
        if(!username && !accountId) {
            setLoggedIn(false)
        }
        const shopperList = useSelector(state => state.shopperList);
        const favoritesList = useSelector(state => state.favoritesList);
        const requestOptions = {
            method: 'GET',
            headers: { 'accountid': accountId },
        };

        if(shopperList.length === 0) {
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/shoppinglist`, requestOptions)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        console.log('hej')
                    }
                })
                .then(data => dispatch(getList(data.list[0].listItems)))
                .catch(err => console.log(err))
        }
        if(favoritesList.length === 0) {
            fetch(`https://dramatic-bottlenose-hallway.glitch.me/api/favorites`, requestOptions)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log('hej')
                }
            })
            .then(data => dispatch(getFavorites(data.list[0].listItems)))
            .catch(err => console.log(err))
        }

        }, [])

    return (
        <section>
            <Header setLoggedIn={setLoggedIn} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            {listType === 'shoppinglist' && <ShoppingList /> }
            {listType === 'favorites' && <Favorites />}
            <DeleteFunction listType={listType} deleteActive={deleteActive}/>
        </section>
    )
}