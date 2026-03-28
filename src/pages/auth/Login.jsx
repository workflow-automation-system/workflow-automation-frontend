import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Workflow } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Sun, Moon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = React.useState({});

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on mount
  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[var(--primary)] mb-4">
              <Workflow size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h1>
            <p className="text-[var(--text-secondary)] mt-2">
              Sign in to your FlowForge account
            </p>
          </div>

          {/* Login Form */}
          <Card>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-[var(--error)] bg-opacity-10 border border-[var(--error)] text-[var(--error)] text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  icon={Mail}
                  error={formErrors.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={Lock}
                  error={formErrors.password}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[var(--primary)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Sign In
                </Button>
              </form>
            </Card.Body>
          </Card>

          {/* Demo credentials */}
          <div className="mt-4 p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)] mb-2">Demo credentials:</p>
            <p className="text-sm text-[var(--text-primary)]">admin@example.com / admin123</p>
          </div>

          {/* Sign up link */}
          <p className="text-center mt-6 text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--primary)] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;