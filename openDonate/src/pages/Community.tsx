import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllPosts,
  createPost,
  incrementViews,
  incrementLikes,
} from '../services/communityService';
import type { CommunityPost } from '../types/community';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

function Community() {
  const { user } = useAuth(); // 현재 로그인한 사용자 정보
  const [activeTab, setActiveTab] = useState<
    '기부후기' | '자유게시판' | '공지사항'
  >('기부후기');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  // 새글 작성 상태
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });

  // 게시글 목록 가져오기
  const loadPosts = async () => {
    try {
      setLoading(true);
      const posts = await getAllPosts();
      setPosts(posts);
    } catch (error) {
      console.error('게시글 목록 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 게시글 목록 가져오기
  useEffect(() => {
    loadPosts();
  }, []);

  // 새 글 작성
  const addPost = async (): Promise<string | null> => {
    if (
      newPost.title.trim() &&
      newPost.content.trim() &&
      user &&
      user.displayName
    ) {
      try {
        const postData = {
          title: newPost.title,
          content: newPost.content,
          category: activeTab,
          author: {
            id: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || undefined,
          },
          views: 0,
          likes: 0,
          comments: 0,
          isPinned: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const postId = await createPost(postData);

        // 폼 초기화
        setNewPost({ title: '', content: '' });
        setShowWriteForm(false);

        // 게시글 목록 다시 로드
        await loadPosts();

        alert('게시글이 작성되었습니다!');
        return postId;
      } catch (error) {
        console.error('게시글 작성 실패:', error);
        alert('게시글 작성에 실패했습니다.');
        return null;
      }
    }
    return null; // 조건을 만족하지 않을 때
  };

  // 게시글 클릭 시 조회수 증가
  const handlePostClick = async (post: CommunityPost) => {
    setSelectedPost(post);
    await incrementViews(post.id);
    setPosts(
      posts.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
    );
  };

  // 좋아요 클릭
  const handleLikeClick = async (postId: string) => {
    await incrementLikes(postId);
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
    }
  };

  // 현재 탭의 게시글만 필터링
  const filteredPosts = posts.filter((post) => post.category === activeTab);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">커뮤니티</h2>

      {/* 탭 컴포넌트 */}
      <Tabs defaultValue="기부후기" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="기부후기"
            onClick={() => setActiveTab('기부후기')}
          >
            기부후기
          </TabsTrigger>
          <TabsTrigger
            value="자유게시판"
            onClick={() => setActiveTab('자유게시판')}
          >
            자유게시판
          </TabsTrigger>
          <TabsTrigger
            value="공지사항"
            onClick={() => setActiveTab('공지사항')}
          >
            공지사항
          </TabsTrigger>
        </TabsList>
        <TabsContent value="기부후기">
          {loading && <p>게시글을 불러오는 중...</p>}
          <section>
            <div>
              {!loading && filteredPosts.length === 0 ? (
                <p>아직 등록된 게시글이 없습니다.</p>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="border p-4 my-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-600">
                      {post.content.length > 100
                        ? post.content.substring(0, 100) + '...'
                        : post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-xs mt-2">
                      <span>조회수: {post.views}</span>
                      <span>좋아요: {post.likes}</span>
                      <span>작성자: {post.author.displayName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="자유게시판">
          {/* 자유게시판 컨텐츠 */}
          {loading && <p>게시글을 불러오는 중...</p>}
          <section>
            <div>
              {!loading && filteredPosts.length === 0 ? (
                <p>아직 등록된 게시글이 없습니다.</p>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="border p-4 my-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-600">
                      {post.content.length > 100
                        ? post.content.substring(0, 100) + '...'
                        : post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-xs mt-2">
                      <span>조회수: {post.views}</span>
                      <span>좋아요: {post.likes}</span>
                      <span>작성자: {post.author.displayName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="공지사항">
          {/* 공지사항 컨텐츠 */}
          {loading && <p>게시글을 불러오는 중...</p>}
          <section>
            <div>
              {!loading && filteredPosts.length === 0 ? (
                <p>아직 등록된 게시글이 없습니다.</p>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="border p-4 my-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-600">
                      {post.content.length > 100
                        ? post.content.substring(0, 100) + '...'
                        : post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-xs mt-2">
                      <span>조회수: {post.views}</span>
                      <span>좋아요: {post.likes}</span>
                      <span>작성자: {post.author.displayName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* 글쓰기 버튼 */}
      {user && (
        <button
          onClick={() => setShowWriteForm(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          글쓰기
        </button>
      )}

      {/* 글쓰기 폼 */}
      {showWriteForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">새 글 작성</h3>
            <input
              type="text"
              placeholder="제목"
              className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <textarea
              placeholder="내용"
              className="w-full p-2 h-40 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowWriteForm(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={addPost}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                작성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 상세 보기 */}
      {selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">{selectedPost.title}</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              작성자: {selectedPost.author.displayName}
            </p>
            <div className="prose max-w-none mb-6">
              <p>{selectedPost.content}</p>
            </div>
            <div className="flex items-center space-x-6 text-gray-500 text-sm">
              <span className="flex items-center">
                <span className="mr-1">👀</span> 조회 {selectedPost.views}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeClick(selectedPost.id);
                }}
                className="flex items-center cursor-pointer hover:text-red-500"
              >
                <span className="mr-1">❤️</span> 좋아요 {selectedPost.likes}
              </span>
              <span className="flex items-center">
                <span className="mr-1">💬</span> 댓글 {selectedPost.comments}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;
