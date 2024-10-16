import React, { useState, useEffect } from "react";
import Newsfeed from "./Newsfeed";

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;

const EditNewsfeed = ({ post, onPostEdited, onCancel, onPostDelete }) => {
    const [editedPost, setEditedPost] = useState(post);
    const [editing, setEditing] = useState(true);

    useEffect(() => {
        setEditedPost(post);
    }, [post]);

    const handleEdit = () => {
      setEditing(true);
  };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setEditedPost({ ...editedPost, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BACKEND_URL}/newsfeeds/${post._id}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editedPost),
            });
    
            if (!res.ok) {
                const errorText = await res.text();
                if (errorText.includes('Post not found')) {
                alert('Post not found. Please try again.');
                } else {
                throw new Error(`Error updating Post: ${errorText}`);
            }
            }
          const updatedPost = await res.json();
          onPostEdited(updatedPost);
        } catch (error) {
          console.error('Error updating post', error);
        }
    }
    const handleDelete = async () => {
        const token = localStorage.getItem ('token');
        try {
            const res = await fetch(`${BACKEND_URL}/newsfeeds/${post._id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }, 
                
            });       
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Delete post failed: ${errorText}`);
            }
            onPostDelete([post._id]);
            
        } catch (error) {
            console.error('Error deleting post', error.message)
        }
    };

    return (
        <>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="content">
            Edit Post:
            <textarea
              name="content"
              value={editedPost.content || ''}
              onChange={handleChange}
              required
            />
          </label>
          <button type="save-post-edit">Save Changes</button>
          <button type="cancel-post-edit" onClick={onCancel}>Cancel</button>
          
        </form> 
        
      ) : (
        <p>Edit is not enabled</p>
      )}
      <button type='button' onClick={handleDelete} >Delete Post</button>
      </>
    );
    }
export default EditNewsfeed;