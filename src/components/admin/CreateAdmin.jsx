// // components/admin/CreateAdmin.jsx
// import React, { useState } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import useAuthStore from '../../stores/authStore';
// import useAdminStore from '../../stores/adminStore';
// import { toast } from 'react-hot-toast';
// import { Shield } from 'lucide-react';

// const CreateAdmin = ({ darkMode }) => {
//   // All hooks must be called at the top level, before any conditional returns
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const { createAdmin, loading, error } = useAdminStore();
  
//   const [formData, setFormData] = useState({
//     email: '',
//     first_name: '',
//     last_name: '',
//     password: '',
//     confirm_password: ''
//   });
  
//   // Define all event handlers before any conditional returns
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirm_password) {
//       toast.error("Passwords don't match");
//       return;
//     }
    
//     if (formData.password.length < 8) {
//       toast.error("Password must be at least 8 characters");
//       return;
//     }
    
//     // Remove confirm_password before sending
//     const { confirm_password, ...adminData } = formData;
    
//     const result = await createAdmin(adminData);
//     if (result) {
//       toast.success(`Admin user ${result.email} created successfully`);
//       setFormData({
//         email: '',
//         first_name: '',
//         last_name: '',
//         password: '',
//         confirm_password: ''
//       });
      
//       // Navigate back to dashboard after successful creation
//       navigate('/admin/dashboard');
//     }
//   };

//   // Now you can have the conditional return
//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/login" />;
//   }
   

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center gap-3 mb-6">
//         <Shield className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
//         <h1 className="text-3xl font-bold">Create Admin User</h1>
//       </div>
      
//       {error && <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-700'}`}>{error}</div>}
      
//       <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//             />
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 font-medium">First Name</label>
//               <input
//                 type="text"
//                 name="first_name"
//                 value={formData.first_name}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium">Last Name</label>
//               <input
//                 type="text"
//                 name="last_name"
//                 value={formData.last_name}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//               />
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block mb-2 font-medium">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//               />
//               <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium">Confirm Password</label>
//               <input
//                 type="password"
//                 name="confirm_password"
//                 value={formData.confirm_password}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//               />
//             </div>
//           </div>
          
//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
//                 darkMode 
//                   ? 'bg-purple-600 hover:bg-purple-700' 
//                   : 'bg-purple-500 hover:bg-purple-600'
//               } text-white transition-colors disabled:opacity-50`}
//             >
//               {loading ? 'Creating...' : 'Create Admin User'}
//             </button>
            
//             <button
//               type="button"
//               onClick={() => navigate('/admin/dashboard')}
//               className={`px-6 py-2 rounded-lg ${
//                 darkMode 
//                   ? 'bg-gray-700 hover:bg-gray-600' 
//                   : 'bg-gray-200 hover:bg-gray-300'
//               } transition-colors`}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAdmin;