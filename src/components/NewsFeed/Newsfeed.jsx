import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChildEditForm from '../ChildForm/ChildEditForm';
import ChildForm from '../ChildForm/ChildForm';

// imports

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;


const Newsfeed = ({ user, onPostAdded }) => {

  //states
const [ newsfeed, setNewsfeed ] = useState({content: ''});
const [ posts, setPosts ] = useState([]);
const [ loading, setLoading ] = useState(true);
const [ error, setError ] = useState(null);
const [ message, setMessage ] = useState('');

//display all posts

useEffect(() => {
  const fetchPosts = async () => {
  const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BACKEND_URL}/newsfeeds`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setPosts([data]);
      } else {
        setPosts(data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, []);



// handleSubmit to post by userid
const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem ('token');
  try {
    const res = await fetch(`${BACKEND_URL}/newsfeeds`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },    
      //unsure of line below is correct    
      body: JSON.stringify({ ...newsfeed, caregiver: user._id }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error('Post to newsfeed failed');
    }
    const addedPost = await res.json();
    setMessage(`Post added: ${addedPost.newsFeed.content}`);
    setNewsfeed({ content: '' });
    onPostAdded(addedPost);
    setPosts([...posts, addedPost])
  } catch (error) {
    setMessage(error.message);
  }
};



//function to handle change

const handleChange = (e) => {
  const { name, value } = e.target;
  setNewsfeed({ ...newsfeed, [name]: value });
};


//( WORK ON THIS AFTER I GET NEWSFEED TO POST A POST!)/////
//handle editing post feed id,setEditingPost to post


//handelCancelEdit to setEditingPost to null
  

//updated post handleChange

 
// deleting post handleDelete
//( WORK ON THIS AFTER I GET NEWSFEED TO POST A POST!)//////  
   
//form to make a post
return (
  <div>
    <h1>Newsfeed</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="content"
        value={newsfeed.content}
        onChange={handleChange}
        required
      />
      <button type="submit">Post</button>
    </form>
    {message && <p>{message}</p>}
    <ul>
      {posts.map((post) => (
        <div key={post._id}>Post: {post.content}, Post By:{post.caregiver}</div> 
      ))}
    </ul>
  </div>
//form to edit post on new jsx page
  )
}
export default Newsfeed;