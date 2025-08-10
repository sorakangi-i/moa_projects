import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import DonateCenter from './pages/DonateCenter';
import Community from './pages/Community';
import MyPage from './pages/MyPage';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <div className="flex flex-col ">
            <Header />
            <main className="w-2xl mx-auto p-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/donate-center" element={<DonateCenter />} />
                <Route path="/community" element={<Community />} />
                <Route path="/mypage" element={<MyPage />} />
              </Routes>
            </main>
            <div className="w-2xl mx-auto p-8 bg-gray-500">
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
