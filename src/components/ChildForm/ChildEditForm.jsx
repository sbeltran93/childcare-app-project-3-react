import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;

const ChildEditForm = ({ child, onChildEdited, onCancel, onChildDelete }) => {
  const [editedChild, setEditedChild] = useState(child);
  const [editing, setEditing] = useState(true);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
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
    const confirmed = window.confirm('Are you sure you want to delete this child?');
    
    if (!confirmed) {
      return;
    }
    
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

        setDeleteSuccess(true);
        onChildDelete([child._id]);

        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);

    } catch (error) {
        console.error('Error deleting child', error.message)
    }
};
const successMessageStyle = {
  backgroundColor: '#4CAF50', 
  color: 'white',
  padding: '3px',
  borderRadius: '5px',
  textAlign: 'center',
  marginTop: '15px',
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
      <button type="cancel" onClick={onCancel}>Cancel</button>    
    </form> 
     
  ) : (
    <p>Edit is not enabled</p>
  )}
  <button type='button' onClick={handleDelete} >Delete Child</button>
  {deleteSuccess && (
      <div style={successMessageStyle}>
        <p>Child successfully deleted!</p>
      </div>
    )}
  </>
);
};

export default ChildEditForm;