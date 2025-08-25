import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PartnershipInfo {
  merchant_name: string;
  partnership_status: 'none' | 'pending' | 'active';
  qr_image_url: string | null;
}

const OwnerMyPage = () => {
  const navigate = useNavigate();
  const { user, logout, apiCall } = useAuth();
  const [partnership, setPartnership] = useState<PartnershipInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartnership = async () => {
      try {
        const response = await apiCall({
          method: 'GET',
          url: '/merchants/mypage',
        });
        setPartnership(response.data);
      } catch (err) {
        setPartnership(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnership();
  }, [apiCall]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-gray-600">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  const renderPartnershipContent = () => {
    if (!partnership) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">❌</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">정보 로드 실패</h3>
          <p className="text-gray-500 text-sm">
            가게 정보를 불러올 수 없습니다.
          </p>
        </div>
      );
    }

    // partnership_status에 따른 처리
    switch (partnership.partnership_status) {
      case 'active':
        // 제휴 활성화 상태 - QR 코드 표시
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                제휴 활성화
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                🏪 {partnership.merchant_name}
              </h2>
              <p className="text-gray-500 text-sm mb-4">제휴가 활성화되었습니다</p>
            </div>
            
            {partnership.qr_image_url && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                <p className="text-sm text-gray-600 mb-3">고객용 QR 코드</p>
                <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
                  <img 
                    src={partnership.qr_image_url} 
                    alt="QR 코드" 
                    className="w-40 h-40 rounded-lg" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  고객이 QR 코드를 스캔하면 제휴 쿠폰을 발급받습니다
                </p>
              </div>
            )}
          </div>
        );

      case 'pending':
        // 제휴 대기중 상태
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-yellow-600">⏳</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">제휴 심사중</h3>
            <p className="text-gray-500 text-sm mb-4">
              {partnership.merchant_name}의 제휴 승인을 기다리고 있습니다.<br />
              관리자 승인 후 QR 코드가 생성됩니다.
            </p>
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
              승인 대기중
            </div>
          </div>
        );

      case 'none':
      default:
        // 제휴 없음 상태 - 쿠폰 정책 설정 버튼 표시
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">🤔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">제휴 대기중</h3>
            <p className="text-gray-500 text-sm mb-6">
              {partnership.merchant_name}<br />
              먼저 쿠폰 정책을 설정해보세요.
            </p>
            
            {/* 쿠폰 정책 설정 버튼 */}
            <button
              onClick={() => window.location.href = '/owner/coupon-setup'}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="mr-2">🎫</span>
              쿠폰 정책 설정하기
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* 네비게이션 버튼 */}
          <div className="flex gap-3 mb-6">
            <button
              disabled
              className="flex-1 bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md cursor-default flex items-center justify-center"
            >
              <span className="mr-2">👤</span>
              마이페이지
            </button>
            <button
              onClick={() => navigate('/owner/posts')}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl shadow-md border transition-colors flex items-center justify-center"
            >
              <span className="mr-2">📋</span>
              제휴 게시글
            </button>
          </div>

          {/* 헤더 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl text-white">👤</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">사장님 마이페이지</h1>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">📱 전화번호</span>
                <span className="text-sm font-medium text-gray-800">{user.phone_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">👔 역할</span>
                <span className="text-sm font-medium text-blue-600 capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {/* 제휴 정보 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {renderPartnershipContent()}
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            로그아웃
          </button>

          {/* 푸터 */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              네이비즈 소상공인 제휴 플랫폼
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerMyPage;