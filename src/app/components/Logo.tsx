import React from 'react';
//import logoImage from 'figma:asset/9912caf33a17623d5c9a5067ec11389749d17479.png';
export function Logo() {
  return <img src="/images/logo.png" alt="AI Product Day Logo" />;
}

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'full' }) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="AI Product Day" 
        className={`${sizes[size]} w-auto object-contain`}
      />
    </div>
  );
};
