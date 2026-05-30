import React, { useState } from 'react';
import { X, Check, XCircle } from 'lucide-react';
import { mediDoctorService } from '../services/mediDoctorService';

const ConsultationReviewModal = ({ request, onClose, onActionComplete }) => {
  const [action, setAction] = useState(null); // 'accept' | 'reject' | null
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [doctorRemarks, setDoctorRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (action === 'accept') {
        await mediDoctorService.acceptRequest(request.id, {
          appointmentDate,
          appointmentTime,
          doctorRemarks
        });
      } else {
        await mediDoctorService.rejectRequest(request.id, {
          doctorRemarks
        });
      }
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Failed to submit action:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Consultation Request</h2>
            <p className="text-sm text-slate-500 mt-1">Patient: {request.patient?.user?.name || 'Unknown'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50">
          {/* Assessment Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 mb-4">AI Assessment</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-slate-500 font-medium">Summary:</span>
                  <p className="text-slate-800 mt-1">{request.latestAssessment?.summary}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Severity:</span>
                  <p className="text-slate-800 mt-1">{request.latestAssessment?.severity}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Suggested Specialist:</span>
                  <p className="text-slate-800 mt-1">{request.latestAssessment?.suggestedSpecialist}</p>
                </div>
                {request.latestAssessment?.symptoms && (
                  <div>
                    <span className="text-slate-500 font-medium">Symptoms:</span>
                    <ul className="list-disc pl-5 mt-1 text-slate-800">
                      {request.latestAssessment.symptoms.map((sym, i) => <li key={i}>{sym}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {!action && request.status === 'Pending' && (
              <div className="flex gap-4">
                <button 
                  onClick={() => setAction('accept')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Check size={20} /> Accept Request
                </button>
                <button 
                  onClick={() => setAction('reject')}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <XCircle size={20} /> Reject
                </button>
              </div>
            )}

            {action && (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-800">
                    {action === 'accept' ? 'Schedule Appointment' : 'Reject Request'}
                  </h3>
                  <button type="button" onClick={() => setAction(null)} className="text-sm text-slate-500 hover:underline">Cancel</button>
                </div>

                {action === 'accept' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                      <input 
                        type="date" 
                        required
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                      <input 
                        type="time" 
                        required
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {action === 'accept' ? 'Notes for Patient (Optional)' : 'Reason for Rejection'}
                  </label>
                  <textarea 
                    required={action === 'reject'}
                    value={doctorRemarks}
                    onChange={(e) => setDoctorRemarks(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full font-semibold py-3 px-4 rounded-xl text-white transition-all ${
                    action === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Action'}
                </button>
              </form>
            )}
          </div>

          {/* Chat History View placeholder */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Chat Summary Context</h3>
            <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl p-4 border border-slate-100">
               <p className="text-slate-500 text-sm whitespace-pre-wrap">{request.conversation?.summary || 'No summary available.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationReviewModal;
