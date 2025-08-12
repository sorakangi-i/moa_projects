import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllPosts,
  incrementLikes,
  deletePost,
} from '../services/communityService';
import type { CommunityPost } from '../types/community';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('게시글 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts =
    selectedCategory === 'all'
      ? posts.filter((post) => post && post.id) // 유효한 게시글만 필터링
      : posts.filter(
          (post) => post && post.id && post.category === selectedCategory
        );

  const getTimeAgo = (date: Date) => {
    try {
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 60) {
        return `약 ${diffInMinutes}분 전`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `약 ${hours}시간 전`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `약 ${days}일 전`;
      }
    } catch (error) {
      console.error('시간 계산 오류:', error);
      return '방금 전';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case '기부후기':
        return '기부후기';
      case '자유게시판':
        return '자유게시판';
      case '공지사항':
        return '공지사항';
      default:
        return category;
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/community/${postId}`);
  };

  // 좋아요 버튼 클릭 처리
  const handleLikeClick = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // 게시글 클릭 이벤트 방지
    try {
      await incrementLikes(postId);
      // 게시글 목록 새로고침
      const postsData = await getAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  // 게시글 삭제 처리
  const handleDeleteClick = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // 게시글 클릭 이벤트 방지
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        // 게시글 목록 새로고침
        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-xl font-bold mb-2">게시글을 불러오는 중...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* 에러 처리 */}
        {posts.length > 0 && posts.some((post) => !post || !post.id) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              일부 게시글 데이터에 문제가 있어 표시되지 않을 수 있습니다.
            </p>
          </div>
        )}
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
            {user && (
              <Button
                onClick={() => navigate('/community/write')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                글쓰기
              </Button>
            )}
          </div>

          {/* 카테고리 탭 */}
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="기부후기">기부후기</TabsTrigger>
              <TabsTrigger value="자유게시판">자유게시판</TabsTrigger>
              <TabsTrigger value="공지사항">공지사항</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-3">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  {/* 게시글 내용 */}
                  <div className="flex-1 min-w-0">
                    {/* 메타데이터 */}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="mr-2">
                        {getCategoryDisplayName(post.category || '기타')}
                      </span>
                      <span className="mr-2">·</span>
                      <span className="mr-2">
                        📍 {post.author?.displayName || '익명'}
                      </span>

                      <span className="mr-2">·</span>
                      <span>
                        {post.createdAt
                          ? getTimeAgo(post.createdAt)
                          : '방금 전'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {post.title || '제목 없음'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {post.content || '내용 없음'}
                    </p>

                    {/* 좋아요, 댓글, 조회수 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <button
                          onClick={(e) => handleLikeClick(e, post.id)}
                          className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                        >
                          <span>👍</span>
                          <span>
                            {typeof post.likes === 'number' ? post.likes : 0}
                          </span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>
                            {typeof post.commentCount === 'number'
                              ? post.commentCount
                              : post.comments?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>👁️</span>
                          <span>
                            조회{' '}
                            {typeof post.views === 'number' ? post.views : 0}
                          </span>
                        </div>
                      </div>

                      {/* 삭제 버튼 (작성자만 표시) */}
                      {user && post.author?.id === user.uid && (
                        <button
                          onClick={(e) => handleDeleteClick(e, post.id)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 썸네일 이미지 (있는 경우) */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.attachments[0]}
                        alt="썸네일"
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">
                아직 게시글이 없어요
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory === 'all'
                  ? '첫 번째 게시글을 작성해보세요!'
                  : `${getCategoryDisplayName(
                      selectedCategory
                    )} 카테고리의 첫 게시글을 작성해보세요!`}
              </p>
              {user && (
                <Button
                  onClick={() => navigate('/community/write')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  글쓰기
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 로그인 안내 */}
        {!user && (
          <div className="bg-blue-50 rounded-lg p-4 mt-6 text-center">
            <p className="text-sm text-blue-600 mb-2">
              게시글을 작성하려면 로그인이 필요합니다.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              로그인하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;
