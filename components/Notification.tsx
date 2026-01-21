import React from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const styles = {
    success: {
      bg: 'bg-gray-900/95',
      border: 'border-emerald-500/50',
      iconBg: 'bg-emerald-500',
      icon: Check,
      text: 'text-white'
    },
    error: {
      bg: 'bg-gray-900/95',
      border: 'border-red-500/50',
      iconBg: 'bg-red-500',
      icon: AlertCircle,
      text: 'text-white'
    },
    info: {
      bg: 'bg-white/95',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      icon: Info,
      text: 'text-gray-800'
    }
  };

  const currentStyle = styles[type];
  const Icon = currentStyle.icon;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in w-full max-w-sm px-4">
      <div className={`${currentStyle.bg} backdrop-blur-md ${currentStyle.text} px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border ${currentStyle.border}`}>
        <div className="flex items-center gap-3">
          <div className={`${currentStyle.iconBg} rounded-full p-1.5 shadow-sm flex-shrink-0`}>
            <Icon size={14} className="text-white stroke-[3]" />
          </div>
          <span className="font-bold text-sm leading-tight">{message}</span>
        </div>
        <button 
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-black/10 transition-colors ${type === 'info' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-400 hover:text-white'}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;