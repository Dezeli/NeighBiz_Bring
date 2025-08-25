import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CouponSetupPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    expected_value: '',
    expected_duration: '1_month',
    valid_from: '',
    valid_until: '',
    daily_limit: '',
    total_limit: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        expected_value: parseInt(formData.expected_value),
        daily_limit: parseInt(formData.daily_limit),
        total_limit: parseInt(formData.total_limit),
      };

      const response = await apiCall({
        method: 'POST',
        url: '/coupon-policies/',
        data: submitData,
      });

      if (response.success) {
        alert('🎉 쿠폰 정책이 성공적으로 등록되었습니다!\n마이페이지로 이동합니다.');
        navigate('/owner/mypage');
      } else {
        setError('쿠폰 정책 등록에 실패했습니다.');
      }
    } catch (err) {
      setError(err.message || '쿠폰 정책 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const durationOptions = [
    { value: '1_month', label: '1개월' },
    { value: '3_months', label: '3개월' },
    { value: '6_months', label: '6개월' },
    { value: 'unlimited', label: '무기한' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/owner/mypage')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <span className="mr-2">←</span>
            마이페이지로 돌아가기
          </button>

          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">🎫</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">쿠폰 정책 설정</h1>
          <p className="text-gray-500">고객에게 제공할 쿠폰의 조건을 설정해주세요</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 쿠폰 설명 *
              </label>
              <textarea
                name="description"
                placeholder="예: 아메리카노 무료 제공"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 예상 가치 (원) *
              </label>
              <input
                type="number"
                name="expected_value"
                placeholder="4500"
                value={formData.expected_value}
                onChange={handleChange}
                min="0"
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏰ 예상 지속 기간 *
              </label>
              <select
                name="expected_duration"
                value={formData.expected_duration}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white"
                required
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 시작일 *
                </label>
                <input
                  type="date"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleChange}
                  className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 종료일 *
                </label>
                <input
                  type="date"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleChange}
                  className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">📊 발급 제한 설정</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📈 일일 발급 제한 *
                </label>
                <input
                  type="number"
                  name="daily_limit"
                  placeholder="10"
                  value={formData.daily_limit}
                  onChange={handleChange}
                  min="1"
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">하루에 발급할 수 있는 최대 쿠폰 수</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 총 발급 제한 *
                </label>
                <input
                  type="number"
                  name="total_limit"
                  placeholder="300"
                  value={formData.total_limit}
                  onChange={handleChange}
                  min="1"
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">전체 기간 동안 발급할 수 있는 최대 쿠폰 수</p>
              </div>
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
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  등록 중...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  쿠폰 정책 등록하기
                </>
              )}
            </button>
          </form>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">💡</span>
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">안내사항</p>
                <ul className="space-y-1 text-xs">
                  <li>• 쿠폰 정책 등록 후 관리자가 제휴를 설정해드립니다</li>
                  <li>• 제휴가 완료되면 QR 코드가 생성됩니다</li>
                  <li>• 설정한 제한에 따라 쿠폰이 자동으로 발급됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponSetupPage;
