import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import customerService from '../../services/customerService';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('नाव आवश्यक आहे')
    .min(2, 'नाव कमीत कमी २ अक्षरी असावे'),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'मोबाईल नंबर १० अंकी असावा')
    .nullable(),
  address: yup
    .string()
    .nullable(),
  village: yup
    .string()
    .nullable(),
});

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      address: '',
      village: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        let response;
        if (id) {
          response = await customerService.updateCustomer(id, values);
        } else {
          response = await customerService.createCustomer(values);
        }

        if (response.success) {
          toast.success(id ? 'ग्राहक माहिती अद्यावत केली!' : 'ग्राहक यशस्वीरित्या जोडला गेला!');
          navigate('/customers');
        } else {
          setError(response.message || 'कृती अयशस्वी');
        }
      } catch (err) {
        console.error('Form submission error:', err);
        setError(err.message || 'कृती करताना त्रुटी');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await customerService.getCustomerById(id);
      if (response.success) {
        formik.setValues(response.data);
      } else {
        setError('ग्राहक डेटा मिळवताना त्रुटी');
      }
    } catch (err) {
      console.error('Error fetching customer:', err);
      setError(err.message || 'ग्राहक डेटा मिळवताना त्रुटी');
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          {id ? 'ग्राहक माहिती संपादन' : 'नवीन ग्राहक'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="ग्राहकाचे नाव *"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="mobile"
                name="mobile"
                label="मोबाईल नंबर"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="village"
                name="village"
                label="गाव"
                value={formik.values.village}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="पत्ता"
                multiline
                rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/customers')}
                  disabled={loading}
                >
                  रद्द करा
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (id ? 'अद्यावत करा' : 'सेव करा')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CustomerForm;