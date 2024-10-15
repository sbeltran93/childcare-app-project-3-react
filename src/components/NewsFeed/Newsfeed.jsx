import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChildEditForm from '../ChildForm/ChildEditForm';
import ChildForm from '../ChildForm/ChildForm';
import EditNewsfeed from './EditNewsfeed';


const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;


const Newsfeed = ({ user, onPostAdded }) => {

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


const handleCancelEdit = () => {
  setEditingPost(null)
};

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


const handleChange = (e) => {
  const { name, value } = e.target;
  setNewsfeed({ ...newsfeed, [name]: value });
};
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

const onPostEdited = (editedPost) => {
  setPosts(posts.map((post) => (post._id === editedPost._id ? editedPost : post)));
  setEditingPost(null);
};
const handlePostDelete = (postId) => {
  setPosts(posts.filter(post => post._id !== postId));
};   

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
            <button type='button' onClick={() => handleEditPost(post)}>Edit Post</button>
          </div>
        ))}
      </ul>
    </div>
  </>
);
}
export default Newsfeed;