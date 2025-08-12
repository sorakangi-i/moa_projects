import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../services/communityService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

function CommunityWrite() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // 제목 글자 수 제한 (60자)
  const MAX_TITLE_LENGTH = 60;
  const titleLength = title.length;

  // 게시글 작성 처리
  const handleSubmit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!category) {
      alert('주제를 선택해주세요.');
      return;
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      const newPost = {
        title: title.trim(),
        content: content.trim(),
        category: category as '기부후기' | '자유게시판' | '공지사항',
        author: {
          id: user.uid,
          displayName: user.displayName || '익명',
          photoURL: user.photoURL || undefined,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0,
        comments: [],
        commentCount: 0,
      };

      await createPost(newPost);
      alert('게시글이 성공적으로 작성되었습니다!');
      navigate('/community');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-4">
            게시글을 작성하려면 로그인해주세요.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            로그인하기
          </Button>
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

      <div className="max-w-2xl mx-auto p-4">
        {/* 커뮤니티 가이드라인 배너 */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            건강한 커뮤니티 환경을 위해 운영 정책에 따라 일부 게시글은 노출 제한
            또는 삭제될 수 있습니다. 자세한 내용은 가이드라인을 참고해주세요.{' '}
            <button className="text-blue-600 hover:underline">
              커뮤니티 가이드라인 &gt;
            </button>
          </p>
        </div>

        {/* 게시글 작성 폼 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">게시글 작성</h1>

          {/* 주제 선택 */}
          <div className="mb-6">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              주제 선택
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="주제를 선택해주세요(필수)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="기부후기">기부후기</SelectItem>
                <SelectItem value="자유게시판">자유게시판</SelectItem>
                <SelectItem value="공지사항">공지사항</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 제목 입력 */}
          <div className="mb-6">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              제목
            </Label>
            <div className="relative">
              <Input
                id="title"
                type="text"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE_LENGTH}
                className="pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {titleLength}/{MAX_TITLE_LENGTH}
              </div>
            </div>
            {!category && (
              <p className="text-sm text-gray-500 mt-2">
                게시판을 먼저 선택해주세요.
              </p>
            )}
          </div>

          {/* 내용 입력 */}
          <div className="mb-6">
            <Label
              htmlFor="content"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              내용
            </Label>
            <Textarea
              id="content"
              placeholder="게시글 내용을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/community')}
              disabled={submitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !category || !title.trim() || !content.trim() || submitting
              }
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {submitting ? '작성 중...' : '게시글 작성'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityWrite;
