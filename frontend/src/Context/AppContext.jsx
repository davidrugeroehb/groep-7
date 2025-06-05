import {createContext} from 'react'
export const AppContext= createContext()
const AppContextProvider=(props)=>{
    const value={}
    return (
    <AppContext.provider value={value}>
        {props.childeren}
    </AppContext.provider>
    )
}

export default AppContextProvider