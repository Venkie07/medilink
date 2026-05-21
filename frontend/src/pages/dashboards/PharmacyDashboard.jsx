import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import { Store, Search, ClipboardList, Pill, User, Clock, CheckCircle } from 'lucide-react';

const PharmacyDashboard = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/prescriptions');
            setPrescriptions(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load live pharmacy queue');
        } finally {
            setLoading(false);
        }
    };

    const handleDispense = async (id) => {
        try {
            await api.patch(`/prescriptions/${id}/status`, { status: 'Dispensed' });
            toast.success('Medication Dispensed Successfully');
            // Refresh queue state
            setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, status: 'Dispensed' } : p));
        } catch (err) {
            toast.error('Error marking as dispensed');
        }
    };

    const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
    const dispensedCount = prescriptions.filter(p => p.status === 'Dispensed').length;

    // Filtered queue search
    const filteredPrescriptions = prescriptions.filter(p => {
        const matchesSearch = !searchId || 
            p.patient?.patientId?.toLowerCase().includes(searchId.toLowerCase()) ||
            p.patient?.user?.userId?.toLowerCase().includes(searchId.toLowerCase());
        
        const matchesFilter = !filterQuery ||
            p.patient?.user?.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
            p.patient?.patientId?.toLowerCase().includes(filterQuery.toLowerCase());
            
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Clinical Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Pharmacy Queue & Dispensing</h1>
                <p className="text-sm text-slate-500">Manage real-time pending prescriptions and dispense patient medications.</p>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Pending Dispensing" value={activePrescriptions.length} icon={Clock} color="bg-blue-600" />
                <StatsCard title="Dispensed Today" value={dispensedCount} icon={CheckCircle} color="bg-emerald-600" />
                <StatsCard title="Total Queue Size" value={prescriptions.length} icon={Pill} color="bg-slate-600" />
            </div>

            {/* Main Dispensing Terminal */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                
                {/* Search and Filters Sidebar */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="glass-card p-5 space-y-4">
                        <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Search & Filters</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Search Patient ID</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        placeholder="MEDI-1234..."
                                        value={searchId}
                                        onChange={e => setSearchId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Filter Name / Key</label>
                                <input
                                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    placeholder="Patient Name..."
                                    value={filterQuery}
                                    onChange={e => setFilterQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={fetchPrescriptions}
                            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition"
                        >
                            Refresh Queue
                        </button>
                    </div>
                </div>

                {/* Live Prescription Queue List */}
                <div className="xl:col-span-3">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Store className="text-blue-600" size={20} /> Live Dispensing Line
                            </h3>
                            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">
                                {filteredPrescriptions.filter(p => p.status === 'Active').length} Waiting
                            </span>
                        </div>

                        {loading ? (
                            <div className="py-12 text-center text-slate-400 text-sm">
                                Loading live queue...
                            </div>
                        ) : filteredPrescriptions.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 italic text-sm">
                                No active prescription requests waiting in the queue.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredPrescriptions.map(presc => (
                                    <div 
                                        key={presc.id} 
                                        className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                                            presc.status === 'Dispensed' 
                                                ? 'bg-slate-50/50 border-slate-100 opacity-75' 
                                                : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        presc.status === 'Dispensed' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{presc.patient?.user?.name}</h4>
                                                        <p className="text-[10px] text-slate-400 font-mono tracking-wider">{presc.patient?.patientId}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                                    presc.status === 'Dispensed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                    {presc.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-6">
                                                {presc.medications.map((med, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50/70 rounded-lg">
                                                        <span className="font-semibold text-slate-700">{med.name}</span>
                                                        <span className="text-[10px] text-slate-400">{med.dosage} • {med.frequency}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-auto">
                                            <p className="text-[10px] text-slate-400">Dr. {presc.doctor?.name}</p>
                                            <button 
                                                onClick={() => handleDispense(presc.id)}
                                                disabled={presc.status === 'Dispensed'}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                                    presc.status === 'Dispensed' 
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm'
                                                }`}
                                            >
                                                {presc.status === 'Dispensed' ? 'Dispensed' : 'Mark Dispensed'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PharmacyDashboard;
