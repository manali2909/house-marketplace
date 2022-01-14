import {useState} from 'react';
import {Link} from 'react-router-dom';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRigntIcon} from '../assets/svg/keyboardArrowRightIcon.svg'


function ForgotPassword() {
    const [email, setEmail]=useState('');
    const onChange=(e)=>{
        setEmail(e.target.value);
    }
    const onSubmit =async (e)=>{
       e.preventDefault(); 
       try{
            const auth=getAuth();
            await sendPasswordResetEmail(auth,email);
            toast.success('Email was sent');
       }catch(error){
            toast.error('Could not sent reset email');
       }
    }
    
    return (
        <div className='pageConatainer'>
            <header>
                <p className='pageHeader'>Forgot Password</p>
            </header>

            <main>
                <form onSubmit ={onSubmit}>
                    <input 
                        type="email" 
                        className='emailInput' 
                        placaholder="Email" 
                        id="email" 
                        value={email} 
                        onChange={onChange}
                    />
                    <Link className='forgotPasswordLink' to='/signin'>
                        Sign In
                    </Link>
                    
                    <div className="signInBar">
                        <div className="signInText">Send Reset link</div>
                        <button className='signInButton'>
                            <ArrowRigntIcon fill='#ffffff' width='36px' height='36px'/>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ForgotPassword
