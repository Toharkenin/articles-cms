'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/auth-context';
import { adminLogin } from '@/services/auth';
import errorMessages from '@/services/error-messages.json';

const ERROR_MESSAGES = {
  ...errorMessages.validation,
  ...errorMessages.api,
  ...errorMessages.default,
};

type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { value, update } = useAuthContext();
  const { login } = value;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const newErrors: Errors = {};

    if (!email) newErrors.email = ERROR_MESSAGES.email_required;
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = ERROR_MESSAGES.email_invalid;

    if (!password) newErrors.password = ERROR_MESSAGES.password_required;
    else if (password.length < 6)
      newErrors.password = ERROR_MESSAGES.password_short;

    return newErrors;
  };

  const mapBackendError = (error: any) => {
    if (error?.message === 'Network Error') return ERROR_MESSAGES.network_error;
    if (error?.response?.status >= 500) return ERROR_MESSAGES.server_error;

    const backendMessage = error?.response?.data?.message?.toLowerCase();

    if (!backendMessage) return ERROR_MESSAGES.unknown_error;
    if (backendMessage.includes('invalid') || backendMessage.includes('incorrect'))
      return ERROR_MESSAGES.invalid_credentials;
    if (backendMessage.includes('not found'))
      return ERROR_MESSAGES.user_not_found;
    if (backendMessage.includes('disabled'))
      return ERROR_MESSAGES.account_disabled;
    if (backendMessage.includes('too many'))
      return ERROR_MESSAGES.too_many_attempts;

    return error.response.data.message;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    console.log('handleSubmit');
    e.preventDefault();

    if (isLoading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await adminLogin(email, password);

      if (response?.success && response?.token) {
        login(response.token);
        localStorage.setItem('admin_token', response.token);
        update({ isLoggedIn: true });
        router.push('/admin/dashboard');
        return;
      }

      setErrors({
        general: response?.message || ERROR_MESSAGES.invalid_credentials,
      });
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setErrors({ general: mapBackendError(error) });
      setEmail('');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your admin dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            <Input
              type="email"
              label="Email Address"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
