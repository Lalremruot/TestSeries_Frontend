import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useContext';
import axiosInstance from '../../api';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await axiosInstance.get(`/api/tests/${testId}`);
        setTest(response.data);
      } catch (error) {
        toast.error('Failed to fetch test details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId, user, navigate]);

  const handlePayment = async (paymentMethod) => {
    setPaymentLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add test to user's purchased tests
      await axiosInstance.post('/api/user/purchase-test', {
        userId: user._id,
        testId: testId
      });
      
      toast.success('Payment successful! Test purchased.');
      navigate(`/start-test/${test.testTypeId}`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Test not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Purchase Test</h2>
            <p className="text-gray-600">Complete your purchase to access this test</p>
          </div>

          {/* Test Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Duration: {test.duration} minutes</p>
              <p>Questions: {test.totalQuestions || test.subjects?.reduce((total, subject) => total + subject.questions.length, 0) || 0}</p>
              <p>Max Attempts: {test.maxAttempts}</p>
              <p className="text-lg font-semibold text-orange-600">Price: ₹{test.price}</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Payment Method</h3>
            
            <button
              onClick={() => handlePayment('upi')}
              disabled={paymentLoading}
              className={`w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors ${
                paymentLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">UPI</span>
                  </div>
                  <span className="font-medium">Pay with UPI</span>
                </div>
                <span className="text-blue-600">₹{test.price}</span>
              </div>
            </button>

            <button
              onClick={() => handlePayment('card')}
              disabled={paymentLoading}
              className={`w-full p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors ${
                paymentLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💳</span>
                  </div>
                  <span className="font-medium">Pay with Card</span>
                </div>
                <span className="text-gray-600">₹{test.price}</span>
              </div>
            </button>

            <button
              onClick={() => handlePayment('wallet')}
              disabled={paymentLoading}
              className={`w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors ${
                paymentLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💰</span>
                  </div>
                  <span className="font-medium">Pay with Wallet</span>
                </div>
                <span className="text-green-600">₹{test.price}</span>
              </div>
            </button>
          </div>

          {paymentLoading && (
            <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing payment...</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 