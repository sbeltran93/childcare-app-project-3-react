import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChildEditForm from '../ChildForm/ChildEditForm';
import ChildForm from '../ChildForm/ChildForm';
import EditNewsfeed from './EditNewsfeed';



const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;


const Newsfeed = ({ user, onPostAdded }) => {

const [ newsfeed, setNewsfeed ] = useState({ title:'', content: '', child: ''});
const [ posts, setPosts ] = useState([]);
const [ loading, setLoading ] = useState(true);
const [ error, setError ] = useState(null);
const [ message, setMessage ] = useState('');
const [editingPost, setEditingPost] = useState(null);
const [editedPost, setEditedPost] = useState(null);
const [children, setChildren] = useState([]);


useEffect(() => {
  const fetchPosts = async () => {
  const token = localStorage.getItem('token');
  console.log('Fetching posts with token:', token);
    try {
      const res = await fetch(`${BACKEND_URL}/newsfeeds`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      console.log('Response status for fetching posts:', res.status);
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await res.json();
      console.log('Fetched posts:', data);

      setPosts(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, []);

useEffect(() => {
  const fetchChildren = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BACKEND_URL}/childs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch children');
      }
      const data = await res.json();
      setChildren(data);
    } catch (error) {
      setError(error.message);
    }
  };
  fetchChildren();
}, []);

const handleEditPost = (post) => {
  setEditingPost(post);
};


const handleCancelEdit = () => {
  setEditingPost(null)
};


const handleChange = (e) => {
  const { name, value } = e.target;
  setNewsfeed({ ...newsfeed, [name]: value });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem ('token');

  if (user.role !== 'Caregiver') {
    setMessage('You are not authorized to post to the newsfeed');
    console.log('Unauthorized attempt to post, user role:', user.role);
    return;
  }

  console.log('Posting with content:', newsfeed.content, 'and child:', newsfeed.child);

  try {
    const res = await fetch(`${BACKEND_URL}/newsfeeds`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },        
      body: JSON.stringify({ 
        title: newsfeed.title,
        content: newsfeed.content,
        //caregiver: newsfeed.caregiver,
        child: newsfeed.child,
       }),
    });
    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error from server:', errorText);
      throw new Error('Post to newsfeed failed');
    }

    const addedPost = await res.json();
    console.log('Post added:', addedPost);


    setMessage(`Post added: ${addedPost.content}`);
    setNewsfeed({ title: '', content: '', child: '' });
    onPostAdded(addedPost);
    setPosts([...posts, addedPost])
  } catch (error) {
    console.error('Error in handleSubmit:', error.message);
    setMessage(`Error: ${error.message}`);
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
    <div className='newsfeed-form'>
      <h1>Newsfeed</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='title'
          value={newsfeed.title}
          onChange={handleChange}
          required
          placeholder='Enter title for post'
        />  
        <textarea
          name="content"
          value={newsfeed.content}
          onChange={handleChange}
          required
        />
        /* Dropdown to select a child */
        <select
          name="child"
          value={newsfeed.child}
          onChange={handleChange}
          required 
        >
          <option value="">Select a child</option>
          {children.map((child) => (
            <option key={child._id} value={child._id}>
              {child.name}
            </option>
          ))}
        </select>
        <button type="submit-post">Post</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {posts.map((post) => (
          <div key={post._id}>
            <h2 className='post-title'>{post.title}</h2>
            <ul><span className='post'>Post: {post.content}, </span></ul>
            <span className='post'>Post By: {post.caregiver.username}</span> 
            <span className='post'>For Child: {post.child.name}</span>
            <button type='post-button' onClick={() => handleEditPost(post)}>Edit Post</button>
          </div>
        ))}
      </ul>
    </div>
    {editingPost ? (
      <EditNewsfeed
        post={editingPost}
        onPostEdited={onPostEdited}
        onCancel={handleCancelEdit}
        onPostDelete={handlePostDelete}
      />
    ) : null}



  </>
);
}
export default Newsfeed;