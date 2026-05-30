import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mediDoctorService } from '../../services/mediDoctorService';
import { Loader2, User, FileText, Calendar, Clock, ChevronRight } from 'lucide-react';
import ConsultationReviewModal from '../../components/ConsultationReviewModal';

const DoctorConsultations = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await mediDoctorService.getDoctorRequests(user.userId);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch doctor requests:', error);
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
          <p className="text-slate-500 mt-1">Review AI-assisted triage requests from patients.</p>
        </div>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
            You don't have any consultation requests at the moment.
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{req.patient?.user?.name || 'Unknown'}</h3>
                      <p className="text-sm text-slate-500">Requested: {new Date(req.requestedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <FileText size={18} />
                        AI Assessment
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        req.latestAssessment?.urgency?.toLowerCase() === 'critical' ? 'bg-red-100 text-red-700' : 
                        req.latestAssessment?.urgency?.toLowerCase() === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Urgency: {req.latestAssessment?.urgency || 'Normal'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {req.latestAssessment?.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                  <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold w-full text-center ${getStatusColor(req.status)}`}>
                    {req.status}
                  </div>
                  
                  {req.status === 'Accepted' && (
                    <div className="w-full bg-slate-50 rounded-xl p-3 text-sm text-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" /> {req.appointmentDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" /> {req.appointmentTime}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setSelectedRequest(req)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRequest && (
        <ConsultationReviewModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)}
          onActionComplete={fetchRequests}
        />
      )}
    </div>
  );
};

export default DoctorConsultations;
