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
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import transactionService from '../../services/transactionService';
import customerService from '../../services/customerService';

const validationSchema = yup.object({
  customerId: yup
    .number()
    .required('ग्राहक निवडा')
    .positive('ग्राहक निवडा'),
  amount: yup
    .number()
    .required('रक्कम आवश्यक आहे')
    .positive('रक्कम ० पेक्षा जास्त असावी')
    .max(1000000, 'रक्कम १० लाख पेक्षा कमी असावी'),
  dueDate: yup
    .date()
    .nullable()
    .min(new Date(), 'देय तारीख आज किंवा उद्याची असावी'),
  description: yup
    .string()
    .max(500, 'वर्णन ५०० अक्षरांपेक्षा कमी असावे'),
});

const AddCredit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const preselectedCustomer = location.state?.customerId;
  const preselectedCustomerName = location.state?.customerName;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      if (response.success) {
        setCustomers(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('ग्राहक यादी मिळवताना त्रुटी');
    } finally {
      setInitialLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      customerId: preselectedCustomer || '',
      amount: '',
      dueDate: null,
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        const response = await transactionService.addCredit({
          customerId: values.customerId,
          amount: values.amount,
          dueDate: values.dueDate,
          description: values.description,
        });

        if (response.success) {
          toast.success('उधारी यशस्वीरित्या नोंदली!');
          navigate('/transactions');
        } else {
          setError(response.message || 'उधारी नोंदवताना त्रुटी');
        }
      } catch (err) {
        console.error('Error adding credit:', err);
        setError(err.message || 'उधारी नोंदवताना त्रुटी');
      } finally {
        setLoading(false);
      }
    },
  });

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'error.main' }}>
            नवीन उधारी
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => 
                    option.name ? `${option.name} (${option.mobile || option.village || 'गाव नाही'})` : ''
                  }
                  value={customers.find(c => c.id === formik.values.customerId) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('customerId', newValue?.id || '');
                  }}
                  onBlur={() => formik.setFieldTouched('customerId', true)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ग्राहक निवडा *"
                      error={formik.touched.customerId && Boolean(formik.errors.customerId)}
                      helperText={formik.touched.customerId && formik.errors.customerId}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="amount"
                  name="amount"
                  label="रक्कम (₹) *"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="देय तारीख"
                  value={formik.values.dueDate}
                  onChange={(date) => formik.setFieldValue('dueDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.dueDate && Boolean(formik.errors.dueDate),
                      helperText: formik.touched.dueDate && formik.errors.dueDate,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="वर्णन (कशासाठी उधारी?)"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/transactions')}
                    disabled={loading}
                  >
                    रद्द करा
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'उधारी सेव करा'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default AddCredit;