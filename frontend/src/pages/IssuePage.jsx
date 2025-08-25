import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneAuthModal from '../components/PhoneAuthModal';

const IssuePage = () => {
  const { slug } = useParams();
  const { user, login, apiCall } = useAuth();

  const [couponData, setCouponData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ✅ 쿠폰 불러오기
  const loadCoupon = async () => {
    if (!slug) {
      setError('잘못된 QR 코드입니다.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await apiCall({ method: 'GET', url: `/issue/${slug}/` });
      if (response.success) {
        setCouponData(response.data);
      } else {
        setError('쿠폰을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      if (err.message.includes('login required')) {
        setShowPhoneAuth(true);
      } else {
        setError(err.message || '쿠폰 발급 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ 페이지 진입 시 쿠폰 로드
  useEffect(() => {
    const checkAuthAndLoadCoupon = async () => {
      setPageLoading(true);
      if (user) {
        await loadCoupon();
      } else {
        setShowPhoneAuth(true);
      }
      setPageLoading(false);
    };

    checkAuthAndLoadCoupon();
  }, [user, slug]); // loadCoupon은 넣지 말기 (useCallback 안 했으니까)

  // ✅ 쿠폰 사용
  const useCoupon = async () => {
    if (!couponData) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiCall({ method: 'POST', url: `/use/${couponData.coupon_id}/` });
      if (response.success) {
        setCouponData(prev => prev ? { ...prev, status: 'used' } : null);
        alert('🎉 쿠폰이 사용 완료되었습니다!');
      } else {
        setError('쿠폰 사용에 실패했습니다.');
      }
    } catch (err) {
      setError(err.message || '쿠폰 사용 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 전화번호 인증 성공 후 처리
  const handlePhoneAuthSuccess = async (access, refresh) => {
    try {
      await login(access, refresh);
      setShowPhoneAuth(false);
      await loadCoupon(); // 인증 성공 후 쿠폰 다시 불러오기
    } catch (error) {
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 text-center max-w-sm w-full">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">QR 코드 확인 중</h2>
          <p className="text-gray-500 text-sm">매장 정보를 불러오고 있어요...</p>
        </div>
      </div>
    );
  }

  if (showPhoneAuth) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 text-center max-w-sm w-full">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl">🎫</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-3">특별 쿠폰 대기중</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              휴대폰 번호 인증으로<br />
              <span className="font-semibold text-blue-600">제휴 매장 쿠폰</span>을 받아보세요!
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 mb-6 border border-blue-100">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">✨</span>
                <span className="font-bold text-blue-800">쿠폰 발급 준비완료</span>
              </div>
              <p className="text-xs text-blue-600">인증 완료 즉시 자동 발급됩니다</p>
            </div>

            <div className="text-xs text-gray-400 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              안전한 SMS 인증 시스템
            </div>
          </div>
        </div>
        
        <PhoneAuthModal
          isOpen={showPhoneAuth}
          onClose={() => setShowPhoneAuth(false)}
          onSuccess={handlePhoneAuthSuccess}
        />
      </>
    );
  }

  // 에러 상태
  if (error && !couponData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">이런! 문제가 발생했어요</h2>
          <div className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-100">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <span className="mr-2">🔄</span>
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  // 쿠폰 로딩 중
  if (loading && !couponData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 text-center max-w-sm w-full">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-3 bg-green-50 rounded-full flex items-center justify-center">
              <span className="text-xl">🎁</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">쿠폰 발급 중</h2>
          <p className="text-gray-500 text-sm">특별한 혜택을 준비하고 있어요!</p>
          
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // 쿠폰 표시
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 max-w-sm w-full overflow-hidden">
        
        {/* 쿠폰 헤더 - 티켓 스타일 */}
        <div className="relative">
          <div className={`p-8 text-center text-white relative ${
            couponData?.status === 'used' 
              ? 'bg-gradient-to-br from-gray-500 to-slate-600' 
              : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700'
          }`}>
            
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
              <div className="absolute top-12 right-8 w-4 h-4 border-2 border-white/20 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-6 h-6 border-2 border-white/25 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="text-5xl mb-4 filter drop-shadow-lg">
                {couponData?.status === 'used' ? '✅' : '🎫'}
              </div>
              <h1 className="text-2xl font-bold mb-2 tracking-wide">
                {couponData?.status === 'used' ? '사용 완료!' : '쿠폰 발급 완료!'}
              </h1>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-sm font-medium">
                  🏪 {couponData?.partner_store}
                </p>
              </div>
            </div>

            {/* 사용완료 스탬프 */}
            {couponData?.status === 'used' && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12 shadow-lg">
                USED
              </div>
            )}
          </div>

          {/* 티켓 펀칭 홀 */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full -ml-4 border-4 border-white"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full -mr-4 border-4 border-white"></div>
        </div>

        {/* 점선 구분선 */}
        <div className="border-t-2 border-dashed border-gray-200 mx-6"></div>

        {/* 쿠폰 내용 */}
        <div className="p-6">
          
          {/* 쿠폰 혜택 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-100">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🎁</span>
              <h3 className="font-bold text-lg text-gray-800">쿠폰 혜택</h3>
            </div>
            <p className="text-gray-700 leading-relaxed font-medium">
              {couponData?.description}
            </p>
          </div>

          {/* 발급 정보 */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">발급일시</p>
                <p className="text-sm text-blue-800 font-medium">
                  {couponData?.issued_at && formatDate(couponData.issued_at)}
                </p>
              </div>
              <div className="text-2xl">📅</div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-400 mr-3 text-xl">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          {couponData?.status === 'active' ? (
            <button
              onClick={useCoupon}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  <span>처리중...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">✨</span>
                  <div>
                    <div className="font-bold">사용하기</div>
                    <div className="text-xs opacity-90">사장님이 눌러주세요</div>
                  </div>
                </div>
              )}
            </button>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center bg-gray-100 border-2 border-gray-200 text-gray-600 px-6 py-4 rounded-2xl text-lg font-bold shadow-inner">
                <span className="mr-3 text-2xl">✅</span>
                <div>
                  <div>사용 완료</div>
                  <div className="text-xs font-normal opacity-70">이미 사용된 쿠폰입니다</div>
                </div>
              </div>
            </div>
          )}

          {/* 사용 안내 */}
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5">
            <div className="flex items-start">
              <div className="text-2xl mr-3 mt-1">💡</div>
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-2">사용 방법 안내</p>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  매장에서 사장님께 이 화면을 보여주시고<br />
                  <span className="font-semibold">"쿠폰 사용하기"</span> 버튼을 눌러달라고 말씀해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* 네이비즈 브랜딩 */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-xs text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span>네이비즈 제휴 쿠폰</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full ml-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuePage;