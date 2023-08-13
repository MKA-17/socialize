import { createContext, useContext, useEffect, useState } from "react"

let HelmetContext = createContext();

export function HelmetProvider({children}) {
    const [helmetObj, setHelmetObj] = useState({
        author: 'MKA',
        title: 'Socialize',
        description: 'MERN Stack App',
        keywords: 'MERN'
    });
  

    return (
    <HelmetContext.Provider value={ [helmetObj, setHelmetObj] }>
       {children}
    </HelmetContext.Provider>
  )
}

export const useHelmet = () => useContext(HelmetContext);