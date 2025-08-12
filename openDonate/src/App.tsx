import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import DonateCenter from './pages/DonateCenter';
import DonateCenterDetail from './pages/DonateCenterDetail';
import Community from './pages/Community';
import CommunityDetail from './pages/CommunityDetail';
import CommunityWrite from './pages/CommunityWrite';
import MyPage from './pages/MyPage';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <div className="flex flex-col ">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/donate-center" element={<DonateCenter />} />
                <Route
                  path="/donate-center-detail/:id"
                  element={<DonateCenterDetail />}
                />
                <Route path="/community" element={<Community />} />
                <Route path="/community/:id" element={<CommunityDetail />} />
                <Route path="/community/write" element={<CommunityWrite />} />
                <Route path="/mypage" element={<MyPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
