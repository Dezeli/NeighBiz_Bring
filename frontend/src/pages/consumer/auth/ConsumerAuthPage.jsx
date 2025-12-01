import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api/v1';
const BASE_URL = 'http://neighbiz.store/api/v1';

const Container = {
  minHeight: '100vh',
  background: '#f5f5f5',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: 0,
};

const ContentWrapper = {
  width: '100vw',
  maxWidth: '390px',
  minHeight: 'auto',
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '2rem',
};

const HeaderSection = {
  background: 'linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%)',
  padding: '3rem 1.5rem 2rem',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const LogoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  marginBottom: '1rem',
};

const Logo = {
  fontSize: '2.5rem',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: '#1f2937',
  position: 'relative',
  zIndex: 1,
};

const HeaderTitle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.5rem',
  position: 'relative',
  zIndex: 1,
};

const HeaderDescription = {
  fontSize: '0.9rem',
  color: '#6b7280',
  position: 'relative',
  zIndex: 1,
};

const MainContent = {
  flex: 1,
  padding: '2.5rem 1.5rem',
  maxWidth: '100%',
  boxSizing: 'border-box',
};

const FormSection = {
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
};

const FormTitle = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '1rem',
};

const InputGroup = {
  marginBottom: '1.5rem',
};

const Label = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.5rem',
};

const Input = {
  width: '100%',
  height: '52px',
  padding: '0 1rem',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  outline: 'none',
  boxSizing: 'border-box',
};

const InputRow = {
  display: 'flex',
  gap: '0.75rem',
};

const CodeInput = {
  flex: 1,
  height: '52px',
  padding: '0 1rem',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  outline: 'none',
  boxSizing: 'border-box',
};

const Button = {
  height: '52px',
  padding: '0 1.5rem',
  background: 'linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%)',
  color: '#1f2937',
  border: 'none',
  borderRadius: '12px',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(76, 230, 209, 0.3)',
  whiteSpace: 'nowrap',
};

const SubmitButton = {
  width: '100%',
  height: '56px',
  background: '#1f2937',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(31, 41, 55, 0.3)',
  marginTop: '1rem',
};

const ErrorMessage = {
  width: '100%',
  padding: '1rem',
  background: 'rgba(255, 90, 90, 0.1)',
  border: '1px solid rgba(255, 90, 90, 0.3)',
  borderRadius: '12px',
  color: '#ff5a5a',
  fontSize: '0.9rem',
  fontWeight: 600,
  marginTop: '1rem',
  textAlign: 'center',
  boxSizing: 'border-box',
  wordBreak: 'keep-all',
};

const SuccessMessage = {
  width: '100%',
  padding: '1rem',
  background: 'rgba(76, 230, 209, 0.1)',
  border: '1px solid rgba(76, 230, 209, 0.3)',
  borderRadius: '12px',
  color: '#065f46',
  fontSize: '0.9rem',
  fontWeight: 600,
  marginTop: '1rem',
  textAlign: 'center',
  boxSizing: 'border-box',
  wordBreak: 'keep-all',
};

const HelpText = {
  fontSize: '0.75rem',
  color: '#6b7280',
  marginTop: '0.5rem',
};

const ConsumerAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [location]);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = 'Unknown';
    let os = 'Unknown';
    
    if (ua.indexOf('iPhone') > -1) {
      device = 'iPhone';
      os = 'iOS';
    } else if (ua.indexOf('iPad') > -1) {
      device = 'iPad';
      os = 'iOS';
    } else if (ua.indexOf('Android') > -1) {
      device = 'Android';
      os = 'Android';
    } else if (ua.indexOf('Windows') > -1) {
      device = 'PC';
      os = 'Windows';
    } else if (ua.indexOf('Mac') > -1) {
      device = 'Mac';
      os = 'macOS';
    }
    
    return `${device} / ${os}`;
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    return numbers;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 11) {
      setPhoneNumber(formatted);
      setError('');
    }
  };

  const handleRequestCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('올바른 전화번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${BASE_URL}/accounts/phone-verify-request/`, {
        phone_number: phoneNumber,
      });

      if (!response.data.success) {
        setError(response.data.message || '인증번호 발송에 실패했습니다');
        return;
      }

      setSuccess('인증번호가 발송되었습니다');
      setStep(2);
    } catch (err) {
      console.error('Request code error:', err);
      setError(err.response?.data?.message || '인증번호 발송에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('6자리 인증번호를 입력해주세요');
      return;
    }

    setVerifyLoading(true);
    setError('');
    setSuccess('');

    try {
      const verifyResponse = await axios.post(`${BASE_URL}/accounts/phone-verify/`, {
        phone_number: phoneNumber,
        code: verificationCode,
      });

      if (!verifyResponse.data.success) {
        setError(verifyResponse.data.message || '인증에 실패했습니다');
        setVerifyLoading(false);
        return;
      }

      const loginResponse = await axios.post(`${BASE_URL}/accounts/consumer-login/`, {
        phone_number: phoneNumber,
        code: verificationCode,
        device_info: getDeviceInfo(),
      });

      if (loginResponse.data.success && loginResponse.data.data?.access && loginResponse.data.data?.refresh) {
        await login(loginResponse.data.data.access, loginResponse.data.data.refresh);
        
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate('/');
        }
      } else {
        setError(loginResponse.data.message || '로그인에 실패했습니다');
      }
    } catch (err) {
      console.error('Verify/Login error:', err);
      setError(err.response?.data?.message || '인증 처리에 실패했습니다');
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div style={Container}>
      <div style={ContentWrapper}>
        <div style={HeaderSection}>
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/images/business-network-pattern.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
            }}
          />
          <div style={LogoContainer}>
            <img 
              src="/images/logo.png" 
              alt="NeighBiz Logo" 
              style={{
                width: '60px',
                height: '60px',
                position: 'relative',
                zIndex: 1,
              }}
            />
            <h1 style={Logo}>
              <span>Neigh</span>
              <span>Biz</span>
            </h1>
          </div>
          <h2 style={HeaderTitle}>쿠폰 받기</h2>
          <p style={HeaderDescription}>
            전화번호로 간편하게 인증하세요
          </p>
        </div>

        <div style={MainContent}>
          <div style={FormSection}>
            {step === 1 ? (
              <>
                <h3 style={FormTitle}>전화번호 인증</h3>
                <div style={InputGroup}>
                  <label style={Label}>전화번호</label>
                  <input
                    type="tel"
                    placeholder="01012345678"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    style={Input}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4CE6D1';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                    disabled={loading}
                  />
                  <p style={HelpText}>- 없이 숫자만 입력해주세요</p>
                </div>

                <button
                  onClick={handleRequestCode}
                  disabled={loading}
                  style={{
                    ...SubmitButton,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#374151';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(31, 41, 55, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = '#1f2937';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(31, 41, 55, 0.3)';
                    }
                  }}
                >
                  {loading ? '전송 중...' : '인증번호 받기'}
                </button>
              </>
            ) : (
              <>
                <h3 style={FormTitle}>인증번호 입력</h3>
                <div style={InputGroup}>
                  <label style={Label}>인증번호</label>
                  <div style={InputRow}>
                    <input
                      type="text"
                      placeholder="6자리 숫자"
                      value={verificationCode}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/[^0-9]/g, '');
                        if (numbers.length <= 6) {
                          setVerificationCode(numbers);
                          setError('');
                        }
                      }}
                      style={CodeInput}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#4CE6D1';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                      disabled={verifyLoading}
                    />
                    <button
                      onClick={handleRequestCode}
                      disabled={loading}
                      style={{
                        ...Button,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 20px rgba(76, 230, 209, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 12px rgba(76, 230, 209, 0.3)';
                        }
                      }}
                    >
                      재전송
                    </button>
                  </div>
                  <p style={HelpText}>{phoneNumber}로 전송된 인증번호를 입력하세요</p>
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={verifyLoading}
                  style={{
                    ...SubmitButton,
                    opacity: verifyLoading ? 0.7 : 1,
                    cursor: verifyLoading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!verifyLoading) {
                      e.target.style.background = '#374151';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(31, 41, 55, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!verifyLoading) {
                      e.target.style.background = '#1f2937';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(31, 41, 55, 0.3)';
                    }
                  }}
                >
                  {verifyLoading ? '인증 중...' : '인증 완료'}
                </button>
              </>
            )}

            {error && <div style={ErrorMessage}>{error}</div>}
            {success && <div style={SuccessMessage}>{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerAuthPage;