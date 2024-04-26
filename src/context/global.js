//create a global context store my state for the data that i want to display

import React, {createContext, useContext, useReducer} from "react";

const GlobalContext = createContext();

const baseUrl = "https://api.jikan.moe/v4";

//actions
const LOADING = "LOADING";
const SEARCH = "SEARCH";
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";
const GET_UPCOMING_ANIME = "GET_UPCOMING_ANIME";
const GET_AIRING_ANIME = "GET_AIRING_ANIME";
const GET_PICTURES = "GET_PICTURES";

//reducer takes two parameters
const reducer = (state, action) =>{
    switch(action.type){
        case LOADING:
            return {...state, loading: true}
        case GET_POPULAR_ANIME:
            return {...state, popularAnime: action.payload, loading: false}
        case SEARCH:
            return { ...state, searchResults: action.payload, loading: false }
        case GET_UPCOMING_ANIME:
            return {...state, upcomingAnime: action.payload, loading: false }
        case GET_AIRING_ANIME: 
            return {...state, airingAnime: action.payload, loading: false }
        case GET_PICTURES:
            return {...state, pictures: action.payload, loading: false }
        default:
            return state;
    }
}

//allows us to use the state in a global provider
export const GlobalContextProvider = ({children}) => {

    //initializing arrays initial state
    const initialState = {
        popularAnime: [],
        upcomingAnime: [],
        pictures: [],
        airingAnime: [],
        isSearch: false,
        searchResults: [],
        loading: false,
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    const [search, setSearch] = React.useState('');

    //handling a change in the state
    const handleChange = (e) => {
        setSearch(e.target.value);
        if(e.target.value === '') {
            state.isSearch = false;
        }
    }

    //handling search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (search) {
            searchAnime(search);
            state.isSearch = true;
        } else {
            state.isSearch = false;
            alert('Please enter a search term')
        }

    }

    //searching for an anime
    const searchAnime = async (anime) => {
        dispatch({ type: LOADING })
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${anime}&order_by=popularity&sort=asc&sfw`);
        const data = await response.json();
        dispatch({type: SEARCH, payload: data.data})
    }

    //get Anime Pictures
    const getAnimePictures = async (id) => {
        dispatch({ type: LOADING })
        const response = await fetch(`https://api.jikan.moe/v4/characters/${id}/pictures`);
        const data = await response.json();
        dispatch({type: GET_PICTURES, payload: data.data})
    }


    //fetching popular anime
    const getPopularAnime = async () => {
        dispatch({type: LOADING})
        const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
        const data = await response.json();
        dispatch({type: GET_POPULAR_ANIME, payload: data.data})
    }

    //fetching upcoming anime
    const getUpComingAnime = async () => {
        dispatch({type: LOADING})
        const response = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
        const data = await response.json();
        dispatch({type: GET_UPCOMING_ANIME, payload: data.data})
    }

    //fetch airing anime
    const getAiringAnime = async () => {
        dispatch({type: LOADING})
        const response = await fetch(`${baseUrl}/top/anime?filter=airing`);
        const data = await response.json();
        dispatch({type: GET_AIRING_ANIME, payload: data.data})
    }

    //initial render
    React.useEffect(() => {
        getPopularAnime();
    }, [])

    return(
        <GlobalContext.Provider value={{
            ...state, //using spread operator (...) to extract the values in initialstate inidiviually
            handleChange,
            handleSubmit,
            searchAnime, 
            search,
            getPopularAnime,
            getUpComingAnime,
            getAiringAnime,
            getAnimePictures
        }}>
            {children}
        </GlobalContext.Provider>
    )
}
export const useGlobalContext = () => {
    return useContext(GlobalContext);
}