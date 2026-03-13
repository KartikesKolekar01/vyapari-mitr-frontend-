import React, { useState, useEffect } from 'react';
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
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ownerExists, setOwnerExists] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    mobile: '',
    pin: '',
    confirmPin: '',
  });

  useEffect(() => {
    checkOwner();
  }, []);

  const checkOwner = async () => {
    try {
      const response = await authService.checkOwner();
      setOwnerExists(response.exists);
    } catch (error) {
      console.error('Error checking owner:', error);
    }
  };

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
    if (!formData.shopName || !formData.ownerName || !formData.mobile || !formData.pin) {
      setError('सर्व फील्ड भरा');
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

    if (formData.pin !== formData.confirmPin) {
      setError('पिन जुळत नाहीत');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        mobile: formData.mobile,
        pin: formData.pin,
      });

      if (response.success) {
        toast.success('नोंदणी यशस्वी! कृपया लॉगिन करा 🎉');
        navigate('/login');
      } else {
        setError(response.message || 'नोंदणी अयशस्वी');
      }
    } catch (error) {
      setError(error.message || 'नोंदणी करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  if (ownerExists) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <Paper sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom>
              मालक आधीच नोंदणीकृत आहे!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              फक्त एकच मालक नोंदणी करू शकतो.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              fullWidth
            >
              लॉगिन पेजवर जा
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
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
              नोंदणी
            </Typography>
            <Typography variant="body1" color="text.secondary">
              तुमच्या दुकानाची माहिती भरा
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
              id="shopName"
              label="दुकानाचे नाव"
              name="shopName"
              autoComplete="off"
              autoFocus
              value={formData.shopName}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="ownerName"
              label="मालकाचे नाव"
              name="ownerName"
              autoComplete="off"
              value={formData.ownerName}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="मोबाईल नंबर"
              name="mobile"
              autoComplete="off"
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
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPin"
              label="पिन पुन्हा टाका"
              type={showPassword ? 'text' : 'password'}
              id="confirmPin"
              autoComplete="off"
              value={formData.confirmPin}
              onChange={handleChange}
              inputProps={{ maxLength: 4 }}
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
              {loading ? 'नोंदणी होत आहे...' : 'नोंदणी करा'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                आधीच नोंदणी केली आहे?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#1E4A5F',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  लॉगिन करा
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;