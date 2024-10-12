import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SweetAlert from "sweetalert2";

interface LoginProps {
  onLogin: () => void; 
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      onLogin(); 
      navigate('/admin');
    } else {
      setError('Invalid credentials');
      SweetAlert.fire("Error", "Invalid credentials", "error");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f0f4f8"
    >
      <Paper
        elevation={5}
        style={{
          padding: '32px',
          borderRadius: '15px',
          width: '400px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h4" align="center" style={{ color: '#3f51b5' }}>
          Admin Login
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          style={{ marginTop: '20px', borderRadius: '25px' }}
          fullWidth
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
