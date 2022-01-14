import {useState,useEffect} from 'react';
import {getAuth, updateProfile} from 'firebase/auth';
import {useNavigate, Link, Navigate} from 'react-router-dom'
import {updateDoc, doc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
function Profile() {
    const navigate = useNavigate();
    const [changeDetails,setChangeDetails]= useState(false);
    const auth = getAuth();
    const [formData , setFormData] = useState({
        name:auth.currentUser.displayName,
        email:auth.currentUser.email,
    })
    const {name,email}=formData;
   const onLogout =()=>{
    auth.signOut();
    navigate('/');
   }
   const onSubmit = async()=>{
       try{
           if(auth.currentUser.displayName !== name){
               //update display name in firebase
               await updateProfile(auth.currentUser,{displayName:name})

               //update in firestore
               const userRef = doc(db, 'users', auth.currentUser.uid)
               await updateDoc(userRef,{
                   name
               })
           }
       }catch (error){
           toast.error('could not update profile');
       }

   }

   const onChange =(e)=>{
       setFormData((prevState)=>({
           ...prevState,
           [e.target.id]: e.target.value
       }))
   }
    return (
    <div className='profile'>
        <header className='profileHeader'>
            <p className='pageHeader'> My profile</p>
            <button type='button' className='logOut' onClick={onLogout}>
                Logout    
            </button>
        </header>
        <main>
            <div className="profileDetailsHeader">
                <p className="profileDetailsText">
                    Personal Details
                </p>
                <p className="changePersonalDetails" onClick={()=>{
                    changeDetails && onSubmit()
                    setChangeDetails((prevState)=> !prevState)
                    }}>
                    {changeDetails ? 'done' : 'change'}
                </p>
            </div>

            <div className="profileCard">
                <form>
                    <input 
                        type='text'
                        id='name'
                        value={name}
                        disabled={!changeDetails}
                        onChange={onChange}
                        className={!changeDetails ? 'profileName': 'profileNameActive'}
                    />
                     <input 
                        type='text'
                        id='email'
                        value={email}
                        disabled={!changeDetails}
                        onChange={onChange}
                        className={!changeDetails ? 'profileEmail': 'profileEmailActive'}
                    />
                </form>
            </div>
        </main>
    </div>
    )
}

export default Profile
