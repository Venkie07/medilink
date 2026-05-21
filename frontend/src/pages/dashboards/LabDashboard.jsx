import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import { FlaskConical, Upload, CheckCircle, Search, Clock, FileText } from 'lucide-react';

const LabDashboard = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [reportFile, setReportFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/lab/tests');
            setTests(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load laboratory queue');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!reportFile || !selectedTest) return;

        const formData = new FormData();
        formData.append('report', reportFile);
        formData.append('labTestId', selectedTest.id);
        formData.append('resultSummary', summary);

        setUploading(true);
        try {
            await api.post('/lab/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Lab Report Uploaded Successfully!');
            setSelectedTest(null);
            setReportFile(null);
            setSummary('');
            fetchTests(); // Refresh the dynamic lab tests queue
        } catch (err) {
            console.error(err);
            toast.error('Lab report upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const pendingTests = tests.filter(t => t.status === 'Requested');
    const completedTests = tests.filter(t => t.status === 'Completed');

    // Filter queue by searchId or patient name
    const filteredTests = tests.filter(t => {
        const matchesSearch = !searchId || 
            t.patient?.patientId?.toLowerCase().includes(searchId.toLowerCase()) ||
            t.patient?.user?.userId?.toLowerCase().includes(searchId.toLowerCase());

        const matchesFilter = !filterQuery ||
            t.testName?.toLowerCase().includes(filterQuery.toLowerCase()) ||
            t.patient?.user?.name?.toLowerCase().includes(filterQuery.toLowerCase());

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Clinical Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Diagnostic Laboratory Dispatch</h1>
                <p className="text-sm text-slate-500">Manage real-time pending patient diagnostic requests and file uploads.</p>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Pending Requests" value={pendingTests.length} icon={Clock} color="bg-amber-600" />
                <StatsCard title="Completed Reports" value={completedTests.length} icon={CheckCircle} color="bg-emerald-600" />
                <StatsCard title="Active Laboratory Load" value={tests.length} icon={FlaskConical} color="bg-blue-600" />
            </div>

            {/* Main Terminal Queue & Action layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Search & Left sidebar queue */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-card p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FlaskConical className="text-blue-600" size={20} /> Live Diagnostic Queue
                            </h3>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-48">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        placeholder="Search patient..."
                                        value={filterQuery}
                                        onChange={e => setFilterQuery(e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={fetchTests}
                                    className="p-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-xs transition"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-12 text-center text-slate-400 text-sm">
                                Loading clinical queue...
                            </div>
                        ) : filteredTests.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 italic text-sm">
                                No diagnostic test assignments available in the queue.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTests.map(test => (
                                    <div 
                                        key={test.id} 
                                        onClick={() => test.status === 'Requested' && setSelectedTest(test)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                            selectedTest?.id === test.id
                                                ? 'bg-blue-50/50 border-blue-300 shadow-sm'
                                                : test.status === 'Completed'
                                                ? 'bg-slate-50/50 border-slate-100 opacity-75 cursor-default'
                                                : 'bg-white border-slate-200 hover:shadow-sm hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 text-sm">{test.testName}</p>
                                            <p className="text-xs text-slate-500">Patient: <span className="font-medium text-slate-700">{test.patient?.user?.name}</span> ({test.patient?.patientId})</p>
                                            <p className="text-[10px] text-slate-400">Ordered by Dr. {test.doctor?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${
                                                test.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {test.status}
                                            </span>
                                            {test.status === 'Requested' && (
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Upload size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right sidebar action box */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-blue-600" /> Dispatch Report
                        </h3>
                        {selectedTest ? (
                            <form onSubmit={handleUpload} className="space-y-4 animate-in fade-in duration-200">
                                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl mb-4">
                                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Active Test</p>
                                    <p className="text-sm font-bold text-slate-800 mt-1">{selectedTest.testName}</p>
                                    <p className="text-xs text-slate-500">Patient: {selectedTest.patient?.user?.name}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Report File (PDF/Image)</label>
                                    <input 
                                        type="file" 
                                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={e => setReportFile(e.target.files[0])}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Diagnostic Summary</label>
                                    <textarea 
                                        className="input-field min-h-[120px] text-sm" 
                                        placeholder="Enter clinical observations, measurements, or diagnostic results..."
                                        value={summary}
                                        onChange={e => setSummary(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button type="submit" className="btn-primary flex-1 py-2 text-sm" disabled={uploading}>
                                        {uploading ? 'Uploading...' : 'Submit Report'}
                                    </button>
                                    <button type="button" onClick={() => setSelectedTest(null)} className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
                                <Upload size={32} className="mb-2 opacity-30 text-blue-600" />
                                <p className="text-xs italic">Select a pending request from the live queue to upload results.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LabDashboard;
