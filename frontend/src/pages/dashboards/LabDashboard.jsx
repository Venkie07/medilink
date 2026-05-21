import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import { FlaskConical, Upload, CheckCircle, Search, Clock } from 'lucide-react';

const LabDashboard = () => {
    const [tests, setTests] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [reportFile, setReportFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [searchId, setSearchId] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;
        
        try {
            const { data } = await api.get('/lab/tests');
            // Filter by patient ID or Name if needed, but the user specifically asked for Patient ID access
            const patientTests = data.filter(t => 
                t.patient?.patientId?.toLowerCase() === searchId.toLowerCase() ||
                t.patient?.user?.userId?.toLowerCase() === searchId.toLowerCase()
            );
            setTests(patientTests);
            if (patientTests.length === 0) alert('No tests found for this Patient ID');
        } catch (err) {
            console.error(err);
            toast.error('Error fetching tests');
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
            toast.success('Report uploaded successfully!');
            setSelectedTest(null);
            setReportFile(null);
            setSummary('');
            // Trigger a re-search to refresh the list
            if (searchId) {
                const { data: allTests } = await api.get('/lab/tests');
                const patientTests = allTests.filter(t => 
                    t.patient?.patientId?.toLowerCase() === searchId.toLowerCase() ||
                    t.patient?.user?.userId?.toLowerCase() === searchId.toLowerCase()
                );
                setTests(patientTests);
            }
        } catch (err) {
            console.error(err);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const pendingTests = tests.filter(t => t.status === 'Requested');
    const completedTests = tests.filter(t => t.status === 'Completed');

    return (
        <div className="space-y-8">
            <div className="glass-card p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                <div className="max-w-xl">
                    <h2 className="text-2xl font-bold mb-2">Diagnostic Access Terminal</h2>
                    <p className="text-primary-100 text-sm mb-6 opacity-90">Enter a Patient ID to access assigned laboratory tests and upload reports.</p>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={20} />
                            <input 
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-primary-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                                placeholder="Enter Patient ID (e.g. MEDI-1234)..."
                                value={searchId}
                                onChange={e => setSearchId(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-8 py-3 bg-white text-primary-700 font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-lg active:scale-95">
                            Search
                        </button>
                    </form>
                </div>
            </div>
            <br></br>
            {tests.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <StatsCard title="Pending Requests" value={pendingTests.length} icon={Clock} color="bg-amber-500" />
                    <StatsCard title="Completed Tests" value={completedTests.length} icon={CheckCircle} color="bg-emerald-500" />
                </div>
            )}
            <br></br>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Test Requests */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FlaskConical className="text-primary-600" /> Pending Lab Requests
                    </h3>
                    <div className="space-y-4">
                        {pendingTests.length === 0 ? (
                            <p className="text-slate-400 italic text-center py-8">No pending requests</p>
                        ) : (
                            pendingTests.map(test => (
                                <div key={test.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white hover:shadow-md transition-all">
                                    <div>
                                        <p className="font-bold text-slate-700">{test.testName}</p>
                                        <p className="text-xs text-slate-500">Patient: {test.patient?.user?.name} ({test.patient?.patientId})</p>
                                        <p className="text-[10px] text-slate-400">Dr. {test.doctor?.name}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedTest(test)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                    >
                                        <Upload size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Report Upload Form (Conditional) */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Report Action</h3>
                    {selectedTest ? (
                        <form onSubmit={handleUpload} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="p-4 bg-primary-50 rounded-2xl mb-4">
                                <p className="text-sm font-bold text-primary-700">Test: {selectedTest.testName}</p>
                                <p className="text-xs text-primary-600">Patient: {selectedTest.patient?.user?.name}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Report (PDF/Image)</label>
                                <input 
                                    type="file" 
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    onChange={e => setReportFile(e.target.files[0])}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Result Summary</label>
                                <textarea 
                                    className="input-field min-h-[100px]" 
                                    placeholder="Enter brief summary of results..."
                                    value={summary}
                                    onChange={e => setSummary(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary flex-1" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Submit Report'}
                                </button>
                                <button type="button" onClick={() => setSelectedTest(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                            <Upload size={40} className="mb-2 opacity-20" />
                            <p className="text-sm italic">Select a test request to upload results</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabDashboard;
