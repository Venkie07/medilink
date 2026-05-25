import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import MediLinkCard from '../../components/MediLinkCard';
import StatsCard from '../../components/StatsCard';
import { Calendar, FileText, FlaskConical, Activity, Download, ChevronRight, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: cardRef,
        pageStyle: `
    @page {
      size: 85.6mm 53.98mm;
      margin: 0;
    }
    body {
      -webkit-print-color-adjust: exact;
    }
  `
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: myProfile } = await api.get('/patients/me');
            setPatient(myProfile);

            const [appts, prescs, labs] = await Promise.all([
                api.get('/appointments'),
                api.get('/prescriptions'),
                api.get('/lab/tests')
            ]);

            setAppointments(appts.data);
            setPrescriptions(prescs.data);
            setLabTests(labs.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse text-primary-600 font-bold">Loading your health records...</div>;

    return (
        <div className="space-y-10">
            {/* Header & Card */}
            <div className="flex flex-col xl:flex-row gap-10 items-start">
                <div className="flex-1 w-full space-y-6">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Personal Health Hub</h2>
                    {patient ? (
                        <div className="space-y-4">
                            <MediLinkCard ref={cardRef} patient={patient} />
                            <button
                                onClick={handlePrint}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Printer size={18} /> Print Digital Card
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-12 text-center text-slate-400 border-dashed border-2">
                            Patient profile not found.
                        </div>
                    )}
                </div>

                <div className="w-full xl:w-96 grid grid-cols-1 gap-2">
                    <StatsCard title="My Appointments" value={appointments.length} icon={Calendar} color="bg-blue-500" />
                    <StatsCard title="My Prescriptions" value={prescriptions.length} icon={FileText} color="bg-emerald-500" />
                    <StatsCard title="My Lab Reports" value={labTests.filter(t => t.status === 'Completed').length} icon={FlaskConical} color="bg-purple-500" />
                    {/* <StatsCard title="Health Score" value="A+" icon={Activity} color="bg-rose-500" /> */}
                </div>
            </div>

            {/* Records Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appointments */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                        Appointments <ChevronRight size={20} className="text-slate-300" />
                    </h3>
                    <div className="space-y-4">
                        {appointments.length === 0 ? <p className="text-center py-6 text-slate-400 italic">No scheduled visits</p> :
                            appointments.map(a => (
                                <div key={a.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white">
                                    <div className="bg-primary-100 p-3 rounded-xl text-primary-600">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-700">{a.doctor?.name}</p>
                                        <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString()} at {a.time}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                        a.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                        a.status === 'Attended' ? 'bg-emerald-100 text-emerald-600' :
                                        a.status === 'Missed' ? 'bg-rose-100 text-rose-600' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Lab Reports */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                        Lab Reports <ChevronRight size={20} className="text-slate-300" />
                    </h3>
                    <div className="space-y-4">
                        {labTests.length === 0 ? <p className="text-center py-6 text-slate-400 italic">No assigned lab tests</p> :
                            labTests.map(t => (
                                <div key={t.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white group hover:border-primary-200 transition-all">
                                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                                        <FlaskConical size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-700">{t.testName}</p>
                                        {t.status === 'Completed' ? (
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.report?.uploadDate ? new Date(t.report.uploadDate).toLocaleDateString() : 'N/A'}</p>
                                        ) : (
                                            <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">{t.status}</p>
                                        )}
                                    </div>
                                    {t.status === 'Completed' && t.report && (
                                        <button
                                            onClick={() => window.open(`http://localhost:5000/${t.report?.filePath}`)}
                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                            title="Download Report"
                                        >
                                            <Download size={20} />
                                        </button>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Prescriptions */}
            <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-6">Recent Prescriptions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {prescriptions.map(p => (
                        <div key={p.id} className="p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100">
                            <div className="flex justify-between items-start mb-4">
                                <FileText className="text-emerald-600" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase">Dr. {p.doctor?.name}</span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {p.medications.map((m, i) => (
                                    <div key={i} className="text-sm border-b border-emerald-100/50 pb-2 last:border-0">
                                        <p className="font-bold text-slate-700">{m.name}</p>
                                        <p className="text-[10px] text-slate-500">{m.dosage} • {m.frequency}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-slate-500 italic">"{p.instructions}"</p>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${p.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {p.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {prescriptions.length === 0 && <p className="col-span-full text-center py-8 text-slate-400 italic">No prescriptions found</p>}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
