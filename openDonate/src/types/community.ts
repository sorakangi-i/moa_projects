export interface CommunityPost {
  id: string; // 게시글 고유 아이디
  title: string;
  content: string;
  attachments?: string[]; // 첨부파일
  author: {
    // 작성자 정보
    id: string;
    displayName: string;
    photoURL?: string; // 프로필 이미지
  };
  category: '기부후기' | '자유게시판' | '공지사항';
  createdAt: Date; // 작성일
  updatedAt: Date; // 수정일
  isPinned?: boolean; // 고정 게시글 여부
  views: number; // 조회수
  likes: number; // 좋아요 수
  comments: Comment[]; // 댓글 목록
  commentCount: number; // 댓글 수
}

export interface Comment {
  id: string; // 댓글 고유 아이디(삭제, 수정, 조회에 사용. 리스트 랜더링할때 key로 사용)
  postId: string; // 어떤 게시글에 속한 댓글인지를 알려주는 역할(게시글과 댓글 사이 관계 형성)
  content: string;
  author: {
    // 작성자 정보
    id: string;
    displayName: string;
    photoURL?: string; // 프로필 이미지
  };
  createdAt: Date; // 작성일
  updatedAt: Date; // 수정일
  likes: number; // 좋아요 수
}
