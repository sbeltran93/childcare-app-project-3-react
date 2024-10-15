import React, { useState, useEffect } from 'react';
import axios from 'axios';

// imports

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;


const Newsfeed = ({ user, onPostAdded }) => {

  //states
const [ newsfeed, setNewsfeed ] = useState({content: ''});
const [ loading, setLoading ] = useState(true);
const [ error, setError ] = useState(null);
const [ message, setMessage ] = useState('');



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
    setMessage(`Post added: ${addedPost.content}`);
    setNewsfeed({ content: '' });
    onPostAdded(addedPost);

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
   

return (
  <div>
    <h1>Newsfeed</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="content"
        value={newsfeed.content}
        onChange={handleChange}
      />
      <button type="submit">Post</button>
    </form>
    {message && <p>{message}</p>}
  </div>
  
//form to make a post

//form to edit post

  
)
}
export default Newsfeed;