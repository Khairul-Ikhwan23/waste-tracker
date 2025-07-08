import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

export default function MobileTestHelper() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Only show in development
  if (import.meta.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-2 right-2 z-50 bg-black text-white p-2 rounded text-xs font-mono">
      <div className="flex items-center space-x-2">
        <Badge variant={isMobile ? "default" : "secondary"}>
          {isMobile ? "Mobile" : "Desktop"}
        </Badge>
        <span>{screenSize.width}x{screenSize.height}</span>
      </div>
    </div>
  );
}