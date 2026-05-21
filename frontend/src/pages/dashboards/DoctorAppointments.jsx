import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, User, CheckCircle, XCircle, Search, Clock, Trash2 } from 'lucide-react';
import StatsCard from '../../components/StatsCard';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            // Sort by date and time (nearest first)
            const sorted = data.sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return dateA - dateB;
            });
            setAppointments(sorted);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success(`Marked as ${status}`);
            fetchAppointments();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;
        try {
            await api.delete(`/appointments/${id}`);
            toast.success('Appointment deleted');
            fetchAppointments();
        } catch (err) {
            toast.error('Failed to delete appointment');
        }
    };

    const isTodayOrPast = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const apptDate = new Date(dateString);
        apptDate.setHours(0, 0, 0, 0);
        return apptDate <= today;
    };

    const isToday = (dateString) => {
        const today = new Date();
        const apptDate = new Date(dateString);
        return today.toDateString() === apptDate.toDateString();
    };

    const filteredAppointments = appointments.filter(a => 
        a.patient?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.patient?.patientId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center animate-pulse text-primary-600 font-bold text-xl items-center justify-center flex font-heading">Loading Appointments...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Appointments</h2>
                    <p className="text-slate-500">Track and manage patient attendance for today and upcoming visits.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <input 
                            className="input-field pl-10 py-2 w-64 lg:w-80" 
                            placeholder="Search Patient Name or ID..." 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                        />
                    </div>
                </div>
            </div>
            <br></br>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard 
                    title="Today's Appointments" 
                    value={appointments.filter(a => isToday(a.date)).length} 
                    icon={Clock} 
                    color="bg-primary-500" 
                />
                <StatsCard 
                    title="Pending Attendance" 
                    value={appointments.filter(a => isTodayOrPast(a.date) && a.status === 'Pending').length} 
                    icon={Calendar} 
                    color="bg-amber-500" 
                />
                <StatsCard 
                    title="Total Upcoming" 
                    value={appointments.filter(a => new Date(a.date) > new Date()).length} 
                    icon={User} 
                    color="bg-blue-500" 
                />
            </div>
            <br></br>
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold">Patient Details</th>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold text-center">Current Status</th>
                                <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Attendance Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No appointments found matching your criteria.</td>
                                </tr>
                            ) : (
                                filteredAppointments.map(a => {
                                    const available = isTodayOrPast(a.date);
                                    return (
                                        <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700">{a.patient?.user?.name}</span>
                                                    <span className="text-xs font-mono text-slate-400">{a.patient?.patientId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{new Date(a.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                    <span className="text-xs text-slate-400 font-bold">{a.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                                    a.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                                    a.status === 'Attended' ? 'bg-emerald-100 text-emerald-600' :
                                                    a.status === 'Missed' ? 'bg-rose-100 text-rose-600' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(a.id, 'Attended')}
                                                        disabled={!available || a.status !== 'Pending'}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                            available && a.status === 'Pending' 
                                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm' 
                                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                                                        }`}
                                                        title={!available ? "Only available on or after the day of appointment" : ""}
                                                    >
                                                        <CheckCircle size={16} /> Arrived
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(a.id, 'Missed')}
                                                        disabled={!available || a.status !== 'Pending'}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                            available && a.status === 'Pending' 
                                                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm' 
                                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                                                        }`}
                                                        title={!available ? "Only available on or after the day of appointment" : ""}
                                                    >
                                                        <XCircle size={16} /> Not Arrived
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(a.id)}
                                                        disabled={a.status !== 'Pending'}
                                                        className={`p-2 rounded-xl transition-all ${
                                                            a.status === 'Pending' 
                                                            ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-600' 
                                                            : 'text-slate-200 cursor-not-allowed'
                                                        }`}
                                                        title={a.status !== 'Pending' ? "Cannot delete processed appointments" : "Delete Appointment"}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
