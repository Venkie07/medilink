import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mediDoctorService } from '../../services/mediDoctorService';
import { FileText, Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';

const PatientConsultations = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const data = await mediDoctorService.getPatientRequests(user.userId);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch patient requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Consultation Requests</h1>
          <p className="text-slate-500 mt-1">Track the status of your AI-assisted doctor consultations.</p>
        </div>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
            You haven't requested any consultations yet.
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Dr. {req.doctor?.name}</h3>
                  <p className="text-sm text-slate-500">{req.doctor?.hospitalName || 'General Physician'}</p>
                </div>

                <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold w-fit ${getStatusColor(req.status)}`}>
                  {req.status}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-2 font-medium">
                    <FileText size={18} />
                    AI Assessment Summary
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-3">
                    {req.latestAssessment?.summary || 'No summary available.'}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center">
                  {req.status === 'Accepted' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-700">
                        <Calendar size={18} className="text-blue-600" />
                        <span className="font-medium">{req.appointmentDate}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <Clock size={18} className="text-blue-600" />
                        <span className="font-medium">{req.appointmentTime}</span>
                      </div>
                      {req.doctorRemarks && (
                        <div className="mt-2 bg-white/60 rounded-xl p-4 border border-emerald-100">
                          <p className="text-xs font-bold text-emerald-800 mb-1 uppercase tracking-wider">Doctor's Notes</p>
                          <p className="text-sm text-emerald-900">{req.doctorRemarks}</p>
                        </div>
                      )}
                    </div>
                  ) : req.status === 'Rejected' ? (
                    <div className="flex gap-3 text-slate-700">
                      <AlertCircle size={18} className="text-red-500 shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-red-600 mb-1">Reason for Rejection</p>
                        <p className="text-sm">{req.doctorRemarks || 'No specific reason provided.'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 text-sm">
                      Waiting for doctor's response...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientConsultations;
