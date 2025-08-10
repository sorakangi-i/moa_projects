import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // DB 연결과 초기화

const firebaseConfig = {
  apiKey: 'AIzaSyBWEoAQFUtp3bKzionr24gY-A2019fW0gE',
  authDomain: 'moa-projects-8618b.firebaseapp.com',
  projectId: 'moa-projects-8618b',
  storageBucket: 'moa-projects-8618b.firebasestorage.app',
  messagingSenderId: '579233006501',
  appId: '1:579233006501:web:70a0abd8dd219879f51e4c',
  // measurementId는 없어도 로그인은 됨
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
