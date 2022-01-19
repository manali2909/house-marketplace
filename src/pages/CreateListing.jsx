import {useState, useEffect,useRef} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {
    getStorage, 
    ref,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage'
import {addDoc , collection , serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {v4 as uuidv4} from 'uuid'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
function CreateListing() {
    const [geoLocationEnabled, setGeolocationEnabled]=useState(false)
    const [loading ,setLoading] = useState(false);
    const [formData, setFormData]= useState({
        type:'rent',
        name:'',
        bedroom: 1,
        bathroom:1,
        parking: false,
        furnished: false,
        address:'',
        offer:true,
        regularPrice: 0,
        discountedPrice:0,
        images:{},
        latitude:0,
        longitude:0
    })

    const {
        type,
        name,
        bedroom,
        bathroom,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude
        
    } = formData

    const auth=getAuth()
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        if(isMounted){
            onAuthStateChanged(auth, (user)=>{
                if(user){
                    setFormData({...formData, userRef:user.uid})
                }else{
                    navigate('/signin');
                }
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    const onSubmit= async(e)=>{
        e.preventDefault();
        setLoading(true);
        if(discountedPrice >= regularPrice){
            setLoading(false);
            toast.error("Discounted price needs to be less than Regular price");
            return;
        }
        if(images.length > 6){
            setLoading(false);
            toast.error('Max 6 images');
            return;
        }

        let geolocation ={};
        let location 

        if(geoLocationEnabled){
            //google api needs to go here 
            console.log('need to put api goolge here ');
        }else {
            geolocation.lat = latitude
            geolocation.lng= longitude
            location=address
        }

        //store image in firebase
        const storeImage = async (image)=>{
            return new Promise((resolve,reject)=>{
                const storage =getStorage();
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef= ref(storage, `images/'${fileName}`);
                const uploadTask = uploadBytesResumable(storageRef,image);

                uploadTask.on(
                    'state_changed',
                    (snapshot)=>{
                        const progress=(snapshot.bytesTransferred / snapshot.totalBytes)*100;
                            console.log("Upload is" + progress + '% done');

                            switch(snapshot.state){
                                case 'paused': console.log("Upload is paused");
                                                break;
                                case 'running' : console.log('Upload is running');
                                                break;
                            }
                    },
                    (error)=>{
                        reject(error)
                        console.log(error);
                    },
                    ()=>{
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL)=>{
                                resolve(downloadURL)
                            }
                        )
                    }
                )

            })
        }

        const imageUrls = await Promise.all(
            [...images].map((image)=> storeImage(image))
        ).catch(()=>{
            setLoading(false);
            toast.error('Images not uploaded')
            return
        })
        
        const formDataCopy = {
            ...formData,
            imageUrls,
            geolocation,
            timestamp:serverTimestamp()
        }
        //clean up
        delete formDataCopy.images
        delete formDataCopy.address
        location && (formDataCopy.location=location)
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        //adding to database
        const docRef = await addDoc(collection(db,'listings'),formDataCopy)

        setLoading(false);
        toast.success('Listing added');
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)

        
        // console.log(formData);
    }
    const onMutate = (e)=>{
        let boolean=null;

        if(e.target.value=== "true"){
            boolean= true
        }
        if(e.target.value=== 'false'){
            boolean= false
        }
        
        //files 
        if(e.target.files){
            setFormData((prevState)=> ({
                ...prevState,
                images: e.target.files
            }))
        }
        //text/boolean/numbers
        if(!e.target.files){
            setFormData((prevState)=>({
                ...prevState,
                [e.target.id]: boolean ??e.target.value
            }))
        }
        
    }

    if(loading){return <Spinner/>}
    return (
        <div className='profile'>
            <header>
                <p className='pageHeader'>Create a listing</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className='formButtons'>
                        <button 
                            type='button' 
                            className={type=== 'sale'? 'formButtonActive': 'formButton' }
                            id='type'
                            value='sale'
                            onClick={onMutate}
                        >
                         Sell
                        </button>
                        <button 
                            type='button' 
                            className={type=== 'rent'? 'formButtonActive': 'formButton' }
                            id='type'
                            value='rent'
                            onClick={onMutate}
                        >
                         Rent
                        </button>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    <div className="formRooms flex">
                        <div>
                            <label  className="formLabel">Bedrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bedroom'
                                value={bedroom}
                                onChange={onMutate}
                                max='50'
                                min='1'
                                required
                            />
                        </div>
                        <div>
                            <label  className="formLabel">Bathrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bathroom'
                                value={bathroom}
                                onChange={onMutate}
                                max='50'
                                min='1'
                                required
                            />
                        </div>
                    </div>
                    
                    <label className='formLabel'>Parking Spot</label>
                    <div className='formButtons'>
                        <button 
                            type='button' 
                            className={parking ? 'formButtonActive': 'formButton' }
                            id='parking'
                            value={true}
                            onClick={onMutate}
                        >
                         Yes
                        </button>
                        <button 
                            type='button' 
                            className={!parking && parking !== null ? 'formButtonActive': 'formButton' }
                            id='parking'
                            value={false}
                            onClick={onMutate}
                        >
                         No
                        </button>
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className='formButtons'>
                        <button 
                            type='button' 
                            className={furnished ? 'formButtonActive': 'formButton' }
                            id='furnished'
                            value={true}
                            onClick={onMutate}
                        >
                         Yes
                        </button>
                        <button 
                            type='button' 
                            className={!furnished && furnished !==null ? 'formButtonActive': 'formButton' }
                            id='furnished'
                            value={false}
                            onClick={onMutate}
                        >
                         No
                        </button>
                    </div>

                    <label className='formLabel'>Address</label>
                    <textarea
                        className='formInputAddress'
                        type='text'
                        id='address'
                        value={address}
                        onChange={onMutate}
                        required
                    />

                    {!geoLocationEnabled && (
                        <div className="formLatLng flex">
                            <div>
                                <label className="formLabel">Latitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='latitude'
                                    value={latitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label className="formLabel">Longitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='longitude'
                                    value={longitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button 
                            type='button' 
                            className={offer ? 'formButtonActive': 'formButton' }
                            id='offer'
                            value={true}
                            onClick={onMutate}
                        >
                         Yes
                        </button>
                        <button 
                            type='button' 
                            className={!offer && offer !==null ? 'formButtonActive': 'formButton' }
                            id='offer'
                            value={false}
                            onClick={onMutate}
                        >
                         No
                        </button>
                    </div>

                    <label className='formLabel'>Regular Price</label>
                    <div className="formPriceDiv">
                        <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            max='75000000'
                            min='50'
                            required
                        /> 
                        {type === 'rent' && (
                            <p className="formPriceText">$ /Month</p>
                        )}
                    </div>

                    {offer && (
                        <>
                            <label className='formLabel'>Offer Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                max='75000000'
                                min='50'
                                // required={offer}
                            /> 
                        </>
                            
                    )}

                    <label className='formLabel'>Images</label>
                    <p className="imagesInfo">The first image will be the cover (max 6).</p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='images'
                        onChange={onMutate}
                        max='6'
                        accept ='.jpg,.png,.jpeg'
                        multiple
                        required
                    /> 
                    <button className="primaryButton createListingButton">
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    )
}

export default CreateListing

