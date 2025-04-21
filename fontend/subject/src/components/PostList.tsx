import { useEffect, useState } from "react";

const PostList=()=>{
    const [posts,setPosts]=useState([])
    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/posts').then(
           (res)=>res.json ()
        ).then(
            (data)=>setPosts(data)

        )
    },[])
    return(
        <div>
            <h5>{posts.length}</h5>
        </div>
    )

}
export default PostList