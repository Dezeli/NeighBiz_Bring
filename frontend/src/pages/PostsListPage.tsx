import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Author {
  id: number;
  name: string;
  category: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  expected_value: number;
  expected_duration: string;
  status: string;
  created_at: string;
  author: Author;
}

const PostsListPage = () => {
  const navigate = useNavigate();
  const { apiCall } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiCall({
          method: 'GET',
          url: '/posts/',
        });
        setPosts(response);
      } catch (err: any) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiCall]);

  const formatDuration = (duration: string) => {
    const durationMap: { [key: string]: string } = {
      '1_month': '1개월',
      '3_months': '3개월',
      '6_months': '6개월',
      'unlimited': '무기한',
    };
    return durationMap[duration] || duration;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons: { [key: string]: string } = {
      cafe: '☕',
      restaurant: '🍽️',
      beauty: '💄',
      etc: '🛍️',
    };
    return categoryIcons[category] || '🏪';
  };

  const getCategoryName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      cafe: '카페',
      restaurant: '식당',
      beauty: '미용',
      etc: '기타',
    };
    return categoryNames[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl text-white">📋</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">제휴 게시글</h1>
            <p className="text-gray-500">다른 사장님들의 제휴 제안을 확인해보세요</p>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => navigate('/owner/mypage')}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl shadow-md border transition-colors flex items-center justify-center"
            >
              <span className="mr-2">👤</span>
              마이페이지
            </button>
            <button
              disabled
              className="flex-1 bg-green-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md cursor-default flex items-center justify-center"
            >
              <span className="mr-2">📋</span>
              제휴 게시글
            </button>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">등록된 게시글이 없습니다</h3>
                <p className="text-gray-500 text-sm">
                  아직 제휴 제안이 없어요.<br />
                  조금 더 기다려보세요!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  {/* 게시글 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg">{getCategoryIcon(post.author.category)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                        <p className="text-sm text-gray-500">
                          {getCategoryName(post.author.category)} • {formatDate(post.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        모집중
                      </div>
                    </div>
                  </div>

                  {/* 쿠폰 설명 */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-800 font-medium mb-2">🎫 제공 쿠폰</p>
                    <p className="text-gray-600">{post.description}</p>
                  </div>

                  {/* 쿠폰 정보 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-600 font-medium mb-1">예상 가치</p>
                      <p className="text-lg font-bold text-blue-800">
                        {formatPrice(post.expected_value)}원
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-purple-600 font-medium mb-1">유효 기간</p>
                      <p className="text-lg font-bold text-purple-800">
                        {formatDuration(post.expected_duration)}
                      </p>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
                      onClick={() => alert('제휴 신청 기능은 곧 출시됩니다!')}
                    >
                      <span className="mr-2">🤝</span>
                      제휴 신청하기
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 푸터 */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400">
              네이비즈 소상공인 제휴 플랫폼
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsListPage;