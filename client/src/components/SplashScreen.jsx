import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#052E1B] lg:hidden">
      <img
        src="/images/splash-screen.png"
        alt="AyurvedaMart"
        className="w-full max-w-[360px] object-contain"
      />
    </div>
  );
};

export default SplashScreen;