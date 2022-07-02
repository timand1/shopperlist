const initialState = {
    shopperList: [],
    shopperDeleteList: [],
    favoritesList: [],
    favoritesDeleteList: [],
    deleteSetting: false
}
// {item: 'kaka'}, {item: 'kaffe'}
const shoppingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_LIST': 
            let newList = []
            if(action.payload.length > 0) {
                newList = [...action.payload]

            } else {
                newList = action.payload
            }

            localStorage.setItem('shopperList', JSON.stringify(newList))
            return {
                ...state,
                shopperList: newList
            }
        case 'ADD_ITEM':
            return {
                ...state,
                shopperList : [action.payload, ...state.shopperList]
            }
        case 'REMOVE_ITEM':
            let updatedArr = [...state.shopperList]            
                for(const item of action.payload) {
                    updatedArr = updatedArr.filter(e => e.item !== item.item)
                }           

            return {
                ...state,
                shopperList: [...updatedArr]
            }
        case 'UPDATE_AMOUNT':
            const listCopy = [...state.shopperList];

            listCopy.forEach(e => {
                if (e.item === action.payload.item) {
                    e.amount = action.payload.amount
                }
            })

            localStorage.setItem('shopperList', JSON.stringify(listCopy))
            return {
                ...state,
                shopperList : [...listCopy]
            }
        case 'ITEM_DONE':
            const shopperListCopy = [...state.shopperList]

            shopperListCopy.forEach(e => {
                if (e.id === action.payload.id) {
                    e.itemIsDone = action.payload.itemIsDone
                }
            })
            localStorage.setItem('shopperList', shopperListCopy)
            return {
                ...state,
                shopperList: [...shopperListCopy]                
            }
        case 'EMPTY_LIST':
            localStorage.removeItem('shopperList')
            return {
                ...state,
                shopperList: []                
            }
        case 'GET_FAVORITES': 
            let newFavorites = []
            if(action.payload.length > 0) {
                newFavorites = [...action.payload]
            } else {
                newFavorites = action.payload
            }
            localStorage.setItem('favoritesList', JSON.stringify(newFavorites))
            return {
                ...state,
                favoritesList: [...newFavorites]
            }
        case 'ADD_FAVORITE':
            const newFavorite = {
                item: action.payload.item,
                added: false,
                id: action.payload.id
            }

            const shopperCopy = [...state.shopperList]

            const testing = shopperCopy.filter(e => e.item === newFavorite.item)

            if(testing.length === 1) {
                newFavorite.added = true;
            }

            return {
                ...state,
                favoritesList : [newFavorite, ...state.favoritesList]
            }
        case 'REMOVE_FAVORITE':
            let updatedFavorites = [...state.favoritesList]

            for(const item of action.payload) {
                updatedFavorites = updatedFavorites.filter(e => e.item !== item.item)
            }
            localStorage.setItem('favoritesList', JSON.stringify(updatedFavorites))
            return {
                ...state,
                favoritesList: [...updatedFavorites]
            }

        case 'EMPTY_FAVORITES':
            localStorage.removeItem('favoritesList')
            return {
                ...state,
                favoritesList: []
            }    
        case 'DELETE_SETTING':               

            return {
                ...state,
                deleteSetting: action.payload
            }
        case 'CHECK_FAVORITE':
            const filteredFavorite = state.favoritesList.filter(e => e.item === action.payload.item)
            if(filteredFavorite === 1) {
                action.payload.favorite = true
            }
        
            return {
                ...state,
                shopperList: [...state.shopperList, action.payload]
            }
        case 'CHECK_ITEM':
            const filteredItems = state.shopperList.filter(e => e.item === action.payload.item)
            if(filteredItems === 1) {
                action.payload.added = true
            }
            
            return {
                ...state,
                favoritesList: [...state.favoritesList, action.payload]
            }
        case 'LOG_OUT':
            localStorage.clear()
            return {
                shopperList: [],
                shopperDeleteList: [],
                favoritesList: [],
                favoritesDeleteList: [],
                deleteSetting: false
            }
        default: 
            return state
    }
}
        

export { shoppingReducer }