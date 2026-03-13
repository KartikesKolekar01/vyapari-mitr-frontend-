import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import reportService from '../../services/reportService';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  const months = [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setReportData(null);

    try {
      let response;

      switch (reportType) {
        case 'daily':
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          response = await reportService.getDailyReport(dateStr);
          break;

        case 'monthly':
          response = await reportService.getMonthlyReport(selectedYear, selectedMonth + 1);
          break;

        case 'yearly':
          response = await reportService.getYearlyReport(selectedYear);
          break;

        case 'pending':
          response = await reportService.getPendingReport();
          break;

        default:
          return;
      }

      if (response.success) {
        setReportData(response.data);
      } else {
        setError(response.message || 'अहवाल मिळवताना त्रुटी');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'अहवाल तयार करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast.info('रिपोर्ट डाउनलोड करण्याची सुविधा लवकरच उपलब्ध होईल');
  };

  const handlePrint = () => {
    window.print();
  };

  const getReportTitle = () => {
    if (reportData?.reportType === 'DAILY') {
      return `दैनिक अहवाल - ${reportData.period || format(selectedDate, 'dd MMMM yyyy')}`;
    }
    switch (reportType) {
      case 'monthly':
        return `मासिक अहवाल - ${months[selectedMonth]} ${selectedYear}`;
      case 'yearly':
        return `वार्षिक अहवाल - ${selectedYear}`;
      case 'pending':
        return 'थकबाकी अहवाल';
      default:
        return 'अहवाल';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          अहवाल
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                अहवाल निवडा
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>अहवाल प्रकार</InputLabel>
                <Select
                  value={reportType}
                  label="अहवाल प्रकार"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="daily">दैनिक अहवाल</MenuItem>
                  <MenuItem value="monthly">मासिक अहवाल</MenuItem>
                  <MenuItem value="yearly">वार्षिक अहवाल</MenuItem>
                  <MenuItem value="pending">थकबाकी अहवाल</MenuItem>
                </Select>
              </FormControl>

              {reportType === 'daily' && (
                <DatePicker
                  label="तारीख निवडा"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
                />
              )}

              {reportType === 'monthly' && (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>महिना</InputLabel>
                    <Select
                      value={selectedMonth}
                      label="महिना"
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {months.map((month, index) => (
                        <MenuItem key={month} value={index}>{month}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>वर्ष</InputLabel>
                    <Select
                      value={selectedYear}
                      label="वर्ष"
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {reportType === 'yearly' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>वर्ष</InputLabel>
                  <Select
                    value={selectedYear}
                    label="वर्ष"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleGenerateReport}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'अहवाल तयार करा'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, minHeight: 500 }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                  <CircularProgress />
                </Box>
              )}

              {!loading && !reportData && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                  <Typography color="text.secondary">
                    कृपया अहवाल तयार करा
                  </Typography>
                </Box>
              )}

              {reportData && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {getReportTitle()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        size="small"
                      >
                        डाउनलोड
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        size="small"
                      >
                        प्रिंट
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            ग्राहक संख्या
                          </Typography>
                          <Typography variant="h6">
                            {reportData.customerCount || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
                        <CardContent>
                          <Typography gutterBottom>एकूण उधारी</Typography>
                          <Typography variant="h6">
                            ₹ {(reportData.totalCredit || 0).toLocaleString('mr-IN')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                        <CardContent>
                          <Typography gutterBottom>एकूण वसूली</Typography>
                          <Typography variant="h6">
                            ₹ {(reportData.totalPayment || 0).toLocaleString('mr-IN')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ bgcolor: 'warning.light' }}>
                        <CardContent>
                          <Typography gutterBottom>थकबाकी</Typography>
                          <Typography variant="h6">
                            ₹ {(reportData.pendingAmount || 0).toLocaleString('mr-IN')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {reportData.topDefaulters && reportData.topDefaulters.length > 0 && (
                    <>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        शीर्ष थकबाकीदार
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>नाव</TableCell>
                              <TableCell>मोबाईल</TableCell>
                              <TableCell>गाव</TableCell>
                              <TableCell align="right">थकबाकी</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.topDefaulters.map((customer, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.mobile}</TableCell>
                                <TableCell>{customer.village}</TableCell>
                                <TableCell align="right">
                                  ₹ {(customer.balance || 0).toLocaleString('mr-IN')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Reports;