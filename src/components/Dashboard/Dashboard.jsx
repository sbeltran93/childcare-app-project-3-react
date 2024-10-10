import React, { useState } from "react";

const Dashboard = ({ user }) => {
    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    
    return (
        <main>
            <h1>Welcome, {user.username}</h1>
            <p>
                This is the dashboard for all your personal account information.
            </p>
            <h2>Account Details</h2>
            <h2>Parent name: {user.username}</h2>
            <h2>Role: {user.role}</h2>
            <h2>Email: {user.email}</h2>
            <h2>User Id: {user._id}</h2>
        </main>
    )
}

export default Dashboard;