import { createContext } from "react";

export const BackendUrlContext= createContext()

const BackendUrlProvider = (props) =>{
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    return(
        <BackendUrlContext.Provider value={backendURL}>
                {props.children}
        </BackendUrlContext.Provider>
    )
}

export default BackendUrlProvider