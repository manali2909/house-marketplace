import {useEffect , useState} from 'react';
import {useParams} from 'react-router-dom';
import {collection , getDocs,doc,query,where,orderBy,limit,startAfter} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {
    const [listings, setListings]=useState(null);
    const [loading, setLoading]=useState(true);

    const params = useParams();
//use effect cant be async
    useEffect(()=>{
        const fetchListings = async ()=>{
            try{
                //Get reference
                const listingRef= collection(db,'listings');
                //Create a query
                const q=query(listingRef , 
                    where('offer','==',true), 
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )
                
                //execute query
                 
                const querySnap = await getDocs(q);
                
                const listings =[]
                    
                querySnap.forEach((doc)=>{
                    return listings.push({
                        id:doc.id,
                        data:doc.data()
                    })
                })
                setListings(listings);
                // console.log(l);
                setLoading(false);
            }catch(error){
                toast.error('Could not fetch listing');
                setLoading(false);
            }
        }
        fetchListings();
    },[])
    return (
        <div className='category'>
            <header>
                <p className='pageHeader'>
                    Offers
                </p>
            </header>

            {loading ? (<Spinner/>):
                    listings && listings.length >0 ?(
                        <>
                            <main>
                                <ul className='categoryListings'>
                                    {listings.map((listing)=>(
                                        <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                                    ))}
                                </ul>
                            </main>
                        </>
                    )
                    :<p>No Offers </p>
            }
        </div>
    )
}

export default Offers
