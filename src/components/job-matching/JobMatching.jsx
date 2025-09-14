import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Upload, FileText, Target, CheckCircle, AlertCircle, User, Star, 
    ExternalLink, Briefcase, Brain, Users, Zap, Sparkles, TrendingUp,
    Award, Shield, Clock, ChevronRight, ChevronDown, ChevronUp,
    Building, Globe, Activity, BarChart3, Layers, Info, Eye, EyeOff
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useResumeStore from '../../stores/resumeStore';
import API_BASE_URL, { CV_AI_ENDPOINTS } from '../../config';

const JobMatching = ({ darkMode }) => {
    const { t } = useTranslation();
    
    // Core state
    const [cvSource, setCvSource] = useState('text');
    const [selectedResume, setSelectedResume] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileProcessing, setFileProcessing] = useState(false);
    const [usageInfo, setUsageInfo] = useState(null);
    const [formData, setFormData] = useState({
        resume_text: '',
        job_description: '',
        job_title: '',
        company_name: '',
        analysis_method: 'crewai'
    });
    
    // Analysis state
    const [availableMethods, setAvailableMethods] = useState(['crewai']);
    const [methodDescriptions, setMethodDescriptions] = useState({});
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Async processing state
    const [processingMode, setProcessingMode] = useState('sync');
    const [taskId, setTaskId] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const [isPolling, setIsPolling] = useState(false);

    // Expandable sections state
    const [expandedSections, setExpandedSections] = useState({
        strengths: false,
        improvements: false,
        recommendations: false,
        applicationTips: false,
        marketInsights: false,
        keywordsPresent: false,
        keywordsMissing: false
    });

    // Auth and resume stores
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());
    const token = useAuthStore(state => state.token);
    const { resumes, fetchResumes, loading: resumesLoading } = useResumeStore();

    // Enhanced method configurations
    const getMethodConfig = (method) => {
        const configs = {
            crewai: {
                icon: "🤖",
                title: t('jobMatching.methods.crewai.title', 'CrewAI Analysis'),
                subtitle: t('jobMatching.methods.crewai.subtitle', 'Multi-agent AI team analysis'),
                badge: t('jobMatching.methods.crewai.badge', 'PREMIUM'),
                badgeColor: "bg-blue-500",
                description: t('jobMatching.methods.crewai.description', 'Advanced AI analysis')
            },
            claude: {
                icon: "🧠", 
                title: t('jobMatching.methods.claude.title', 'Claude Analysis'),
                subtitle: t('jobMatching.methods.claude.subtitle', 'Advanced language model'),
                badge: t('jobMatching.methods.claude.badge', 'FAST'),
                badgeColor: "bg-purple-500",
                description: t('jobMatching.methods.claude.description', 'Quick and accurate')
            },
            both: {
                icon: "⚡",
                title: t('jobMatching.methods.both.title', 'Combined Analysis'),
                subtitle: t('jobMatching.methods.both.subtitle', 'Best of both worlds'),
                badge: t('jobMatching.methods.both.badge', 'ULTIMATE'),
                badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
                description: t('jobMatching.methods.both.description', 'Most comprehensive')
            }
        };
        return configs[method] || configs.crewai;
    };

    // Enhanced score utilities
    const getScoreEmoji = (score) => {
        if (score >= 80) return "🔥";
        if (score >= 60) return "👍";
        if (score >= 40) return "📈";
        return "💪";
    };
    
    const getScoreMessage = (score) => {
        if (score >= 80) return t('jobMatching.scores.excellent', 'Excellent match!');
        if (score >= 60) return t('jobMatching.scores.good', 'Good compatibility');
        if (score >= 40) return t('jobMatching.scores.improvement', 'Room for improvement');
        return t('jobMatching.scores.levelUp', 'Time to level up!');
    };

    const getScoreColor = (score) => {
        if (score >= 70) return darkMode ? 'text-green-400' : 'text-green-600';
        if (score >= 50) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
        return darkMode ? 'text-red-400' : 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 70) return darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200';
        if (score >= 50) return darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200';
        return darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200';
    };

    const getScoreBarColor = (score) => {
        if (score >= 70) return 'bg-green-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return darkMode ? 'text-green-400' : 'text-green-600';
        if (confidence >= 0.6) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
        return darkMode ? 'text-red-400' : 'text-red-600';
    };

    // Toggle expandable sections
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Expandable Section Component
    const ExpandableSection = ({ 
        title, 
        items, 
        icon, 
        sectionKey, 
        maxShow = 3, 
        bgColor, 
        textColor,
        badgeColor = 'bg-gray-600'
    }) => {
        const isExpanded = expandedSections[sectionKey];
        const displayItems = isExpanded ? items : items.slice(0, maxShow);
        const hasMore = items.length > maxShow;
        
        return (
            <div className={`p-3 rounded-lg border ${bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold text-sm flex items-center gap-1 ${textColor}`}>
                        {icon}
                        {title}
                        <span className={`text-xs ${badgeColor} text-white px-1.5 py-0.5 rounded-full ml-1`}>
                            {items.length}
                        </span>
                    </h4>
                    {hasMore && (
                        <button 
                            onClick={() => toggleSection(sectionKey)}
                            className={`text-xs flex items-center gap-1 hover:underline ${textColor}`}
                        >
                            {isExpanded ? (
                                <>
                                    <EyeOff className="w-3 h-3" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <Eye className="w-3 h-3" />
                                    Show All ({items.length})
                                </>
                            )}
                        </button>
                    )}
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                    {displayItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-1">
                            <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Industry Analysis Component
    const IndustryAnalysis = ({ analysis }) => {
        if (!analysis.industry_detected) return null;

        return (
            <div className={`p-3 rounded-lg border ${
                darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
            }`}>
                <h4 className={`flex items-center gap-2 font-bold text-sm mb-3 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                    <Building className="w-4 h-4" />
                    Industry Intelligence
                </h4>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Primary Industry:
                        </span>
                        <span className="font-semibold">
                            {analysis.industry_detected?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                    </div>
                    
                    {analysis.industry_confidence && (
                        <div className="flex justify-between items-center">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                Detection Confidence:
                            </span>
                            <span className={`font-semibold ${getConfidenceColor(analysis.industry_confidence)}`}>
                                {(analysis.industry_confidence * 100).toFixed(1)}%
                            </span>
                        </div>
                    )}
                    
                    {analysis.detected_role && (
                        <div className="flex justify-between items-center">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                Detected Role:
                            </span>
                            <span className="font-semibold">{analysis.detected_role}</span>
                        </div>
                    )}

                    {analysis.alternative_industries && analysis.alternative_industries.length > 0 && (
                        <div className="pt-2 border-t border-purple-300/30">
                            <div className={`text-xs font-medium mb-1 ${
                                darkMode ? 'text-purple-400' : 'text-purple-600'
                            }`}>
                                Alternative Industries:
                            </div>
                            <div className="space-y-1">
                                {analysis.alternative_industries.slice(0, 2).map((alt, index) => (
                                    <div key={index} className="flex justify-between text-xs">
                                        <span>{alt[0]?.replace(/_/g, ' ')}</span>
                                        <span className="opacity-75">{(alt[1] * 100).toFixed(0)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Analysis Method Details Component
    const AnalysisMethodDetails = ({ analysis }) => (
        <div className={`p-3 rounded-lg border ${
            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
            <h4 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
            }`}>
                <Activity className="w-4 h-4" />
                Analysis Details
            </h4>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Method:</span>
                    <span className="font-medium text-right max-w-[60%] break-words">
                        {analysis.analysis_method?.replace(/Cost-Optimized|70% cost reduction/g, '').trim()}
                    </span>
                </div>
                
                {analysis.processing_time_ms && (
                    <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Processing Time:</span>
                        <span className="font-medium">{analysis.processing_time_ms}ms</span>
                    </div>
                )}
                
                {analysis.detected_language && (
                    <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Language:</span>
                        <span className="font-medium">{analysis.detected_language.toUpperCase()}</span>
                    </div>
                )}

                {analysis.universal_analysis && (
                    <div className="flex items-center gap-1 pt-1 border-t border-gray-300/30">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className={`text-green-${darkMode ? '400' : '600'} font-medium`}>
                            Universal Industry Intelligence
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    // Confidence & Agreement Metrics Component
    const ConfidenceMetrics = ({ analysis }) => {
        if (!analysis.consensus_level && !analysis.score_difference) return null;

        return (
            <div className={`p-3 rounded-lg border ${
                darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
            }`}>
                <h4 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                    <BarChart3 className="w-4 h-4" />
                    Analysis Confidence
                </h4>
                <div className="space-y-1 text-xs">
                    {analysis.consensus_level && (
                        <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                Consensus Level:
                            </span>
                            <span className={`font-semibold ${
                                analysis.consensus_level === 'high' 
                                    ? darkMode ? 'text-green-400' : 'text-green-600'
                                    : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                            }`}>
                                {analysis.consensus_level.toUpperCase()}
                            </span>
                        </div>
                    )}
                    
                    {analysis.score_difference !== undefined && (
                        <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                Score Variance:
                            </span>
                            <span className="font-semibold">
                                {analysis.score_difference.toFixed(1)}%
                            </span>
                        </div>
                    )}

                    {analysis.agreement_analysis && (
                        <div className="pt-1 border-t border-blue-300/30">
                            <div className="flex justify-between">
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    Overall Confidence:
                                </span>
                                <span className={`font-semibold ${
                                    analysis.agreement_analysis.overall_confidence === 'high'
                                        ? darkMode ? 'text-green-400' : 'text-green-600'
                                        : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                }`}>
                                    {analysis.agreement_analysis.overall_confidence?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Usage limit check
    const checkUsageLimit = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/job-matching/usage-limit`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUsageInfo(data);
            }
        } catch (err) {
            console.error('Error checking usage limit:', err);
        }
    };

    // Effects
    useEffect(() => {
        if (token) {
            checkUsageLimit();
        }
    }, [token]);

    useEffect(() => {
        console.log('🔍 JobMatching useEffect triggered');
        console.log('isAuthenticated:', isAuthenticated);
        console.log('token:', token ? 'exists' : 'missing');
        
        if (isAuthenticated && token) {
            console.log('✅ Fetching resumes...');
            fetchResumes().then(() => {
                console.log('📋 Resumes fetched, current resumes:', resumes);
            }).catch(error => {
                console.error('❌ Error fetching resumes:', error);
            });
            fetchAnalysisMethods();
        } else {
            console.log('❌ Not authenticated or no token');
        }
    }, [fetchResumes, isAuthenticated, token]);

    useEffect(() => {
        console.log('📋 Resumes state changed:', {
            resumes,
            length: resumes?.length,
            isArray: Array.isArray(resumes),
            resumesLoading
        });
    }, [resumes, resumesLoading]);

    // Fetch available analysis methods
    const fetchAnalysisMethods = async () => {
        if (!token) {
            console.error('No token available for API request');
            setError(t('jobMatching.errors.needLogin', 'Please login to continue'));
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/job-matching/analysis-methods`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            setAvailableMethods(data.available_methods);
            setMethodDescriptions(data.descriptions);
            
            if (data.available_methods.length > 0 && !data.available_methods.includes(formData.analysis_method)) {
                setFormData(prev => ({
                    ...prev,
                    analysis_method: data.available_methods[0]
                }));
            }
        } catch (error) {
            console.error('Failed to fetch analysis methods:', error);
            setAvailableMethods(['crewai']);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            setError(t('jobMatching.errors.invalidFileType', 'Invalid file type. Please use PDF, DOC, DOCX, or TXT files.'));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError(t('jobMatching.errors.fileTooLarge', 'File too large. Maximum size is 10MB.'));
            return;
        }

        setUploadedFile(file);
        setFileProcessing(false);
        setError('');

        setError(`✅ ${t('CoverLetter.success.file_uploaded', 'File uploaded successfully')}: "${file.name}". ${t('jobMatching.form.analyzeMatch', 'Ready to analyze!')}`);
        
        setFormData({ ...formData, resume_text: '' });
        setSelectedResume('');
    };

    // Handle resume selection from database
    const handleResumeSelect = (resumeId) => {
        console.log('Selecting resume:', resumeId);
        setSelectedResume(resumeId);
        
        if (resumeId) {
            const resume = resumes.find(r => r.id == resumeId);
            if (resume) {
                const resumeText = formatResumeToText(resume);
                setFormData({ ...formData, resume_text: resumeText });
                console.log('Resume text set:', resumeText.substring(0, 100) + '...');
            }
            setUploadedFile(null);
        } else {
            setFormData({ ...formData, resume_text: '' });
        }
    };

    // Format resume object to text
    const formatResumeToText = (resume) => {
        let text = `${resume.personal_info?.full_name || ''}\n`;
        text += `${resume.personal_info?.email || ''}\n`;
        text += `${resume.personal_info?.title || ''}\n\n`;
        
        if (resume.personal_info?.summary) {
            text += `${t('resume.personal_info.summary', 'Summary')}: ${resume.personal_info.summary}\n\n`;
        }
        
        if (resume.experiences?.length) {
            text += `${t('resume.experience.title', 'Experience')}:\n`;
            resume.experiences.forEach(exp => {
                text += `- ${exp.position} ${t('common.at', 'at')} ${exp.company} (${exp.start_date} - ${exp.current ? t('common.tonow', 'Present') : exp.end_date})\n`;
                if (exp.description) text += `  ${exp.description}\n`;
            });
            text += '\n';
        }
        
        if (resume.educations?.length) {
            text += `${t('resume.education.title', 'Education')}:\n`;
            resume.educations.forEach(edu => {
                text += `- ${edu.degree} ${t('common.in', 'in')} ${edu.field_of_study} ${t('common.at', 'at')} ${edu.institution}\n`;
            });
            text += '\n';
        }
        
        if (resume.skills?.length) {
            text += `${t('resume.skills.title', 'Skills')}: ${resume.skills.map(s => s.name).join(', ')}\n\n`;
        }
        
        if (resume.languages?.length) {
            text += `${t('resume.languages.title', 'Languages')}: ${resume.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}\n\n`;
        }
        
        return text;
    };

    // Async analysis function
    const handleAsyncAnalyze = async () => {
        if (!formData.job_description.trim()) {
            setError(t('jobMatching.errors.jobDescriptionRequired', 'Job description is required'));
            return;
        }

        if (formData.job_description.trim().length < 10) {
            setError(t('jobMatching.errors.jobDescriptionTooShort', 'Job description must be at least 10 characters'));
            return;
        }

        if (!formData.job_title.trim()) {
            setError(t('jobMatching.errors.jobTitleRequired', 'Job title is required'));
            return;
        }

        if (cvSource === 'text' && !formData.resume_text.trim()) {
            setError(t('jobMatching.errors.resumeRequired', 'Resume content is required'));
            return;
        }

        if (cvSource === 'upload' && !uploadedFile) {
            setError(t('jobMatching.errors.resumeFileRequired', 'Please upload a resume file'));
            return;
        }

        if (cvSource === 'database' && !selectedResume) {
            setError(t('jobMatching.errors.resumeSelectionRequired', 'Please select a resume from your saved resumes'));
            return;
        }

        if (!isAuthenticated || !token) {
            setError(t('jobMatching.errors.needLogin', 'Please login to continue'));
            return;
        }

        setLoading(true);
        setError('');
        setAnalysis(null);
        
        try {
            let response;
            
            if (cvSource === 'upload' && uploadedFile) {
                const formDataUpload = new FormData();
                formDataUpload.append('resume_file', uploadedFile);
                formDataUpload.append('job_description', formData.job_description);
                formDataUpload.append('job_title', formData.job_title);
                formDataUpload.append('company_name', formData.company_name || '');
                formDataUpload.append('analysis_method', formData.analysis_method);
                
                response = await fetch(`${API_BASE_URL}/job-matching/analyze-job-match-file-async`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formDataUpload,
                    credentials: 'include'
                });
            } else {
                response = await fetch(`${API_BASE_URL}/job-matching/analyze-job-match-async`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include'
                });
            }
            
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error(t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
                }
                throw new Error(errorData.detail || t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
            }
            
            const data = await response.json();
            console.log('Async task started:', data);
            
            setTaskId(data.task_id);
            setTaskStatus({
                status: 'processing',
                message: data.message,
                created_at: new Date().toISOString()
            });
            
            startPolling(data.task_id);
            
        } catch (error) {
            console.error('Async analysis failed:', error);
            setError(error.message || t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
            setLoading(false);
        }
    };

    // Sync analysis function
    const handleSyncAnalyze = async () => {
        if (!formData.job_description.trim()) {
            setError(t('jobMatching.errors.jobDescriptionRequired', 'Job description is required'));
            return;
        }

        if (formData.job_description.trim().length < 10) {
            setError(t('jobMatching.errors.jobDescriptionTooShort', 'Job description must be at least 10 characters'));
            return;
        }

        if (!formData.job_title.trim()) {
            setError(t('jobMatching.errors.jobTitleRequired', 'Job title is required'));
            return;
        }

        if (cvSource === 'text' && !formData.resume_text.trim()) {
            setError(t('jobMatching.errors.resumeRequired', 'Resume content is required'));
            return;
        }

        if (cvSource === 'upload' && !uploadedFile) {
            setError(t('jobMatching.errors.resumeFileRequired', 'Please upload a resume file'));
            return;
        }

        if (cvSource === 'database' && !selectedResume) {
            setError(t('jobMatching.errors.resumeSelectionRequired', 'Please select a resume from your saved resumes'));
            return;
        }

        if (!isAuthenticated || !token) {
            setError(t('jobMatching.errors.needLogin', 'Please login to continue'));
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            let response;
            
            if (cvSource === 'upload' && uploadedFile) {
                const formDataUpload = new FormData();
                formDataUpload.append('resume_file', uploadedFile);
                formDataUpload.append('job_description', formData.job_description);
                formDataUpload.append('job_title', formData.job_title);
                formDataUpload.append('company_name', formData.company_name || '');
                formDataUpload.append('analysis_method', formData.analysis_method);
                
                console.log('Uploading file:', uploadedFile.name);
                
                response = await fetch(`${API_BASE_URL}/job-matching/analyze-job-match-file`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formDataUpload,
                    credentials: 'include'
                });
            } else {
                console.log('Sending text analysis request:', {
                    job_title: formData.job_title,
                    company_name: formData.company_name,
                    analysis_method: formData.analysis_method,
                    resume_text_length: formData.resume_text.length,
                    job_description_length: formData.job_description.length
                });
                
                response = await fetch(`${API_BASE_URL}/job-matching/analyze-job-match`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include'
                });
            }
            
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('API Error Response:', errorData);
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                    throw new Error(t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
                }
                
                if (response.status === 422) {
                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        const validationErrors = errorData.errors.map(err => {
                            const location = Array.isArray(err.loc) ? err.loc.join('.') : 'Field';
                            return `${location}: ${err.msg}`;
                        }).join('; ');
                        throw new Error(`Validation Error: ${validationErrors}`);
                    } else if (errorData.detail) {
                        throw new Error(`Validation Error: ${errorData.detail}`);
                    }
                }
                
                throw new Error(errorData.detail || t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
            }
            
            const data = await response.json();
            console.log('Analysis result:', data);
            setAnalysis(data);
        } catch (error) {
            console.error('Analysis failed:', error);
            setError(error.message || t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    // Main analyze function
    const handleAnalyze = async () => {
        if (processingMode === 'async') {
            await handleAsyncAnalyze();
        } else {
            await handleSyncAnalyze();
        }
    };

    // Polling function for async tasks
    const startPolling = (taskId) => {
        setIsPolling(true);
        
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/job-matching/task-status/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to check task status');
                }
                
                const data = await response.json();
                console.log('Task status:', data);
                
                setTaskStatus(data);
                
                if (data.status === 'completed') {
                    setAnalysis(data.result);
                    setLoading(false);
                    setIsPolling(false);
                    clearInterval(pollInterval);
                    
                    console.log('Analysis completed successfully!');
                    
                } else if (data.status === 'failed') {
                    setError(data.error || t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
                    setLoading(false);
                    setIsPolling(false);
                    clearInterval(pollInterval);
                }
                
            } catch (error) {
                console.error('Error checking task status:', error);
                setError(t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
                setLoading(false);
                setIsPolling(false);
                clearInterval(pollInterval);
            }
        }, 2000);
        
        setTimeout(() => {
            clearInterval(pollInterval);
            if (isPolling) {
                setError(t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
                setLoading(false);
                setIsPolling(false);
            }
        }, 300000);
    };

    // Processing mode selector component
    const ProcessingModeSelector = () => (
        <div className="mb-4">
            <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                ⚡ {t('common.processing_mode', 'Processing Mode')}
            </label>
            <div className={`grid grid-cols-2 gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                {[
                    { 
                        key: 'sync', 
                        icon: '⚡', 
                        label: t('jobMatching.form.analyzeMatch', 'Quick Analysis'),
                        subtitle: t('jobMatching.form.takes30Seconds', 'Takes 30 seconds')
                    },
                    { 
                        key: 'async', 
                        icon: '🔄', 
                        label: t('jobMatching.form.deepAnalysis', 'Deep Analysis'),
                        subtitle: t('jobMatching.form.aiAnalyzing', 'AI analyzing...')
                    }
                ].map(({ key, icon, label, subtitle }) => (
                    <button
                        key={key}
                        onClick={() => setProcessingMode(key)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-md text-xs font-medium transition-all duration-200 ${
                            processingMode === key
                                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-md scale-105'
                                : darkMode
                                    ? 'text-gray-300 hover:bg-gray-600'
                                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                        }`}
                    >
                        <span className="text-lg">{icon}</span>
                        <span className="text-center leading-tight font-semibold">{label}</span>
                        <span className={`text-xs opacity-75 text-center leading-tight ${
                            processingMode === key ? 'text-white/90' : ''
                        }`}>
                            {subtitle}
                        </span>
                    </button>
                ))}
            </div>
            {processingMode === 'async' && (
                <div className={`mt-2 p-2 rounded text-xs ${
                    darkMode ? 'bg-blue-900/20 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                    💡 {t('jobMatching.progress.bothTakesTime', 'Deep analysis takes more time but provides comprehensive insights')}
                </div>
            )}
        </div>
    );

    console.log('Usage Info:', usageInfo);

    // Loading display component
    const LoadingDisplay = () => {
        if (processingMode === 'sync') {
            return (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="relative mb-3">
                        <div className="w-8 h-8 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto" />
                    </div>
                    <h3 className="text-base font-semibold mb-1">{getMethodConfig(formData.analysis_method).title}</h3>
                    <p className="text-sm font-medium mb-1">
                        {formData.analysis_method === 'crewai' && t('jobMatching.progress.expertPanel', 'Expert panel analyzing...')}
                        {formData.analysis_method === 'claude' && t('jobMatching.progress.deepAnalysis', 'Deep analysis in progress...')}
                        {formData.analysis_method === 'both' && t('jobMatching.progress.comprehensive', 'Comprehensive analysis...')}
                    </p>
                </div>
            );
        } else {
            return (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="relative mb-3">
                        <div className="w-8 h-8 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto" />
                    </div>
                    <h3 className="text-base font-semibold mb-1">🔄 {t('common.loading', 'Loading')}</h3>
                    <p className="text-sm font-medium mb-2">
                        {taskStatus?.message || t('jobMatching.form.aiAnalyzing', 'AI analyzing...')}
                    </p>
                    {taskStatus && (
                        <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            <div>Task ID: {taskId}</div>
                            <div>Status: {taskStatus.status}</div>
                            {taskStatus.job_title && <div>Job: {taskStatus.job_title}</div>}
                            <div className="mt-2 text-xs opacity-75">
                                {t('jobMatching.progress.bothTakesTime', 'This may take a few minutes...')}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    };

    // Login required state
    if (!isAuthenticated || !token) {
        return (
            <div className={`min-h-screen pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className={`text-center p-6 rounded-xl shadow-lg border ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-lg opacity-20"></div>
                            <div className="relative p-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {t('jobMatching.auth.unlockPotential', 'Unlock Your Potential')}
                        </h2>
                        <p className={`text-sm mb-4 max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {t('jobMatching.auth.joinThousands', 'Join thousands of professionals who landed their dream jobs')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs">
                            {[
                                t('jobMatching.features.instantScoring', 'Instant scoring'),
                                t('jobMatching.features.atsOptimization', 'ATS optimization'),
                                t('jobMatching.features.personalizedTips', 'Personalized tips'),
                                t('jobMatching.features.keywordAnalysis', 'Keyword analysis')
                            ].map((feature, index) => (
                                <div key={index} className={`px-2 py-1 rounded-full ${
                                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="group relative px-6 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                            <span className="relative">{t('jobMatching.auth.getStarted', 'Get Started')}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    
     return (
        <div className={`min-h-screen pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
  
            {usageInfo && (
                <div className={`mb-3 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {usageInfo.limit ? 
                        t('ai.limit_info', 'AI requests remaining: {{remaining}} of {{limit}}', { 
                            remaining: usageInfo.remaining, 
                            limit: usageInfo.limit 
                        })
                        :
                        `AI requests remaining: ${usageInfo.remaining || usageInfo.legacy_remaining || 0} of ${usageInfo.daily_limit || usageInfo.legacy_limit || 6}`
                    }
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Enhanced Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-md opacity-30"></div>
                            <div className="relative p-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                {t('jobMatching.title', 'Job Matching Analysis')}
                            </h1>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-current" />
                                    ))}
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {t('jobMatching.socialProof', 'Trusted by 10,000+ job seekers')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className={`text-sm max-w-3xl mx-auto leading-relaxed mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {t('jobMatching.subtitle', 'Get instant AI-powered analysis of how well your resume matches any job posting')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                        {[
                            t('jobMatching.features.instantScoring', 'Instant scoring'),
                            t('jobMatching.features.beatATS', 'Beat ATS systems'),
                            t('jobMatching.features.personalizedTips', 'Personalized tips'),
                            t('jobMatching.features.keywordGaps', 'Find keyword gaps')
                        ].map((feature, index) => (
                            <div key={index} className={`px-2 py-1 rounded-full shadow-sm backdrop-blur-sm ${
                                darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white/80 text-gray-700 border border-white/20'
                            }`}>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Panel - Enhanced Input Form */}
                    <div className={`rounded-xl p-4 shadow-lg backdrop-blur-sm border ${
                        darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'
                    }`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {t('jobMatching.form.title', 'Analysis Setup')}
                            </h2>
                        </div>

                        {/* Processing Mode Selection */}
                        <ProcessingModeSelector />

                        {/* Enhanced Analysis Method Selection */}
                        {availableMethods.length > 1 && (
                            <div className="mb-4">
                                <div className="text-center mb-3">
                                    <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('jobMatching.form.chooseAnalysis', 'Choose Analysis Method')}
                                    </h3>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t('jobMatching.form.differentApproaches', 'Different AI systems offer unique insights')}
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    {availableMethods.map((method) => {
                                        const isSelected = formData.analysis_method === method;
                                        const config = getMethodConfig(method);
                                        
                                        return (
                                            <label key={method} className={`relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? `border-purple-500 shadow-md ring-1 ${
                                                        darkMode 
                                                            ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 ring-purple-800' 
                                                            : 'bg-gradient-to-r from-purple-50 to-pink-50 ring-purple-200'
                                                      }`
                                                    : `border-gray-200 hover:border-purple-300 hover:shadow-sm ${
                                                        darkMode ? 'border-gray-600 hover:border-purple-400' : ''
                                                      }`
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="analysis_method"
                                                    value={method}
                                                    checked={isSelected}
                                                    onChange={handleInputChange}
                                                    className="sr-only"
                                                />
                                                
                                                <div className={`text-xl p-2 rounded-lg transition-all duration-200 ${
                                                    isSelected 
                                                        ? `shadow-sm scale-105 ${darkMode ? 'bg-gray-700' : 'bg-white'}` 
                                                        : `${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
                                                }`}>
                                                    {config.icon}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {config.title}
                                                        </h4>
                                                        <span className={`px-1.5 py-0.5 text-xs font-medium text-white rounded flex-shrink-0 ${config.badgeColor}`}>
                                                            {config.badge}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs leading-tight ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {config.subtitle}
                                                    </p>
                                                    {method === 'both' && (
                                                        <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${
                                                            darkMode ? 'text-orange-400' : 'text-orange-600'
                                                        }`}>
                                                            <Clock className="w-3 h-3" />
                                                            Takes longer but more comprehensive
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Job Details */}
                        <div className="space-y-3 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {t('jobMatching.form.targetPosition', 'Target Position')}
                                    </label>
                                    <input
                                        type="text"
                                        name="job_title"
                                        value={formData.job_title}
                                        onChange={handleInputChange}
                                        placeholder={t('jobMatching.form.jobTitlePlaceholder', 'e.g. Software Engineer')}
                                        className={`w-full rounded-lg border p-2.5 text-sm transition-all ${
                                            darkMode 
                                                ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                                : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {t('jobMatching.form.dreamCompany', 'Company (Optional)')}
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleInputChange}
                                        placeholder={t('jobMatching.form.companyPlaceholder', 'e.g. Google, Microsoft')}
                                        className={`w-full rounded-lg border p-2.5 text-sm transition-all ${
                                            darkMode 
                                                ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                                : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Enhanced CV Source Selection */}
                        <div className="mb-4">
                            <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                {t('jobMatching.form.howSubmitResume', 'How would you like to submit your resume?')}
                            </label>
                            <div className={`grid grid-cols-3 gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                {[
                                    { key: 'database', icon: FileText, label: t('jobMatching.form.savedCVs', 'Saved CVs') },
                                    { key: 'upload', icon: Upload, label: t('jobMatching.form.uploadNew', 'Upload New') },
                                    { key: 'text', icon: User, label: t('jobMatching.form.copyPaste', 'Copy & Paste') }
                                ].map(({ key, icon: Icon, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setCvSource(key);
                                            if (key !== 'database') setSelectedResume('');
                                            if (key !== 'upload') setUploadedFile(null);
                                            if (key !== 'text') setFormData(prev => ({ ...prev, resume_text: '' }));
                                        }}
                                        className={`flex flex-col items-center gap-1 p-2 rounded-md text-xs font-medium transition-all duration-200 ${
                                            cvSource === key
                                                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-md scale-105'
                                                : darkMode
                                                    ? 'text-gray-300 hover:bg-gray-600'
                                                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-center leading-tight">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Database Resume Selection */}
                        {cvSource === 'database' && (
                            <div className="mb-4">
                                <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {t('jobMatching.form.selectStoredResume', 'Select from your saved resumes')}
                                </label>
                                
                                {resumesLoading && (
                                    <div className={`p-3 rounded-lg border text-center ${
                                        darkMode ? 'bg-gray-700/30 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-600'
                                    }`}>
                                        <div className="w-4 h-4 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-sm">Loading your resumes...</p>
                                    </div>
                                )}
                                
                                {!resumesLoading && isAuthenticated && resumes && Array.isArray(resumes) && resumes.length > 0 && (
                                    <div>
                                        <div className="flex">
                                            <select
                                                name="resumeId"
                                                value={selectedResume}
                                                onChange={(e) => {
                                                    console.log('🎯 Resume selected:', e.target.value);
                                                    handleResumeSelect(e.target.value);
                                                }}
                                                className={`w-full p-2.5 text-sm rounded-l border transition-all ${
                                                    darkMode 
                                                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                                        : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                                }`}
                                            >
                                                <option value="">{t('jobMatching.form.selectResume', '-- Select a resume --')}</option>
                                                {resumes.map(resume => (
                                                    <option key={resume.id} value={resume.id}>
                                                        {resume.title || `${t('resume.title', 'Resume')} #${resume.id}`}
                                                        {resume.personal_info?.full_name && ` - ${resume.personal_info.full_name}`}
                                                    </option>
                                                ))}
                                            </select>
                                            {selectedResume && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        console.log('🗑️ Clearing resume selection');
                                                        handleResumeSelect('');
                                                    }}
                                                    className={`px-3 py-2 rounded-r border-l-0 text-sm transition-colors ${
                                                        darkMode 
                                                            ? 'bg-gray-600 text-gray-300 border-gray-600 hover:bg-gray-500' 
                                                            : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                                                    }`}
                                                    title={t('common.clear', 'Clear')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        
                                        {selectedResume && (
                                            <div className={`mt-2 p-2 rounded text-xs flex items-center gap-2 ${
                                                darkMode ? 'bg-green-900/20 border border-green-800 text-green-400' : 'bg-green-100 border border-green-300 text-green-700'
                                            }`}>
                                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                                <span>
                                                    {t('jobMatching.form.resumeSelected', 'Selected resume')}: {
                                                        resumes.find(r => r.id == selectedResume)?.title || 
                                                        `${t('resume.title', 'Resume')} #${selectedResume}`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {!resumesLoading && isAuthenticated && (!resumes || !Array.isArray(resumes) || resumes.length === 0) && (
                                    <div className={`p-3 rounded-lg border text-center ${
                                        darkMode ? 'bg-gray-700/30 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-600'
                                    }`}>
                                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium mb-1">{t('jobMatching.form.noSavedResumes', 'No saved resumes found')}</p>
                                        <p className="text-xs opacity-75">{t('jobMatching.form.createResumeFirst', 'Create your first resume to get started')}</p>
                                        <button
                                            onClick={() => {
                                                console.log('🏗️ Navigating to resume builder');
                                                window.location.href = '/resume-builder';
                                            }}
                                            className="mt-2 px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-md transition-all"
                                        >
                                            {t('jobMatching.form.createResume', 'Create Resume')}
                                        </button>
                                    </div>
                                )}
                                
                                {!isAuthenticated && (
                                    <div className={`p-3 rounded-lg border text-center ${
                                        darkMode ? 'bg-yellow-900/20 border-yellow-800 text-yellow-400' : 'bg-yellow-50 border-yellow-300 text-yellow-700'
                                    }`}>
                                        <p className="text-sm">{t('jobMatching.form.loginToAccessResumes', 'Please login to access your saved resumes')}</p>
                                        <button
                                            onClick={() => {
                                                console.log('🔐 Navigating to login');
                                                window.location.href = '/login';
                                            }}
                                            className="mt-2 px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-md transition-all"
                                        >
                                            {t('auth.login.title', 'Login')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* File Upload Section */}
                        {cvSource === 'upload' && (
                            <div className="mb-4">
                                <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {t('jobMatching.form.uploadCV', 'Upload your resume')}
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                                    darkMode ? 'border-gray-600 bg-gray-700/30 hover:border-purple-500' : 'border-gray-300 bg-gray-50 hover:border-purple-400'
                                }`}>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="cv-upload"
                                        disabled={fileProcessing}
                                    />
                                    <label
                                        htmlFor="cv-upload"
                                        className={`cursor-pointer flex flex-col items-center gap-2 ${
                                            fileProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                        } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                    >
                                        {fileProcessing ? (
                                            <>
                                                <div className="w-6 h-6 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin" />
                                                <span className="text-xs font-medium">{t('jobMatching.form.processingFile', 'Processing file...')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6" />
                                                <div>
                                                    <span className="text-xs font-medium block">
                                                        {uploadedFile ? uploadedFile.name : t('jobMatching.form.uploadPlaceholder', 'Click to upload or drag and drop')}
                                                    </span>
                                                    <span className="text-xs opacity-75 mt-1 block">{t('jobMatching.form.supportedFormats', 'PDF, DOC, DOCX, TXT (max 10MB)')}</span>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Text Input Section */}
                        {cvSource === 'text' && (
                            <div className="mb-4">
                                <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {t('jobMatching.form.resumeContent', 'Resume content')}
                                </label>
                                <textarea
                                    name="resume_text"
                                    value={formData.resume_text}
                                    onChange={handleInputChange}
                                    placeholder={t('jobMatching.form.resumeContentPlaceholder', 'Paste your resume text here...')}
                                    rows={5}
                                    className={`w-full rounded-lg border p-2.5 text-sm resize-none transition-all ${
                                        darkMode 
                                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                            : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                    }`}
                                    required
                                />
                            </div>
                        )}

                        {/* Job Description */}
                        <div className="mb-4">
                            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                {t('jobMatching.form.jobPosting', 'Job description')}
                            </label>
                            <textarea
                                name="job_description"
                                value={formData.job_description}
                                onChange={handleInputChange}
                                placeholder={t('jobMatching.form.jobDescriptionPlaceholder', 'Paste the complete job posting here...')}
                                rows={6}
                                className={`w-full rounded-lg border p-2.5 text-sm resize-none transition-all ${
                                    darkMode 
                                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                        : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                }`}
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                                error.startsWith('✅') 
                                    ? darkMode ? 'bg-green-900/20 border border-green-800 text-green-400' : 'bg-green-100 border border-green-300 text-green-700'
                                    : darkMode ? 'bg-red-900/20 border border-red-800 text-red-400' : 'bg-red-100 border border-red-300 text-red-700'
                            }`}>
                                {error.startsWith('✅') ? (
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                )}
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Enhanced Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || fileProcessing}
                            className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-3 text-white font-semibold text-sm shadow-lg transition-all duration-300 hover:shadow-purple-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <div className="text-center">
                                            <span className="block text-sm">
                                                {processingMode === 'sync' ? t('jobMatching.form.aiAnalyzing', 'AI analyzing...') : t('jobMatching.progress.comprehensive', 'Comprehensive analysis...')}
                                            </span>
                                            <span className="text-xs opacity-90">
                                                {processingMode === 'sync' 
                                                    ? t('jobMatching.form.usingMethod', 'Using {{method}}', { method: getMethodConfig(formData.analysis_method).title })
                                                    : t('jobMatching.form.takes30Seconds', 'This may take a few minutes')
                                                }
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg">{processingMode === 'sync' ? '🚀' : '🔄'}</span>
                                        <div className="text-center">
                                            <span className="block text-sm">
                                                {t('jobMatching.form.analyzeMatch', 'Analyze Job Match')}
                                            </span>
                                            <span className="text-xs opacity-90">
                                                {t('jobMatching.form.takes30Seconds', 'Get instant results')}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                            {!loading && (
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                            )}
                        </button>
                    </div>

                    {/* Right Panel - Enhanced Results */}
                    <div className={`rounded-xl p-4 shadow-lg backdrop-blur-sm border ${
                        darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'
                    }`}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {t('jobMatching.results.intelligenceReport', 'Intelligence Report')}
                            </h2>
                        </div>

                        {!analysis && !loading && (
                            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <div className="relative mb-3">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-lg"></div>
                                    <Target className="relative w-12 h-12 mx-auto opacity-50" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">{t('jobMatching.results.readyToDiscover', 'Ready to discover your potential?')}</h3>
                                <p className="text-sm max-w-md mx-auto">{t('jobMatching.results.fillFormGetInsights', 'Fill out the form to get personalized insights')}</p>
                            </div>
                        )}

                        {loading && <LoadingDisplay />}

                        {analysis && (
                            <div className="space-y-4">
                                {/* Industry Analysis - NEW */}
                                <IndustryAnalysis analysis={analysis} />

                                {/* Analysis Method Details - NEW */}
                                <AnalysisMethodDetails analysis={analysis} />

                                {/* Confidence Metrics - NEW */}
                                <ConfidenceMetrics analysis={analysis} />

                                {/* Combined Analysis Alert */}
                                {analysis.analysis_method?.includes("Combined") && analysis.score_difference && (
                                    <div className={`p-3 rounded-lg border ${
                                        darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
                                    }`}>
                                        <h4 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${
                                            darkMode ? 'text-purple-400' : 'text-purple-600'
                                        }`}>
                                            <Brain className="w-4 h-4" />
                                            AI Systems Comparison
                                        </h4>
                                        <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <div className="flex justify-between">
                                                <span>🤖 CrewAI:</span>
                                                <span className="font-semibold">{analysis.crewai_analysis?.match_score}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>🧠 Claude:</span>
                                                <span className="font-semibold">{analysis.claude_analysis?.match_score}%</span>
                                            </div>
                                            <div className={`flex justify-between text-xs font-medium pt-1 border-t ${
                                                darkMode ? 'border-purple-800' : 'border-purple-200'
                                            } ${
                                                analysis.score_difference > 20 
                                                    ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                                    : darkMode ? 'text-green-400' : 'text-green-600'
                                            }`}>
                                                <span>Confidence:</span>
                                                <span>
                                                    {analysis.score_difference > 20 
                                                        ? `⚠️ Mixed signals`
                                                        : `✅ High confidence`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Score Display */}
                                <div className={`text-center p-4 rounded-xl shadow-lg border ${
                                    darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                                }`}>
                                    <div className="text-4xl mb-2">{getScoreEmoji(analysis.match_score)}</div>
                                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysis.match_score)}`}>
                                        {analysis.match_score}%
                                    </div>
                                    <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Job Compatibility Score
                                    </h3>
                                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {getScoreMessage(analysis.match_score)}
                                    </p>
                                    <div className={`text-xs font-medium flex items-center justify-center gap-1 ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        <Shield className="w-3 h-3" />
                                        Analyzed by: {analysis.analysis_method?.split(' - ')[0] || analysis.analysis_method}
                                    </div>
                                </div>

                                {/* Score Cards Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className={`p-3 rounded-lg text-center border ${getScoreBgColor(analysis.ats_compatibility_score)}`}>
                                        <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            🤖 ATS Pass Rate
                                        </h4>
                                        <div className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.ats_compatibility_score)}`}>
                                            {analysis.ats_compatibility_score}%
                                        </div>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            How well you beat the robots
                                        </p>
                                        <div className={`w-full rounded-full h-1.5 mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                            <div 
                                                className={`h-1.5 rounded-full transition-all duration-1000 ${getScoreBarColor(analysis.ats_compatibility_score)}`}
                                                style={{ width: `${analysis.ats_compatibility_score}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`p-3 rounded-lg text-center border ${
                                        darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            💡 Recommendation
                                        </h4>
                                        <div className={`text-xl font-bold mb-1 ${
                                            analysis.should_apply 
                                                ? darkMode ? 'text-green-400' : 'text-green-600'
                                                : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                        }`}>
                                            {analysis.should_apply ? '🎯' : '📈'}
                                        </div>
                                        <p className={`text-xs font-semibold ${
                                            analysis.should_apply 
                                                ? darkMode ? 'text-green-400' : 'text-green-600'
                                                : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                        }`}>
                                            {analysis.should_apply 
                                                ? 'Go for it!' 
                                                : 'Build up first'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Enhanced Expandable Sections */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Superpowers - Enhanced */}
                                    <ExpandableSection
                                        title="Your Superpowers"
                                        items={analysis.strengths || []}
                                        icon={<Award className="w-4 h-4" />}
                                        sectionKey="strengths"
                                        maxShow={3}
                                        bgColor={darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}
                                        textColor={darkMode ? 'text-green-400' : 'text-green-600'}
                                        badgeColor="bg-green-600"
                                    />

                                    {/* Level Up Areas - Enhanced */}
                                    <ExpandableSection
                                        title="Level Up Here"
                                        items={analysis.improvement_areas || []}
                                        icon={<TrendingUp className="w-4 h-4" />}
                                        sectionKey="improvements"
                                        maxShow={3}
                                        bgColor={darkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'}
                                        textColor={darkMode ? 'text-orange-400' : 'text-orange-600'}
                                        badgeColor="bg-orange-600"
                                    />
                                </div>

                                {/* Enhanced Keywords Analysis */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <ExpandableSection
                                        title="Skills to Add"
                                        items={analysis.keywords_missing || []}
                                        icon={<AlertCircle className="w-3 h-3" />}
                                        sectionKey="keywordsMissing"
                                        maxShow={4}
                                        bgColor={darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}
                                        textColor={darkMode ? 'text-red-400' : 'text-red-600'}
                                        badgeColor="bg-red-600"
                                    />
                                    
                                    <ExpandableSection
                                        title="Winning Keywords"
                                        items={analysis.keywords_present || []}
                                        icon={<CheckCircle className="w-3 h-3" />}
                                        sectionKey="keywordsPresent"
                                        maxShow={4}
                                        bgColor={darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}
                                        textColor={darkMode ? 'text-green-400' : 'text-green-600'}
                                        badgeColor="bg-green-600"
                                    />
                                </div>

                                {/* Enhanced Action Plan */}
                                <div className={`p-3 rounded-lg border ${
                                    darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                                }`}>
                                    <h4 className={`flex items-center gap-2 font-bold text-sm mb-3 ${
                                        darkMode ? 'text-blue-400' : 'text-blue-600'
                                    }`}>
                                        <Briefcase className="w-4 h-4" />
                                        Your Action Plan
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <h5 className={`font-semibold text-xs flex items-center gap-1 ${
                                                    darkMode ? 'text-blue-400' : 'text-blue-600'
                                                }`}>
                                                    <Target className="w-3 h-3" />
                                                    Strategic Moves
                                                </h5>
                                                {(analysis.recommendations?.length > 2) && (
                                                    <button 
                                                        onClick={() => toggleSection('recommendations')}
                                                        className={`text-xs flex items-center gap-1 hover:underline ${
                                                            darkMode ? 'text-blue-400' : 'text-blue-600'
                                                        }`}
                                                    >
                                                        {expandedSections.recommendations ? (
                                                            <>
                                                                <ChevronUp className="w-3 h-3" />
                                                                Less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-3 h-3" />
                                                                All ({analysis.recommendations.length})
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                                {(expandedSections.recommendations 
                                                    ? analysis.recommendations 
                                                    : analysis.recommendations?.slice(0, 2) || []
                                                ).map((rec, index) => (
                                                    <p key={index} className={`text-xs flex items-start gap-1 ${
                                                        darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                        <span className="text-blue-500 font-bold">•</span>
                                                        {rec}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <h5 className={`font-semibold text-xs flex items-center gap-1 ${
                                                    darkMode ? 'text-blue-400' : 'text-blue-600'
                                                }`}>
                                                    <Sparkles className="w-3 h-3" />
                                                    Application Hacks
                                                </h5>
                                                {(analysis.application_tips?.length > 2) && (
                                                    <button 
                                                        onClick={() => toggleSection('applicationTips')}
                                                        className={`text-xs flex items-center gap-1 hover:underline ${
                                                            darkMode ? 'text-blue-400' : 'text-blue-600'
                                                        }`}
                                                    >
                                                        {expandedSections.applicationTips ? (
                                                            <>
                                                                <ChevronUp className="w-3 h-3" />
                                                                Less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-3 h-3" />
                                                                All ({analysis.application_tips.length})
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                                {(expandedSections.applicationTips 
                                                    ? analysis.application_tips 
                                                    : analysis.application_tips?.slice(0, 2) || []
                                                ).map((tip, index) => (
                                                    <p key={index} className={`text-xs flex items-start gap-1 ${
                                                        darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                        <span className="text-blue-500 font-bold">•</span>
                                                        {tip}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        </div>
                               </div>

                               {/* Enhanced Market Insights */}
                               {analysis.market_insights && analysis.market_insights.length > 0 && (
                                   <ExpandableSection
                                       title="Market Intelligence"
                                       items={analysis.market_insights}
                                       icon={<TrendingUp className="w-4 h-4" />}
                                       sectionKey="marketInsights"
                                       maxShow={3}
                                       bgColor={darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'}
                                       textColor={darkMode ? 'text-purple-400' : 'text-purple-600'}
                                       badgeColor="bg-purple-600"
                                   />
                               )}

                               {/* Quick Actions */}
                               <div className={`p-3 rounded-lg border ${
                                   darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                               }`}>
                                   <h4 className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                       🚀 Quick Actions
                                   </h4>
                                   <div className="flex flex-wrap gap-2">
                                       <button
                                           onClick={() => window.print()}
                                           className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                               darkMode 
                                                   ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                                   : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                           }`}
                                       >
                                           📄 Save Report
                                       </button>
                                       <button
                                           onClick={() => {
                                               const text = `Job Match Analysis Results:\n\nScore: ${analysis.match_score}%\nATS Score: ${analysis.ats_compatibility_score}%\nRecommendation: ${analysis.should_apply ? 'Apply!' : 'Improve first'}\n\nIndustry: ${analysis.industry_detected?.replace(/_/g, ' ')}\nDetected Role: ${analysis.detected_role || 'N/A'}\n\nTop Strengths:\n${(analysis.strengths || []).slice(0, 3).map(s => `• ${s}`).join('\n')}\n\nImprovement Areas:\n${(analysis.improvement_areas || []).slice(0, 3).map(a => `• ${a}`).join('\n')}\n\nKeywords Present: ${(analysis.keywords_present || []).join(', ')}\nKeywords Missing: ${(analysis.keywords_missing || []).join(', ')}`;
                                               navigator.clipboard.writeText(text);
                                               alert('Results copied to clipboard!');
                                           }}
                                           className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                               darkMode 
                                                   ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                                   : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                           }`}
                                       >
                                           📋 Copy Results
                                       </button>
                                       <button
                                           onClick={() => {
                                               setAnalysis(null);
                                               setError('');
                                               setFormData({
                                                   ...formData,
                                                   job_description: '',
                                                   job_title: '',
                                                   company_name: ''
                                               });
                                           }}
                                           className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-md transition-all"
                                       >
                                           🔄 New Analysis
                                       </button>
                                   </div>
                               </div>
                           </div>
                       )}
                   </div>
               </div>
           </div>
       </div>
   );
};

export default JobMatching;