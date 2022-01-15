import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Offers from './pages/Offers';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Category from './pages/Category';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore/>}/>
          <Route path='/offers' element={<Offers/>}/>
          <Route path='/profile' element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile/>}/>
          </Route>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/category/:categoryName' element={<Category/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
        </Routes>
        <Navbar/>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
