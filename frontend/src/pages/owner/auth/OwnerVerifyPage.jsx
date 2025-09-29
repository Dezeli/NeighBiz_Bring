import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Container = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
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
  padding: '2rem 1.5rem',
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
  fontSize: '2rem',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: '#1f2937',
  position: 'relative',
  zIndex: 1,
};

const MainContent = {
  flex: 1,
  padding: '2.5rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  maxWidth: '100%',
  boxSizing: 'border-box',
};

const StatusIcon = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(76, 230, 209, 0.1) 0%, rgba(160, 246, 210, 0.1) 100%)',
  border: '3px solid rgba(76, 230, 209, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
  fontSize: '2.5rem',
};

const StatusTitle = {
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '0.75rem',
};

const StatusDescription = {
  fontSize: '1rem',
  color: '#6b7280',
  lineHeight: 1.6,
  marginBottom: '2.5rem',
  fontWeight: 500,
};

const Divider = {
  width: '100%',
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, rgba(76, 230, 209, 0.3) 50%, transparent 100%)',
  margin: '2rem 0',
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
  textAlign: 'left',
};

const InputWrapper = {
  marginBottom: '1rem',
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
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '12px',
  color: '#dc2626',
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
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  borderRadius: '12px',
  color: '#065f46',
  fontSize: '0.9rem',
  fontWeight: 600,
  marginTop: '1rem',
  textAlign: 'center',
  boxSizing: 'border-box',
  wordBreak: 'keep-all',
};

const InfoBox = {
  width: '100%',
  padding: '0.875rem',
  background: 'rgba(76, 230, 209, 0.05)',
  border: '1px solid rgba(76, 230, 209, 0.2)',
  borderRadius: '12px',
  fontSize: '0.8rem',
  color: '#6b7280',
  lineHeight: 1.5,
  marginTop: '1.5rem',
  textAlign: 'left',
  boxSizing: 'border-box',
  wordBreak: 'keep-all',
  maxWidth: '100%',
};

const LicenseSection = {
  width: '100%',
  marginTop: '2rem',
  paddingTop: '2rem',
  borderTop: '1px solid rgba(76, 230, 209, 0.2)',
};

const FileLabel = {
  display: 'block',
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'white',
  color: '#4CE6D1',
  border: '2px solid rgba(76, 230, 209, 0.3)',
  borderRadius: '12px',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  boxSizing: 'border-box',
  marginBottom: '1rem',
};

const UploadButton = {
  width: '100%',
  height: '48px',
  background: 'linear-gradient(135deg, #4CE6D1 0%, #A0F6D2 100%)',
  color: '#1f2937',
  border: 'none',
  borderRadius: '12px',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(76, 230, 209, 0.3)',
};

const OwnerVerifyPage = () => {
  const navigate = useNavigate();
  const { apiCall, fetchUser } = useAuth();
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!adminPassword.trim()) {
      setError('관리자 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiCall({
        method: 'POST',
        url: '/accounts/verify-owner/',
        data: {
          admin_password: adminPassword,
        },
      });

      if (response?.success === true) {
        await fetchUser();
        navigate('/owner/profile', { replace: true });
      } else {
        setError(response?.message || '관리자 비밀번호가 올바르지 않습니다');
      }
    } catch (err) {
      console.error('Verify error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('관리자 비밀번호가 올바르지 않습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setSelectedFile(file);
      setError('');
      setUploadSuccess('');
    }
  };

  const handleUploadLicense = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    setUploadLoading(true);
    setError('');
    setUploadSuccess('');

    try {
      const uploadResponse = await apiCall({
        method: 'POST',
        url: '/upload/image/',
        data: {
          filename: selectedFile.name,
          content_type: selectedFile.type,
          image_type: 'business_license',
        },
      });

      if (!uploadResponse?.data?.upload_url || !uploadResponse?.data?.key) {
        throw new Error('업로드 URL을 받지 못했습니다');
      }

      const uploadUrl = uploadResponse.data.upload_url;
      const imageKey = uploadResponse.data.key;

      const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      });

      if (!putResponse.ok) {
        throw new Error('이미지 업로드에 실패했습니다');
      }

      const patchResponse = await apiCall({
        method: 'PATCH',
        url: '/accounts/owner-license/',
        data: {
          business_license_image: imageKey,
        },
      });

      if (patchResponse?.success) {
        setUploadSuccess('사업자등록증이 성공적으로 업로드되었습니다. 재심사를 기다려주세요.');
        setSelectedFile(null);
      } else {
        setError(patchResponse?.message || '사업자등록증 업로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('Upload license failed:', err);
      setError('사업자등록증 업로드에 실패했습니다.');
    } finally {
      setUploadLoading(false);
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
                width: '48px',
                height: '48px',
                position: 'relative',
                zIndex: 1,
              }}
            />
            <h1 style={Logo}>
              <span>Neigh</span>
              <span>Biz</span>
            </h1>
          </div>
        </div>

        <div style={MainContent}>
          <div style={StatusIcon}>⏱️</div>
          <h2 style={StatusTitle}>승인 대기중입니다</h2>
          <p style={StatusDescription}>
            회원가입이 완료되었습니다<br />
            관리자 승인 후 서비스를 이용하실 수 있습니다
          </p>

          <div style={Divider} />

          <form onSubmit={handleSubmit} style={FormSection}>
            <h3 style={FormTitle}>빠른 승인</h3>
            
            <div style={InputWrapper}>
              <input
                type="password"
                placeholder="관리자 비밀번호 입력"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setError('');
                }}
                style={Input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4CE6D1';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              style={{
                ...SubmitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
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
              {loading ? '인증 처리중...' : '즉시 인증하기'}
            </button>

            {error && <div style={ErrorMessage}>{error}</div>}

            <div style={InfoBox}>
              <strong>안내사항</strong>
              <br />• 관리자 비밀번호는 NeighBiz 운영팀이 입력해드립니다
              <br />• 일반적으로 1-2 영업일 이내 승인이 완료됩니다
              <br />• 문의사항이 있으시면 운영팀으로 연락주세요
            </div>
          </form>

          <div style={LicenseSection}>
            <h3 style={FormTitle}>사업자등록증 재업로드</h3>
            <input
              id="license-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="license-upload"
              style={FileLabel}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(76, 230, 209, 0.1)';
                e.target.style.borderColor = '#4CE6D1';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = 'rgba(76, 230, 209, 0.3)';
              }}
            >
              📷 {selectedFile ? selectedFile.name : '이미지 선택하기'}
            </label>
            <button
              type="button"
              onClick={handleUploadLicense}
              disabled={!selectedFile || uploadLoading}
              style={{
                ...UploadButton,
                opacity: !selectedFile || uploadLoading ? 0.5 : 1,
                cursor: !selectedFile || uploadLoading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (selectedFile && !uploadLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(76, 230, 209, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFile && !uploadLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(76, 230, 209, 0.3)';
                }
              }}
            >
              {uploadLoading ? '업로드 중...' : '사업자등록증 제출'}
            </button>

            {uploadSuccess && <div style={SuccessMessage}>{uploadSuccess}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerVerifyPage;