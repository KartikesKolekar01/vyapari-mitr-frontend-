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
  Card,
  CardContent,
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
  description: yup
    .string()
    .max(500, 'वर्णन ५०० अक्षरांपेक्षा कमी असावे'),
});

const AddPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerBalance, setCustomerBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const preselectedCustomer = location.state?.customerId;

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (preselectedCustomer && customers.length > 0) {
      const customer = customers.find(c => c.id === preselectedCustomer);
      if (customer) {
        setSelectedCustomer(customer);
        formik.setFieldValue('customerId', customer.id);
        setCustomerBalance(customer.balance || 0);
      }
    }
  }, [customers, preselectedCustomer]);

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

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    if (newValue) {
      formik.setFieldValue('customerId', newValue.id);
      setCustomerBalance(newValue.balance || 0);
    } else {
      formik.setFieldValue('customerId', '');
      setCustomerBalance(0);
    }
  };

  const formik = useFormik({
    initialValues: {
      customerId: preselectedCustomer || '',
      amount: '',
      transactionDate: new Date(),
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.amount > customerBalance) {
        setError(`भरलेली रक्कम थकबाकीपेक्षा जास्त असू शकत नाही. थकबाकी: ₹ ${customerBalance}`);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const response = await transactionService.addPayment({
          customerId: values.customerId,
          amount: values.amount,
          transactionDate: values.transactionDate,
          description: values.description,
        });

        if (response.success) {
          toast.success('पैसे यशस्वीरित्या नोंदले!');
          navigate('/transactions');
        } else {
          setError(response.message || 'पेमेंट नोंदवताना त्रुटी');
        }
      } catch (err) {
        console.error('Error adding payment:', err);
        setError(err.message || 'पेमेंट नोंदवताना त्रुटी');
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
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'success.main' }}>
            पैसे भरले
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
                    option.name ? `${option.name} (थकबाकी: ₹${option.balance?.toLocaleString('mr-IN') || 0})` : ''
                  }
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
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

              {selectedCustomer && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {selectedCustomer.name}
                      </Typography>
                      <Typography variant="body2">
                        मोबाईल: {selectedCustomer.mobile || 'नाही'}
                      </Typography>
                      <Typography variant="body2">
                        गाव: {selectedCustomer.village || 'नाही'}
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                        थकबाकी: ₹ {selectedCustomer.balance?.toLocaleString('mr-IN') || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

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
                  label="तारीख"
                  value={formik.values.transactionDate}
                  onChange={(date) => formik.setFieldValue('transactionDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="वर्णन"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
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
                    color="success"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'पेमेंट सेव करा'}
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

export default AddPayment;