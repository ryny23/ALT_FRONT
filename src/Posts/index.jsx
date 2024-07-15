import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Posts = () => {
    const[posts, setPosts] = useState([]);
    useEffect(() => {
        let url = 'http://localhost/alt/wp-json/wp/v2/posts'
        axios.get(url).then((res)=> {
            setPosts(res.data);
            });
    }, []);
    console.log('posts', posts);
  return (
    <>
    {
        posts && posts.map((posts) => {
            console.log('posts', posts);
            return <p key={post.id}>{post.title.rendered}</p>
        })
    }
    </>
  )
}

export default Posts