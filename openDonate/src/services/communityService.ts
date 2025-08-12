import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
  getDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CommunityPost, Comment } from '../types/community';

// 글 작성
export const createPost = async (
  post: Omit<CommunityPost, 'id'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...post,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    throw error;
  }
};

// 모든 게시글 가져오기
export const getAllPosts = async (): Promise<CommunityPost[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id, // 게시글 id
      ...doc.data(), // 게시글 데이터
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      author: {
        id: doc.data().author.id,
        displayName: doc.data().author.displayName,
        photoURL: doc.data().author.photoURL,
      },
      views: doc.data().views,
      likes: doc.data().likes,
      comments: doc.data().comments,
      category: doc.data().category,
    })) as CommunityPost[];
  } catch (error) {
    console.error('게시글 목록 가져오기 실패:', error);
    throw error;
  }
};

// 카테고리별 게시글 가져오기
export const getPostsByCategory = async (
  category: string
): Promise<CommunityPost[]> => {
  try {
    const q = query(collection(db, 'posts'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      author: {
        id: doc.data().author.id,
        displayName: doc.data().author.displayName,
        photoURL: doc.data().author.photoURL,
      },
      views: doc.data().views,
      likes: doc.data().likes,
      comments: doc.data().comments,
      category: doc.data().category,
    })) as CommunityPost[];
  } catch (error) {
    console.error('카테고리별 게시글 가져오기 실패:', error);
    throw error;
  }
};

// 조회수 증가
export const incrementViews = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error('조회수 증가 실패:', error);
  }
};

// 좋아요 증가
export const incrementLikes = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
    });
  } catch (error) {
    console.error('좋아요 증가 실패:', error);
  }
};

// 특정 게시글 가져오기
export const getPostById = async (postId: string): Promise<CommunityPost> => {
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      author: {
        id: data.author.id,
        displayName: data.author.displayName,
        photoURL: data.author.photoURL,
      },
      views: data.views,
      likes: data.likes,
      comments: data.comments || [],
      commentCount: data.commentCount || 0,
      category: data.category,
    } as CommunityPost;
  } catch (error) {
    console.error('게시글 가져오기 실패:', error);
    throw error;
  }
};

// 댓글 추가
export const addComment = async (
  postId: string,
  comment: Comment
): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment),
      commentCount: increment(1),
    });
  } catch (error) {
    console.error('댓글 추가 실패:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};
