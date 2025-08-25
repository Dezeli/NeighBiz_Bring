import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { extractErrorMessage } from '../utils/response';
import { useAuth } from '../context/AuthContext';

const OwnerLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/owner/login', { username, password });

      if (!res.data.success) {
        setError(extractErrorMessage(res.data));
        return;
      }

      const { access, refresh } = res.data.data;
      await login(access, refresh);
      navigate('/owner/mypage');
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고/헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">🏪</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">네이비즈</h1>
          <p className="text-gray-500">사장님 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  로그인 중...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  로그인
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/signup" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
            >
              계정이 없으신가요? 회원가입하기
            </a>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            소상공인 간 제휴를 통한 상생 플랫폼
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerLoginPage;
