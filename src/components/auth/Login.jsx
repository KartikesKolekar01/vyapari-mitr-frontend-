import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    mobile: '',
    pin: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.mobile || !formData.pin) {
      setError('कृपया मोबाईल नंबर आणि पिन टाका');
      setLoading(false);
      return;
    }

    if (formData.mobile.length !== 10) {
      setError('मोबाईल नंबर १० अंकी असावा');
      setLoading(false);
      return;
    }

    if (formData.pin.length !== 4) {
      setError('पिन ४ अंकी असावा');
      setLoading(false);
      return;
    }

    try {
      const response = await login(formData);
      if (response.success) {
        toast.success('लॉगिन यशस्वी! 🚀');
        navigate('/');
      } else {
        setError(response.message || 'लॉगिन अयशस्वी');
      }
    } catch (error) {
      setError(error.message || 'लॉगिन करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                mb: 1,
              }}
            >
              व्यापारी मित्र
            </Typography>
            <Typography variant="body1" color="text.secondary">
              तुमच्या दुकानाचा हिशोब सोप्या पद्धतीने
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="मोबाईल नंबर"
              name="mobile"
              autoComplete="off"
              autoFocus
              value={formData.mobile}
              onChange={handleChange}
              inputProps={{ maxLength: 10 }}
              helperText="१० अंकी मोबाईल नंबर"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="pin"
              label="पिन"
              type={showPassword ? 'text' : 'password'}
              id="pin"
              autoComplete="off"
              value={formData.pin}
              onChange={handleChange}
              inputProps={{ maxLength: 4 }}
              helperText="४ अंकी पिन"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
              disabled={loading}
            >
              {loading ? 'लॉगिन होत आहे...' : 'लॉगिन'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                नवीन व्यापारी आहात?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#1E4A5F',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  नोंदणी करा
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;