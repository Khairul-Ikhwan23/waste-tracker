import { useEffect, useState } from 'react';
import Logo from '@/assets/logo.png';

export default function SplashScreen() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start animation after 1 second
    const animationTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 1000);

    // Remove component completely after animation
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // 1s delay + 0.5s animation

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-500 ease-in-out ${
        isAnimating ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="animate-pulse">
        <img src={Logo} alt="Kitar360 Logo" className="h-32 w-auto" />
      </div>
    </div>
  );
}