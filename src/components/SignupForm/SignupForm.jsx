import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import * as authService from '../../services/authService';

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [role, setRole] = useState('parent');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
    email: '',
    role: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="name"
            value={username}
            name="username"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            name="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            name="role"
            onChange={(handleChange)}>
                <option value='Parent'>Parent</option>
                <option value='Caregiver'>Caregiver</option>
            </select>
        </div>
        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <Link to="/">
            <button>Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignupForm;
