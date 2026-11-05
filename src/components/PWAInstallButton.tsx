import React from 'react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = () => {
  // Silent null component to completely eliminate install prompts and keep native web browser experience
  return null;
};
