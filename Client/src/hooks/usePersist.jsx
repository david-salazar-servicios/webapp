import { useState, useEffect } from "react"

const usePersist = () => {
    
    const [persist, setPersist] = useState(localStorage.getItem("persist") === "undefined" ? false : JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist