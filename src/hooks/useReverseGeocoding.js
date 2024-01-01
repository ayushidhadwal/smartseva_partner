import {useState, useEffect,useCallback} from 'react';
import axios from 'axios'
import {GOOGLE_MAP_KEY} from '../constant/googleMapKey'

export const useReverseGeocoding = (lat, long) => {
    const [address, setAddress] = useState("")
    const [states,setStates]=useState("")


    const getLocationbyCoodinates = useCallback(async () => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_MAP_KEY}`);
            if (response.data.results.length > 0) {
                setAddress(response.data.results[0].formatted_address)
                 setStates(response.data.results[9].formatted_address)
            }
        } catch (e) {
            console.log( "ERR: " ,e)
        }
    }, [lat, long])

    useEffect(()=>{
        getLocationbyCoodinates()
    },[getLocationbyCoodinates])

    return[ address,states];
}