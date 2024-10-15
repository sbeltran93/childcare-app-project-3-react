import React, { useState, useEffect } from "react";
import * as authService from '../../services/authService';
import ChildForm from "../ChildForm/ChildForm";
import ChildEditForm from "../ChildForm/ChildEditForm";

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;

const Dashboard = ({ user, setUser }) => {
    
    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingChild, setEditingChild] = useState(null);
    
    const handleEditChild = (child) => {
        setEditingChild(child);
    };
    const handleCancelEdit = () => {
        setEditingChild(null);
    };

    useEffect(() => {
        const fetchChildren = async () => {
          const token = localStorage.getItem('token');
          const response = await fetch(`${BACKEND_URL}/childs/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setChildren(data);
          setLoading(false);
        };
        fetchChildren();
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem ('token');
        try {
            const res = await fetch(`${BACKEND_URL}/users/${user._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },        
                body: JSON.stringify(editedUser),
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error('Update user failed');
        }
        const updatedUser = await res.json();
        setEditedUser(updatedUser);
        setUser(updatedUser);
        setEditing(false);
        } catch (error) {
            console.error('Error updating user', error.message);
        }  
    }
    const handleDelete = async () => {
        const token = localStorage.getItem ('token');
        try {
            const res = await fetch(`${BACKEND_URL}/users/${user._id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }, 
            });       
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Delete user failed: ${errorText}`);
            }
            authService.signout();
            setUser(null);
        } catch (error) {
            console.error('Error deleting user', error.message)
        }
    };
    const handleChildAdded = (addedChild) => {
        setChildren([...children, addedChild]);
        const token = localStorage.getItem ('token');
    };

    const onChildEdited = (editedChild) => {
        setChildren(children.map((child) => (child._id === editedChild._id ? editedChild : child)));
    };

    const handleChildDelete = (childId) => {
        setChildren(children.filter(child => child._id !== childId));
    };

    return(
        <main>
            <h1>Welcome, {user.username}</h1>
            <p>
                This is the dashboard for all your personal account information.</p>
    
                {editingChild ? (
    <ChildEditForm
        child={editingChild}
        onChildEdited={onChildEdited}
        onCancel={handleCancelEdit}
        onChildDelete={handleChildDelete}
    />
) : (
    <ChildForm
        user={user}
        onChildAdded={handleChildAdded}
        onChildEdited={onChildEdited}
    />
)}

<ul>
    {children.map((child) => (
        <div key={child._id}>
            <span>Name- {child.name},</span>
            <span>Age- {child.age},</span>
            <span>Notes- {child.notes}</span>
            <span>Child Id- {child._id}</span>
            <button onClick={() => handleEditChild(child)}>Edit Child</button>
        </div>
    ))}
</ul>
            
            <h2>Account Details:</h2>

            <button onClick={() => { setEditedUser(user); setEditing(true); }}>Edit User</button>
            <button onClick={handleDelete}>Delete Account</button>

            {editing ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Parent Name:
                        <input 
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleChange} 
                    />
                    </label>
                    <label>
                        Role:
                        <input 
                        type="text"
                        name="role"
                        value={editedUser.role}
                        onChange={handleChange} 
                    />
                    </label>
                    <label>
                        Email:
                        <input 
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange} 
                    />
                    </label>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)}>Cancel</button>
                </form>
            ) : (
            
                <div>
                    <h2>Parent name: {user.username}</h2>
                    <h3>Role- {user.role}</h3>
                    <h3>Email- {user.email}</h3>
                    <h3>User Id- {user._id}</h3>
                    
                </div>    
        )}
        </main>
    );
};

export default Dashboard;