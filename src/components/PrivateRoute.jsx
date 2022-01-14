import {Navigate , Outlet} from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
    const {loggedin , checkingStatus}= useAuthStatus();
    
    if(checkingStatus){
        return <Spinner/>
    }
    return loggedin ? <Outlet/>:<Navigate to='/signin'/>
}

export default PrivateRoute
