import React, { useState, useEffect } from 'react';
import { X, Search, User as UserIcon, Loader2, CheckCircle } from 'lucide-react';
import { mediDoctorService } from '../services/mediDoctorService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorSelectionModal = ({ onClose, onSuccess, conversationId, assessment }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/consultations/doctors');
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDoctor = async (doctorId, doctorName) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await mediDoctorService.createConsultationRequest({
        patientId: user.userId,
        doctorId,
        conversationId
      });
      setSelectedDoctorName(doctorName);
      setTimeout(() => {
        if (onSuccess) onSuccess(doctorName);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to create consultation request:', error);
      setIsSubmitting(false);
    }
  };

  if (selectedDoctorName) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Request Sent!</h2>
          <p className="text-slate-500">Your request was sent to <span className="font-semibold">Dr. {selectedDoctorName}</span>. You will be notified once they respond.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Select a Doctor</h2>
            <p className="text-sm text-slate-500 mt-1">Suggested: {assessment?.suggestedSpecialist}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No doctors found matching your search.
            </div>
          ) : (
            filteredDoctors.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Dr. {doc.name}</h3>
                    <p className="text-sm text-slate-500">{doc.hospitalName || 'General Physician'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSelectDoctor(doc.id, doc.name)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white disabled:opacity-50"
                >
                  Select
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSelectionModal;
