import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import { Users, Shield, Activity, Plus, Search, Pencil } from 'lucide-react';
import Modal from '../../components/Modal';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [formData, setFormData] = useState({ 
        userId: '', 
        password: '', 
        name: '', 
        role: 'Doctor', 
        email: '', 
        mobile: '',
        address: '',
        hospitalName: '',
        certifiedId: '',
        age: '',
        gender: 'Male'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await api.put(`/users/${selectedUserId}`, formData);
                toast.success('User Updated Successfully');
            } else {
                await api.post('/users', formData);
                toast.success('User Created Successfully');
            }
            fetchUsers();
            closeModal();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
        finally { setLoading(false); }
    };

    const handleEdit = (user) => {
        setIsEditMode(true);
        setSelectedUserId(user.id);
        setFormData({
            userId: user.userId,
            password: '', // Don't pre-fill password
            name: user.name,
            role: user.role,
            email: user.email || '',
            mobile: user.mobile || '',
            address: user.address || '',
            hospitalName: user.hospitalName || '',
            certifiedId: user.certifiedId || '',
            age: user.patientProfile?.age || '',
            gender: user.patientProfile?.gender || 'Male'
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedUserId(null);
        setFormData({ 
            userId: '', 
            password: '', 
            name: '', 
            role: 'Doctor', 
            email: '', 
            mobile: '',
            address: '',
            hospitalName: '',
            certifiedId: '',
            age: '',
            gender: 'Male'
        });
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.userId.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
                <StatsCard title="Doctors" value={users.filter(u => u.role === 'Doctor').length} icon={Activity} color="bg-emerald-500" />
                <StatsCard title="Technicians" value={users.filter(u => u.role === 'Lab Technician').length} icon={Shield} color="bg-purple-500" />
                <StatsCard title="Pharmacy" value={users.filter(u => u.role === 'Pharmacy').length} icon={Activity} color="bg-amber-500" />
                <StatsCard title="Patients" value={users.filter(u => u.role === 'Patient').length} icon={Activity} color="bg-amber-500" />
            </div>
            <br></br>
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h3 className="text-xl font-bold">System Users</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <input className="input-field pl-15 py-2 w-94" placeholder="Search ID or Name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> Add User
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="pb-4 font-semibold">User</th>
                                <th className="pb-4 font-semibold">User ID</th>
                                <th className="pb-4 font-semibold">Role</th>
                                <th className="pb-4 font-semibold">Contact</th>
                                <th className="pb-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 font-bold text-slate-700">{u.name}</td>
                                    <td className="py-4 font-mono text-xs text-slate-500">{u.userId}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                            u.role === 'Admin' ? 'bg-rose-100 text-rose-600' :
                                            u.role === 'Doctor' ? 'bg-blue-100 text-blue-600' :
                                            u.role === 'Lab Technician' ? 'bg-purple-100 text-purple-600' :
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm text-slate-500">{u.mobile || u.email || 'N/A'}</td>
                                    <td className="py-4 text-right">
                                        <button 
                                            onClick={() => handleEdit(u)}
                                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            title="Edit User"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? "Edit User Details" : "Create New System User"}>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh]  px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">User ID</label>
                            <input className="input-field" placeholder="User ID" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required disabled={isEditMode} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Password {isEditMode && '(Leave blank to keep current)'}</label>
                            <input className="input-field" type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEditMode} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Full Name</label>
                        <input className="input-field" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Role</label>
                        <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} disabled={isEditMode}>
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Lab Technician">Lab Technician</option>
                            <option value="Pharmacy">Pharmacy</option>
                            {/* <option value="Patient">Patient</option> */}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Email</label>
                            <input className="input-field" type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Mobile</label>
                            <input className="input-field" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Address</label>
                        <textarea className="input-field py-2" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="2" />
                    </div>

                    {/* Role Specific Fields */}
                    {formData.role === 'Doctor' && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Hospital Name</label>
                            <input className="input-field" placeholder="Hospital Name" value={formData.hospitalName} onChange={e => setFormData({...formData, hospitalName: e.target.value})} />
                        </div>
                    )}

                    {(formData.role === 'Lab Technician' || formData.role === 'Pharmacy') && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Certified ID / License Number</label>
                            <input className="input-field" placeholder="Certified ID" value={formData.certifiedId} onChange={e => setFormData({...formData, certifiedId: e.target.value})} />
                        </div>
                    )}

                    {formData.role === 'Patient' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 ml-1">Age</label>
                                <input className="input-field" type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 ml-1">Gender</label>
                                <select className="input-field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <button className="btn-primary w-full py-3" disabled={loading}>
                        {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create User')}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
