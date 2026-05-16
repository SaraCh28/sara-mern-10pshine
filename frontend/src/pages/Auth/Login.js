import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassPanel from '../../components/common/GlassPanel';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import styles from './Auth.module.css';

const Login = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassPanel className={styles.card} blur="lg">
          <div className={styles.header}>
            <h1 className={styles.logo}>Journally</h1>
            <p className={styles.subtitle}>Welcome Back. Your thoughts await.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <Input
              label="Email Address"
              type="email"
              placeholder="user@journally.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className={styles.forgotPassword}>
              <a href="#forgot">Forgot password?</a>
            </div>

            <Button type="submit" isLoading={loading} icon={LogIn}>
              Sign In <LogIn size={18} />
            </Button>
          </form>

          <div className={styles.socialAuth}>
            <div className={styles.divider}>
              <span>OR CONTINUE WITH</span>
            </div>
            <div className={styles.socialButtons}>
              <button className={styles.socialBtn} type="button">
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width={20} /> Google
              </button>
              <button className={styles.socialBtn} type="button">
                <img src="https://www.svgrepo.com/show/448204/apple.svg" alt="Apple" width={20} /> Apple
              </button>
            </div>
          </div>

          <p className={styles.footer}>
            Don't have an account? <Link to="/signup">Create an account</Link>
          </p>
        </GlassPanel>
      </motion.div>
    </div>
  );
};

export default Login;
