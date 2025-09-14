import React from 'react';
import { Search, Brain, Settings, TrendingUp } from 'lucide-react';

const QuickActions = ({ setActiveTab, jobMatchesCount, usageLimits }) => {
  const searchesRemaining = usageLimits?.job_search_limits?.daily_remaining || 0;
  const aiCreditsRemaining = usageLimits?.ai_analysis_limits?.remaining || 0;
  
  const actions = [
    {
      id: 'search',
      title: 'Discover Jobs',
      subtitle: `${searchesRemaining} free searches left`,
      icon: Search,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      subtitleColor: 'text-blue-600',
      badge: 'FREE'
    },
    {
      id: 'matches',
      title: 'AI Matches',
      subtitle: `${jobMatchesCount} analyzed matches`,
      icon: Brain,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      subtitleColor: 'text-purple-600',
      badge: jobMatchesCount > 0 ? 'READY' : null
    },
    {
      id: 'preferences',
      title: 'Auto-Search Setup',
      subtitle: 'Global preferences',
      icon: Settings,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      iconColor: 'text-green-600',
     titleColor: 'text-green-900',
     subtitleColor: 'text-green-600',
     badge: null
   },
   {
     id: 'analytics',
     title: 'Analytics',
     subtitle: `${aiCreditsRemaining} AI credits left`,
     icon: TrendingUp,
     bgColor: 'bg-orange-50',
     borderColor: 'border-orange-200',
     hoverColor: 'hover:bg-orange-100',
     iconColor: 'text-orange-600',
     titleColor: 'text-orange-900',
     subtitleColor: 'text-orange-600',
     badge: null
   }
 ];

 const getActionStatus = (actionId) => {
   switch (actionId) {
     case 'search':
       return searchesRemaining > 0 ? 'active' : 'limited';
     case 'matches':
       return jobMatchesCount > 0 ? 'ready' : 'empty';
     case 'preferences':
       return 'active';
     case 'analytics':
       return aiCreditsRemaining > 0 ? 'active' : 'limited';
     default:
       return 'active';
   }
 };

 return (
   <div className="mb-6">
     {/* Two-Phase System Banner */}
     <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="text-2xl">🌍</div>
           <div>
             <h3 className="font-semibold text-blue-800">Two-Phase Global Job Search</h3>
             <p className="text-sm text-blue-600">Phase 1: FREE Discovery • Phase 2: AI Analysis ($0.012/job)</p>
           </div>
         </div>
         <div className="text-right">
           <div className="text-sm text-blue-700">
             <div>Searches: {usageLimits?.job_search_limits?.daily_used || 0}/{usageLimits?.job_search_limits?.daily_limit || 20}</div>
             <div>AI Credits: {usageLimits?.ai_analysis_limits?.daily_used || 0}/{usageLimits?.ai_analysis_limits?.daily_limit || 6}</div>
           </div>
         </div>
       </div>
     </div>

     {/* Quick Actions Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       {actions.map(action => {
         const status = getActionStatus(action.id);
         const isDisabled = status === 'limited';
         
         return (
           <button
             key={action.id}
             onClick={() => !isDisabled && setActiveTab(action.id)}
             disabled={isDisabled}
             className={`relative p-4 rounded-lg transition-all text-left ${
               isDisabled 
                 ? 'bg-gray-50 border border-gray-200 opacity-60 cursor-not-allowed' 
                 : `${action.bgColor} border ${action.borderColor} ${action.hoverColor}`
             }`}
           >
             {/* Status Badge */}
             {action.badge && (
               <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
                 action.badge === 'FREE' ? 'bg-green-100 text-green-700' :
                 action.badge === 'READY' ? 'bg-blue-100 text-blue-700' :
                 'bg-white/80 text-gray-700'
               }`}>
                 {action.badge}
               </span>
             )}

             {/* Limitation Badge */}
             {isDisabled && (
               <span className="absolute top-2 right-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                 LIMIT REACHED
               </span>
             )}

             {/* Action Icon */}
             <action.icon 
               size={24} 
               className={`mb-3 ${isDisabled ? 'text-gray-400' : action.iconColor}`} 
             />
             
             {/* Action Content */}
             <div>
               <div className={`font-medium ${isDisabled ? 'text-gray-500' : action.titleColor}`}>
                 {action.title}
               </div>
               <div className={`text-sm ${isDisabled ? 'text-gray-400' : action.subtitleColor}`}>
                 {action.subtitle}
               </div>
               
               {/* Additional Status Info */}
               {action.id === 'search' && (
                 <div className="mt-2 text-xs">
                   <div className={`${isDisabled ? 'text-gray-400' : 'text-blue-600'}`}>
                     Phase 1: Discovery
                   </div>
                 </div>
               )}
               
               {action.id === 'matches' && jobMatchesCount > 0 && (
                 <div className="mt-2 text-xs">
                   <div className="text-purple-600">
                     Cost: ${(jobMatchesCount * 0.012).toFixed(3)}
                   </div>
                 </div>
               )}

               {action.id === 'analytics' && (
                 <div className="mt-2 text-xs">
                   <div className={`${isDisabled ? 'text-gray-400' : 'text-orange-600'}`}>
                     70% Cost Savings
                   </div>
                 </div>
               )}
             </div>

             {/* Progress Bar for Usage */}
             {(action.id === 'search' || action.id === 'analytics') && (
               <div className="mt-3">
                 <div className="w-full bg-gray-200 rounded-full h-1.5">
                   <div 
                     className={`h-1.5 rounded-full transition-all ${
                       action.id === 'search' ? 'bg-blue-500' : 'bg-orange-500'
                     }`}
                     style={{
                       width: action.id === 'search' 
                         ? `${((usageLimits?.job_search_limits?.daily_used || 0) / (usageLimits?.job_search_limits?.daily_limit || 20)) * 100}%`
                         : `${((usageLimits?.ai_analysis_limits?.daily_used || 0) / (usageLimits?.ai_analysis_limits?.daily_limit || 6)) * 100}%`
                     }}
                   />
                 </div>
               </div>
             )}
           </button>
         );
       })}
     </div>

     {/* Usage Warnings */}
     {(searchesRemaining === 0 || aiCreditsRemaining === 0) && (
       <div className="mt-4 space-y-2">
         {searchesRemaining === 0 && (
           <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
             <div className="flex items-center gap-2">
               <div className="text-yellow-600">⚠️</div>
               <div className="text-sm text-yellow-800">
                 <strong>Daily search limit reached.</strong> You've used all {usageLimits?.job_search_limits?.daily_limit || 20} free discoveries today. Limit resets at midnight.
               </div>
             </div>
           </div>
         )}
         
         {aiCreditsRemaining === 0 && (
           <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
             <div className="flex items-center gap-2">
               <div className="text-red-600">🚫</div>
               <div className="text-sm text-red-800">
                 <strong>Daily AI analysis limit reached.</strong> You've used all {usageLimits?.ai_analysis_limits?.daily_limit || 6} AI credits today. Limit resets at midnight.
               </div>
             </div>
           </div>
         )}
       </div>
     )}

     {/* Helpful Tips */}
     <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
       <h4 className="font-medium text-gray-800 mb-2">💡 Smart Job Search Tips</h4>
       <div className="text-sm text-gray-600 space-y-1">
         <p><strong>Phase 1 (FREE):</strong> Cast a wide net with broad keywords to discover all opportunities</p>
         <p><strong>Phase 2 (AI):</strong> Select only the most promising jobs for detailed analysis</p>
         <p><strong>Cost Optimization:</strong> Filter results before AI analysis to maximize your 6 daily credits</p>
         <p><strong>Global Coverage:</strong> Search across 40+ countries with specialized job sources</p>
       </div>
     </div>
   </div>
 );
};

export default QuickActions;