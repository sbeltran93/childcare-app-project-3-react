import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
    email: '',
    role: 'parent', 
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRole(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const newUserResponse = await authService.signup(formData)
        props.setUser(newUserResponse.user);
        navigate('/')
      } catch (err) {
        updateMessage(err.message)
      }
    }

  const { username, password, passwordConf, email } = formData;

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf);
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            id="username"
            value={username}
            name="username"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            name="email"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            name="role"
            onChange={(e) => handleChange(e)}>
                <option value=''>Select Role</option>
                <option value='Parent'>Parent</option>
                <option value='Caregiver'>Caregiver</option>
            </select>
        </div>
        <div>
          <button>Sign Up</button>
          <Link to="/">
            <button>Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignupForm;
