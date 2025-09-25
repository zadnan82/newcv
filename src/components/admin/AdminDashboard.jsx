// import React, { useEffect, useState } from 'react';
// import { Navigate, Link } from 'react-router-dom';
// import useAuthStore from '../../stores/authStore';
// import useAdminStore from '../../stores/adminStore';
// import { Shield, Plus, Users, FileText, FileSignature, MessageSquare } from 'lucide-react';

// const AdminDashboard = ({ darkMode }) => {
//   // All hooks must be called unconditionally at the top
//   const [searchTerm, setSearchTerm] = useState('');
//   const { user } = useAuthStore();
//   const { stats, users, loading, error, fetchStats, fetchUsers } = useAdminStore();
  
//   useEffect(() => {
//     // Only fetch data if the user is an admin
//     if (user?.role === 'admin') {
//       fetchStats();
//       fetchUsers();
//     }
//   }, [user]); // Add user as a dependency
  
//   // Check admin status after all hooks are called
//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/login" />;
//   }
  
//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchUsers(searchTerm);
//   };
   
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-3">
//           <Shield className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
//           <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         </div>
        
//         <div className="flex space-x-3">
//           {/* Feedback Management Button */}
//           <Link 
//             to="/admin/feedback" 
//             className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//               darkMode 
//                 ? 'bg-blue-600 hover:bg-blue-700' 
//                 : 'bg-blue-500 hover:bg-blue-600'
//             } text-white transition-colors`}
//           >
//             <MessageSquare size={16} />
//             <span>Manage Feedback</span>
//           </Link>
          
//           {/* Create Admin Button */}
//           <Link 
//             to="/admin/create" 
//             className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//               darkMode 
//                 ? 'bg-purple-600 hover:bg-purple-700' 
//                 : 'bg-purple-500 hover:bg-purple-600'
//             } text-white transition-colors`}
//           >
//             <Plus size={16} />
//             <span>Create Admin</span>
//           </Link>
//         </div>
//       </div>
      
//       {loading && (
//         <div className={`text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//           Loading...
//         </div>
//       )}
      
//       {error && (
//         <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-700'}`}>
//           {error}
//         </div>
//       )}
      
//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//             <div className="flex items-center gap-3 mb-3">
//               <Users className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
//               <h3 className="text-xl font-semibold">Users</h3>
//             </div>
//             <p className="text-3xl">{stats.total_users}</p>
//             <p className="text-sm opacity-70">+{stats.new_users_last_7_days} in last 7 days</p>
//           </div>
          
//           <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//             <div className="flex items-center gap-3 mb-3">
//               <FileText className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
//               <h3 className="text-xl font-semibold">Resumes</h3>
//             </div>
//             <p className="text-3xl">{stats.total_resumes}</p>
//           </div>
          
//           <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//             <div className="flex items-center gap-3 mb-3">
//               <FileSignature className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
//               <h3 className="text-xl font-semibold">Cover Letters</h3>
//             </div>
//             <p className="text-3xl">{stats.total_cover_letters}</p>
//           </div>
          
//           <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//             <div className="flex items-center gap-3 mb-3">
//               <MessageSquare className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
//               <h3 className="text-xl font-semibold">Feedback</h3>
//             </div>
//             <p className="text-3xl">{stats.total_feedbacks || 0}</p>
//             <p className="text-sm opacity-70">
//               {stats.unviewed_feedback|| 0} pending
//             </p>
//           </div>
//         </div>
//       )}
      
//       <div className={`p-6 rounded-lg shadow mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//         <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        
//         <form onSubmit={handleSearch} className="mb-4">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search users..."
//               className={`flex-grow p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//             />
//             <button 
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Search
//             </button>
//           </div>
//         </form>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
//                 <th className="p-2 text-left">ID</th>
//                 <th className="p-2 text-left">Name</th>
//                 <th className="p-2 text-left">Email</th>
//                 <th className="p-2 text-left">Role</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length > 0 ? (
//                 users.map(user => (
//                   <tr key={user.id} className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
//                     <td className="p-2">{user.id}</td>
//                     <td className="p-2">{user.first_name} {user.last_name}</td>
//                     <td className="p-2">{user.email}</td>
//                     <td className="p-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         user.role === 'admin' 
//                           ? darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
//                           : darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
//                       }`}>
//                         {user.role}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="p-4 text-center">
//                     {loading ? 'Loading users...' : 'No users found'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;