import React, { useState } from "react";

const Newsfeed = ({user}) => {
    const [content, setContent] = useState();
    const [message, setMessage] = useState('');


    
//     const handleSubmit = async (e) => {
//         e.prevenDefault();
//         const token = localStorage.getItem ('token');


//     }
//         const res = await fetch(`${BACKEND_URL}/newsfeeds/${user._id}`, {
//             method: 'PUT',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },        
//             body: JSON.stringify(editedUser),


// })
}