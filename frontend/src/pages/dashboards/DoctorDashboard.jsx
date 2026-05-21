import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import Modal from '../../components/Modal';
import { Users, UserPlus, ClipboardList, FlaskConical, Search, Calendar, Plus, Trash2, FileText, History, Clock } from 'lucide-react';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Modals state
    const [activeModal, setActiveModal] = useState(null); // 'register', 'appointment', 'prescription', 'lab', 'history'
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Form states
    const [regData, setRegData] = useState({ userId: '', password: '', name: '', age: '', gender: 'Male', email: '', mobile: '', address: '' });
    const [apptData, setApptData] = useState({ date: '', time: '', reason: '' });
    const [prescData, setPrescData] = useState({ medications: [{ name: '', dosage: '', frequency: '' }], instructions: '' });
    const [labData, setLabData] = useState({ testName: '' });

    const [appointments, setAppointments] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        fetchPatients();
        fetchStats();
    }, []);

    const fetchPatients = async () => {
        try {
            const { data } = await api.get('/patients');
            setPatients(data);
        } catch (err) { console.error(err); }
    };

    const fetchPatientHistory = async (patientId) => {
        setHistoryLoading(true);
        try {
            const { data } = await api.get(`/patients/history/${patientId}`);
            // Merge and sort records
            const records = [
                ...(data.appointments || []).map(a => ({ ...a, type: 'Appointment', sortDate: new Date(`${a.date} ${a.time}`) })),
                ...(data.prescriptions || []).map(p => ({ ...p, type: 'Prescription', sortDate: new Date(p.createdAt) })),
                ...(data.labTests || []).map(l => ({ ...l, type: 'Lab Test', sortDate: new Date(l.createdAt) }))
            ].sort((a, b) => b.sortDate - a.sortDate);
            
            setPatientHistory({ ...data, records });
        } catch (err) {
            toast.error('Failed to load patient history');
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const [apptRes, labRes, prescRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/lab/tests'),
                api.get('/prescriptions')
            ]);
            setAppointments(apptRes.data);
            setLabTests(labRes.data);
            setPrescriptions(prescRes.data);
        } catch (err) { console.error(err); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/patients', regData);
            toast.success('Patient Registered Successfully');
            fetchPatients();
            setActiveModal(null);
            setRegData({ userId: '', password: '', name: '', age: '', gender: 'Male', email: '', mobile: '', address: '' });
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
        finally { setLoading(false); }
    };

    const handleAppointment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', { ...apptData, patientId: selectedPatient.id });
            toast.success('Appointment Scheduled Overall Successfully');
            setActiveModal(null);
        } catch (err) { toast.error('Error Scheduling Appointment'); }
    };

    const handlePrescription = async (e) => {
        e.preventDefault();
        try {
            await api.post('/prescriptions', { ...prescData, patientId: selectedPatient.id });
            toast.success('Prescription Created and Assigned Successfully');
            setActiveModal(null);
        } catch (err) { toast.error('Error Creating Prescription'); }
    };

    const handleLabRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/lab/request', { ...labData, patientId: selectedPatient.id });
            toast.success('Lab Test Requested and Assigned Successfully');
            setActiveModal(null);
        } catch (err) { toast.error('Error Requesting Lab Test'); }
    };

    const addMedication = () => {
        setPrescData({ ...prescData, medications: [...prescData.medications, { name: '', dosage: '', frequency: '' }] });
    };

    const removeMedication = (index) => {
        const meds = [...prescData.medications];
        meds.splice(index, 1);
        setPrescData({ ...prescData, medications: meds });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Patients" value={patients.length} icon={Users} color="bg-blue-500" />
                <StatsCard title="Upcoming Appointments" value={appointments.length} icon={Calendar} color="bg-emerald-500" />
                <StatsCard title="Pending Lab Requests" value={labTests.filter(t => t.status === 'Requested').length} icon={FlaskConical} color="bg-amber-500" />
            </div>
            <br></br>
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h3 className="text-xl font-bold">Patient Management</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <input className="input-field pl-10 py-2 w-64" placeholder="Search patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                        <button onClick={() => setActiveModal('register')} className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> Register
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="pb-4 font-semibold">Patient</th>
                                <th className="pb-4 font-semibold">ID</th>
                                <th className="pb-4 font-semibold">Contact</th>
                                <th className="pb-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {patients.filter(p => p.user?.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4">
                                        <p className="font-bold text-slate-700">{p.user?.name}</p>
                                        <p className="text-[10px] text-slate-400">{p.gender}, {p.age} years</p>
                                    </td>
                                    <td className="py-4 font-mono text-xs text-slate-500">{p.patientId}</td>
                                    <td className="py-4 text-sm text-slate-500">{p.user?.mobile}</td>
                                    <td className="py-4">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setSelectedPatient(p); fetchPatientHistory(p.id); setActiveModal('history'); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl" title="View History"><History size={18} /></button>
                                            <button onClick={() => { setSelectedPatient(p); setActiveModal('appointment'); }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl" title="Schedule Appointment"><Calendar size={18} /></button>
                                            <button onClick={() => { setSelectedPatient(p); setActiveModal('prescription'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl" title="Write Prescription"><ClipboardList size={18} /></button>
                                            <button onClick={() => { setSelectedPatient(p); setActiveModal('lab'); }} className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl" title="Request Lab Test"><FlaskConical size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <br></br>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Recent Prescriptions</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {prescriptions
                            .filter(p => !searchQuery || p.patient?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.patient?.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
                            .length === 0 ? <p className="text-center py-8 text-slate-400 italic">No prescriptions found</p> : 
                            prescriptions
                                .filter(p => !searchQuery || p.patient?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.patient?.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
                                .slice(0, 10).map(p => (
                                <div key={p.id} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800">{p.patient?.user?.name}</p>
                                        <p className="text-[10px] text-slate-500">{p.medications?.length} Medication(s) • {new Date(p.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                        p.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-600' : 
                                        p.status === 'Attended' ? 'bg-emerald-100 text-emerald-600' : 
                                        p.status === 'Missed' ? 'bg-rose-100 text-rose-600' : 
                                        'bg-amber-100 text-amber-600'
                                    }`}>
                                        {p.status || 'Active'}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Lab Results Reflection</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {labTests
                            .filter(t => !searchQuery || t.patient?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.patient?.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
                            .slice(0, 10).map(t => (
                            <div key={t.id} className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-slate-800">{t.testName}</p>
                                    <p className="text-[10px] text-slate-500">Patient: {t.patient?.user?.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {t.status === 'Completed' && t.report && (
                                        <button 
                                            onClick={() => window.open(`http://localhost:5000/${t.report.filePath}`, '_blank')}
                                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                            title="View Report"
                                        >
                                            <FileText size={16} />
                                        </button>
                                    )}
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {labTests.filter(t => !searchQuery || t.patient?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.patient?.patientId.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                             <p className="text-center py-8 text-slate-400 italic">No lab results found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={activeModal === 'history'} onClose={() => { setActiveModal(null); setPatientHistory(null); }} title={`Medical History: ${selectedPatient?.user?.name}`} size="xl">
                {historyLoading ? (
                    <div className="p-12 text-center animate-pulse text-indigo-600 font-bold">Loading records...</div>
                ) : patientHistory?.records?.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 italic">No medical records found for this patient.</div>
                ) : (
                    <div className="space-y-6 max-h-[70vh]  pr-2">
                        {patientHistory?.records.map((record, idx) => (
                            <div key={idx} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-6">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                                    record.type === 'Appointment' ? 'bg-emerald-400' :
                                    record.type === 'Prescription' ? 'bg-blue-400' :
                                    'bg-amber-400'
                                } shadow-sm`}></div>
                                
                                <div className="glass-card p-4 border-slate-100 hover:border-indigo-100 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1 inline-block ${
                                                record.type === 'Appointment' ? 'bg-emerald-50 text-emerald-600' :
                                                record.type === 'Prescription' ? 'bg-blue-50 text-blue-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                {record.type}
                                            </span>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock size={12} /> {new Date(record.sortDate).toLocaleDateString()} at {record.time || new Date(record.sortDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Dr. {record.doctor?.name}</p>
                                    </div>

                                    {record.type === 'Appointment' && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-700 font-medium">Reason: {record.reason || 'Routine Checkup'}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                record.status === 'Attended' ? 'bg-emerald-100 text-emerald-600' : 
                                                record.status === 'Missed' ? 'bg-rose-100 text-rose-600' : 
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    )}

                                    {record.type === 'Prescription' && (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {record.medications?.map((m, i) => (
                                                    <div key={i} className="bg-blue-50/50 p-2 rounded-xl border border-blue-50">
                                                        <p className="text-xs font-bold text-slate-700">{m.name}</p>
                                                        <p className="text-[10px] text-slate-500">{m.dosage} • {m.frequency}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            {record.instructions && <p className="text-[10px] text-slate-500 italic">"{record.instructions}"</p>}
                                        </div>
                                    )}

                                    {record.type === 'Lab Test' && (
                                        <div className="flex justify-between items-center bg-amber-50/30 p-3 rounded-2xl border border-amber-100">
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{record.testName}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                    record.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            {record.report && (
                                                <button 
                                                    onClick={() => window.open(`http://localhost:5000/${record.report.filePath}`, '_blank')}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="View Report"
                                                >
                                                    <FileText size={18} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            <Modal isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} title="Register New Patient">
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input-field" placeholder="User ID" value={regData.userId} onChange={e => setRegData({...regData, userId: e.target.value})} required />
                        <input className="input-field" type="password" placeholder="Password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} required />
                    </div>
                    <input className="input-field" placeholder="Full Name" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} required />
                    <input className="input-field" placeholder="Address" value={regData.address} onChange={e => setRegData({...regData, address: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input-field" type="number" placeholder="Age" value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})} required />
                        <select className="input-field" value={regData.gender} onChange={e => setRegData({...regData, gender: e.target.value})}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <input className="input-field" type="email" placeholder="Email Address" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />        
                    <input className="input-field" placeholder="Mobile" value={regData.mobile} onChange={e => setRegData({...regData, mobile: e.target.value})} required />
                    <button className="btn-primary w-full py-3" disabled={loading}>{loading ? 'Registering...' : 'Register Patient'}</button>
                </form>
            </Modal>

            <Modal isOpen={activeModal === 'appointment'} onClose={() => setActiveModal(null)} title={`Schedule: ${selectedPatient?.user?.name}`}>
                <form onSubmit={handleAppointment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input-field" type="date" value={apptData.date} onChange={e => setApptData({...apptData, date: e.target.value})} required />
                        <input className="input-field" type="time" value={apptData.time} onChange={e => setApptData({...apptData, time: e.target.value})} required />
                    </div>
                    <textarea className="input-field" placeholder="Reason for appointment" value={apptData.reason} onChange={e => setApptData({...apptData, reason: e.target.value})} />
                    <button className="btn-primary w-full py-3 text-white">Confirm Schedule</button>
                </form>
            </Modal>

            <Modal isOpen={activeModal === 'prescription'} onClose={() => setActiveModal(null)} title={`Write Prescription: ${selectedPatient?.user?.name}`}>
                <form onSubmit={handlePrescription} className="space-y-4">
                    {prescData.medications.map((med, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative">
                            {idx > 0 && <button type="button" onClick={() => removeMedication(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>}
                            <input className="input-field bg-white" placeholder="Medicine Name" value={med.name} onChange={e => {
                                const meds = [...prescData.medications];
                                meds[idx].name = e.target.value;
                                setPrescData({...prescData, medications: meds});
                            }} required />
                            <div className="grid grid-cols-2 gap-3">
                                <input className="input-field bg-white" placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={e => {
                                    const meds = [...prescData.medications];
                                    meds[idx].dosage = e.target.value;
                                    setPrescData({...prescData, medications: meds});
                                }} required />
                                <input className="input-field bg-white" placeholder="Freq (e.g. 1-0-1)" value={med.frequency} onChange={e => {
                                    const meds = [...prescData.medications];
                                    meds[idx].frequency = e.target.value;
                                    setPrescData({...prescData, medications: meds});
                                }} required />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addMedication} className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:underline">
                        <Plus size={14} /> Add Medicine
                    </button>
                    <textarea className="input-field" placeholder="Special Instructions" value={prescData.instructions} onChange={e => setPrescData({...prescData, instructions: e.target.value})} />
                    <button className="btn-primary w-full py-3">Submit Prescription</button>
                </form>
            </Modal>

            <Modal isOpen={activeModal === 'lab'} onClose={() => setActiveModal(null)} title={`Request Lab Test: ${selectedPatient?.user?.name}`}>
                <form onSubmit={handleLabRequest} className="space-y-4">
                    <input className="input-field" placeholder="Test Name (e.g. Blood Count, X-Ray)" value={labData.testName} onChange={e => setLabData({...labData, testName: e.target.value})} required />
                    <button className="btn-primary w-full py-3">Submit Request</button>
                </form>
            </Modal>
        </div>
    );
};

export default DoctorDashboard;
