import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChildEditForm from '../ChildForm/ChildEditForm';
import ChildForm from '../ChildForm/ChildForm';
import EditNewsfeed from './EditNewsfeed';

// imports

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;


const Newsfeed = ({ user, onPostAdded }) => {

  //states
const [ newsfeed, setNewsfeed ] = useState({content: ''});
const [ posts, setPosts ] = useState([]);
const [ loading, setLoading ] = useState(true);
const [ error, setError ] = useState(null);
const [ message, setMessage ] = useState('');
const [editingPost, setEditingPost] = useState(null);
const [editedPost, setEditedPost] = useState(null);

const handleEditPost = (post) => {
  setEditingPost(post);
};

//handelCancelEdit to setEditingPost to null
const handleCancelEdit = () => {
  setEditingPost(null)
};
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

//function to handle change

const handleChange = (e) => {
  const { name, value } = e.target;
  setNewsfeed({ ...newsfeed, [name]: value });
};


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
    setPosts([...posts, addedPost])
  } 
  catch (error) {
    setMessage(error.message);
  }
};
// const handleEditSubmit = async (e) => {
//   e.preventDefault();
//   const token = localStorage.getItem ('token');
//   const updatedPost = await res.json();
//   setEditedPost(updatedPost);
//   setPosts(updatedPost);
//   setEditingPost(false);
// }



//( WORK ON THIS AFTER I GET NEWSFEED TO POST A POST!)/////
//handle editing post feed id,setEditingPost to post



//updated post handleChange
// const onPostEditing = (editingPost) => {
//   setPosts(posts.map((post) => (post._id === editingPost._id ? editingPost: post)));
// }
const onPostEdited = (editedPost) => {
  setPosts(posts.map((post) => (post._id === editedPost._id ? editedPost : post)));
  setEditingPost(null); // Clear editing state after editing
};


 
// deleting post handleDelete
//( WORK ON THIS AFTER I GET NEWSFEED TO POST A POST!)//////  
const handlePostDelete = (postId) => {
  setPosts(posts.filter(post => post._id !== postId));
};   


//form to make a post
return (
  <>
    {editingPost ? (
      <EditNewsfeed
        post={editingPost}
        onPostEdited={onPostEdited}
        onCancel={handleCancelEdit}
        onPostDelete={handlePostDelete}
      />
    ) : null}

    <div>
      <h1>Newsfeed</h1>
      <form onSubmit={handleSubmit}>
        <textarea
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
          <div key={post._id}>
            <span>Post: {post.content}, </span>
            <span>Post By: {post.caregiver}</span>
            <button onClick={() => handleEditPost(post)}>Edit Post</button>
          </div>
        ))}
      </ul>
    </div>
  </>
);
}
export default Newsfeed;