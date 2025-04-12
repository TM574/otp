import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { login, getUserData, verifyOtp } from "@/services/api";
import axios from 'axios';
import Cookie from 'js-cookies';
import OtpInput from 'react-otp-input';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password }); // Stores token
      Cookie.setItem('token', res.token); // Already set in api.ts too

      const userRes = await getUserData();
console.log("nan")
      if (userRes.success && userRes.user) {
        console.log("uhdahu")
        const user = userRes.user;
        if (user.status === 1) {
          toast.success(`Welcome, ${user.name}`);
          navigate('/profile');
        } else {
          toast.info('OTP verification required');
          setUserId(user.id); // Assuming backend sends ID
          setOtpMode(true);
        }
      } else {
        toast.error('Failed to fetch user info');
      }
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp(userId, otp, email);
       if (response?.success) {
        toast.success('OTP Verified');
        navigate('/profile');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error('OTP verification failed');
      console.error('OTP Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    const backendUrl = "http://localhost:8081";
    window.location.href = `${backendUrl}/login/google`;
      };
  

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-brand-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-brand-100">Login to your account</p>
          </div>

          <div className="p-6">
            {!otpMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">OR CONTINUE WITH</span>
                  </div>
                </div>

                <Button onClick={handleGoogleLogin} variant="outline" className="w-full flex gap-2" type="button">
                  {/* Google icon omitted for brevity */}
                  Google
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600">We’ve sent a verification code to:</p>
                  <p className="font-medium">{email}</p>
                </div>

                <div>
                  <Label className="block text-center mb-2">Enter OTP</Label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => <Input {...props} />}
                    inputStyle={{
                      width: '2.5rem',
                      height: '2.5rem',
                      margin: '0 0.3rem',
                      fontSize: '1.25rem',
                      borderRadius: 6,
                      border: '1px solid #ccc'
                    }}
                    shouldAutoFocus
                  />
                </div>

                <Button className="w-full bg-brand-600 hover:bg-brand-700" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  <button type="button" onClick={() => setOtpMode(false)} className="text-brand-600 text-sm hover:underline mt-4">
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {!otpMode && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don’t have an account?{' '}
                  <Link to="/register" className="text-brand-600 hover:underline">
                    Register Now
                  </Link>
                </p>
                <p className="mt-4 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  Demo Credentials: test@example.com / password
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
