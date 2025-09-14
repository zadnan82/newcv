// Import template components
import Stockholm from './Stockholm';
import Santiago from './Santiago'; 
import NewYork from './NewYork';
import Oslo from './Oslo';
import Amsterdam from './Amsterdam';
import Berlin from './Berlin';
import Boston from './Boston';
import Vienna from './Vienna';
import London from './London';
import Tokyo from './Tokyo';
import Paris from './Paris';
import Toronto from './Toronto';
import Sydney from './Sydney';
import Ur from './Ur';
import Akkad from './Akkad'; 
import Zurich from './Zurich';
import Geneva from './Geneva';
import Osaka from './Osaka';
import Baghdad from './Baghdad';
import Basra from './Basra';
import Babylon from './Babylon';
import Eridu from './Eridu';
import Nimrud from './Nimrud'; 
import Nineveh from './Nineveh';
import Assur from './Assur';
import Sumer from './Sumer';

export const templates = {
  stockholm: {
    component: Stockholm,
    name: "Stockholm",
    description: "Card-based sophisticated layout",
    // Use absolute paths from the public folder root
    previewImage: "/assets/stockholm.jpg",
    category: "Professional"
  },
  geneva: {
    component: Geneva,
    name: "Geneva",
    description: "Elegant two-column layout with timeline elements",
    previewImage: "/assets/geneva.jpg",
    category: "Elegant"
  },
  babylon: {
    component: Babylon,
    name: "Babylon",
    description: "Minimalist design with uppercase headers",
    previewImage: "/assets/babylon.jpg",
    category: "Minimalist"
  },
  tokyo: {
    component: Tokyo,
    name: "Tokyo",
    description: "Modern minimalist with clean lines",
    previewImage: "/assets/tokyo.jpg",
    category: "Modern"
  },
  basra: {
    component: Basra,
    name: "Basra",
    description: "Minimalist design with uppercase headers",
    previewImage: "/assets/basra.jpg",
    category: "Minimalist"
  },
  paris: {
    component: Paris,
    name: "Paris",
    description: "Elegant French-inspired design with artistic touches",
    previewImage: "/assets/paris.png", 
    category: "Elegant"
  },
  ur: {
    component: Ur,
    name: "Ur",
    description: "Modern template with strong typography and clean structure",
    previewImage: "/assets/ur.png",
    category: "Modern"
  },
  london: {
    component: London,
    name: "London",
    description: "British professional style",
    previewImage: "/assets/london.jpg",
    category: "Professional"
  },
  baghdad: {
    component: Baghdad,
    name: "Baghdad",
    description: "Minimalist design with uppercase headers",
    previewImage: "/assets/baghdad.jpg",
    category: "Minimalist"
  },
  berlin: {
    component: Berlin,
    name: "Berlin",
    description: "Minimalist geometric design",
    previewImage: "/assets/berlin.jpg",
    category: "Minimalist"
  },
  nineveh: {
    component: Nineveh,
    name: "Nineveh",
    description: "British professional style",
    previewImage: "/assets/nineveh.png",
    category: "Professional"
  },
  zurich: {
    component: Zurich,
    name: "Zurich",
    description: "Modern minimalist design with side column",
    previewImage: "/assets/zurich.png",
    category: "Modern"
  },
  nimrud: {
    component: Nimrud,
    name: "Nimrud",
    description: "Sophisticated asymmetrical design with unique timeline layout",
    previewImage: "/assets/nimrud.png",
    category: "Professional"
  },
  newyork: {
    component: NewYork,
    name: "NewYork",
    description: "Classic professional layout",
    previewImage: "/assets/newyork.jpg",
    category: "Classic"
  },
  assur: {
    component: Assur,
    name: "Assur",
    description: "British professional style",
    previewImage: "/assets/assur.png",
    category: "Professional"
  },
  vienna: {
    component: Vienna,
    name: "Vienna",
    description: "Elegant European design with classical styling",
    previewImage: "/assets/vienna.jpg",
    category: "Elegant"
  },
  sumer: {
    component: Sumer,
    name: "Sumer",
    description: "British professional style",
    previewImage: "/assets/sumer.jpg",
    category: "Professional"
  },
  sydney: {
    component: Sydney,
    name: "Sydney",
    description: "Elegant European design with classical styling",
    previewImage: "/assets/sydney.jpg",
    category: "Modern"
  },
  toronto: {
    component: Toronto,
    name: "Toronto",
    description: "Minimalist design with uppercase headers",
    previewImage: "/assets/toronto.jpg",
    category: "Minimalist"
  },
  oslo: {
    component: Oslo,
    name: "Oslo",
    description: "Modern layout with blue accents",
    previewImage: "/assets/oslo.jpg",
    category: "Modern"
  },
  amsterdam: {
    component: Amsterdam,
    name: "Amsterdam",
    description: "Dutch-inspired professional template",
    previewImage: "/assets/amsterdam.jpg",
    category: "Professional"
  },
  akkad: {
    component: Akkad,
    name: "Akkad",
    description: "Sophisticated asymmetrical design with unique timeline layout",
    previewImage: "/assets/akkad.png",  
    category: "Professional"
  },
  boston: {
    component: Boston,
    name: "Boston",
    description: "Classic American professional style",
    previewImage: "/assets/boston.jpg",
    category: "Classic"
  },
  eridu: {
    component: Eridu,
    name: "Eridu",
    description: "Minimalist design with uppercase headers",
    previewImage: "/assets/eridu.jpg",
    category: "Minimalist"
  },
  osaka: {
    component: Osaka,
    name: "Osaka",
    description: "Modern minimalist with clean lines",
    previewImage: "/assets/osaka.jpg",
    category: "Modern"
  },
  santiago: {
    component: Santiago,
    name: "Santiago",
    description: "Minimalist design with uppercase headers",
    previewImage: "/assets/santiago.jpg",
    category: "Minimalist"
  },
};

// The rest of your file remains unchanged
const templatePdfSettings = {
  stockholm: {
    margins: [10, 10, 10, 10], // [top, right, bottom, left] in mm
    pageMarginsCSS: '10mm', // CSS version for @page rule
    additionalCSS: `
      .stockholm-template {
        box-shadow: none !important;
      }
      .stockholm-header {
        padding: 15px 20px !important;
      }
      .stockholm-main-column {
        padding: 10px 15px !important;
      }
      .stockholm-sidebar {
        padding: 10px 15px !important;
      }
      .stockholm-exp-item, .stockholm-edu-item {
        box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
        margin-bottom: 8px !important;
        padding: 8px !important;
      }
    `
  },
  // Rest of the PDF settings remain the same
  // ...
};

export function enhanceTemplatesWithPdfSettings() {
  // Loop through all templates and add PDF settings
  Object.keys(templates).forEach(templateId => {
    // Get PDF settings for this template (or use defaults)
    const pdfSettings = templatePdfSettings[templateId] || {
      margins: [10, 10, 10, 10],
      pageMarginsCSS: '10mm',
      additionalCSS: ''
    };
    
    // Add PDF settings to the template definition
    templates[templateId] = {
      ...templates[templateId],
      pdfSettings
    };
  });
  
  // Return the enhanced templates
  return templates;
}

// Apply the enhancements immediately when this file is imported
enhanceTemplatesWithPdfSettings();

export const categories = [
  "All",
  "Professional",
  "Creative",
  "Modern",
  "Classic",
  "Minimalist",
  "Elegant"
];

export default templates;