import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState();
    
    useEffect(()=>{
        const timeout = setTimeout(() => {
            setDebounceValue(value)
        },delay)

        return () => clearTimeout(timeout);
    },[delay, value])

    return debounceValue;
}

