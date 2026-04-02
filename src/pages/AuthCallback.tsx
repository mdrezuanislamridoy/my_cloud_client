import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens, fetchProfile, user } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');

      if (!accessToken || !refreshToken) {
        toast.error('Authentication failed: Missing tokens');
        navigate('/login', { replace: true });
        return;
      }

      try {
        setTokens(accessToken, refreshToken);
        await fetchProfile();
        toast.success('Logged in successfully!');
      } catch (error) {
        toast.error('Failed to fetch profile during Google login');
        navigate('/login', { replace: true });
      }
    };

    handleAuth();
  }, [searchParams, setTokens, fetchProfile, navigate]);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/app', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#94A3B8] font-medium animate-pulse">Authenticating with Google...</p>
      </div>
    </div>
  );
}
