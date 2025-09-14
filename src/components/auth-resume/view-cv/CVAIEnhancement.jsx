import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  MessageCircle, 
  Award, 
  Zap, 
  BarChart2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../../stores/authStore';
import useResumeStore from '../../../stores/resumeStore';
import API_BASE_URL, { CV_AI_ENDPOINTS } from '../../../config';


const CVAIEnhancement = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentResume, updateResume } = useResumeStore();
  const { token } = useAuthStore();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSections, setLoadingSections] = useState({});
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('initial');
  const [expandedSections, setExpandedSections] = useState({ summary: true });
  const [skillsUpdateMode, setSkillsUpdateMode] = useState('merge');
  const [usageInfo, setUsageInfo] = useState(null);
  const sections = [
    { id: 'summary', name: t('resume.personal_info.summary', 'Professional Summary'), key: 'personal_info.summary' },
    { id: 'experiences', name: t('resume.experience.title', 'Work Experience'), key: 'experiences', items: true },
    { id: 'skills', name: t('resume.skills.title', 'Skills'), key: 'skills', items: true },
  ];
  const [suggestions, setSuggestions] = useState({
    summary: {},
    experiences: {},
    skills: {}
  });

  const checkUsageLimit = async () => {
    try {
      const response = await fetch(CV_AI_ENDPOINTS.USAGE_LIMIT, {
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
  useEffect(() => {
    if (token) {
      checkUsageLimit();
    }
  }, [token]);
  
  const saveEnhancedResume = async () => {
  try {
    const resumeId = formData.id || formData.server_id;
    
    if (!resumeId) {
      throw new Error("No resume ID found");
    }
    
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error("Authentication required");
    }
    
    // Let's only update the specific sections that were enhanced
    const updateData = {};
    
    // If summary was enhanced
    if (formData.personal_info?.summary) {
      updateData.personal_info = {
        ...formData.personal_info
      };
    }
    
    // If experiences were enhanced
    if (formData.experiences && formData.experiences.length > 0) {
      updateData.experiences = formData.experiences.map(exp => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        location: exp.location || '',
        start_date: exp.start_date,
        end_date: exp.end_date,
        current: exp.current || false,
        description: exp.description || ''
      }));
    }
    
    // If skills were enhanced
    if (formData.skills && formData.skills.length > 0) {
      updateData.skills = formData.skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        level: skill.level || 'Intermediate'
      }));
    }

    console.log("Saving specific sections:", updateData);
    
    // Create a function to make PATCH requests
    const patchSection = async (section, data) => {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}/${section}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error updating ${section}:`, errorText);
        return false;
      }
      
      return true;
    };
    
    // Create a promise array to track all save operations
    const savePromises = [];
    
    // Patch experiences if they were enhanced
    if (updateData.experiences) {
      for (const exp of updateData.experiences) {
        if (exp.id) {
          savePromises.push(
            patchSection(`experiences/${exp.id}`, {
              description: exp.description
            })
          );
        }
      }
    }
    
    // Patch personal_info if summary was enhanced
    if (updateData.personal_info) {
      savePromises.push(
        patchSection('personal_info/summary', {
          summary: updateData.personal_info.summary
        })
      );
    }
    
    // Patch skills if they were enhanced
    if (updateData.skills) {
      // First delete existing skills
      const deleteSkills = await fetch(`${API_BASE_URL}/resume/${resumeId}/skills`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!deleteSkills.ok) {
        console.error("Failed to delete existing skills");
        throw new Error("Failed to delete existing skills");
      }
      
      // Make sure each skill is under 50 characters before sending
      const truncatedSkills = updateData.skills.map(skill => ({
        name: skill.name.length > 50 ? skill.name.substring(0, 47) + "..." : skill.name,
        level: skill.level || 'Intermediate'
      }));
      
      // Add new skills one by one
      for (const skill of truncatedSkills) {
        savePromises.push(
          patchSection('skills', {
            skills: {
              name: skill.name,
              level: skill.level
            }
          })
        );
      }
    }
    
    // Wait for all save operations to complete
    const results = await Promise.allSettled(savePromises);
    const allSucceeded = results.every(r => r.status === 'fulfilled' && r.value === true);
    
    if (allSucceeded) {
      alert("Changes saved successfully!");
      // navigate(`/edit-resume/${resumeId}`);
      navigate(`/my-resumes`);
    } else {
      const failedCount = results.filter(r => r.status !== 'fulfilled' || r.value !== true).length;
      throw new Error(`${failedCount} updates failed. Some changes may not have been saved.`);
    }
    
  } catch (err) {
    console.error("Error saving enhanced resume:", err);
    setError(`Failed to save changes: ${err.message}`);
  }
};
 
  const extractImprovedText = (result) => {
    if (result.improved_text) {
      return result.improved_text;
    } else if (result.raw) {
      return result.raw;
    } else if (typeof result === 'string') {
      return result;
    } else if (result.tasks_output && result.tasks_output.length > 0) {
      return result.tasks_output[0].raw || '';
    } else {
      try {
        return JSON.stringify(result, null, 2);
      } catch (e) {
        return t('ai_enhancement.error_message', 'An error occurred. Please try again.');
      }
    }
  };
 
  const matchTaskToExperience = (task, experiences) => {
    if (!experiences || !experiences.length) return -1;

    const taskDescription = task.description || task.task || '';
    const taskOutput = task.raw || task.output || '';

    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      if (exp.company && taskDescription.toLowerCase().includes(exp.company.toLowerCase())) {
        return i;
      }
      if (exp.position && taskDescription.toLowerCase().includes(exp.position.toLowerCase())) {
        return i;
      }
    }

    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      if (exp.company && taskOutput.toLowerCase().includes(exp.company.toLowerCase())) {
        return i;
      }
      if (exp.position && taskOutput.toLowerCase().includes(exp.position.toLowerCase())) {
        return i;
      }
    }

    return -1;
  };
 
  const matchExperienceSuggestions = (result, experiences) => {
    const suggestions = {};
    console.log("Matching experience suggestions:", result);

    // Debug the current structure
    console.log("Result structure:", {
      hasExperiences: !!result.experiences,
      experiencesIsArray: Array.isArray(result.experiences),
      hasTasksOutput: !!result.tasks_output,
      hasRaw: !!result.raw,
      hasImprovedText: !!result.improved_text
    });

    // First try to parse from structured data if available
    if (result.experiences && Array.isArray(result.experiences)) {
      result.experiences.forEach((exp, index) => {
        if (index < experiences.length) {
          suggestions[`item_${index}`] = {
            original: experiences[index].description,
            improved: exp.improved_description || exp.description || '',
            position: experiences[index].position,
            company: experiences[index].company
          };
        }
      });

      if (Object.keys(suggestions).length > 0) {
        return suggestions;
      }
    }

    // If we have tasks output, try to match them to experiences
    if (result.tasks_output && Array.isArray(result.tasks_output)) {
      result.tasks_output.forEach(task => {
        const expIndex = matchTaskToExperience(task, experiences);
        if (expIndex >= 0) {
          const taskText = task.raw || task.output || '';

          // Extract bullet points if applicable
          let improvedText = taskText;

          suggestions[`item_${expIndex}`] = {
            original: experiences[expIndex].description,
            improved: improvedText,
            position: experiences[expIndex].position,
            company: experiences[expIndex].company
          };
        }
      });

      if (Object.keys(suggestions).length > 0) {
        return suggestions;
      }
    }

    // If no structured data, parse from raw text
    const rawText = result.raw || result.improved_text || '';
    if (!rawText) return suggestions;

    // Try to match each experience individually based on company/position names
    experiences.forEach((exp, index) => {
      // Create patterns to search for this company/position in the raw text
      const companyPattern = exp.company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const positionPattern = exp.position.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Find sections in the raw text that mention this company or position
      const sectionRegex = new RegExp(
        `(${companyPattern}|${positionPattern})([\\s\\S]*?)(?=\\n\\s*\\n|$)`,
        'i'
      );

      const match = rawText.match(sectionRegex);

      if (match && match[0]) {
        // Extract bullet points from the matched section
        const bulletPoints = match[0]
          .split('\n')
          .filter(line =>
            line.trim().startsWith('-') ||
            line.trim().startsWith('*') ||
            line.trim().startsWith('•')
          )
          .map(line => line.replace(/^[-*•]\s*/, '').trim())
          .filter(line => line.length > 0);

        if (bulletPoints.length > 0) {
          suggestions[`item_${index}`] = {
            original: exp.description,
            improved: bulletPoints.join('\n'),
            position: exp.position,
            company: exp.company
          };
        } else if (match[0].includes('\n')) {
          // If no bullet points, try to extract paragraphs
          const paragraphs = match[0].split('\n\n').filter(p => p.trim().length > 0);
          if (paragraphs.length > 1) {
            // Skip the first paragraph (likely just contains company/position)
            suggestions[`item_${index}`] = {
              original: exp.description,
              improved: paragraphs.slice(1).join('\n\n'),
              position: exp.position,
              company: exp.company
            };
          }
        }
      }
    });

    // If we still couldn't match all experiences, look for bullet point sections
    if (Object.keys(suggestions).length < experiences.length) {
      // Find all bullet point sections in the text
      const allText = rawText.split('\n');
      let currentSection = [];
      let allSections = [];

      allText.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.length === 0) {
          if (currentSection.length > 0) {
            allSections.push(currentSection.join('\n'));
            currentSection = [];
          }
        } else {
          currentSection.push(line);
        }
      });

      if (currentSection.length > 0) {
        allSections.push(currentSection.join('\n'));
      }

      // Find sections with bullet points
      const bulletSections = allSections.filter(section =>
        section.includes('-') || section.includes('*') || section.includes('•')
      );

      // Try to match remaining experiences with bullet sections
      experiences.forEach((exp, index) => {
        if (!suggestions[`item_${index}`]) {
          // Find a section that mentions this company or position
          const matchingSection = bulletSections.find(section =>
            section.toLowerCase().includes(exp.company.toLowerCase()) ||
            section.toLowerCase().includes(exp.position.toLowerCase())
          );

          if (matchingSection) {
            const bullets = matchingSection
              .split('\n')
              .filter(line =>
                line.trim().startsWith('-') ||
                line.trim().startsWith('*') ||
                line.trim().startsWith('•')
              )
              .map(line => line.replace(/^[-*•]\s*/, '').trim())
              .filter(line => line.length > 0);

            if (bullets.length > 0) {
              suggestions[`item_${index}`] = {
                original: exp.description,
                improved: bullets.join('\n'),
                position: exp.position,
                company: exp.company
              };
            }
          }
        }
      });
    }

    // Last resort: If we got bullet points but couldn't match them to specific experiences,
    // try to distribute them
    if (Object.keys(suggestions).length === 0 && experiences.length > 0) {
      const allBullets = rawText
        .split('\n')
        .filter(line =>
          line.trim().startsWith('-') ||
          line.trim().startsWith('*') ||
          line.trim().startsWith('•')
        )
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(line => line.length > 0);

      if (allBullets.length > 0) {
        // Distribute bullets by checking for any keywords
        let assignedBullets = {};

        experiences.forEach((exp, index) => {
          assignedBullets[index] = [];

          allBullets.forEach(bullet => {
            if (
              bullet.toLowerCase().includes(exp.company.toLowerCase()) ||
              bullet.toLowerCase().includes(exp.position.toLowerCase()) ||
              (exp.description && bullet.toLowerCase().includes(exp.description.substring(0, 15).toLowerCase()))
            ) {
              assignedBullets[index].push(bullet);
            }
          });
        });

        // Create suggestions for experiences that got bullets
        Object.entries(assignedBullets).forEach(([index, bullets]) => {
          if (bullets.length > 0) {
            suggestions[`item_${parseInt(index)}`] = {
              original: experiences[parseInt(index)].description,
              improved: bullets.join('\n'),
              position: experiences[parseInt(index)].position,
              company: experiences[parseInt(index)].company
            };
          }
        });
      }
    }

    console.log("Generated experience suggestions:", suggestions);
    return suggestions;
  };

  useEffect(() => {
    try {
      if (currentResume) {
        setFormData(currentResume);
      } else {
        setError(t('ai_enhancement.create_resume_first', 'Please create a resume first'));
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
      setError(t('ai_enhancement.error_message', 'An error occurred. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [currentResume, t]);
 
  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
 
  const requestSectionEnhancement = async (sectionId) => {
  if (!formData) return;

  setLoadingSections(prev => ({ ...prev, [sectionId]: true }));

  try {
    let sectionData = {};

    if (sectionId === 'summary') {
      sectionData = {
        current_text: formData.personal_info?.summary || '',
        experiences: formData.experiences || []
      };
    } else if (sectionId === 'experiences') {
      if (formData.experiences && formData.experiences.length > 0) {
        sectionData = {
          experiences: formData.experiences.map(exp => ({
            company: exp.company || '',
            position: exp.position || '',
            description: exp.description || '',
            start_date: exp.start_date || '',
            end_date: exp.end_date || '',
            current: exp.current || false
          }))
        };
      } else {
        throw new Error(t('ai_enhancement.no_experiences', 'No work experiences added yet'));
      }
    }

    if (!token) {
      throw new Error(t('auth.login.title', 'Login'));
    }

    // ✅ Fix: Add section as query parameter
    const url = `${CV_AI_ENDPOINTS.IMPROVE_SECTION}?section=${sectionId}`;

    // Initial request to start the background task
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sectionData) // ✅ Send only data in body
    });

    if (!response.ok) {
      if (response.status === 429) {
        // ✅ Handle rate limiting specifically
        try {
          const errorData = await response.json();
          
          if (errorData.detail && typeof errorData.detail === 'object' && errorData.detail.error_code === 'AI_LIMIT_REACHED') {
            // Handle structured error response
            const { used_today, daily_limit, hours_until_reset } = errorData.detail;
            
            setError(
              t('ai.limit_reached', 
                "You've used {{used}} of {{limit}} daily AI requests. Please try again in {{hours}} hours.", 
                { 
                  used: used_today, 
                  limit: daily_limit, 
                  hours: hours_until_reset 
                }
              )
            );
          } else {
            // Handle old format or string error
            setError(
              t('ai.limit_reached_simple', 
                "Daily AI limit reached. Please try again tomorrow."
              )
            );
          }
        } catch (parseError) {
          // If JSON parsing fails, use default message
          setError(
            t('ai.limit_reached_simple', 
              "Daily AI limit reached. Please try again tomorrow."
            )
          );
        }
        setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
        return; // Don't proceed further
      } else {
        // Handle other errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || t('ai_enhancement.error_message', 'An error occurred. Please try again.'));
      }
    }

    // Get the task ID and status URL
    const taskData = await response.json();
    
    // Start polling for the result
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(taskData.check_status_url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!statusResponse.ok) {
          clearInterval(pollInterval);
          throw new Error(t('ai_enhancement.error_message', 'An error occurred checking task status.'));
        }
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed') {
          clearInterval(pollInterval);
          
          // Process the completed result
          const result = statusData.result;
          console.log(`Received suggestion for ${sectionId}:`, result);

          let processedSuggestions = {};

          if (sectionId === 'summary') {
            processedSuggestions = {
              main: extractImprovedText(result)
            };
          } else if (sectionId === 'experiences') {
            processedSuggestions = matchExperienceSuggestions(result, formData.experiences);
          }

          setSuggestions(prev => ({
            ...prev,
            [sectionId]: processedSuggestions
          }));

          setExpandedSections(prev => ({
            ...prev,
            [sectionId]: true
          }));
          
          setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
        } 
        else if (statusData.status === 'failed') {
          clearInterval(pollInterval);
          throw new Error(statusData.error || t('ai_enhancement.error_message', 'Task processing failed.'));
        }
        // For 'processing' status, we just keep polling
      } catch (error) {
        clearInterval(pollInterval);
        console.error(`Error checking section ${sectionId} status:`, error);
        setError(t('ai_enhancement.error_message', 'An error occurred. Please try again.'));
        setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
      }
    }, 2000); // Check every 2 seconds
    
  } catch (error) {
    console.error(`Error enhancing section ${sectionId}:`, error);
    if (!error.message.includes('daily AI requests')) { // Only set error if not already set by rate limiting
      setError(error.message || t('ai_enhancement.error_message', 'An error occurred. Please try again.'));
    }
    setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
  }
};

  const parseAIResponseAndDistributeBullets = (rawText, experiences) => {
    console.log("Parsing raw text for experiences");
     
    const suggestions = {};
    
    if (!rawText || experiences.length === 0) {
      return suggestions;
    }
    
    // Split the text into paragraphs/sections
    const sections = rawText.split(/\n\s*\n/);
    console.log(`Found ${sections.length} sections`);
    
    // For each experience, try to find a matching section
    experiences.forEach((exp, index) => {
      // Convert company and position to lowercase for case-insensitive matching
      const companyLower = exp.company.toLowerCase();
      const positionLower = exp.position.toLowerCase();
      
      // Look for sections that mention this specific company or position
      const matchingSections = sections.filter(section => {
        const sectionLower = section.toLowerCase();
        return sectionLower.includes(companyLower) || sectionLower.includes(positionLower);
      });
      
      console.log(`Experience ${index} (${exp.company}): Found ${matchingSections.length} matching sections`);
      
      if (matchingSections.length > 0) {
        // Extract bullet points from the matching section
        const matchingSection = matchingSections[0]; // Use the first matching section
        
        const bulletPoints = matchingSection
          .split('\n')
          .filter(line => 
            line.trim().startsWith('-') || 
            line.trim().startsWith('*') || 
            line.trim().startsWith('•')
          )
          .map(line => line.replace(/^[-*•]\s*/, '').trim())
          .filter(line => {
            // Skip lines that contain the company name or job title
            const lineLower = line.toLowerCase();
            
            // Check if this line is the title line (containing company and position)
            const isTitleLine = (
              lineLower.includes(companyLower) && lineLower.includes(positionLower) ||
              lineLower.includes("**" + companyLower) || 
              lineLower.includes("**" + positionLower) ||
              /^\s*"[^"]*"\s*\(\d{4}/.test(line) // Pattern for "Company Name" (2019-2021)
            );
            
            return !isTitleLine && line.length > 0;
          });
        
        console.log(`Experience ${index}: Found ${bulletPoints.length} bullet points after filtering title lines`);
        
        if (bulletPoints.length > 0) {
          // Create a properly formatted "improved" string that includes the company and position
          // This ensures the structure is consistent with what the component expects
          const formattedImproved = [
            `**** ${exp.company} ****`,
            `* *${exp.position}* *`,
            ...bulletPoints.map(point => `- ${point}`)
          ].join('\n');
          
          suggestions[`item_${index}`] = {
            original: exp.description,
            improved: formattedImproved,
            position: exp.position,
            company: exp.company
          };
        }
      }
    });
    
    // If we didn't find any section-based matches, try a different approach
    if (Object.keys(suggestions).length === 0) {
      // Find all bullet points in the text
      const allBulletLines = rawText
        .split('\n')
        .filter(line => 
          line.trim().startsWith('-') || 
          line.trim().startsWith('*') || 
          line.trim().startsWith('•')
        )
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(line => line.length > 0);
      
      // If we found bullet points but couldn't match them to specific sections,
      // distribute them across experiences
      if (allBulletLines.length > 0) {
        // Calculate how many bullet points to allocate per experience
        const pointsPerExperience = Math.max(1, Math.floor(allBulletLines.length / experiences.length));
        
        experiences.forEach((exp, index) => {
          // Calculate the start and end indices for this experience's bullet points
          const startIdx = index * pointsPerExperience;
          const endIdx = Math.min(startIdx + pointsPerExperience, allBulletLines.length);
          
          // Get bullet points for this experience
          const expBullets = allBulletLines.slice(startIdx, endIdx);
          
          if (expBullets.length > 0) {
            // Create a properly formatted "improved" string
            const formattedImproved = [
              `**** ${exp.company} ****`,
              `* *${exp.position}* *`,
              ...expBullets.map(point => `- ${point}`)
            ].join('\n');
            
            suggestions[`item_${index}`] = {
              original: exp.description,
              improved: formattedImproved,
              position: exp.position,
              company: exp.company
            };
          }
        });
      }
    }
    
    console.log("Final suggestions:", suggestions);
    return suggestions;
  }
  
  const requestFullCVEnhancement = async () => {
  if (!formData) return;
  setStatus('loading');

  try {
    if (!token) {
      throw new Error(t('auth.login.title', 'Login'));
    }

    console.log('Sending request to:', CV_AI_ENDPOINTS.IMPROVE_FULL_CV);

    const response = await fetch(CV_AI_ENDPOINTS.IMPROVE_FULL_CV, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        // ✅ Handle rate limiting specifically
        try {
          const errorData = await response.json();
          
          if (errorData.detail && typeof errorData.detail === 'object' && errorData.detail.error_code === 'AI_LIMIT_REACHED') {
            // Handle structured error response
            const { used_today, daily_limit, hours_until_reset } = errorData.detail;
            
            setError(
              t('ai.limit_reached', 
                "You've used {{used}} of {{limit}} daily AI requests. Please try again in {{hours}} hours.", 
                { 
                  used: used_today, 
                  limit: daily_limit, 
                  hours: hours_until_reset 
                }
              )
            );
          } else {
            // Handle old format or string error
            setError(
              t('ai.limit_reached_simple', 
                "Daily AI limit reached. Please try again tomorrow."
              )
            );
          }
        } catch (parseError) {
          // If JSON parsing fails, use default message
          setError(
            t('ai.limit_reached_simple', 
              "Daily AI limit reached. Please try again tomorrow."
            )
          );
        }
        setStatus('error');
        return; // Don't proceed further
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(t('ai_enhancement.error_message', 'An error occurred. Please try again.'));
      }
    }

    const result = await response.json();
    console.log("API response:", result);
      
      const newSuggestions = {
        summary: {},
        experiences: {},
        skills: {}
      };
  
      // Process summary suggestion
      if (result.improvements?.summary?.main) {
        newSuggestions.summary = {
          main: result.improvements.summary.main
        };
      }
  
      // Process experience suggestions with our parsing function
      if (result.improvements?.raw) {
        const experienceSuggestions = parseAIResponseAndDistributeBullets(
          result.improvements.raw,
          formData.experiences
        );
  
        if (Object.keys(experienceSuggestions).length > 0) {
          newSuggestions.experiences = experienceSuggestions;
        }
      } else if (result.improvements?.experiences) {
        // If structured experience data is available
        newSuggestions.experiences = result.improvements.experiences;
      }
  
      // Process skills suggestions
      if (result.improvements?.skills?.main) {
        newSuggestions.skills = {
          main: result.improvements.skills.main,
          parsed: result.improvements.skills.main.parsed
        };
      }
  
      console.log("Final processed suggestions:", newSuggestions);
      setSuggestions(newSuggestions);
      setStatus('success');
  
      // Expand all sections with suggestions
      const sectionsToExpand = {};
      Object.keys(newSuggestions).forEach(sectionId => {
        if (Object.keys(newSuggestions[sectionId]).length > 0) {
          sectionsToExpand[sectionId] = true;
        }
      });
      setExpandedSections(prev => ({
        ...prev,
        ...sectionsToExpand
      }));
  
    } catch (err) {
    console.error('Error enhancing full CV:', err);
    if (!err.message.includes('daily AI requests')) { // Only set error if not already set by rate limiting
      setError(err.message || t('ai_enhancement.error_message', 'An error occurred. Please try again.'));
    }
    setStatus('error');
  }
};

  const applySuggestion = (sectionId, itemKey = 'main') => {
    if (!formData || !suggestions[sectionId] || !suggestions[sectionId][itemKey]) return;

    // Create a deep clone of the current form data
    const updatedFormData = JSON.parse(JSON.stringify(formData));

    // Ensure personal_info exists and has required fields
    if (!updatedFormData.personal_info) {
      updatedFormData.personal_info = {};
    }
    if (!updatedFormData.personal_info.title) {
      updatedFormData.personal_info.title = '';
    }

    try {
      if (sectionId === 'summary' && itemKey === 'main') {
        // Update the summary field
        updatedFormData.personal_info.summary = suggestions[sectionId][itemKey];
      } else if (sectionId === 'experiences') {
        const index = parseInt(itemKey.split('_')[1]);
        if (updatedFormData.experiences && updatedFormData.experiences[index]) {
          // Extract only real bullet points
          const actualBulletPoints = [];
          
          suggestions[sectionId][itemKey].improved.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('-') && 
                !trimmed.includes('**') && 
                !trimmed.includes('*') && 
                !trimmed.includes('(20')) {
              actualBulletPoints.push(trimmed.substring(trimmed.indexOf('-') + 1).trim());
            }
          });
          
          // Update just the description field
          updatedFormData.experiences[index].description = actualBulletPoints.join('\n');
        }
      } 
      else if (sectionId === 'skills' && itemKey === 'main') {
        if (suggestions[sectionId][itemKey].parsed?.categories) {
          const groupedSkills = [];
          const MAX_SKILL_LENGTH = 50; // Maximum length for skill name field
          
          // Process each category
          Object.entries(suggestions[sectionId][itemKey].parsed.categories).forEach(([category, skills]) => {
            if (skills.length > 0) {
              // For each category, create chunks of skills that fit within the character limit
              let currentChunk = "";
              
              skills.forEach(skill => {
                const trimmedSkill = skill.trim();
                if (!trimmedSkill) return;
                
                // If this skill by itself is too long, truncate it
                const safeSkill = trimmedSkill.length > MAX_SKILL_LENGTH 
                  ? trimmedSkill.substring(0, MAX_SKILL_LENGTH - 3) + "..." 
                  : trimmedSkill;
                  
                // If adding this skill would exceed the limit, add the current chunk and start a new one
                if (currentChunk && (currentChunk.length + safeSkill.length + 2) > MAX_SKILL_LENGTH) {
                  groupedSkills.push({
                    name: currentChunk,
                    level: "Intermediate"
                  });
                  currentChunk = safeSkill;
                }
                // Otherwise, add to the current chunk
                else {
                  currentChunk = currentChunk 
                    ? currentChunk + ", " + safeSkill 
                    : safeSkill;
                }
              });
              
              // Add the final chunk if not empty
              if (currentChunk) {
                groupedSkills.push({
                  name: currentChunk,
                  level: "Intermediate"
                });
              }
            }
          });
          
          // Update the skills array
          updatedFormData.skills = groupedSkills;
        }
      }

      // Update the local form data state
      setFormData(updatedFormData);
      
      // Remove the applied suggestion
      setSuggestions(prev => {
        const updated = { ...prev };
        if (updated[sectionId]) {
          const updatedSection = { ...updated[sectionId] };
          delete updatedSection[itemKey];
          updated[sectionId] = updatedSection;
        }
        return updated;
      });
    } catch (error) {
      console.error("Error applying suggestion:", error);
    }
  };
   
  const rejectSuggestion = (sectionId, itemKey = 'main') => {
    setSuggestions(prev => {
      const updated = { ...prev };
      if (updated[sectionId]) {
        const updatedSection = { ...updated[sectionId] };
        delete updatedSection[itemKey];

        if (Object.keys(updatedSection).length === 0) {
          delete updated[sectionId];
        } else {
          updated[sectionId] = updatedSection;
        }
      }
      return updated;
    });
  };
 
  const handleBackToEditor = () => {
    const resumeId = formData?.id || formData?.server_id;
    if (resumeId) {
      navigate(`/edit-resume/${resumeId}`);
    } else {
      navigate('/edit-resume');
    }
  };
 
  const handleContinueToTemplates = () => {
    const resumeId = formData?.id || formData?.server_id;
    navigate('/resume-customizer', { 
      state: { 
        resumeId: resumeId
      } 
    });
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen pt-14 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('common.loading', 'Loading...')}</div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className={`flex items-center justify-center h-screen pt-14 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
          {error}. {t('common.back_to_editor', 'Back to Editor')} <button onClick={handleBackToEditor} className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} underline`}>{t('common.back_to_editor', 'Back to Editor')}</button> {t('ai_enhancement.create_resume_first', 'Please create a resume first')}.
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto pt-14 px-4 pb-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}>
      {/* Background Elements - similar to Home component */}
      {usageInfo && (
  <div className={`mb-3 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    {t('ai.limit_info', 'AI requests remaining: {{remaining}} of {{limit}}', {
      remaining: usageInfo.remaining,
      limit: usageInfo.limit
    })}
  </div>
)}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-24 w-48 h-48 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-24 left-24 w-48 h-48 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Content wrapper with relative z-index */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
         
          <div className="flex items-center">
            <button
              onClick={handleBackToEditor}
              className={`p-1 mr-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              
            </button>
            <h1 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('ai_enhancement.title', 'AI Resume Enhancement')}
            </h1>
          </div>
           
        </div>

        {/* Error message */}
        {error && (
          <div className={`mb-3 p-2 ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} rounded-md text-xs`}>
            {error}
            <button
              onClick={() => setError(null)}
              className={`ml-2 ${darkMode ? 'text-red-200 hover:text-red-100' : 'text-red-800 hover:text-red-900'}`}
            >
              {t('common.dismiss', 'Dismiss')}
            </button>
          </div>
        )}

        {/* Enhance all sections button */}
        <div className="mb-4 text-center">
          <button
            onClick={requestFullCVEnhancement}
            disabled={status === 'loading'}
            className={`px-3 py-1.5 rounded-md text-white flex items-center justify-center mx-auto gap-1.5 text-xs ${
              status === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
            }`}
          >
            {status === 'loading' ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                {t('common.enhancing', 'Enhancing...')}
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                {t('ai_enhancement.enhance_all', 'Enhance All Sections')}
              </>
            )}
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`border rounded-lg overflow-hidden ${
                darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200/50 bg-white/50 backdrop-blur-sm'
              }`}
            >
              <div className={`p-3 border-b flex justify-between items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50/50'}`}>
                <div className="flex items-center">
                  <h2 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {section.name}
                  </h2>
                  {suggestions[section.id] && Object.keys(suggestions[section.id]).length > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 text-[0.6rem] ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'} rounded-full`}>
                      {Object.keys(suggestions[section.id]).length} {t('common.ai_suggestions', 'AI Suggestions')}
                    </span>
                  )}
                  <button
                    onClick={() => toggleSectionExpansion(section.id)}
                    className={`ml-1 p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    {expandedSections[section.id] ?
                      <ChevronUp className="w-3 h-3" /> :
                      <ChevronDown className="w-3 h-3" />
                    }
                  </button>
                </div>
                {!suggestions[section.id] && !loadingSections[section.id] && (
                  <button
                    onClick={() => requestSectionEnhancement(section.id)}
                    className="px-2 py-0.5 text-[0.7rem] bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    {t('common.enhance', 'Enhance')}
                  </button>
                )}
                {loadingSections[section.id] && (
                  <div className={`flex items-center text-[0.7rem] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <RefreshCw className="w-2.5 h-2.5 animate-spin mr-1" />
                    {t('common.enhancing', 'Enhancing...')}
                  </div>
                )}
              </div>

              {expandedSections[section.id] && (
                <div className="p-3">
                  {/* Original content preview */}
                  <div className="mb-3">
                    <h3 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('ai_enhancement.current_content', 'Current Content')}
                    </h3>

                    {/* Summary section content */}
                    {section.id === 'summary' && (
                      <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {formData?.personal_info?.summary ? (
                          <p className="text-xs">{formData.personal_info.summary}</p>
                        ) : (
                          <p className={`text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('common.no_summary', 'No summary added yet')}
                          </p>
                        )}
                      </div>
                    )}

                    {section.id === 'experiences' && (
                      <div className="mb-3">
                        <div className={`rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {formData?.experiences?.length > 0 ? (
                            <div className="space-y-3 p-2">
                              {formData.experiences.map((exp, index) => {
                                // Check if this specific experience has suggestions
                                const hasSuggestion = suggestions?.experiences &&
                                                      suggestions.experiences[`item_${index}`] &&
                                                      suggestions.experiences[`item_${index}`].improved;

                                return (
                                  <div key={index} className={`p-2 border rounded ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
                                    <div className="text-xs font-medium">{exp.position} {t('common.at', 'at')} {exp.company}</div>
                                    <div className={`text-[0.6rem] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {exp.start_date} - {exp.current ? t('resume.experience.current_work', 'Present') : exp.end_date}
                                    </div>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{exp.description}</p>

                                    {/* Show suggestions for this specific experience */}
                                    {hasSuggestion && (
<div className={`mt-2 p-2 rounded ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-indigo-50 border-indigo-100'} border`}>
  <h4 className={`text-[0.6rem] font-medium mb-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
    {t('common.ai_suggestions', 'AI Suggestions')}
  </h4>

  {/* Process the suggestion dynamically without hardcoding */}
  <ul style={{ listStyleType: 'disc', paddingLeft: '15px' }}>
{suggestions.experiences[`item_${index}`].improved
  .split('\n')
  .filter(line => {
    const trimmed = line.trim();
    // Only keep actual bullet points (starting with dash) and exclude anything that might be a header
    return trimmed.startsWith('-') && 
          !trimmed.includes('**') && 
          !trimmed.includes('*') && 
          !trimmed.includes('(20'); // Exclude dates like (2019-2021)
  })
  .map((line, i) => {
    // Extract just the content after the dash
    const content = line.substring(line.indexOf('-') + 1).trim();
    return <li key={i} className="text-[0.7rem] mb-0.5">{content}</li>;
  })
}
</ul>
  <div className="flex space-x-1.5 mt-1.5">
    <button
      onClick={() => applySuggestion('experiences', `item_${index}`)}
      className="px-1.5 py-0.5 text-[0.6rem] bg-green-500 hover:bg-green-600 text-white rounded flex items-center"
    >
      <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
      {t('common.apply', 'Apply')}
    </button>
    <button
      onClick={() => rejectSuggestion('experiences', `item_${index}`)}
      className="px-1.5 py-0.5 text-[0.6rem] bg-red-500 hover:bg-red-600 text-white rounded flex items-center"
    >
      <XCircle className="w-2.5 h-2.5 mr-0.5" />
      {t('common.reject', 'Reject')}
    </button>
  </div>
</div>
)}
                                  </div>
                                );
                              })}
                </div>
                          ) : (
                            <p className={`text-xs p-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {t('ai_enhancement.no_experiences', 'No work experiences added yet')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Skills section content */}
                    {section.id === 'skills' && (
                      <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {formData?.skills?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {formData.skills.map((skill, index) => (
                              <div
                                key={index}
                                className={`text-[0.6rem] px-1.5 py-0.5 rounded ${
                                  darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {skill.name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('ai_enhancement.no_skills', 'No skills added yet')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Summary suggestions */}
                  {section.id === 'summary' && suggestions[section.id]?.main && (
                  <div className="space-y-3">
                  <h3 className={`text-xs font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-500'} flex items-center`}>
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    {t('common.ai_suggestions', 'AI Suggestions')}
                  </h3>

                  <div className={`border rounded-md p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
                    <div className={`text-xs ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-2 rounded border ${darkMode ? 'border-gray-600' : 'border-indigo-100'}`}>
                      <p>{suggestions[section.id].main}</p>
                    </div>

                    <div className="mt-2 flex space-x-1.5">
                      <button
                        onClick={() => applySuggestion(section.id, 'main')}
                        className="px-2 py-0.5 text-[0.6rem] bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center"
                      >
                        <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                        {t('common.apply', 'Apply')}
                      </button>
                      <button
                        onClick={() => rejectSuggestion(section.id, 'main')}
                        className="px-2 py-0.5 text-[0.6rem] bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center"
                      >
                        <XCircle className="w-2.5 h-2.5 mr-0.5" />
                        {t('common.reject', 'Reject')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills suggestions */}
              {section.id === 'skills' && suggestions[section.id]?.main && (
                <div className="space-y-3">
                  <h3 className={`text-xs font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-500'} flex items-center`}>
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    {t('common.ai_suggestions', 'AI Suggestions')}
                  </h3>

                  <div className={`border rounded-md p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
                    <div className={`text-xs ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-2 rounded border ${darkMode ? 'border-gray-600' : 'border-indigo-100'}`}>
                      {suggestions[section.id].main.parsed?.categories ? (
                        <div className="space-y-1.5">
                          {Object.entries(suggestions[section.id].main.parsed.categories).map(([category, skills]) => (
                            <div key={category}>
                              <h4 className="text-[0.7rem] font-medium mb-0.5">{category}</h4>
                              <div className="flex flex-wrap gap-1">
                                {skills.map((skill, idx) => (
                                  <span 
                                    key={idx} 
                                    className={`text-[0.6rem] px-1.5 py-0.5 rounded ${
                                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>{suggestions[section.id].main}</p>
                      )}
                    </div>

                    <div className="mt-2 flex space-x-1.5">
                      <button
                        onClick={() => applySuggestion(section.id, 'main')}
                        className="px-2 py-0.5 text-[0.6rem] bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center"
                      >
                        <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                        {t('common.apply', 'Apply')}
                      </button>
                      <button
                        onClick={() => rejectSuggestion(section.id, 'main')}
                        className="px-2 py-0.5 text-[0.6rem] bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center"
                      >
                        <XCircle className="w-2.5 h-2.5 mr-0.5" />
                        {t('common.reject', 'Reject')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>

   {/* Actions */}
   <div className="mt-4 flex justify-between">
          <button
            onClick={handleBackToEditor}
            className={`px-2.5 py-1 text-xs rounded-full transition-all duration-300 ${
              darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow-lg' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800 hover:shadow-md'
            }`}
          >
            {t('common.back_to_editor', 'Back to Editor')}
          </button>
          
          <button
            onClick={saveEnhancedResume}
            className="px-2.5 py-1 text-xs rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105"
          >
            {t('resume.actions.save_changes', 'Save Changes')}
          </button>
          
          <button
            onClick={handleContinueToTemplates}
            className="px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
          >
            {t('common.choose_your_templates', 'Choose Your Templates')}
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default CVAIEnhancement;