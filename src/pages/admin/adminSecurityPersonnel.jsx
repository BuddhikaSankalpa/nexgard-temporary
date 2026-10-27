import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaUserShield, FaUserPlus, FaTimes, FaLock } from "react-icons/fa";
import { MdOutlineLocalPhone } from "react-icons/md";
import { useDemoData } from '../../demoContext';

export default function AdminSecurityPersonnel() {
  const { personnel: users, updateCollection } = useDemoData();
  const [isVerified, setIsVerified] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  // States needed for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', phone: '', role: 'Security Officer', isBlocked: false });

  function handleAuthSubmit(event) {
    event.preventDefault();
    if (authEmail.trim().toLowerCase() === 'admin@gmail.com' && authPassword === '123') {
      setIsVerified(true);
      setAuthPassword('');
      toast.success('Access Granted');
    } else {
      toast.error('Access Denied: Invalid credentials.');
    }
  }

  function handleAddUser(event) {
    event.preventDefault();
    if (users.some(user => user.email === newUser.email)) return toast.error('Email already exists.');
    updateCollection('personnel', previous => [...previous, { ...newUser, _id: crypto.randomUUID(), isAdmin: newUser.role === 'System Admin' }]);
    setIsAddModalOpen(false);
    setNewUser({ firstName: '', lastName: '', email: '', phone: '', role: 'Security Officer', isBlocked: false });
    toast.success('Personnel registered successfully!');
  }

  // Remove (delete) a user
  function handleRemoveUser(id) {
    if (window.confirm("Are you sure you want to remove this operator/admin?")) {
      updateCollection('personnel', previous => previous.filter(user => user._id !== id));
      toast.success("Personnel removed successfully!");
    }
  }

  // Function to open the edit modal
  function openEditModal(user) {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  }

  // Save changes to the local frontend data.
  function handleUpdateUser(e) {
    e.preventDefault();
    updateCollection('personnel', previous => previous.map(user => user._id === selectedUser._id ? selectedUser : user));
    toast.success("Personnel updated successfully!");
    setIsEditModalOpen(false);
  }

  if (!isVerified) {
    return (
      <div className="p-8 w-full min-h-screen bg-[#090D14] text-slate-300 flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>
        <div className="bg-[#111826] border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl relative z-10 text-center">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <FaLock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Security Clearance Required</h2>
          <p className="text-slate-400 text-sm mb-6">Please enter Head Security Officer credentials to unlock Personnel Profiles.</p>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input type="email" placeholder="Email Address" aria-label="Email Address" autoComplete="off" value={authEmail} onChange={event => setAuthEmail(event.target.value)} className="w-full px-4 py-3 bg-[#090D14] text-white rounded-xl border border-slate-700 outline-none focus:border-blue-500 transition text-sm" required />
            <input type="password" placeholder="Password" aria-label="Password" autoComplete="off" value={authPassword} onChange={event => setAuthPassword(event.target.value)} className="w-full px-4 py-3 bg-[#090D14] text-white rounded-xl border border-slate-700 outline-none focus:border-blue-500 transition text-sm" required />
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-md uppercase text-xs tracking-wider">
              Verify Credentials
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full min-h-screen bg-[#090D14] text-slate-300 relative overflow-hidden font-sans">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <FaUserShield className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> Personnel Management
            </h1>
            <p className="text-slate-400 mt-1">Manage system admin access and all registered personnel profiles.</p>
          </div>
          
          <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:from-blue-500 hover:to-indigo-500 transition duration-300 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] flex items-center gap-2 tracking-wide"
            >
              <FaUserPlus size={18} />
              <span>REGISTER PERSONNEL</span>
            </button>
        </div>

        <div className="bg-[#111826] rounded-xl shadow-lg border border-slate-800 overflow-hidden">
          
          {users.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">
              No Personnel Found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0d131f] text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="p-5 font-bold">Officer Name</th>
                    <th className="p-5 font-bold">Contact Info</th>
                    <th className="p-5 font-bold">Role</th>
                    <th className="p-5 font-bold">Account Status</th>
                    <th className="p-5 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map((person) => (
                    <tr key={person._id} className="hover:bg-[#161f33] transition duration-200 border-b border-slate-800/50 last:border-0">
                      <td className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                          {person.firstName ? person.firstName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 text-base">{person.firstName} {person.lastName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{person.email}</p>
                        </div>
                      </td>
                      <td className="p-5 text-slate-300">
                        <div className="flex items-center gap-2">
                          <MdOutlineLocalPhone className="text-slate-500" /> {person.phone}
                        </div>
                      </td>
                      
                      {/* CHANGED: Dynamic color rendering based on role */}
                      <td className={`p-5 font-bold tracking-wide ${
                        person.role === "Main Security Officer" 
                          ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                          : person.role === "Security Officer" 
                          ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                          : "text-indigo-400"
                      }`}>
                        {person.role || (person.isAdmin ? "System Admin" : "User")}
                      </td>

                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide border ${
                          !person.isBlocked 
                            ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.15)]' 
                            : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                        }`}>
                          {!person.isBlocked ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="p-5 flex gap-4">
                        <button 
                          onClick={() => openEditModal(person)}
                          className="text-blue-400 font-bold hover:text-blue-300 hover:drop-shadow-[0_0_5px_rgba(96,165,250,0.6)] transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemoveUser(person._id)}
                          className="text-red-400 font-bold hover:text-red-300 hover:drop-shadow-[0_0_5px_rgba(248,113,113,0.6)] transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111826] border border-slate-700/60 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Register Personnel</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              {[['firstName', 'First Name'], ['lastName', 'Last Name'], ['email', 'Email Address'], ['phone', 'Contact Number']].map(([name, label]) => (
                <div key={name}>
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <input type={name === 'email' ? 'email' : 'text'} value={newUser[name]} onChange={event => setNewUser(previous => ({ ...previous, [name]: event.target.value }))} className="w-full mt-1 px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg outline-none focus:border-blue-500 transition" required />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">System Role</label>
                <select value={newUser.role} onChange={event => setNewUser(previous => ({ ...previous, role: event.target.value }))} className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg">
                  <option>Main Security Officer</option><option>Security Officer</option><option>Field Operator</option><option>System Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-400 font-bold rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg">Register Personnel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL POPUP */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111826] border border-slate-700/60 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-fade-in">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <FaTimes size={18} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">
              Update Personnel Profile
            </h2>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">First Name</label>
                  <input 
                    type="text" 
                    value={selectedUser.firstName} 
                    onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                    className="w-full mt-1 px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Last Name</label>
                  <input 
                    type="text" 
                    value={selectedUser.lastName} 
                    onChange={(e) => setSelectedUser({...selectedUser, lastName: e.target.value})}
                    className="w-full mt-1 px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={selectedUser.email} 
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="w-full mt-1 px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Contact Number</label>
                <input 
                  type="text" 
                  value={selectedUser.phone} 
                  onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  className="w-full mt-1 px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">System Role</label>
                  <select 
                    value={selectedUser.role} 
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Main Security Officer">Main Security Officer</option>
                    <option value="Security Officer">Security Officer</option>
                    <option value="Field Operator">Field Operator</option>
                    <option value="System Admin">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Account Status</label>
                  <select 
                    value={selectedUser.isBlocked ? "true" : "false"} 
                    onChange={(e) => setSelectedUser({...selectedUser, isBlocked: e.target.value === "true"})}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="false">Active</option>
                    <option value="true">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-400 font-bold rounded-lg hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-indigo-500 transition shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
