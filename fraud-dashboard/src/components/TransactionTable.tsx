import { FC, useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Box,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Sample transaction data - replace with real data from your API
const sampleTransactions = Array.from({ length: 50 }, (_, i) => {
  const date = new Date();
  date.setHours(date.getHours() - i);
  
  const amount = Math.floor(Math.random() * 900) + 100;
  const fraudScore = Math.random();
  const isHighRisk = fraudScore > 0.7;
  const isMediumRisk = fraudScore > 0.3 && fraudScore <= 0.7;
  
  return {
    id: `TRX-${1000 + i}`,
    timestamp: date.toISOString(),
    amount: amount,
    customer: `Customer-${Math.floor(Math.random() * 100) + 1}`,
    fraudScore: fraudScore,
    status: isHighRisk ? 'flagged' : isMediumRisk ? 'review' : 'approved'
  };
});

export const TransactionTable: FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged':
        return {
          bg: theme.palette.error.light,
          color: theme.palette.error.dark,
          icon: <WarningIcon fontSize="small" />
        };
      case 'review':
        return {
          bg: theme.palette.warning.light,
          color: theme.palette.warning.dark,
          icon: <InfoIcon fontSize="small" />
        };
      case 'approved':
        return {
          bg: theme.palette.success.light,
          color: theme.palette.success.dark,
          icon: <CheckCircleIcon fontSize="small" />
        };
      default:
        return {
          bg: theme.palette.grey[200],
          color: theme.palette.grey[700],
          icon: undefined
        };
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 0.7) return theme.palette.error.main;
    if (score > 0.3) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        background: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
        Recent Transactions
      </Typography>
      <Typography variant="body2" sx={{ color: '#4a5568', mb: 3 }}>
        Monitor recent transaction activity and fraud alerts
      </Typography>

      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Transaction ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Risk Score</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#4a5568' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction, index) => {
                const statusStyle = getStatusColor(transaction.status);
                
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.3
                    }}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white'
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e2e8f0',
                            mr: 1,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: `${transaction.fraudScore * 100}%`,
                              backgroundColor: getRiskColor(transaction.fraudScore),
                              borderRadius: 3,
                              transition: 'width 0.5s ease-in-out'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: getRiskColor(transaction.fraudScore) }}>
                          {Math.round(transaction.fraudScore * 100)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusStyle.icon}
                        label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 500,
                          '& .MuiChip-icon': {
                            color: statusStyle.color
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sampleTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}; 