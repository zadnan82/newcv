// // src/stores/asyncTaskStore.js - Universal async task handler
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import useAuthStore from './authStore';
// import API_BASE_URL from '../config';

// // Universal async task store for all AI functions
// const useAsyncTaskStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       activeTasks: new Map(), // Map of taskId -> task data
//       taskHistory: [],
      
//       // Start a new async task
//       startTask: (taskId, taskData) => {
//         set(state => {
//           const newTasks = new Map(state.activeTasks);
//           newTasks.set(taskId, {
//             ...taskData,
//             startTime: Date.now(),
//             status: 'processing',
//             progress: 0
//           });
          
//           return { activeTasks: newTasks };
//         });
//       },
      
//       // Update task status
//       updateTask: (taskId, updates) => {
//         set(state => {
//           const newTasks = new Map(state.activeTasks);
//           const existingTask = newTasks.get(taskId);
          
//           if (existingTask) {
//             newTasks.set(taskId, {
//               ...existingTask,
//               ...updates,
//               lastUpdate: Date.now()
//             });
//           }
          
//           return { activeTasks: newTasks };
//         });
//       },
      
//       // Complete a task
//       completeTask: (taskId, result) => {
//         set(state => {
//           const newTasks = new Map(state.activeTasks);
//           const task = newTasks.get(taskId);
          
//           if (task) {
//             // Move to history
//             const completedTask = {
//               ...task,
//               status: 'completed',
//               result,
//               completedAt: Date.now(),
//               duration: Date.now() - task.startTime
//             };
            
//             newTasks.delete(taskId);
            
//             return {
//               activeTasks: newTasks,
//               taskHistory: [...state.taskHistory.slice(-9), completedTask] // Keep last 10
//             };
//           }
          
//           return state;
//         });
//       },
      
//       // Fail a task
//       failTask: (taskId, error) => {
//         set(state => {
//           const newTasks = new Map(state.activeTasks);
//           const task = newTasks.get(taskId);
          
//           if (task) {
//             const failedTask = {
//               ...task,
//               status: 'failed',
//               error,
//               failedAt: Date.now(),
//               duration: Date.now() - task.startTime
//             };
            
//             newTasks.delete(taskId);
            
//             return {
//               activeTasks: newTasks,
//               taskHistory: [...state.taskHistory.slice(-9), failedTask]
//             };
//           }
          
//           return state;
//         });
//       },
      
//       // Cancel a task
//       cancelTask: (taskId) => {
//         set(state => {
//           const newTasks = new Map(state.activeTasks);
//           newTasks.delete(taskId);
//           return { activeTasks: newTasks };
//         });
//       },
      
//       // Universal task polling function
//       pollTask: async (taskId, statusUrl, onProgress, onComplete, onError) => {
//         const token = useAuthStore.getState().token;
        
//         if (!token) {
//           onError('Authentication required');
//           return;
//         }
        
//         const poll = async () => {
//           try {
//             const response = await fetch(statusUrl, {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               }
//             });
            
//             if (!response.ok) {
//               throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//             }
            
//             const result = await response.json();
            
//             if (result.status === 'completed') {
//               get().completeTask(taskId, result.result);
//               onComplete(result.result);
//               return; // Stop polling
//             } else if (result.status === 'failed') {
//               get().failTask(taskId, result.error);
//               onError(result.error || 'Task failed');
//               return; // Stop polling
//             } else {
//               // Still processing
//               get().updateTask(taskId, {
//                 message: result.message,
//                 progress: calculateProgress(result)
//               });
//               onProgress(result);
              
//               // Continue polling
//               setTimeout(poll, 3000); // Poll every 3 seconds
//             }
            
//           } catch (error) {
//             console.error('Polling error:', error);
//             get().failTask(taskId, error.message);
//             onError(error.message);
//           }
//         };
        
//         // Start polling
//         poll();
//       },
      
//       // Get task by ID
//       getTask: (taskId) => {
//         return get().activeTasks.get(taskId);
//       },
      
//       // Get all active tasks
//       getActiveTasks: () => {
//         return Array.from(get().activeTasks.values());
//       },
      
//       // Get tasks by type
//       getTasksByType: (type) => {
//         return Array.from(get().activeTasks.values()).filter(task => task.type === type);
//       },
      
//       // Clear completed tasks from history
//       clearHistory: () => {
//         set({ taskHistory: [] });
//       }
//     }),
//     {
//       name: 'async-task-storage',
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         // Don't persist active tasks (they're temporary)
//         taskHistory: state.taskHistory.slice(-5) // Only keep last 5 in storage
//       }),
//     }
//   )
// );

// // Helper function to calculate progress
// function calculateProgress(result) {
//   if (result.progress !== undefined) return result.progress;
  
//   // Estimate progress based on task type and time
//   const elapsed = Date.now() - (result.startTime || Date.now());
  
//   switch (result.analysis_method || result.type) {
//     case 'crewai':
//       return Math.min(90, (elapsed / 45000) * 100); // 45s estimate
//     case 'claude':
//       return Math.min(90, (elapsed / 30000) * 100); // 30s estimate
//     case 'both':
//       return Math.min(90, (elapsed / 75000) * 100); // 75s estimate
//     case 'cover-letter-generation':
//       return Math.min(90, (elapsed / 25000) * 100); // 25s estimate
//     case 'cv-enhancement':
//       return Math.min(90, (elapsed / 35000) * 100); // 35s estimate
//     default:
//       return Math.min(90, (elapsed / 40000) * 100); // 40s default
//   }
// }

// // Universal async task hook
// export const useAsyncTask = (taskType) => {
//   const store = useAsyncTaskStore();
  
//   return {
//     // Start a new async task
//     startAsyncTask: async (endpoint, payload, taskOptions = {}) => {
//       const token = useAuthStore.getState().token;
      
//       if (!token) {
//         throw new Error('Authentication required');
//       }
      
//       // Make the initial request
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           ...(payload instanceof FormData 
//             ? {} 
//             : { 'Content-Type': 'application/json' }
//           )
//         },
//         body: payload instanceof FormData ? payload : JSON.stringify(payload)
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.detail || `Request failed with status ${response.status}`);
//       }
      
//       const taskData = await response.json();
      
//       if (!taskData.task_id) {
//         throw new Error('No task ID received from server');
//       }
      
//       // Register the task
//       store.startTask(taskData.task_id, {
//         ...taskData,
//         type: taskType,
//         ...taskOptions
//       });
      
//       return {
//         taskId: taskData.task_id,
//         statusUrl: taskData.check_status_url,
//         estimatedTime: taskData.estimated_time
//       };
//     },
    
//     // Poll for task completion
//     pollTaskCompletion: (taskId, statusUrl) => {
//       return new Promise((resolve, reject) => {
//         store.pollTask(
//           taskId,
//           statusUrl,
//           (progressUpdate) => {
//             // Progress callback - you can use this in UI
//             console.log(`Task ${taskId} progress:`, progressUpdate);
//           },
//           (result) => {
//             // Success callback
//             resolve(result);
//           },
//           (error) => {
//             // Error callback
//             reject(new Error(error));
//           }
//         );
//       });
//     },
    
//     // Get active tasks of this type
//     getActiveTasks: () => store.getTasksByType(taskType),
    
//     // Cancel task
//     cancelTask: store.cancelTask
//   };
// };

// export default useAsyncTaskStore;