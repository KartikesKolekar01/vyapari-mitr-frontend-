import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import customerService from '../../services/customerService';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, filterType, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await customerService.getAllCustomers();
      if (response.success) {
        setCustomers(response.data || []);
      } else {
        setError(response.message || 'ग्राहक यादी मिळवताना त्रुटी');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'ग्राहक यादी मिळवताना त्रुटी');
      toast.error('ग्राहक डेटा लोड करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.mobile?.includes(term) ||
          c.village?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (filterType === 'withBalance') {
      filtered = filtered.filter((c) => c.balance > 0);
    } else if (filterType === 'noBalance') {
      filtered = filtered.filter((c) => c.balance === 0);
    } else if (filterType === 'highBalance') {
      filtered = filtered.filter((c) => c.balance > 5000);
    }

    setFilteredCustomers(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (type) => {
    setFilterType(type);
    setPage(0);
    handleFilterClose();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`तुम्हाला ${name} हा ग्राहक हटवायचा आहे का?`)) {
      return;
    }

    try {
      const response = await customerService.deleteCustomer(id);
      if (response.success) {
        toast.success('ग्राहक यशस्वीरित्या हटवला!');
        fetchCustomers();
      } else {
        toast.error(response.message || 'ग्राहक हटवताना त्रुटी');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error(err.message || 'ग्राहक हटवताना त्रुटी');
    }
  };

  const getBalanceColor = (balance) => {
    if (balance === 0) return 'success';
    if (balance < 1000) return 'warning';
    if (balance < 5000) return 'error';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            ग्राहक यादी
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/customers/new')}
          >
            नवीन ग्राहक
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="नाव, मोबाईल किंवा गावाने शोधा..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flex: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            color={filterType !== 'all' ? 'primary' : 'inherit'}
          >
            फिल्टर
          </Button>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem 
              onClick={() => handleFilterSelect('all')}
              selected={filterType === 'all'}
            >
              सर्व ग्राहक
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('withBalance')}
              selected={filterType === 'withBalance'}
            >
              फक्त थकबाकीदार
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('noBalance')}
              selected={filterType === 'noBalance'}
            >
              शून्य थकबाकी
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('highBalance')}
              selected={filterType === 'highBalance'}
            >
              मोठी थकबाकी (५०००+)
            </MenuItem>
          </Menu>
        </Box>

        {/* Customers Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>क्र.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>नाव</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>मोबाईल</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>गाव</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>एकूण उधारी</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>थकबाकी</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                  क्रिया
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'कोणताही ग्राहक सापडला नाही' : 'कोणतेही ग्राहक नाहीत'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer, index) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{customer.name}</TableCell>
                      <TableCell>{customer.mobile || '-'}</TableCell>
                      <TableCell>{customer.village || '-'}</TableCell>
                      <TableCell>₹ {customer.totalCredit?.toLocaleString('mr-IN') || 0}</TableCell>
                      <TableCell>
                        <Chip
                          label={`₹ ${customer.balance?.toLocaleString('mr-IN') || 0}`}
                          color={getBalanceColor(customer.balance)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="पहा">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/customers/${customer.id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="संपादन">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/customers/edit/${customer.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="हटवा">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(customer.id, customer.name)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="प्रति पृष्ठ:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} पैकी ${count}`}
        />
      </Paper>
    </Container>
  );
};

export default CustomerList;