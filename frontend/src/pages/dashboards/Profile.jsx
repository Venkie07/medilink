import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MediLinkCard from '../../components/MediLinkCard';
import { User, MapPin, Phone, Mail, Award, Landmark, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Profile = () => {
    const { user } = useAuth();
    const [patientData, setPatientData] = useState(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (user?.role === 'Patient') {
            fetchPatientData();
        }
    }, [user]);

    const fetchPatientData = async () => {
        try {
            const { data: patients } = await api.get('/patients');
            const myPatient = patients.find(p => p.user?.userId === user.userId);
            setPatientData(myPatient);
        } catch (err) {
            console.error('Error fetching patient data:', err);
        }
    };

    const downloadCard = async () => {
        if (!cardRef.current) return;

        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            scale: 2
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`MediLink_Card_${user.userId}.pdf`);
    };

    if (!user) return null;

    const ProfileItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-white">
            <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">{label}</p>
                <p className="text-slate-700 font-medium">{value || 'Not provided'}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-130px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-12 mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-100">
                            <User size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
                            <p className="text-primary-600 font-bold uppercase tracking-widest text-xs">{user.role}</p>
                            <p className="text-slate-400 text-sm font-mono mt-1">System ID: {user.userId}</p>
                        </div>
                    </div>

                    {user.role === 'Patient' && patientData && (
                        <button
                            onClick={downloadCard}
                            className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            <Download size={20} /> Download MediLink Card
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileItem icon={Mail} label="Email Address" value={user.email} />
                    <ProfileItem icon={Phone} label="Mobile Number" value={user.mobile} />
                    <ProfileItem icon={MapPin} label="Personal Address" value={user.address} />

                    {user.role === 'Doctor' && (
                        <ProfileItem icon={Landmark} label="Hospital Name" value={user.hospitalName} />
                    )}

                    {(user.role === 'Lab Technician' || user.role === 'Pharmacy') && (
                        <ProfileItem icon={Award} label="Certification ID" value={user.certifiedId} />
                    )}
                </div>

                {user.role === 'Patient' && patientData && (
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800">My MediLink Card</h3>
                        <div className="flex justify-center md:justify-start">
                            <MediLinkCard ref={cardRef} patient={patientData} />
                        </div>
                        <p className="text-sm text-slate-400 italic">This card contains your unique QR code used by Doctors, Labs, and Pharmacies.</p>
                    </div>
                )}
            </div>
            {/* <footer className="pt-8 mt-6 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    By using MediLink, you agree to our privacy and security policies.
                    Personal information is securely protected and encrypted.
                    Unauthorized access or misuse of medical data is strictly prohibited.
                </p>
            </footer> */}
            <footer className="mt-auto pt-6 pb-2 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <p>
                    © 2026 MediLink. All rights reserved.
                </p>

                <div className="flex items-center gap-4">
                    <span>Privacy Policy</span>
                    <span>Terms & Conditions</span>
                    <span>Secure & Encrypted</span>
                </div>
            </footer>
        </div>
    );
};

export default Profile;
