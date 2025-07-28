// import { useState } from 'react';
// import axiosInstance from '../../../api';
// import { useNavigate } from 'react-router-dom';

// export default function SignupPage() {
//   const [username, setUsername] = useState('');
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [step, setStep] = useState('signup'); // 'signup' | 'verify' | 'done'
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     if (!username || !phone) {
//       alert('Please enter both username and phone number');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axiosInstance.post('/api/auth/signup', { username, phone });
//       setSessionId(res.data.sessionId);
//       setStep('verify');
//       alert('OTP sent!');
//     } catch (err) {
//       alert(err.response?.data?.error || 'Signup failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify = async () => {
//     if (!otp) {
//       alert('Please enter the OTP');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axiosInstance.post('/api/auth/signup/verify', { phone, sessionId, otp });
//       setStep('done');
//       setTimeout(() => {
//         navigate('/login');
//       }, 1500);
//     } catch (err) {
//       alert(err.response?.data?.error || 'OTP verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             {step === 'signup' && "Enter your details to get started"}
//             {step === 'verify' && "Check your phone for an OTP"}
//             {step === 'done' && "You're all set!"}
//           </p>
//         </div>

//         {step === 'signup' && (
//           <div className="mt-8 space-y-6">
//             <input
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               type="text"
//               placeholder="Username"
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//             <input
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               type="tel"
//               placeholder="Phone Number"
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//             <button
//               onClick={handleSignup}
//               disabled={loading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
//                 loading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? 'Sending OTP...' : 'Send OTP'}
//             </button>
//           </div>
//         )}

//         {step === 'verify' && (
//           <div className="mt-8 space-y-6">
//             <input
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               type="text"
//               placeholder="Enter OTP"
//               maxLength="6"
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//             <button
//               onClick={handleVerify}
//               disabled={loading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none ${
//                 loading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? 'Verifying...' : 'Verify OTP'}
//             </button>
//           </div>
//         )}

//         {step === 'done' && (
//           <div className="mt-8 text-center">
//             <svg
//               className="mx-auto h-16 w-16 text-green-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M5 13l4 4L19 7"
//               ></path>
//             </svg>
//             <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
//               Account created successfully!
//             </h3>
//             <p className="mt-2 text-sm text-gray-500">Redirecting to login...</p>
//           </div>
//         )}

//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               Sign in
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
const SignupPage = () => {
  return (
    <div>SignupPage</div>
  )
}
export default SignupPage