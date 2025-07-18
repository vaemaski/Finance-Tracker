import { toast } from "sonner";

const { setDate } = require("date-fns");
const { useState } = require("react")

const useFetch = (cb)=>{
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(undefined);
    const [error, setError] = useState(undefined);

    const fn = async (...agrs) => {
        setLoading(true);
        setError(null);
        try {
            const response = await cb(...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message)
        }
        finally{
            setLoading(false)
        }

 
    }
    return {data, setData, loading, error, fn };
};
 export default useFetch;