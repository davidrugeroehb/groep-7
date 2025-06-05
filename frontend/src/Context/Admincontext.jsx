import {createContext} from 'react'
export const AdminContext= createContext()
const AdminContextProvider=(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [aToken,setAToken]=useState('')
    const value={
        aToken,setAToken,
        backendUrl
    }

    return (
    <AdminContext.provider value={value}>
        {props.childeren}
    </AdminContext.provider>
    )
}

export default AdminContextProvider