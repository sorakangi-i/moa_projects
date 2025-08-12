function Footer() {
  return (
    <footer className="bg-gray-100 py-8 px-4 mt-10">
      <div className="container mx-auto flex flex-col items-center justify-center text-center">
        {/* 로고 */}
        <img src="/images/logo.png" alt="Open Donate" className="h-10 mb-4" />

        {/* 저작권 정보 */}
        <p className="text-sm text-gray-500 mb-4">
          © 2025 Open Donate. All rights reserved.
        </p>

        {/* 문의 정보 */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            문의 :
            <a href="mailto:opendonate@naver.com" className="hover:underline">
              opendonate@naver.com
            </a>
          </p>
          <p>
            전화 :
            <a href="tel:010-3057-6693" className="hover:underline">
              010-3057-6693
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
