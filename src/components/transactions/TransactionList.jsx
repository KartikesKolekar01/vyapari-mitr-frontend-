import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import transactionService from '../../services/transactionService';

const TransactionList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [stats, setStats] = useState({
    totalCredit: 0,
    totalPayment: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter === 'today') {
      fetchTodayTransactions();
    } else if (filter === 'pending') {
      fetchPendingTransactions();
    } else {
      fetchAllTransactions();
    }
  }, [location.search]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType, startDate, endDate]);

  const fetchAllTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      // For demo, we'll fetch today's and combine with pending
      const [todayRes, pendingRes] = await Promise.all([
        transactionService.getTodayTransactions(),
        transactionService.getPendingPayments(),
      ]);

      let allTransactions = [];
      
      if (todayRes.success) {
        allTransactions = [...allTransactions, ...(todayRes.data || [])];
      }
      
      if (pendingRes.success) {
        const pendingIds = new Set(pendingRes.data?.map(t => t.id) || []);
        const newPending = (pendingRes.data || []).filter(t => !pendingIds.has(t.id));
        allTransactions = [...allTransactions, ...newPending];
      }

      setTransactions(allTransactions);
      calculateStats(allTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'व्यवहार मिळवताना त्रुटी');
      toast.error('व्यवहार डेटा लोड करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await transactionService.getTodayTransactions();
      if (response.success) {
        setTransactions(response.data || []);
        calculateStats(response.data || []);
      } else {
        setError(response.message || 'व्यवहार मिळवताना त्रुटी');
      }
    } catch (err) {
      console.error('Error fetching today transactions:', err);
      setError(err.message || 'व्यवहार मिळवताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await transactionService.getPendingPayments();
      if (response.success) {
        setTransactions(response.data || []);
        calculateStats(response.data || []);
      } else {
        setError(response.message || 'व्यवहार मिळवताना त्रुटी');
      }
    } catch (err) {
      console.error('Error fetching pending transactions:', err);
      setError(err.message || 'व्यवहार मिळवताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.customer?.name?.toLowerCase().includes(term) ||
          t.description?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Date filter
    if (startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.transactionDate) >= startDate
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (t) => new Date(t.transactionDate) <= endDate
      );
    }

    setFilteredTransactions(filtered);
  };

  const calculateStats = (transList) => {
    const credit = transList
      .filter((t) => t.type === 'CREDIT')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const payment = transList
      .filter((t) => t.type === 'PAYMENT')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    setStats({
      totalCredit: credit,
      totalPayment: payment,
      totalTransactions: transList.length,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTransactionIcon = (type) => {
    return type === 'CREDIT' ? <ReceiptIcon /> : <PaymentIcon />;
  };

  const getTransactionColor = (type) => {
    return type === 'CREDIT' ? 'error' : 'success';
  };

  const getTransactionText = (type) => {
    return type === 'CREDIT' ? 'उधारी' : 'पैसे भरले';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            व्यवहार
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/transactions/credit')}
            >
              नवीन उधारी
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<PaymentIcon />}
              onClick={() => navigate('/transactions/payment')}
            >
              नवीन पेमेंट
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  एकूण व्यवहार
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {stats.totalTransactions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom>एकूण उधारी</Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  ₹ {stats.totalCredit.toLocaleString('mr-IN')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom>एकूण पेमेंट</Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  ₹ {stats.totalPayment.toLocaleString('mr-IN')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="ग्राहकानुसार शोधा..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>प्रकार</InputLabel>
                <Select
                  value={filterType}
                  label="प्रकार"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">सर्व</MenuItem>
                  <MenuItem value="CREDIT">उधारी</MenuItem>
                  <MenuItem value="PAYMENT">पैसे भरले</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <DatePicker
                label="सुरुवात तारीख"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <DatePicker
                label="शेवट तारीख"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                fullWidth
              >
                फिल्टर क्लिअर करा
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Transactions Table */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ color: 'white' }}>दिनांक</TableCell>
                  <TableCell sx={{ color: 'white' }}>ग्राहक</TableCell>
                  <TableCell sx={{ color: 'white' }}>प्रकार</TableCell>
                  <TableCell sx={{ color: 'white' }}>रक्कम</TableCell>
                  <TableCell sx={{ color: 'white' }}>देय तारीख</TableCell>
                  <TableCell sx={{ color: 'white' }}>वर्णन</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm || filterType !== 'all' || startDate || endDate
                          ? 'कोणताही व्यवहार सापडला नाही'
                          : 'कोणतेही व्यवहार नाहीत'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          {format(new Date(transaction.transactionDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {transaction.customer?.name || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getTransactionIcon(transaction.type)}
                            label={getTransactionText(transaction.type)}
                            color={getTransactionColor(transaction.type)}
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
                          <Tooltip title={transaction.description || ''}>
                            <Typography noWrap sx={{ maxWidth: 200 }}>
                              {transaction.description || '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="प्रति पृष्ठ:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} पैकी ${count}`}
          />
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default TransactionList;