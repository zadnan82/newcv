import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Upload, FileText, Target, CheckCircle, AlertCircle, User, Star, 
    ExternalLink, Briefcase, Brain, TrendingUp, Award, Shield, Clock, 
    ChevronRight, ChevronDown, Building, Activity, BarChart3, Info, 
    Eye, EyeOff, Sparkles, Copy, RotateCcw, Download
} from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import useResumeStore from '../../stores/resumeStore';
import API_BASE_URL from '../../config';
import { formatResumeToText, validateFile, getTextStats, debugCVStructure, extractTextFromFile } from '../../services/fileConverterService';

const JobMatching = ({ darkMode }) => {
    const { t } = useTranslation();
    
    // Core state
    const [cvSource, setCvSource] = useState('text');
    const [selectedResume, setSelectedResume] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileProcessing, setFileProcessing] = useState(false);
    const [formData, setFormData] = useState({
        resume_text: '',
        job_description: '',
        job_title: '',
        company_name: '',
        analysis_method: 'simple'
    });
    
    // Analysis state
    const [availableMethods, setAvailableMethods] = useState(['simple']);
    const [methodDescriptions, setMethodDescriptions] = useState({});
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
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

    // Session store - FIXED: use correct properties
    const { 
        isSessionActive, 
        sessionToken,
        listAllCloudCVs,
        loadCVFromProvider,
        loadLocalCVs,
        connectedProviders,
        localCVs,
        getConnectedProviderDetails
    } = useSessionStore();
    const { resumes, fetchResumes, loading: resumesLoading } = useResumeStore();

    // Cloud and local CVs state
    const [cloudCVs, setCloudCVs] = useState([]);
    const [localStorageCVs, setLocalStorageCVs] = useState([]);

    // Method configurations
   const getMethodConfig = (method) => {
        const configs = {
            simple: {
                icon: "🔧",
                title: t('jobMatching.methods.crewai.title', 'AI Expert Panel'),
                subtitle: t('jobMatching.methods.crewai.subtitle', 'Team of specialized recruitment agents'),
                badge: t('jobMatching.methods.crewai.badge', 'Most Popular'),
                badgeColor: "bg-green-500",
                description: t('jobMatching.methods.crewai.description', 'Multiple specialized agents work together like a recruitment panel to thoroughly evaluate your fit')
            },
            crewai: {
                icon: "🤖",
                title: t('jobMatching.methods.crewai.title', 'AI Expert Panel'),
                subtitle: t('jobMatching.methods.crewai.subtitle', 'Team of specialized recruitment agents'),
                badge: t('jobMatching.methods.crewai.badge', 'Most Popular'),
                badgeColor: "bg-blue-500",
                description: t('jobMatching.methods.crewai.description', 'Multiple specialized agents work together like a recruitment panel to thoroughly evaluate your fit')
            },
            claude: {
                icon: "🧠", 
                title: t('jobMatching.methods.claude.title', 'Senior AI Recruiter'),
                subtitle: t('jobMatching.methods.claude.subtitle', 'Advanced reasoning like a hiring manager'),
                badge: t('jobMatching.methods.claude.badge', 'Most Accurate'),
                badgeColor: "bg-purple-500",
                description: t('jobMatching.methods.claude.description', 'Cutting-edge AI that thinks like a senior recruiter with years of hiring experience')
            }
        };
        return configs[method] || configs.simple;
    };
    // Score utilities
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
                    
                    {analysis.detected_role && (
                        <div className="flex justify-between items-center">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                Detected Role:
                            </span>
                            <span className="font-semibold">{analysis.detected_role}</span>
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
                        {analysis.analysis_method || 'Built-in Analysis'}
                    </span>
                </div>
                
                {analysis.processing_time_ms && (
                    <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Processing Time:</span>
                        <span className="font-medium">{analysis.processing_time_ms}ms</span>
                    </div>
                )}
                
                <div className="flex items-center gap-1 pt-1 border-t border-gray-300/30">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span className={`text-green-${darkMode ? '400' : '600'} font-medium`}>
                        Privacy-First Analysis
                    </span>
                </div>
            </div>
        </div>
    );

    // Effects
    useEffect(() => {
        // Load CVs similar to CoverLetter component
        const loadAllCVs = async () => {
            // Load local CVs
            try {
                const localCVsData = loadLocalCVs();
                console.log('📱 Loaded local CVs:', localCVsData?.length || 0);
                setLocalStorageCVs(localCVsData || []);
            } catch (error) {
                console.error('❌ Failed to load local CVs:', error);
            }

            // Load cloud CVs from all connected providers
            if (connectedProviders.length > 0 && sessionToken) {
                try {
                    console.log('📋 Loading CVs from connected providers:', connectedProviders);
                    const allCloudCVs = await listAllCloudCVs();
                    console.log('✅ Loaded cloud CVs:', allCloudCVs?.length || 0);
                    setCloudCVs(allCloudCVs || []);
                } catch (error) {
                    console.error('❌ Failed to load cloud CVs:', error);
                }
            }
        };

        loadAllCVs();
        fetchAnalysisMethods();
    }, [connectedProviders, sessionToken, listAllCloudCVs, loadLocalCVs, fetchResumes]);

    // Fetch available analysis methods
    const fetchAnalysisMethods = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/job-matching/available-methods`, {
                headers: { 
                    'Content-Type': 'application/json'
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            setAvailableMethods(data.available_methods || ['simple']);
            setMethodDescriptions(data.descriptions || {});
            
            if (data.available_methods && data.available_methods.length > 0 && !data.available_methods.includes(formData.analysis_method)) {
                setFormData(prev => ({
                    ...prev,
                    analysis_method: data.available_methods[0]
                }));
            }
        } catch (error) {
            console.error('Failed to fetch analysis methods:', error);
            setAvailableMethods(['simple']);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file upload with text extraction
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Use shared validation - Now supports PDF, Word, and TXT
        const validation = validateFile(file, {
            allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
            maxSizeMB: 10
        });
        
        if (!validation.valid) {
            setError(validation.error);
            event.target.value = '';
            return;
        }

        setFileProcessing(true);
        setError('');

        try {
            // Extract text from the file in the browser
            const extractedText = await extractTextFromFile(file);
            
            if (!extractedText || extractedText.trim().length < 50) {
                throw new Error('Extracted text is too short. Please ensure the file contains meaningful content.');
            }

            // Set the extracted text directly instead of the file
            setFormData({ ...formData, resume_text: extractedText });
            setUploadedFile(null); // Don't upload the file, we have the text
            setSelectedResume('');
            setCvSource('text'); // Change to text source since we have the text now
            
            const stats = getTextStats(extractedText);
            console.log('📝 Text extracted from file:', stats);
            
            setError(`✅ File processed successfully: "${file.name}". ${stats.wordCount} words extracted. Ready to analyze!`);
        } catch (error) {
            console.error('File processing failed:', error);
            setError(error.message || 'Failed to process file. Please try again or paste text directly.');
            event.target.value = '';
        } finally {
            setFileProcessing(false);
        }
    };

    // Handle resume selection from database OR cloud
    const handleResumeSelect = async (source, cvId) => {
        setSelectedResume(cvId);
        
        if (cvId) {
            try {
                console.log(`🔥 Loading CV from ${source}:`, cvId);
                let cvData = null;
                
                if (source === 'local') {
                    const localCV = localStorageCVs.find(cv => cv.id === cvId);
                    if (localCV) {
                        cvData = localCV;
                        console.log('✅ Local CV loaded:', cvData.title || cvData.id);
                    }
                } else if (connectedProviders.includes(source)) {
                    console.log(`☁️ Loading CV from ${source} cloud...`);
                    cvData = await loadCVFromProvider(source, cvId);
                    if (cvData) {
                        console.log('✅ Cloud CV loaded successfully');
                    }
                } else {
                    // Legacy: try from resumes store
                    const resume = resumes.find(r => r.id == cvId);
                    if (resume) {
                        cvData = resume;
                    }
                }
                
                if (cvData) {
                    // Debug CV structure
                    const debugInfo = debugCVStructure(cvData);
                    console.log('📄 CV Data structure:', debugInfo);
                    
                    // Use shared formatter
                    const resumeText = formatResumeToText(cvData);
                    
                    // Get text statistics
                    const textStats = getTextStats(resumeText);
                    console.log('📝 Generated resume text:', {
                        ...textStats,
                        preview: resumeText.substring(0, 200) + '...'
                    });
                    
                    setFormData({ ...formData, resume_text: resumeText });
                } else {
                    throw new Error('No CV data found');
                }
            } catch (error) {
                console.error('❌ Failed to load CV:', error);
                setError('Failed to load CV. Please try again.');
            }
            setUploadedFile(null);
        } else {
            setFormData({ ...formData, resume_text: '' });
        }
    };

    // Format resume object to text - REMOVED (now using shared service)

    // Main analyze function
    const handleAnalyze = async () => {
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
                
                const headers = {};
                if (sessionToken) {
                    headers['Authorization'] = `Bearer ${sessionToken}`;
                }
                
                response = await fetch(`${API_BASE_URL}/api/job-matching/analyze-file`, {
                    method: 'POST',
                    headers: headers,
                    body: formDataUpload
                });
            } else {
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (sessionToken) {
                    headers['Authorization'] = `Bearer ${sessionToken}`;
                }
                
                response = await fetch(`${API_BASE_URL}/api/job-matching/analyze`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(formData)
                });
            }
            
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error(t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
                }
                
                console.error('API Error Response:', errorData);
                
                if (response.status === 422) {
                    // Handle FastAPI validation errors
                    if (errorData.detail && Array.isArray(errorData.detail)) {
                        const validationErrors = errorData.detail.map(err => {
                            const location = Array.isArray(err.loc) ? err.loc.join('.') : 'Field';
                            return `${location}: ${err.msg}`;
                        }).join('; ');
                        throw new Error(`Validation Error: ${validationErrors}`);
                    } else if (errorData.detail && typeof errorData.detail === 'string') {
                        throw new Error(`Validation Error: ${errorData.detail}`);
                    } else if (errorData.detail) {
                        throw new Error(`Validation Error: ${JSON.stringify(errorData.detail)}`);
                    }
                }
                
                throw new Error(errorData.detail || errorData.message || t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
            }
            
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error('Analysis failed:', error);
            setError(error.message || t('jobMatching.errors.analysisFailedGeneric', 'Analysis failed. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    // Copy results to clipboard
    const copyResults = () => {
        if (!analysis) return;
        
        const text = `Job Match Analysis Results:

Score: ${analysis.match_score}%
ATS Score: ${analysis.ats_compatibility_score}%
Recommendation: ${analysis.should_apply ? 'Apply!' : 'Improve first'}

Industry: ${analysis.industry_detected?.replace(/_/g, ' ') || 'N/A'}
Detected Role: ${analysis.detected_role || 'N/A'}

Top Strengths:
${(analysis.strengths || []).slice(0, 3).map(s => `• ${s}`).join('\n')}

Improvement Areas:
${(analysis.improvement_areas || []).slice(0, 3).map(a => `• ${a}`).join('\n')}

Keywords Present: ${(analysis.keywords_present || []).join(', ')}
Keywords Missing: ${(analysis.keywords_missing || []).join(', ')}`;

        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    // Reset form
    const resetForm = () => {
        setAnalysis(null);
        setError('');
        setFormData({
            resume_text: '',
            job_description: '',
            job_title: '',
            company_name: '',
            analysis_method: availableMethods[0] || 'simple'
        });
        setSelectedResume('');
        setUploadedFile(null);
    };

    // FIXED: Removed incorrect login required check
    // The app should work without requiring authentication

    return (
        <div className={`min-h-screen pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
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
                                    Privacy-first analysis
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className={`text-sm max-w-3xl mx-auto leading-relaxed mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {t('jobMatching.subtitle', 'Get instant AI-powered analysis of how well your resume matches any job posting')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                        {[
                            'Instant scoring',
                            'Beat ATS systems',
                            'Personalized tips',
                            'Find keyword gaps'
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
                    {/* Left Panel - Input Form */}
                    <div className={`rounded-xl p-4 shadow-lg backdrop-blur-sm border ${
                        darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'
                    }`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {t('jobMatching.form.title', 'Analysis Setup')}
                            </h2>
                        </div>

                        {/* Analysis Method Selection */}
                        {availableMethods.length > 1 && (
                            <div className="mb-4">
                                <div className="text-center mb-3">
                                    <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Analysis Method
                                    </h3>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Choose your preferred analysis approach
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
                                        Target Position
                                    </label>
                                    <input
                                        type="text"
                                        name="job_title"
                                        value={formData.job_title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Software Engineer"
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
                                        Company (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Google, Microsoft"
                                        className={`w-full rounded-lg border p-2.5 text-sm transition-all ${
                                            darkMode 
                                                ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                                : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CV Source Selection */}
                        <div className="mb-4">
                            <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                How would you like to submit your resume?
                            </label>
                            <div className={`grid grid-cols-3 gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                {[
                                    { key: 'database', icon: FileText, label: 'Saved CVs' },
                                    { key: 'upload', icon: Upload, label: 'Upload New' },
                                    { key: 'text', icon: User, label: 'Copy & Paste' }
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
                                    Select from your saved resumes
                                </label>
                                
                                {/* Local Storage CVs */}
                                {localStorageCVs.length > 0 && (
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium mb-1">
                                            💾 From Local Storage
                                        </label>
                                        <select
                                            value={selectedResume && cvSource === 'database' ? selectedResume : ''}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleResumeSelect('local', e.target.value);
                                                }
                                            }}
                                            className={`w-full p-2.5 text-sm rounded border transition-all ${
                                                darkMode 
                                                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                                    : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                            }`}
                                        >
                                            <option value="">-- Select from Local Storage --</option>
                                            {localStorageCVs.map(cv => (
                                                <option key={cv.id} value={cv.id}>
                                                    {cv.title || cv.personal_info?.full_name || 'Untitled'}
                                                    {cv.lastModified && ` (${new Date(cv.lastModified).toLocaleDateString()})`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Cloud CVs by Provider */}
                                {cloudCVs.length > 0 && (() => {
                                    const groupedCloudCVs = cloudCVs.reduce((acc, cv) => {
                                        const provider = cv.provider || 'unknown';
                                        if (!acc[provider]) acc[provider] = [];
                                        acc[provider].push(cv);
                                        return acc;
                                    }, {});

                                    return Object.keys(groupedCloudCVs).map(provider => {
                                        const cvs = groupedCloudCVs[provider];
                                        const providerDetails = getConnectedProviderDetails().find(p => p.provider === provider);
                                        const providerIcon = provider === 'google_drive' ? '📄' : provider === 'onedrive' ? '☁️' : '📦';
                                        const providerName = providerDetails?.name || provider;
                                        
                                        return (
                                            <div key={provider} className="mb-3">
                                                <label className="block text-xs font-medium mb-1">
                                                    {providerIcon} From {providerName}
                                                </label>
                                                <select
                                                    value={selectedResume && cvSource === 'database' ? selectedResume : ''}
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleResumeSelect(provider, e.target.value);
                                                        }
                                                    }}
                                                    className={`w-full p-2.5 text-sm rounded border transition-all ${
                                                        darkMode 
                                                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                                                            : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                                                    }`}
                                                >
                                                    <option value="">-- Select from {providerName} --</option>
                                                    {cvs.map(cv => (
                                                        <option key={cv.file_id || cv.id} value={cv.file_id || cv.id}>
                                                            {cv.name || cv.title || 'Untitled'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    });
                                })()}
                                
                                {resumesLoading && (
                                    <div className={`p-3 rounded-lg border text-center ${
                                        darkMode ? 'bg-gray-700/30 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-600'
                                    }`}>
                                        <div className="w-4 h-4 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-sm">Loading your resumes...</p>
                                    </div>
                                )}
                                
                                {!resumesLoading && localStorageCVs.length === 0 && cloudCVs.length === 0 && (
                                    <div className={`p-3 rounded-lg border text-center ${
                                        darkMode ? 'bg-gray-700/30 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-600'
                                    }`}>
                                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-medium mb-1">No saved resumes found</p>
                                        <p className="text-xs opacity-75">Create your first resume to get started</p>
                                        <button
                                            onClick={() => window.location.href = '/resume-builder'}
                                            className="mt-2 px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-md transition-all"
                                        >
                                            Create Resume
                                        </button>
                                    </div>
                                )}

                                {/* Help text */}
                                <div className="text-xs space-y-1 mt-2">
                                    {localStorageCVs.length > 0 && (
                                        <p className="text-blue-600">
                                            💡 {localStorageCVs.length} CV{localStorageCVs.length !== 1 ? 's' : ''} available locally
                                        </p>
                                    )}
                                    {cloudCVs.length > 0 && (
                                        <p className="text-green-600">
                                            💡 {cloudCVs.length} CV{cloudCVs.length !== 1 ? 's' : ''} in cloud storage
                                        </p>
                                    )}
                                    {connectedProviders.length === 0 && (
                                        <p className="text-amber-600">
                                            💡 <a href="/cloud-setup" className="underline">Connect cloud storage</a> to access cloud CVs
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* File Upload Section */}
                        {cvSource === 'upload' && (
                            <div className="mb-4">
                                <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Upload your resume
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
                                                <span className="text-xs font-medium">Extracting text from file...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6" />
                                                <div>
                                                    <span className="text-xs font-medium block">
                                                        Click to upload or drag and drop
                                                    </span>
                                                    <span className="text-xs opacity-75 mt-1 block">PDF, DOC, DOCX, TXT (max 10MB)</span>
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
                                    Resume content
                                </label>
                                <textarea
                                    name="resume_text"
                                    value={formData.resume_text}
                                    onChange={handleInputChange}
                                    placeholder="Paste your resume text here..."
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
                                Job description
                            </label>
                            <textarea
                                name="job_description"
                                value={formData.job_description}
                                onChange={handleInputChange}
                                placeholder="Paste the complete job posting here..."
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

                        {/* Analyze Button */}
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
                                            <span className="block text-sm">AI analyzing...</span>
                                            <span className="text-xs opacity-90">
                                                Using {getMethodConfig(formData.analysis_method).title}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg">🚀</span>
                                        <div className="text-center">
                                            <span className="block text-sm">Analyze Job Match</span>
                                            <span className="text-xs opacity-90">Get instant results</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            {!loading && (
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                            )}
                        </button>
                    </div>

                    {/* Right Panel - Results */}
                    <div className={`rounded-xl p-4 shadow-lg backdrop-blur-sm border ${
                        darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'
                    }`}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Analysis Report
                            </h2>
                        </div>

                        {!analysis && !loading && (
                            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <div className="relative mb-3">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-lg"></div>
                                    <Target className="relative w-12 h-12 mx-auto opacity-50" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">Ready to discover your potential?</h3>
                                <p className="text-sm max-w-md mx-auto">Fill out the form to get personalized insights</p>
                            </div>
                        )}

                        {loading && (
                            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <div className="relative mb-3">
                                    <div className="w-8 h-8 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto" />
                                </div>
                                <h3 className="text-base font-semibold mb-1">{getMethodConfig(formData.analysis_method).title}</h3>
                                <p className="text-sm font-medium mb-1">Deep analysis in progress...</p>
                            </div>
                        )}

                        {analysis && (
                            <div className="space-y-4">
                                {/* Industry Analysis */}
                                <IndustryAnalysis analysis={analysis} />

                                {/* Analysis Method Details */}
                                <AnalysisMethodDetails analysis={analysis} />

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
                                        Privacy-first analysis
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

                                {/* Expandable Sections */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Strengths */}
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

                                    {/* Improvement Areas */}
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

                                {/* Action Plan */}
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
                                                                <ChevronDown className="w-3 h-3 rotate-180" />
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
                                                                <ChevronDown className="w-3 h-3 rotate-180" />
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

                                {/* Market Insights */}
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
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 ${
                                                darkMode 
                                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Download className="w-3 h-3" />
                                            Save Report
                                        </button>
                                        <button
                                            onClick={copyResults}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 ${
                                                darkMode 
                                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Copy className="w-3 h-3" />
                                            Copy Results
                                        </button>
                                        <button
                                            onClick={resetForm}
                                            className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-md transition-all flex items-center gap-1"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            New Analysis
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