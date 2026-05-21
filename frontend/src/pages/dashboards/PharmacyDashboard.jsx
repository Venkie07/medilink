import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import { Store, Search, ClipboardList, Pill, User } from 'lucide-react';

const PharmacyDashboard = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [searchId, setSearchId] = useState('');

    const handleDispense = async (id) => {
        try {
            await api.patch(`/prescriptions/${id}/status`, { status: 'Dispensed' });
            toast.success('Medication Dispensed Successfully');
            // Refresh local state
            setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, status: 'Dispensed' } : p));
        } catch (err) {
            toast.error('Error marking as dispensed');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        try {
            const { data } = await api.get('/prescriptions');
            const patientPrescs = data.filter(p => 
                p.patient?.patientId?.toLowerCase() === searchId.toLowerCase() ||
                p.patient?.user?.userId?.toLowerCase() === searchId.toLowerCase()
            );
            setPrescriptions(patientPrescs);
            if (patientPrescs.length === 0) alert('No prescriptions found for this Patient ID');
        } catch (err) {
            console.error(err);
            alert('Error fetching prescriptions');
        }
    };

    return (
        <div className="space-y-8">
            <div className="glass-card p-8 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                <div className="max-w-xl">
                    <h2 className="text-2xl font-bold mb-2">Pharmacy Dispensing Terminal</h2>
                    <p className="text-emerald-100 text-sm mb-6 opacity-90">Enter a Patient ID to access active medical prescriptions and mark them as dispensed.</p>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                            <input
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                                placeholder="Enter Patient ID (e.g. MEDI-1234)..."
                                value={searchId}
                                onChange={e => setSearchId(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-lg active:scale-95">
                            Search
                        </button>
                    </form>
                </div>
            </div>
            <br></br>
            {prescriptions.length > 0 ? (
                <>
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <StatsCard title="Active Prescriptions" value={prescriptions.length} icon={Pill} color="bg-emerald-500" />
                </div>
                <br></br>   
                <div className="glass-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Store className="text-emerald-600" /> Patient Prescriptions
                        </h3>
                        {/* Removed search input as per the implied change in the provided code edit */}
                        {/* <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                className="input-field pl-10 py-2"
                                placeholder="Patient ID or Name..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div> */}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Changed from filteredPrescriptions to prescriptions as per the implied change */}
                        {prescriptions.map(presc => (
                            <div key={presc.id} className="glass-card p-6 border-emerald-100 hover:border-emerald-300 transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{presc.patient?.user?.name}</h4>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{presc.patient?.patientId}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {presc.medications.map((med, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                                            <span className="font-medium text-slate-700">{med.name}</span>
                                            <span className="text-xs text-slate-400">{med.dosage} • {med.frequency}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    {/* Changed "Prescribed by Dr." to "Dr." as per the implied change */}
                                    <p className="text-[10px] text-slate-400">Dr. {presc.doctor?.name}</p>
                                    <button 
                                        onClick={() => handleDispense(presc.id)}
                                        disabled={presc.status === 'Dispensed'}
                                        className={`px-3 py-1 text-white text-xs rounded-lg transition shadow-sm ${
                                            presc.status === 'Dispensed' ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                                        }`}
                                    >
                                        {presc.status === 'Dispensed' ? 'Dispensed' : 'Mark Dispensed'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Removed conditional for filteredPrescriptions.length === 0 as it's now handled by the top-level conditional */}
                        {/* {filteredPrescriptions.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-400 italic">
                                No prescriptions found matching your search.
                            </div>
                        )} */}
                    </div>
                </div>
                </>
            ) : (
                <div className="glass-card p-12 text-center text-slate-400 italic">
                    Search for a Patient ID to view active medical prescriptions.
                </div>
            )}
        </div>
    );
};

export default PharmacyDashboard;
