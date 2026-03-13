import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import customerService from '../../services/customerService';
import transactionService from '../../services/transactionService';

const CustomerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const fetchCustomerData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch customer details
      const customerRes = await customerService.getCustomerById(id);
      if (!customerRes.success) {
        throw new Error(customerRes.message || 'ग्राहक सापडला नाही');
      }
      setCustomer(customerRes.data);

      // Fetch customer transactions
      const transRes = await transactionService.getCustomerTransactions(id);
      if (transRes.success) {
        setTransactions(transRes.data || []);
      }

    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err.message || 'ग्राहक डेटा मिळवताना त्रुटी');
      toast.error('ग्राहक डेटा लोड करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredit = () => {
    navigate('/transactions/credit', { state: { customerId: id, customerName: customer?.name } });
  };

  const handleAddPayment = () => {
    navigate('/transactions/payment', { state: { customerId: id, customerName: customer?.name } });
  };

  const getTransactionTypeIcon = (type) => {
    return type === 'CREDIT' ? <ReceiptIcon /> : <PaymentIcon />;
  };

  const getTransactionTypeColor = (type) => {
    return type === 'CREDIT' ? 'error' : 'success';
  };

  const getTransactionTypeText = (type) => {
    return type === 'CREDIT' ? 'उधारी' : 'पैसे भरले';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => navigate('/customers')}>
            ग्राहक यादीकडे जा
          </Button>
        }>
          {error || 'ग्राहक सापडला नाही'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/customers')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          ग्राहक तपशील
        </Typography>
      </Box>

      {/* Customer Info Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 3,
                }}
              >
                {customer.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {customer.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {customer.mobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                      <Typography>{customer.mobile}</Typography>
                    </Box>
                  )}
                  {customer.village && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
                      <Typography>{customer.village}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {customer.address && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                <strong>पत्ता:</strong> {customer.address}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              ग्राहक दिनांक: {format(new Date(customer.createdAt), 'dd MMMM yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  आर्थिक माहिती
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    एकूण उधारी
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    ₹ {customer.totalCredit?.toLocaleString('mr-IN') || 0}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    एकूण भरले
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    ₹ {customer.totalPaid?.toLocaleString('mr-IN') || 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    थकबाकी
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹ {customer.balance?.toLocaleString('mr-IN') || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<ReceiptIcon />}
                onClick={handleAddCredit}
              >
                उधारी
              </Button>
              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<PaymentIcon />}
                onClick={handleAddPayment}
              >
                पैसे भरा
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/customers/edit/${id}`)}
              >
                संपादन
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Transactions Section */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            व्यवहार इतिहास
          </Typography>
          <Chip
            icon={<HistoryIcon />}
            label={`एकूण व्यवहार: ${transactions.length}`}
            variant="outlined"
          />
        </Box>

        {transactions.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            कोणतेही व्यवहार नाहीत
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>दिनांक</TableCell>
                  <TableCell>प्रकार</TableCell>
                  <TableCell>रक्कम</TableCell>
                  <TableCell>देय तारीख</TableCell>
                  <TableCell>वर्णन</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      {format(new Date(transaction.transactionDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getTransactionTypeIcon(transaction.type)}
                        label={getTransactionTypeText(transaction.type)}
                        color={getTransactionTypeColor(transaction.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      ₹ {transaction.amount?.toLocaleString('mr-IN')}
                    </TableCell>
                    <TableCell>
                      {transaction.dueDate 
                        ? format(new Date(transaction.dueDate), 'dd/MM/yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={transaction.description || 'कोणतेही वर्णन नाही'}>
                        <Typography noWrap sx={{ maxWidth: 200 }}>
                          {transaction.description || '-'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default CustomerDetail;