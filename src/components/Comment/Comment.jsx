import React, { useState } from "react";

const Comment = ({content}) => {
    const [comment, setComment] = useState();
    const [message, setMessage] = useState('');


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const token = localStorage.getItem ('token');
    //     try {
    //         const res = await fetch(`${BACKEND_URL}/comments/${user._id}`, {
    //             method: 'PUT',
    //             headers: { 
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },        
    //             body: JSON.stringify(editedUser),
    //     });
}