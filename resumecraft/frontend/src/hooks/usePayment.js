import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export function usePayment() {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const initiatePayment = async ({ actionType, resumeId, onSuccess, onError }) => {
    if (!user) {
      onError?.('Please login to continue');
      return;
    }

    setProcessing(true);
    try {
      // Create order on backend
      const orderRes = await api.post('/api/payments/create-order', { actionType, resumeId });
      const { orderId, amount, currency, label, keyId } = orderRes.data;

      // Open Razorpay checkout
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'ResumeCraft',
        description: label,
        order_id: orderId,
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: { color: '#3B82F6' },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await api.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            onSuccess?.(verifyRes.data);
          } catch (err) {
            onError?.(err.response?.data?.error || 'Payment verification failed');
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            onError?.('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setProcessing(false);
      onError?.(err.response?.data?.error || 'Failed to initiate payment');
    }
  };

  return { initiatePayment, processing };
}
