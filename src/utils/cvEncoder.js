/**
 * Compress CV data for URL embedding
 */
export const compressCV = (cvData) => {
  try {
    // Clean the CV data - remove unnecessary fields
    const cleanData = {
      title: cvData.title || "My Resume",
      personal_info: cvData.personal_info || {},
      experiences: cvData.experiences || [],
      educations: cvData.educations || [],
      skills: cvData.skills || [],
      languages: cvData.languages || [],
      referrals: cvData.referrals || [],
      custom_sections: cvData.custom_sections || [],
      extracurriculars: cvData.extracurriculars || [],
      hobbies: cvData.hobbies || [],
      courses: cvData.courses || [],
      internships: cvData.internships || [],
      photo: cvData.photo || { photolink: null },
      customization: cvData.customization || {
        template: "stockholm",
        accent_color: "#1a5276",
        font_family: "Helvetica, Arial, sans-serif",
        line_spacing: 1.5,
        headings_uppercase: false,
        hide_skill_level: false
      },
      // Add metadata
      _meta: {
        version: '1.0',
        created: Date.now()
      }
    };

    // Convert to JSON and encode
    const jsonString = JSON.stringify(cleanData);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, ''); // Remove padding

    return base64;
  } catch (error) {
    console.error('Failed to compress CV data:', error);
    throw new Error('Failed to compress CV data');
  }
};

/**
 * Decode CV data from URL
 */
export const decompressCV = (encodedData) => {
  try {
    // Add back padding if needed
    let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Convert from base64 to JSON
    const jsonString = decodeURIComponent(escape(atob(base64)));
    const cvData = JSON.parse(jsonString);
    
    return cvData;
  } catch (error) {
    console.error('Failed to decode CV data:', error);
    throw new Error('Failed to decode CV data');
  }
};

/**
 * Generate public URL for CV
 */
export const generatePublicURL = (cvData, baseUrl = window.location.origin) => {
  try {
    const encoded = compressCV(cvData);
    return `${baseUrl}/cv/view#${encoded}`;
  } catch (error) {
    console.error('Public URL generation failed:', error);
    throw error;
  }
};

/**
 * Check if URL contains encoded CV data
 */
export const hasEncodedCV = (location) => {
  return location.hash && location.hash.length > 10;
};

/**
 * Estimate QR code complexity (for UI feedback)
 */
export const estimateQRComplexity = (url) => {
  const length = url.length;
  if (length < 200) return { level: 'simple', description: 'Simple QR code' };
  if (length < 500) return { level: 'medium', description: 'Medium complexity QR code' };
  if (length < 1000) return { level: 'complex', description: 'Complex QR code' };
  return { level: 'very-complex', description: 'Very complex QR code - may be hard to scan' };
};