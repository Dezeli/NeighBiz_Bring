import { useNavigate } from 'react-router-dom';

const OwnerLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">네이비즈 사장님 센터</h1>
        <p className="text-gray-700 text-center mb-8 leading-relaxed">
          우리 동네 가게들과 제휴하고<br />
          소비자에게 혜택을 제공해보세요!
        </p>

        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-2">
            <li>QR 코드 기반 쿠폰 발급</li>
            <li>제휴 가게와 상호 혜택 제공</li>
            <li>발급/사용 통계 대시보드</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full h-12 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          로그인하기
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="w-full h-12 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
        >
          회원가입하기
        </button>
      </div>
    </div>
  );
};

export default OwnerLandingPage;
