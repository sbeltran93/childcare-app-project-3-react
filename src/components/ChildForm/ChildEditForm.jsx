import React, { useState, useEffect } from 'react';
import ChildForm from './ChildForm';

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;

const ChildEditForm = ({ child, onChildEdited, onCancel }) => {
  const [editedChild, setEditedChild] = useState(child);
  const [editing, setEditing] = useState(true);
  
  useEffect(() => {
    setEditedChild(child);
  }, [child]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedChild({ ...editedChild, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${BACKEND_URL}/childs/${child._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedChild),
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes('Child not found')) {
          alert('Child not found. Please try again.');
        } else {
        throw new Error(`Error updating child: ${errorText}`);
      }
      }

      const updatedChild = await res.json();
      onChildEdited(updatedChild);
    } catch (error) {
      console.error('Error updating child', error);
    }
  };

  const handleDelete = async () => {
    console.log("child object",child)
    const token = localStorage.getItem ('token');
    try {
        const res = await fetch(`${BACKEND_URL}/childs/${child._id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }, 
        });       
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Delete child failed: ${errorText}`);
        }
        // window.location.reload();
        // onChildEdited(null);
    } catch (error) {
        console.error('Error deleting child', error.message)
    }
};

  return (
    <>
  {editing ? (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Name:
        <input
          type="text"
          name="name"
          value={editedChild.name}
          onChange={handleChange}
          required
        />
      </label>
      <label htmlFor="number">
        Age:
        <input
          type="number"
          name="age"
          value={editedChild.age}
          onChange={handleChange}
          required
        />
      </label>
      <label htmlFor="notes">
        Notes:
        <textarea
          name="notes"
          value={editedChild.notes}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel}>Cancel</button>
      
    </form> 
    
    
    
  ) : (
    <p>Edit is not enabled</p>
  )}
  <button onClick={handleDelete} >Delete Child</button>
  </>
);
};

export default ChildEditForm;