import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import { Users, Shield, Activity, Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
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

    // Password view toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    // Delete flow states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [viewUser, setViewUser] = useState(null);

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
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setAdminPassword('');
        setShowAdminPassword(false);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        if (!adminPassword) {
            toast.error('Admin password is required to verify deletion.');
            return;
        }
        setDeleteLoading(true);
        try {
            await api.delete(`/users/${userToDelete.id}`, { data: { adminPassword } });
            toast.success('User Deleted Successfully');
            fetchUsers();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            setAdminPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setDeleteLoading(false);
        }
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
        setShowPassword(false);
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.userId.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-2">
            {/* Mobile Layout */}
            <div className="space-y-4 lg:hidden">
                {/* Main Card */}
                <div>
                    <StatsCard
                        title="Total Users"
                        value={users.length}
                        icon={Users}
                        color="bg-blue-500"
                    />
                </div>

                {/* Remaining Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <StatsCard
                        title="Doctors"
                        value={users.filter(u => u.role === 'Doctor').length}
                        icon={Activity}
                        color="bg-emerald-500"
                    />

                    <StatsCard
                        title="Technicians"
                        value={users.filter(u => u.role === 'Lab Technician').length}
                        icon={Shield}
                        color="bg-purple-500"
                    />

                    <StatsCard
                        title="Pharmacy"
                        value={users.filter(u => u.role === 'Pharmacy').length}
                        icon={Activity}
                        color="bg-amber-500"
                    />

                    <StatsCard
                        title="Patients"
                        value={users.filter(u => u.role === 'Patient').length}
                        icon={Activity}
                        color="bg-rose-500"
                    />
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Users"
                    value={users.length}
                    icon={Users}
                    color="bg-blue-500"
                />

                <StatsCard
                    title="Doctors"
                    value={users.filter(u => u.role === 'Doctor').length}
                    icon={Activity}
                    color="bg-emerald-500"
                />

                <StatsCard
                    title="Technicians"
                    value={users.filter(u => u.role === 'Lab Technician').length}
                    icon={Shield}
                    color="bg-purple-500"
                />

                <StatsCard
                    title="Pharmacy"
                    value={users.filter(u => u.role === 'Pharmacy').length}
                    icon={Activity}
                    color="bg-amber-500"
                />

                <StatsCard
                    title="Patients"
                    value={users.filter(u => u.role === 'Patient').length}
                    icon={Activity}
                    color="bg-rose-500"
                />
            </div>
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
                                <th className="pb-4 font-semibold hidden md:table-cell">User ID</th>
                                <th className="pb-4 font-semibold">Role</th>
                                <th className="pb-4 font-semibold hidden md:table-cell">Contact</th>
                                <th className="pb-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 font-bold text-slate-700">{u.name}</td>
                                    <td className="py-4 font-mono text-xs text-slate-500 hidden md:table-cell">{u.userId}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${u.role === 'Admin' ? 'bg-rose-100 text-rose-600' :
                                            u.role === 'Doctor' ? 'bg-blue-100 text-blue-600' :
                                                u.role === 'Lab Technician' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-amber-100 text-amber-600'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm text-slate-500 hidden md:table-cell">{u.mobile || u.email || 'N/A'}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-1.5">
                                            <button
                                                onClick={() => setViewUser(u)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(u)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(u)}
                                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                title="Edit User"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? "Edit User Details" : "Create New System User"}>
                <form onSubmit={handleSubmit} className="space-y-4 px-1">
                    <div className="grid grid-cols-2 gap-4 items-end">
                        {/* First Column: User ID and Role */}
                        {isEditMode ? (
                            <div className="flex gap-6 py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl h-[44px] items-center">
                                <div>
                                    <span className="block text-[12px] uppercase font-bold text-slate-400 tracking-wider">User ID</span>
                                    <span className="font-mono text-sm text-slate-700 font-bold">{formData.userId}</span>
                                </div>
                                <div>
                                    <span className="block text-[12px] uppercase font-bold text-slate-400 tracking-wider">Role</span>
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase inline-block ${formData.role === 'Admin' ? 'bg-rose-100 text-rose-600' :
                                        formData.role === 'Doctor' ? 'bg-blue-100 text-blue-600' :
                                            formData.role === 'Lab Technician' ? 'bg-purple-100 text-purple-600' :
                                                'bg-amber-100 text-amber-600'
                                        }`}>
                                        {formData.role}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 ml-1">User ID</label>
                                    <input className="input-field py-2 px-3 text-sm" placeholder="User ID" value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 ml-1">Role</label>
                                    <select className="input-field py-2 px-3 text-sm" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="Admin">Admin</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Lab Technician">Lab Technician</option>
                                        <option value="Pharmacy">Pharmacy</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Second Column: Full Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Full Name</label>
                            <input className="input-field" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                    </div>

                    {/* Second Row: Password and Mobile Number */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1 block truncate">
                                {isEditMode ? "Password (leave blank to keep current)" : "Password"}
                            </label>
                            <div className="relative">
                                <input
                                    className="input-field pr-10"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={isEditMode ? "••••••••" : "Password"}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required={!isEditMode}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Mobile</label>
                            <input className="input-field" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                        </div>
                    </div>

                    {/* Third Row: Email (Full Width) */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Email</label>
                        <input className="input-field" type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    {/* Fourth Row: Address (Full Width) */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Address</label>
                        <textarea className="input-field py-2" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows="2" />
                    </div>

                    {/* Fifth Row: Role Specific Fields */}
                    {formData.role === 'Doctor' && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Hospital Name</label>
                            <input className="input-field" placeholder="Hospital Name" value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} />
                        </div>
                    )}

                    {(formData.role === 'Lab Technician' || formData.role === 'Pharmacy') && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Certified ID / License Number</label>
                            <input className="input-field" placeholder="Certified ID" value={formData.certifiedId} onChange={e => setFormData({ ...formData, certifiedId: e.target.value })} />
                        </div>
                    )}

                    {formData.role === 'Patient' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 ml-1">Age</label>
                                <input className="input-field" type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 ml-1">Gender</label>
                                <select className="input-field" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <button className="btn-primary w-full py-3 mt-2" disabled={loading}>
                        {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create User')}
                    </button>
                </form>
            </Modal>

            {/* Delete User Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm User Deletion">
                <form onSubmit={handleDeleteConfirm} className="space-y-4 px-1">
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl space-y-2">
                        <p className="text-sm font-bold">⚠️ Warning: Permanent Action</p>
                        <p className="text-xs leading-relaxed">
                            You are about to delete user <strong className="font-semibold">{userToDelete?.name}</strong> (<span className="font-mono">{userToDelete?.userId}</span>).
                            All clinical history and system records associated with this user ID will lose reference constraints.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 ml-1">Enter Administrator Password</label>
                        <div className="relative">
                            <input
                                className="input-field pr-10"
                                type={showAdminPassword ? "text" : "password"}
                                placeholder="Admin Password"
                                value={adminPassword}
                                onChange={e => setAdminPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowAdminPassword(!showAdminPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-colors"
                            >
                                {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="btn-secondary w-1/2 py-2.5"
                            disabled={deleteLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg w-1/2 py-2.5 flex items-center justify-center gap-2"
                            disabled={deleteLoading}
                        >
                            <Trash2 size={16} /> {deleteLoading ? 'Deleting...' : 'Delete User'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View Details Modal */}
            <Modal
                isOpen={!!viewUser}
                onClose={() => setViewUser(null)}
                title="User Details"
            >
                {viewUser && (
                    <div className="space-y-4 text-sm px-1">
                        <div>
                            <p className="text-slate-400 text-s">Name</p>
                            <p className="font-semibold">{viewUser.name}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-s">User ID</p>
                            <p className="font-mono">{viewUser.userId}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-s">Role</p>
                            <p>{viewUser.role}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-s">Email</p>
                            <p>{viewUser.email || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-s">Mobile</p>
                            <p>{viewUser.mobile || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-s">Address</p>
                            <p>{viewUser.address || 'N/A'}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
