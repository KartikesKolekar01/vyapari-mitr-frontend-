import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  Warning as WarningIcon,
  Today as TodayIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import dashboardService from '../../services/dashboardService';
import customerService from '../../services/customerService';
import transactionService from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    customersWithBalance: 0,
    todayTransactions: 0,
    pendingPayments: 0,
    totalOutstanding: 0,
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [todayDate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch dashboard stats from backend
      const dashboardRes = await dashboardService.getDashboardHome();
      
      if (dashboardRes.success) {
        setStats({
          totalCustomers: dashboardRes.data.totalCustomers || 0,
          customersWithBalance: dashboardRes.data.customersWithBalance || 0,
          todayTransactions: dashboardRes.data.todayTransactions || 0,
          pendingPayments: dashboardRes.data.pendingPayments || 0,
          totalOutstanding: dashboardRes.data.totalOutstanding || 0,
        });
      }
      
      // Fetch recent customers
      const customersRes = await customerService.getAllCustomers();
      if (customersRes.success) {
        setRecentCustomers((customersRes.data || []).slice(0, 5));
      }
      
      // Fetch pending transactions
      const pendingRes = await transactionService.getPendingPayments();
      if (pendingRes.success) {
        setPendingList((pendingRes.data || []).slice(0, 5));
      }

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || 'डेटा मिळवताना त्रुटी');
      toast.error('डॅशबोर्ड डेटा लोड करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
          {typeof value === 'number' && title.includes('रक्कम') 
            ? `₹ ${value.toLocaleString('mr-IN')}` 
            : value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              नमस्कार, {user?.ownerName || 'व्यापारी मित्र'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              आजची तारीख: {format(todayDate, 'dd MMMM yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {user?.shopName}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="एकूण ग्राहक"
            value={stats.totalCustomers}
            icon={<PeopleIcon />}
            color="#1E4A5F"
            onClick={() => navigate('/customers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="थकबाकीदार"
            value={stats.customersWithBalance}
            icon={<WarningIcon />}
            color="#DC3545"
            onClick={() => navigate('/customers?filter=balance')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="आजचे व्यवहार"
            value={stats.todayTransactions}
            icon={<TodayIcon />}
            color="#28A745"
            onClick={() => navigate('/transactions?filter=today')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="थकबाकी रक्कम"
            value={stats.totalOutstanding}
            icon={<TrendingUpIcon />}
            color="#F9B234"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                अलीकडील ग्राहक
              </Typography>
              <Button 
                variant="text" 
                onClick={() => navigate('/customers')}
                sx={{ color: 'primary.main' }}
              >
                सर्व पहा
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recentCustomers.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                कोणतेही ग्राहक नाहीत
              </Typography>
            ) : (
              <List>
                {recentCustomers.map((customer) => (
                  <ListItem 
                    key={customer.id}
                    button
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: customer.balance > 0 ? 'error.main' : 'success.main' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={customer.name}
                      secondary={customer.mobile || customer.village || 'मोबाईल नाही'}
                    />
                    <Chip
                      label={`₹ ${customer.balance?.toLocaleString('mr-IN') || 0}`}
                      color={customer.balance > 0 ? 'error' : 'success'}
                      size="small"
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                थकबाकी यादी
              </Typography>
              <Button 
                variant="text" 
                onClick={() => navigate('/transactions?filter=pending')}
                sx={{ color: 'primary.main' }}
              >
                सर्व पहा
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {pendingList.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                कोणतीही थकबाकी नाही
              </Typography>
            ) : (
              <List>
                {pendingList.map((transaction) => (
                  <ListItem 
                    key={transaction.id}
                    button
                    onClick={() => navigate(`/customers/${transaction.customer?.id}`)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'error.main' }}>
                        <PaymentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={transaction.customer?.name}
                      secondary={`देय तारीख: ${transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString('mr-IN') : 'नाही'}`}
                    />
                    <Chip
                      label={`₹ ${transaction.amount?.toLocaleString('mr-IN') || 0}`}
                      color="error"
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;