const getList = (list) => {
    return {
        type: 'GET_LIST',
        payload: list
    }
}

const addItem = (item) => {
    return {
        type: 'ADD_ITEM',
        payload: item
    }
}

const removeItem = (item) => {
    return {
        type: 'REMOVE_ITEM',
        payload: item
    }
}

const updateAmount = (item) => {
    return {
        type: 'UPDATE_AMOUNT',
        payload: item
    }
}

const updateItemDone = (item) => {
    return {
        type: 'ITEM_DONE',
        payload: item
    }
}

const emptyList = (list) => {
    return {
        type: 'EMPTY_LIST',
        payload: list
    }
}

const getFavorites = (list) => {
    return {
        type: 'GET_FAVORITES',
        payload: list
    }
}

const addFavorite = (item) => {
    return {
        type: 'ADD_FAVORITE',
        payload: item
    }
}

const removeFavorite = (item) => {
    return {
        type: 'REMOVE_FAVORITE',
        payload: item
    }
}

const emptyFavorites = (list) => {
    return {
        type: 'EMPTY_FAVORITES',
        payload: list
    }
}

const deleteSettings = (deleteMode) => {
    return {
        type: 'DELETE_SETTING',
        payload: deleteMode
    }
}

const checkIfFavorite = (item) => {
    return {
        type: 'CHECK_FAVORITE',
        payload: item
    }
}

const checkIfItem = (item) => {
    return {
        type: 'CHECK_ITEM',
        payload: item
    }
}

const logOutAction = (item) => {
    return {
        type: 'LOG_OUT',
        payload: item
    }
}

export { getList, addItem, removeItem, updateAmount, updateItemDone, emptyList, getFavorites, addFavorite, removeFavorite, emptyFavorites, deleteSettings, checkIfFavorite, checkIfItem, logOutAction }