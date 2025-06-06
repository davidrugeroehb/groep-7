import {createContext} from 'react'
export const BedrijfContext= createContext()
const BedrijfContextProvider=(props)=>{
    const value={}

    return (
    <BedrijfContext.provider value={value}>
        {props.childeren}
    </BedrijfContext.provider>
    )
}

export default BedrijfContextProvider