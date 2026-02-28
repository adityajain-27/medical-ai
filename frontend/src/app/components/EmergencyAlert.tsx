import { AlertTriangle, Phone, Bell, X } from 'lucide-react';

interface EmergencyAlertProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  condition?: string;
}

export function EmergencyAlert({ isOpen, onClose, patientName = 'Patient', condition }: EmergencyAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
        {/* Red Alert Header */}
        <div className="bg-[#EF4444] p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  High-Risk Condition Detected
                </h2>
                <p className="text-red-50">
                  Immediate Attention Recommended
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Alert Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Patient:</span> {patientName}
            </p>
            {condition && (
              <p className="text-sm text-gray-900 mt-1">
                <span className="font-semibold">Suspected Condition:</span> {condition}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              This patient requires urgent medical evaluation. Please take immediate action.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <button
              onClick={() => {
                alert('Emergency services contacted');
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-4 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors"
            >
              <Phone className="w-6 h-6" />
              <span className="text-sm font-medium">Call Emergency</span>
            </button>
            
            <button
              onClick={() => {
                alert('Physician notified');
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-4 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="text-sm font-medium">Notify Physician</span>
            </button>
            
            <button
              onClick={onClose}
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="text-sm font-medium">Continue Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
