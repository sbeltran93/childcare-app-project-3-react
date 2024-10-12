import React, { useState } from "react";
import * as authService from "../../services/authService";

// const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;
const BACKEND_URL = 'http://localhost:3000';

const ChildForm = ({ user, onChildAdded, childToEdit, onChildEdited }) => {
    const [child, setChild] = useState(childToEdit ? childToEdit : { name: '', age: '', notes: '' });
    const [message, setMessage] = useState('');
    const [editing, setEditing] = useState(!!childToEdit);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setChild({ ...child, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
  
      try {
        if (editing) {
          const res = await fetch(`${BACKEND_URL}/childs/${child.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(child),
          });
  
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error editing child: ${errorText}`);
          }
  
          const editedChild = await res.json();
          setMessage(`Child edited: ${editedChild.name}`);
          onChildEdited(editedChild);
        } else {
          const res = await fetch(`${BACKEND_URL}/childs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...child, caregiver: user._id }),
          });
  
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error adding child: ${errorText}`);
          }
  
          const addedChild = await res.json();
          setMessage(`Child added: ${addedChild.name}`);
          setChild({ name: '', age: '', notes: '' });
          onChildAdded(addedChild);
        }
      } catch (error) {
        setMessage(error.message);
      }
    };
  
    return (
      <div>
        <h1>{editing ? 'Edit Child' : 'Add Child'}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={child.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={child.age}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Notes:
            <textarea
              name="notes"
              value={child.notes}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">{editing ? 'Save Changes' : 'Add Child'}</button>
          {childToEdit && (
            <button onClick={() => handleEditChild(childToEdit)}>Edit</button>
          )}
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  };
  
  export default ChildForm;