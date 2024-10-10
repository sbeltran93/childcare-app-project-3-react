import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Newsfeed = ({ childId }) => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get(`/newsfeeds/${childId}`);
        setFeeds(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchFeeds();
  }, [childId]);

  const handleAddFeed = async (content) => {
    try {
      const response = await axios.post('/newsfeeds', {
        child: childId,
        caregiver: `${user._id}`, 
        content,
      });
      setFeeds([...feeds, response.data]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateFeed = async (id, content) => {
    try {
      const response = await axios.put(`/newsfeeds/${id}`, { content });
      setFeeds(feeds.map((feed) => (feed._id === id ? response.data : feed)));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteFeed = async (id) => {
    try {
      await axios.delete(`/newsfeeds/${id}`);
      setFeeds(feeds.filter((feed) => feed._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!Array.isArray(feeds)) {
    return <div>No updates found</div>
  }

  return (
    <div>
      <h2>Add daily updaate {childId}</h2>
      <ul>
        {feeds.map((feed) => (
          <li key={feed._id}>
            <p>{feed.content}</p>
            <p>Posted by {feed.caregiver.name} on {feed.timeStamp}</p>
            <button onClick={() => handleUpdateFeed(feed._id, 'Updated content')}>Update</button>
            <button onClick={() => handleDeleteFeed(feed._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => handleAddFeed(e.target.content.value)}>
        <input type="text" name="content" placeholder="Add a new feed" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Newsfeed;