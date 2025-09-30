'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWADownloadButtonProps {
  variant?: 'default' | 'icon' | 'app-store';
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function PWADownloadButton({ 
  variant = 'default', 
  className = '',
  size = 'default'
}: PWADownloadButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support the install prompt
      // Show instructions for manual installation
      if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
        alert('To install: Tap the Share button and select "Add to Home Screen"');
      } else {
        alert('To install: Look for the install icon in your browser\'s address bar');
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setCanInstall(false);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Icon variant for navigation bars
  if (variant === 'icon') {
    return (
      <Button
        onClick={handleInstallClick}
        variant="ghost"
        size={size}
        className={`p-2 ${className}`}
        title="Install App"
      >
        <Download className="h-5 w-5" />
      </Button>
    );
  }

  // App Store style button
  if (variant === 'app-store') {
    return (
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center justify-center bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors ${className}`}
        style={{ minHeight: '48px' }}
      >
        <div className="flex items-center space-x-2">
          <Smartphone className="h-6 w-6" />
          <div className="text-left">
            <div className="text-xs opacity-90">Install</div>
            <div className="text-sm font-medium">Tailgate Scooters</div>
          </div>
        </div>
      </button>
    );
  }

  // Default button variant
  return (
    <Button
      onClick={handleInstallClick}
      className={`bg-sky-600 hover:bg-sky-700 text-white flex items-center space-x-2 ${className}`}
      size={size}
    >
      <Download className="h-4 w-4" />
      <span>Install App</span>
    </Button>
  );
}
