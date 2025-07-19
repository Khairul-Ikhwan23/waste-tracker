import { useEffect, useState } from 'react';
import Logo from '@/assets/logo.png';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center transition-opacity duration-500 z-50">
      <div className="animate-pulse">
        <img src={Logo} alt="Kitar360 Logo" className="h-32 w-auto" />
      </div>
    </div>
  );
}