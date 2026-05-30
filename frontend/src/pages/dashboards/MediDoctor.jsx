import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mediDoctorService } from '../../services/mediDoctorService';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, Plus, Send, Activity, User, Bot, Loader2, FileText, ChevronRight, CheckCircle2, Menu, X } from 'lucide-react';
import DoctorSelectionModal from '../../components/DoctorSelectionModal';

const MediDoctor = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [requestedDoctorName, setRequestedDoctorName] = useState(null);
  const [consultationStatus, setConsultationStatus] = useState(null);
  const [doctorRemarks, setDoctorRemarks] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.role === 'Patient') {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversationId && activeConversationId !== 'new') {
      fetchMessages(activeConversationId);
    } else if (activeConversationId === 'new') {
      setMessages([]);
      setLatestAssessment(null);
      setRequestedDoctorName(null);
      setConsultationStatus(null);
      setDoctorRemarks(null);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const data = await mediDoctorService.getConversations(user.userId);
      setConversations(data);
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      } else if (data.length === 0) {
        setActiveConversationId('new');
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (id) => {
    setIsLoading(true);
    setRequestedDoctorName(null);
    try {
      const data = await mediDoctorService.getConversation(id);
      setMessages(data.messages || []);
      setLatestAssessment(data.latestAssessment || null);
      
      if (data.consultationRequest) {
        const req = data.consultationRequest;
        setConsultationStatus(req.status);
        setRequestedDoctorName(req.doctor?.name || 'a doctor');
        setDoctorRemarks(req.doctorRemarks);
      } else if (data.status === 'Requested') {
        setConsultationStatus('Requested');
        setRequestedDoctorName('a doctor');
      } else {
        setConsultationStatus(null);
        setRequestedDoctorName(null);
        setDoctorRemarks(null);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = { sender: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const targetId = activeConversationId || 'new';
      const response = await mediDoctorService.sendMessage(targetId, user.userId, userMessage.content);

      setMessages(prev => [...prev, { sender: 'assistant', content: response.message.content }]);

      if (targetId === 'new') {
        setActiveConversationId(response.conversationId);
        fetchConversations();
      }

      if (response.assessment) {
        setLatestAssessment(response.assessment);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleConsultationRequested = (doctorName) => {
    setRequestedDoctorName(doctorName);
    setIsDoctorModalOpen(false);
    // Refresh conversation list to update status badge in sidebar
    fetchConversations();
  };

  return (
    <div className="flex relative h-[calc(100vh-6rem)] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">

      {/* Main Chat Area — LEFT */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">MediDoctor AI Assistant</h2>
              <p className="text-xs text-slate-500">Your intelligent healthcare triage</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(true)} 
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors md:hidden"
            title="Open Chat History"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="bg-blue-50 p-6 rounded-full text-blue-600">
                <Bot size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">How can I help you today?</h3>
              <p className="max-w-md text-center text-sm">
                Describe your symptoms, and I will help gather information to prepare a consultation summary for a doctor.
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 shadow-sm rounded-tl-none text-slate-700'}`}>
                    {msg.sender === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%] flex-row">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500 text-white">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm rounded-tl-none text-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          {/* Assessment / Consultation Status Card */}
          {latestAssessment && !isSending && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              {consultationStatus === 'Accepted' ? (
                /* Accepted */
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-emerald-800">Consultation Accepted</h3>
                      <p className="text-emerald-700/80 text-sm mt-1">
                        Your request has been accepted by <span className="font-semibold">Dr. {requestedDoctorName}</span>. Check your Consultations tab for the appointment schedule.
                      </p>
                    </div>
                  </div>
                  {doctorRemarks && (
                    <div className="mt-2 bg-white/60 rounded-xl p-4 border border-emerald-100">
                      <p className="text-xs font-bold text-emerald-800 mb-1 uppercase tracking-wider">Doctor's Notes</p>
                      <p className="text-sm text-emerald-900">{doctorRemarks}</p>
                    </div>
                  )}
                </div>
              ) : consultationStatus === 'Requested' || requestedDoctorName ? (
                /* Requested */
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">Consultation Requested</h3>
                    <p className="text-blue-700/80 text-sm mt-1">
                      Your request has been sent to <span className="font-semibold">Dr. {requestedDoctorName}</span>. You will be notified once they respond.
                    </p>
                  </div>
                </div>
              ) : (
                /* Ready to request */
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4 text-blue-800">
                    <FileText size={24} />
                    <h3 className="font-bold text-lg">Consultation Assessment Ready</h3>
                  </div>
                  <p className="text-blue-900/80 mb-6 text-sm leading-relaxed">
                    I have collected enough information to generate a structured consultation summary. You can now submit this to a doctor on the MediLink network.
                  </p>
                  <button
                    onClick={() => setIsDoctorModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                  >
                    Request Doctor Consultation <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Describe your symptoms..."
              className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-2xl py-3 px-5 pr-14 resize-none transition-all text-slate-700 text-sm"
              rows="1"
              style={{ minHeight: '52px', maxHeight: '150px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending || consultationStatus === 'Accepted'}
              className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          {consultationStatus === 'Accepted' && (
            <p className="text-center text-sm text-emerald-600 font-medium mt-2">
              Chat is closed as the consultation has been accepted.
            </p>
          )}
          <p className="text-center text-[10px] text-slate-400 mt-2">
            MediDoctor is an AI assistant and does not provide medical diagnoses. Always consult a professional.
          </p>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content (Shared Desktop & Mobile) */}
      <div className={`
        absolute inset-y-0 right-0 z-50 w-72 bg-slate-50 border-l border-slate-200 flex flex-col transition-transform duration-300
        md:static md:translate-x-0 md:flex md:shrink-0
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => { setActiveConversationId('new'); setIsMobileSidebarOpen(false); }}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            <Plus size={20} />
            New
          </button>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="ml-3 p-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl md:hidden transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Chat History</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 pt-1 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No conversations yet.</p>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => { setActiveConversationId(conv.id); setIsMobileSidebarOpen(false); }}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                  activeConversationId === conv.id ? 'bg-blue-100 text-blue-900' : 'hover:bg-slate-200 text-slate-700'
                }`}
              >
                <MessageSquare size={16} className={`mt-0.5 shrink-0 ${activeConversationId === conv.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="min-w-0">
                  <span className="truncate text-sm font-medium block">{conv.title || 'New Consultation'}</span>
                  {consultationStatus === 'Requested' && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full mt-1 inline-block">Requested</span>
                  )}
                  {consultationStatus === 'Accepted' && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full mt-1 inline-block">Accepted</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {isDoctorModalOpen && (
        <DoctorSelectionModal
          onClose={() => setIsDoctorModalOpen(false)}
          onSuccess={handleConsultationRequested}
          conversationId={activeConversationId}
          assessment={latestAssessment}
        />
      )}
    </div>
  );
};

export default MediDoctor;
