import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassPanel from '../../components/common/GlassPanel';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import styles from './Auth.module.css';

const Signup = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(name, email, password);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
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
            <p className={styles.subtitle}>Join our community of collectors.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="Julian Sterling"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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

            <Button type="submit" isLoading={loading}>
              Create Account <UserPlus size={18} />
            </Button>
          </form>

          <p className={styles.footer}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </GlassPanel>
      </motion.div>
    </div>
  );
};

export default Signup;
