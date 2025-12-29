import React from 'react';
import logoImage from 'figma:asset/be7fb858b7b30ceea243eaa3af0fb0debf3d7468.png';

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