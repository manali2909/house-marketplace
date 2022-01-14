import {useEffect, useState, useRef} from 'react';
import {getAuth , onAuthStateChanged} from 'firebase/auth'; 
export const useAuthStatus = () => {
    const [loggedin, setLoggedin]=useState(false);
    const [checkingStatus, setCheckingStatus]=useState(true);
    const isMounted = useRef(true);

    useEffect(()=>{
        if(isMounted){
            const auth = getAuth();
            onAuthStateChanged(auth,(user)=>{
            if(user) {
                setLoggedin(true);
            } 
            setCheckingStatus(false);
            })
        }
        return ()=>{
            isMounted.current=false
        }
    },[isMounted])
    return {loggedin,checkingStatus}
}
