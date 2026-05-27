import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTimes, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?", 
  confirmText = "Xác nhận", 
  cancelText = "Hủy",
  type = "danger" // 'danger', 'info', 'warning'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'danger': return <FaExclamationTriangle className="text-red-500 text-3xl" />;
      case 'warning': return <FaQuestionCircle className="text-yellow-500 text-3xl" />;
      case 'info': return <FaInfoCircle className="text-blue-500 text-3xl" />;
      default: return <FaExclamationTriangle className="text-red-500 text-3xl" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger': return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
      case 'warning': return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500";
      case 'info': return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600";
      default: return "bg-daidong-black hover:bg-daidong-red focus:ring-daidong-black";
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            type === 'danger' ? 'bg-red-100' : 
            type === 'warning' ? 'bg-yellow-100' : 
            'bg-blue-100'
          }`}>
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-8">{message}</p>
          
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getConfirmButtonClass()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
