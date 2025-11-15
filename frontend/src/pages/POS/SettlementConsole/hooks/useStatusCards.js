import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  MonetizationOn as MoneyIcon,
  CreditCard as CardIcon,
  TrendingUp as TrendingUpIcon,
  DoneAll as DoneAllIcon,
  CheckCircle as CheckIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

/**
 * Custom hook for generating status cards for the settlement console
 * Provides real-time status information for each settlement step
 */
export const useStatusCards = (settlement) => {
  const theme = useTheme();

  const statusCards = useMemo(() => {
    // Calculate payment breakdown
    const paymentBreakdown = settlement?.transactions?.reduce(
      (acc, transaction) => {
        const method = (transaction.paymentMethod || transaction.payment_method || '').toLowerCase();
        const total = parseFloat(transaction.total || 0);
        if (method.includes('cash')) {
          acc.cash += total;
        } else if (method.includes('card')) {
          acc.card += total;
        } else if (method.includes('upi') || method.includes('wallet') || method.includes('digital') || method.includes('online')) {
          acc.digital += total;
        } else {
          acc.others += total;
        }
        return acc;
      },
      { cash: 0, card: 0, digital: 0, others: 0 }
    ) || { cash: 0, card: 0, digital: 0, others: 0 };

    const nonCashTotal = paymentBreakdown.card + paymentBreakdown.digital + paymentBreakdown.others;
    const adjustmentsNetImpact = settlement?.adjustments?.reduce((sum, adjustment) => {
      return adjustment.type === 'add' ? sum + adjustment.amount : sum - adjustment.amount;
    }, 0) || 0;

    // Determine status for each card
    const cashCountStatus = settlement?.actualCash > 0 ? 'success' : 'warning';
    const cashCountValue = settlement?.actualCash > 0 ? 'Counted' : 'Pending';
    const cashCountDetails = settlement?.actualCash > 0 
      ? `₹${settlement.actualCash.toLocaleString('en-IN')} counted`
      : 'Cash not yet counted';

    const cardReconciliationStatus = nonCashTotal > 0 ? 'info' : 'default';
    const cardReconciliationValue = nonCashTotal > 0 ? 'Ready' : 'No Payments';
    const cardReconciliationDetails = nonCashTotal > 0 
      ? `${settlement?.transactions?.filter(t => 
          !['cash', ''].includes((t.paymentMethod || t.payment_method || '').toLowerCase())
        ).length || 0} transactions to verify`
      : 'No non-cash transactions';

    const adjustmentsStatus = settlement?.adjustments?.length > 0 ? 'warning' : 'default';
    const adjustmentsValue = settlement?.adjustments?.length > 0 ? `${settlement.adjustments.length} Added` : 'None';
    const adjustmentsDetails = settlement?.adjustments?.length > 0 
      ? `Net impact: ₹${adjustmentsNetImpact.toLocaleString('en-IN')}`
      : 'No adjustments recorded';

    const settlementStatus = settlement?.status === 'completed' ? 'success' : 
                           settlement?.status === 'pending' ? 'warning' : 'default';
    const settlementValue = settlement?.status === 'completed' ? 'Completed' : 
                          settlement?.status === 'pending' ? 'In Progress' : 'Unknown';
    const settlementDetails = settlement?.status === 'completed' 
      ? `Completed at ${settlement.endTime ? new Date(settlement.endTime).toLocaleTimeString() : 'N/A'}`
      : settlement?.difference !== 0 
      ? `Variance: ₹${Math.abs(settlement.difference).toLocaleString('en-IN')}`
      : 'Ready for completion';

    return [
      {
        title: 'Cash Count',
        icon: 'MoneyIcon',
        color: cashCountStatus,
        value: cashCountValue,
        details: cashCountDetails,
      },
      {
        title: 'Card Reconciliation',
        icon: 'CardIcon',
        color: cardReconciliationStatus,
        value: cardReconciliationValue,
        details: cardReconciliationDetails,
      },
      {
        title: 'Adjustments',
        icon: settlement?.adjustments?.length > 0 ? 
          (adjustmentsNetImpact >= 0 ? 'TrendingUpIcon' : 'TrendingDownIcon') : 
          'TrendingUpIcon',
        color: adjustmentsStatus,
        value: adjustmentsValue,
        details: adjustmentsDetails,
      },
      {
        title: 'Settlement Status',
        icon: settlement?.status === 'completed' ? 'DoneAllIcon' : 'CheckIcon',
        color: settlementStatus,
        value: settlementValue,
        details: settlementDetails,
      },
    ];
  }, [settlement]);

  const refreshStatus = () => {
    // This function can be used to trigger status refresh
    // For now, the useMemo will automatically update when settlement changes
    console.log('Status cards refreshed');
  };

  return {
    statusCards,
    refreshStatus,
  };
};
