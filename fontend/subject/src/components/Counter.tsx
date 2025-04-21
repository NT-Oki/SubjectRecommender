import { useEffect, useState } from "react";


const Counter=()=>{
    const [count,setCount]=useState(1)
    useEffect(()=>{
        const timer=setInterval(()=>{
            setCount((prev)=>
                prev+1
            )
        },1000)
    return ()=>{
        clearInterval(timer)

    }
    },[])
    return(
        <div>
            <h3>{count}</h3>
            <button onClick={()=>{setCount(count+1)}}>Tăng</button>
        </div>
    )
}
export default Counter