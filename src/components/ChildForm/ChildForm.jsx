import React, { useState } from "react";

const ChildForm = ({user}) => {
    const [child, setChild] = useState({ name: '', age: '', notes: ''  });
    const [message, setMessage] = useState('');


const handleChange = (e) => {
    const { name, value } = e.target;
    setChild({ ...child, [name]: value });
};

const handleSubmit = async (e) => {
    e.prevenDefault();
    const token = localStorage.getItem ('token');

try {
    const res = await fetch(`${BACKEND_URL}/childs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,    
        },
        body: JSON.stringify({ ...child, caregiver: user._id }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error adding child: ${errorText}`);
    }
    const addedChild = await res.json();
    setMessage(`Child added: ${addedChild.name}`);
    setChild({ name: '', age: '', notes:'' });
    onChildAdded(addedChild);
} catch (error) {
    setMessage(error.message)
}
};
return (
    <div>
      <h1>Add your Child</h1>
      <form onSubmit={handleSubmit}>
          <label>Name:
          <input
            type="text"
            name="name"
            value={child.name}
            onChange={handleChange} required />
          </label>
          <label>Age:
          <input
            type="number"
            name="age"
            value={child.age}
            onChange={handleChange} required />
          </label>
          <label>Notes:
          <textarea
            name="notes"
            value={child.notes}
            onChange={handleChange} required />
          </label>
          <button type='submit'>Add Child</button>
          </form>
          {message && <p>{message}</p>}
        </div>   
    )
};
    export default ChildForm;