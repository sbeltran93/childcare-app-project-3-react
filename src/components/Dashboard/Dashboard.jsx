import React, { useState } from "react";
import * as authService from '../../services/authService';
import ChildForm from "../ChildForm/ChildForm";

const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;

const Dashboard = ({ user, setUser, child, setChild }) => {
    
    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);
    // const [child, setChild] = useState('');


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
            // res.redirected('/');
        } catch (error) {
            console.error('Error deleting user', error.message)
        }
    };

    return (
        <main>
            <h1>Welcome, {user.username}</h1>
            <p>
                This is the dashboard for all your personal account information.</p>
                <h2>Add your child</h2>
            <ChildForm user={user} setChild={setChild} />
            <h2>Account Details</h2>

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
                    <h2>Role: {user.role}</h2>
                    <h2>Email: {user.email}</h2>
                    <h2>User Id: {user._id}</h2>
                    <h2>Child: {child.name}</h2>

                    <button onClick={() => { setEditedUser(user); setEditing(true); }}>Edit</button>
                    <button onClick={handleDelete}>Delete Account</button>
                </div>    
        )}
        </main>
    );
};

export default Dashboard;