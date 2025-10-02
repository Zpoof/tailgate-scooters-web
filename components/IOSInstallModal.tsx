'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { X, Share, Plus, Smartphone } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallModal({ isOpen, onClose }: IOSInstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-6 w-6 text-cornell-red" />
              <h2 className="text-lg font-semibold text-gray-900">Install App</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Install Tailgate Scooters on your home screen for quick access and a native app experience.
            </p>

            {/* Step 1 */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-cornell-red text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Share className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">Tap the Share button</span>
                </div>
                <p className="text-xs text-gray-600">
                  Look for the share icon in your browser's toolbar (usually at the bottom of the screen)
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-cornell-red text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Plus className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Select "Add to Home Screen"</span>
                </div>
                <p className="text-xs text-gray-600">
                  Scroll down in the share menu and tap "Add to Home Screen"
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-cornell-red text-white rounded-full flex items-center justify-center text-xs font-medium">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Smartphone className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">Confirm installation</span>
                </div>
                <p className="text-xs text-gray-600">
                  Tap "Add" to install the app on your home screen
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Why install?</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Faster loading and better performance</li>
                <li>• Works offline for basic features</li>
                <li>• Native app-like experience</li>
                <li>• Quick access from your home screen</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
