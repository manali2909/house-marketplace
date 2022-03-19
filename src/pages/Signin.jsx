import {useState} from 'react';
import {toast} from 'react-toastify'
import {Link,useNavigate} from 'react-router-dom';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visiblityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth';
function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      
      email:'',
      password:'',
  })

  const {email,password}= formData;
  const onChange =(e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value
    }))
  }

  const onSubmit = async (e)=>{
    e.preventDefault()

    try{
      const auth= getAuth();
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      if(userCredential.user){
        navigate('/');
      }
    }
    catch(error){
        console.log(error);
        toast.error("Bad credentials");
    }
  }
  const navigate = useNavigate();
    return (
        <>
          <div className='pageContainer'>
            <header>
              <p className='pageHeader'>Welcome Back!</p>
            </header>
            <form onSubmit={onSubmit}>
            
              <input
                type='email'
                className='emailInput'
                placeholder='Email'
                id='email'
                value={email}
                onChange={onChange}
              />
              <div className='passwordInputDiv'>
                <input
                  type={showPassword ? 'text': 'password'}
                  className='passwordInput'
                  placeholder='Password'
                  id='password'
                  value={password}
                  onChange={onChange}
                />
                <img 
                  src={visiblityIcon}
                  alt='show password'
                  className='showPassword'
                  onClick={()=>setShowPassword((prevState)=> !prevState)}
                />
              </div>
              <Link to='/signup' className='signInLink'>
                Sign Up Instead?
              </Link>
              <Link to = '/forgot-password'
                className='forgotPasswordLink'>
                    Forgot Password
              </Link>
              
              <div className="signInBar">
                <p className="signInText">
                  Sign In
                </p>
                <button className='signInButton'>
                  <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
                </button>
              </div>
            </form>

            {/* google oAuth */}
            <OAuth/>

            
          </div>  
        </>
    )
}

export default Signin
