import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getPostById,
  addComment,
  incrementViews,
  incrementLikes,
} from '../services/communityService';
import { useAuth } from '../contexts/AuthContext';
import type { CommunityPost, Comment } from '../types/community';
import { Button } from '../components/ui/button';

function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const postData = await getPostById(id);
        setPost(postData);

        // 조회수 증가
        await incrementViews(id);
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 댓글 날짜를 안전하게 변환하는 함수
  const getCommentDate = (date: unknown): string => {
    try {
      if (!date) return '방금 전';

      if (date instanceof Date) {
        return date.toLocaleDateString('ko-KR');
      }

      // 문자열이나 숫자인 경우
      if (typeof date === 'string' || typeof date === 'number') {
        return new Date(date).toLocaleDateString('ko-KR');
      }

      return '방금 전';
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '방금 전';
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim() || !id) return;

    try {
      setSubmitting(true);
      const comment: Comment = {
        id: Date.now().toString(), // 임시 ID
        postId: id,
        content: newComment.trim(),
        author: {
          id: user.uid,
          displayName: user.displayName || '익명',
          photoURL: user.photoURL || undefined,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
      };

      await addComment(id, comment);
      setNewComment('');

      // 게시글 다시 불러오기
      const updatedPost = await getPostById(id);
      setPost(updatedPost);
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 좋아요 버튼 클릭 처리
  const handleLikeClick = async () => {
    if (!id) return;
    try {
      await incrementLikes(id);
      // 게시글 다시 불러오기
      const updatedPost = await getPostById(id);
      setPost(updatedPost);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-xl font-bold mb-2">게시글을 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">게시글을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">
            요청하신 게시글 정보가 존재하지 않습니다.
          </p>
          <button
            onClick={() => navigate('/community')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            커뮤니티로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 뒤로가기 버튼 */}
      <div className="bg-white border-b">
        <div className="p-4">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span>←</span>
            <span>커뮤니티로 돌아가기</span>
          </button>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 게시글 헤더 */}
          <div className="p-6 border-b">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {post.author.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {post.author.displayName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {post.createdAt.toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {post.title}
            </h1>
          </div>

          {/* 게시글 본문 */}
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* 좋아요, 조회수 */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <button
                  onClick={handleLikeClick}
                  className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                >
                  <span>👍</span>
                  <span>{typeof post.likes === 'number' ? post.likes : 0}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <span>👁️</span>
                  <span>
                    조회 {typeof post.views === 'number' ? post.views : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="p-6 border-t bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">댓글</h3>

            {/* 댓글 작성 폼 */}
            {user && (
              <div className="mb-6 bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {(user.displayName || '익명').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.displayName || '익명'}
                  </span>
                </div>
                <textarea
                  placeholder="댓글을 작성해주세요..."
                  value={newComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewComment(e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {submitting ? '작성 중...' : '댓글 작성'}
                  </Button>
                </div>
              </div>
            )}

            {/* 댓글 목록 */}
            {post.comments &&
            Array.isArray(post.comments) &&
            post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment: Comment, index: number) => (
                  <div
                    key={comment.id || index}
                    className="bg-white p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {comment.author?.displayName
                            ?.charAt(0)
                            .toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {comment.author?.displayName || '익명'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getCommentDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {comment.content || '내용 없음'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-gray-600">아직 댓글이 없어요</p>
                <p className="text-sm text-gray-500">
                  {user
                    ? '첫 번째 댓글을 남겨보세요!'
                    : '로그인하고 댓글을 남겨보세요!'}
                </p>
              </div>
            )}

            {/* 로그인 안내 */}
            {!user && (
              <div className="text-center py-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">
                  댓글을 작성하려면 로그인이 필요합니다.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  로그인하기
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetail;
