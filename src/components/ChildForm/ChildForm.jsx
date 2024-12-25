import React, { useState } from "react";
import * as authService from "../../services/authService";

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;


const ChildForm = ({ user, onChildAdded }) => {
    const [child, setChild] = useState({ name: '', age: '', notes: '', parents: [], });
    const [message, setMessage] = useState('');
    
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setChild({ ...child, [name]: value });
    };

    const handleAddParent = (e) => {
      e.preventDefault();
      const parentId = prompt("Enter parent ID");
      if (parentId) {
        setChild((prevChild) => ({
          ...prevChild,
          parents: [...prevChild.parents, parentId],
        }));
      }
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      console.log('Child data being submitted:', child);
  
       try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${BACKEND_URL}/childs`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ 
              // ...child,
              // caregiver: user._id,
              name: child.name, 
              age: child.age, 
              notes: child.notes, 
              parents: child.parents 
            }),
          });
  
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Error adding child: ${errorText}`);
          }

          const addedChild = await res.json();
          onChildAdded(addedChild);
          setMessage(`Child added: ${addedChild.name}`);
          setChild({ 
            name: '', 
            age: '', 
            notes: '',
            parents: [],
           });
          } catch (error) {
            setMessage(`Error adding child: ${error.message}`);
      }
    };
    return (
      <div className="add-child-form">
        <h3>Add Your Child</h3>
          <h4>Please fill out the form below</h4>
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
          <button type="button" onClick={handleAddParent}>
          Add Parent
        </button>
        {child.parents.length > 0 && (
          <div>
            <h4>Assigned Parents:</h4>
            <ul>
              {child.parents.map((parentId, index) => (
                <li key={index}>Parent ID: {parentId}</li>
              ))}
            </ul>
          </div>
        )}
          <button type="submit">Add Child</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  };
  
  export default ChildForm;