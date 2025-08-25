import { useState, useEffect } from 'react';
import api from '../utils/api';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (access: string, refresh: string) => void;
}

const PhoneAuthModal = ({ isOpen, onClose, onSuccess }: PhoneAuthModalProps) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // 타이머 관리
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setStep('phone');
      setPhoneNumber('');
      setVerificationCode('');
      setError('');
      setTimeLeft(0);
    }
  }, [isOpen]);

  // 휴대폰 번호 형식 검증
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^01[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
  };

  // 휴대폰 번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 인증번호 요청
  const requestVerificationCode = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      
      const response = await api.post('/auth/request-code', {
        phone_number: cleanPhoneNumber,
      });

      if (response.data.success) {
        setStep('code');
        setTimeLeft(300); // 5분 타이머
        setError('');
      } else {
        setError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인
  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('6자리 인증번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      
      const response = await api.post('/auth/verify-code', {
        phone_number: cleanPhoneNumber,
        code: verificationCode,
      });

      if (response.data.success) {
        const { access, refresh } = response.data.data.tokens;
        onSuccess(access, refresh);
      } else {
        setError('인증번호가 올바르지 않습니다.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '인증 확인 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 다시 전송
  const resendCode = () => {
    setVerificationCode('');
    setError('');
    requestVerificationCode();
  };

  // 이전 단계로
  const goBack = () => {
    setStep('phone');
    setVerificationCode('');
    setError('');
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">
              {step === 'phone' ? '📱' : '🔐'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {step === 'phone' ? '휴대폰 인증' : '인증번호 확인'}
          </h2>
          <p className="text-gray-500 text-sm">
            {step === 'phone' 
              ? '쿠폰 받기 위해 휴대폰 번호를 입력해주세요' 
              : '발송된 6자리 인증번호를 입력해주세요'
            }
          </p>
        </div>

        {step === 'phone' ? (
          // 휴대폰 번호 입력 단계
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                휴대폰 번호
              </label>
              <input
                type="tel"
                placeholder="010-1234-5678"
                value={formatPhoneNumber(phoneNumber)}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={loading}
                maxLength={13}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={requestVerificationCode}
                disabled={loading || !phoneNumber.trim()}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    발송 중...
                  </>
                ) : (
                  '인증번호 받기'
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          // 인증번호 입력 단계
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인증번호
              </label>
              <input
                type="text"
                placeholder="6자리 숫자"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="w-full h-14 px-4 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={loading}
                maxLength={6}
                autoFocus
              />
              
              {timeLeft > 0 && (
                <p className="text-sm text-blue-600 mt-2 text-center">
                  ⏰ {formatTime(timeLeft)} 남음
                </p>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">{formatPhoneNumber(phoneNumber)}</span>로<br />
                인증번호를 발송했습니다.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={verifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    확인 중...
                  </>
                ) : (
                  '인증 완료'
                )}
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={goBack}
                  className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                  disabled={loading}
                >
                  이전
                </button>
                <button
                  onClick={resendCode}
                  className="flex-1 h-12 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl font-semibold transition-colors"
                  disabled={loading || timeLeft > 240} // 1분 후에 재전송 가능
                >
                  다시 전송
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneAuthModal;