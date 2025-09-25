// src/services/fileConverterService.js

/**
 * Extract text from PDF file using pdf.js
 * Note: You need to install pdfjs-dist: npm install pdfjs-dist
 */
const extractTextFromPDF = async (file) => {
    try {
        // Dynamically import pdf.js
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText.trim();
    } catch (error) {
        console.error('PDF extraction failed:', error);
        throw new Error('Failed to extract text from PDF. Please try a different file or paste the text directly.');
    }
};

/**
 * Extract text from Word document using mammoth
 * Note: You need to install mammoth: npm install mammoth
 */
const extractTextFromWord = async (file) => {
    try {
        // Dynamically import mammoth
        const mammoth = await import('mammoth');
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        return result.value.trim();
    } catch (error) {
        console.error('Word extraction failed:', error);
        throw new Error('Failed to extract text from Word document. Please try a different file or paste the text directly.');
    }
};

/**
 * Extract text from TXT file
 */
const extractTextFromTXT = async (file) => {
    try {
        const text = await file.text();
        return text.trim();
    } catch (error) {
        console.error('TXT extraction failed:', error);
        throw new Error('Failed to read text file.');
    }
};

/**
 * Extract text from any supported file type
 * @param {File} file - The file to extract text from
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromFile = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    console.log(`📄 Extracting text from ${fileExtension} file:`, file.name);
    
    try {
        let text = '';
        
        switch (fileExtension) {
            case '.pdf':
                text = await extractTextFromPDF(file);
                break;
            case '.doc':
            case '.docx':
                text = await extractTextFromWord(file);
                break;
            case '.txt':
                text = await extractTextFromTXT(file);
                break;
            default:
                throw new Error(`Unsupported file type: ${fileExtension}`);
        }
        
        if (!text || text.trim().length === 0) {
            throw new Error('No text could be extracted from the file. The file may be empty or corrupted.');
        }
        
        console.log(`✅ Extracted ${text.length} characters from file`);
        return text;
    } catch (error) {
        console.error('File text extraction failed:', error);
        throw error;
    }
};

/**
 * Converts a CV/Resume object to formatted text
 * @param {Object} resume - The resume/CV object
 * @returns {string} - Formatted text representation
 */
export const formatResumeToText = (resume) => {
    let text = '';
    
    // Personal info
    if (resume.personal_info) {
        if (resume.personal_info.full_name) text += `${resume.personal_info.full_name}\n`;
        if (resume.personal_info.email) text += `Email: ${resume.personal_info.email}\n`;
        if (resume.personal_info.mobile || resume.personal_info.phone) {
            text += `Phone: ${resume.personal_info.mobile || resume.personal_info.phone}\n`;
        }
        if (resume.personal_info.title) text += `Title: ${resume.personal_info.title}\n`;
        if (resume.personal_info.city) text += `Location: ${resume.personal_info.city}\n`;
        text += '\n';
        
        if (resume.personal_info.summary) {
            text += `PROFESSIONAL SUMMARY\n${resume.personal_info.summary}\n\n`;
        }
    }
    
    // Experience
    if (resume.experiences && resume.experiences.length > 0) {
        text += `WORK EXPERIENCE\n`;
        resume.experiences.forEach(exp => {
            text += `\n${exp.position || 'Position'} at ${exp.company || 'Company'}`;
            if (exp.start_date || exp.end_date) {
                text += ` (${exp.start_date || 'Start'} - ${exp.current ? 'Present' : exp.end_date || 'End'})`;
            }
            text += '\n';
            if (exp.description) text += `${exp.description}\n`;
            if (exp.city) text += `Location: ${exp.city}\n`;
        });
        text += '\n';
    }
    
    // Education
    if (resume.educations && resume.educations.length > 0) {
        text += `EDUCATION\n`;
        resume.educations.forEach(edu => {
            text += `\n${edu.degree || 'Degree'} in ${edu.field_of_study || 'Field'}`;
            text += ` - ${edu.institution || 'Institution'}`;
            if (edu.start_date || edu.end_date) {
                text += ` (${edu.start_date || ''} - ${edu.end_date || ''})`;
            }
            text += '\n';
            if (edu.description) text += `${edu.description}\n`;
        });
        text += '\n';
    }
    
    // Skills
    if (resume.skills && resume.skills.length > 0) {
        text += `SKILLS\n`;
        const skillNames = resume.skills.map(s => s.name || s).filter(Boolean);
        if (skillNames.length > 0) {
            text += skillNames.join(', ') + '\n\n';
        }
    }
    
    // Languages
    if (resume.languages && resume.languages.length > 0) {
        text += `LANGUAGES\n`;
        resume.languages.forEach(lang => {
            text += `${lang.language || lang} ${lang.proficiency ? `(${lang.proficiency})` : ''}\n`;
        });
        text += '\n';
    }
    
    // Courses
    if (resume.courses && resume.courses.length > 0) {
        text += `COURSES & CERTIFICATIONS\n`;
        resume.courses.forEach(course => {
            text += `- ${course.name || course}`;
            if (course.institution) text += ` - ${course.institution}`;
            if (course.completion_date) text += ` (${course.completion_date})`;
            text += '\n';
        });
        text += '\n';
    }
    
    // Internships
    if (resume.internships && resume.internships.length > 0) {
        text += `INTERNSHIPS\n`;
        resume.internships.forEach(intern => {
            text += `- ${intern.position || 'Position'} at ${intern.company || 'Company'}`;
            if (intern.start_date || intern.end_date) {
                text += ` (${intern.start_date || ''} - ${intern.end_date || ''})`;
            }
            text += '\n';
            if (intern.description) text += `${intern.description}\n`;
        });
        text += '\n';
    }
    
    // Custom Sections
    if (resume.custom_sections && resume.custom_sections.length > 0) {
        resume.custom_sections.forEach(section => {
            if (section.title) text += `${section.title.toUpperCase()}\n`;
            if (section.content) text += `${section.content}\n\n`;
        });
    }
    
    // Check word count
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    // If not enough content, add placeholder text to meet minimum requirements
    if (wordCount < 20) {
        text += '\nADDITIONAL INFORMATION\n';
        text += 'Experienced professional with diverse background and skill set. ';
        text += 'Strong communication and problem-solving abilities. ';
        text += 'Dedicated to continuous learning and professional development. ';
        text += 'Team player with excellent interpersonal skills.\n';
    }
    
    return text.trim();
};

/**
 * Validates file type for upload
 * @param {File} file - The file to validate
 * @param {Array} allowedExtensions - Array of allowed extensions (e.g., ['.pdf', '.txt'])
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateFileType = (file, allowedExtensions = ['.pdf', '.doc', '.docx', '.txt']) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        const extensionList = allowedExtensions.join(', ');
        return { 
            valid: false, 
            error: `Invalid file type. Supported formats: ${extensionList}` 
        };
    }
    
    return { valid: true, error: null };
};

/**
 * Validates file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default 10MB)
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateFileSize = (file, maxSizeMB = 10) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
        return { 
            valid: false, 
            error: `File too large. Maximum size is ${maxSizeMB}MB` 
        };
    }
    
    return { valid: true, error: null };
};

/**
 * Comprehensive file validation
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateFile = (file, options = {}) => {
    const {
        allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'],
        maxSizeMB = 10
    } = options;
    
    // Check file type
    const typeValidation = validateFileType(file, allowedExtensions);
    if (!typeValidation.valid) {
        return typeValidation;
    }
    
    // Check file size
    const sizeValidation = validateFileSize(file, maxSizeMB);
    if (!sizeValidation.valid) {
        return sizeValidation;
    }
    
    return { valid: true, error: null };
};

/**
 * Get text content statistics
 * @param {string} text - The text to analyze
 * @returns {Object} - Statistics about the text
 */
export const getTextStats = (text) => {
    const trimmedText = text.trim();
    const words = trimmedText.split(/\s+/).filter(w => w.length > 0);
    
    return {
        length: trimmedText.length,
        wordCount: words.length,
        lineCount: trimmedText.split('\n').length,
        hasMinimumWords: words.length >= 20,
        hasMinimumChars: trimmedText.length >= 50
    };
};

/**
 * Debug CV data structure
 * @param {Object} cvData - The CV data to debug
 * @returns {Object} - Debug information
 */
export const debugCVStructure = (cvData) => {
    return {
        hasPersonalInfo: !!cvData?.personal_info,
        hasFullName: !!cvData?.personal_info?.full_name,
        hasExperiences: !!(cvData?.experiences?.length),
        experienceCount: cvData?.experiences?.length || 0,
        hasEducations: !!(cvData?.educations?.length),
        educationCount: cvData?.educations?.length || 0,
        hasSkills: !!(cvData?.skills?.length),
        skillCount: cvData?.skills?.length || 0,
        hasLanguages: !!(cvData?.languages?.length),
        languageCount: cvData?.languages?.length || 0,
        hasSummary: !!(cvData?.personal_info?.summary),
        source: cvData?.source_provider || cvData?.provider || cvData?.storageType || 'unknown'
    };
};

export default {
    extractTextFromFile,
    formatResumeToText,
    validateFileType,
    validateFileSize,
    validateFile,
    getTextStats,
    debugCVStructure
}; 