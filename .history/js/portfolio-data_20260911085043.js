/**
 * Miels Flores - Portfolio Projects Data
 * Showcasing expertise in Graphic Designing, Web Development, and Microsoft Excel
 */

const portfolioProjects = [
  {
    id: "excel-sales-hub",
    title: "Executive Sales & Commission Intelligence Dashboard",
    category: "excel",
    categoryLabel: "Excel & Data Analytics",
    badge: "Advanced Modeling",
    shortDesc: "Comprehensive multi-tier revenue, rep commission, and regional forecasting model with automated pivot caches and dynamic KPIs.",
    fullDesc: "Engineered an enterprise-grade Excel workbook for a multi-regional retail operation. Features automated commission calculations using nested XLOOKUP and dynamic array formulas, interactive slicing by region and quarter, and an executive KPI summary card cluster.",
    tools: ["MS Excel", "XLOOKUP", "Pivot Tables", "Power Query", "Data Validation"],
    thumbnail: "assets/images/project-excel-sales.svg",
    highlight: "Automated 40+ hrs/mo of manual reporting",
    caseStudy: {
      client: "Retail Enterprise Case Study",
      duration: "3 Weeks",
      role: "Lead Data Modeler & Dashboard Architect",
      challenge: "The management team spent days manually consolidating sales slips from 4 branch regions with varying commission brackets and frequent error-prone copy-pasting.",
      solution: "Structured a normalized data architecture with automated data validation rules, dynamic array formulas, conditional formatting thresholds, and high-contrast KPI visualizers.",
      keyFeatures: [
        "Dynamic multi-tier commission tiers using `=XLOOKUP()` and tiered brackets",
        "Interactive timeline and regional slicers linked to synchronized Pivot Tables",
        "Automated summary cards displaying Total Revenue, Average Margin, and Top Rep",
        "Error-handled input forms with drop-down data validation and conditional warnings"
      ],
      formulaHighlight: {
        label: "Tiered Commission Formula with XLOOKUP",
        code: `=XLOOKUP(D4, CommissionTable[TargetMin], CommissionTable[Rate], 0, -1) * (E4 - D4) + F4`
      }
    }
  },
  {
    id: "web-dev-pulse",
    title: "ApexFlow - Cloud Workflow Management Platform",
    category: "web-dev",
    categoryLabel: "Web Development",
    badge: "Full-Stack UI",
    shortDesc: "Responsive modern web application featuring real-time state management, dark-mode glassmorphism, and performance-optimized UI components.",
    fullDesc: "Designed and implemented a high-performance web interface built with modern semantic markup, custom CSS design tokens, and modular vanilla JavaScript. Delivers sub-second load times, fluid micro-interactions, and accessible keyboard navigation.",
    tools: ["HTML5", "Modern CSS3", "JavaScript (ES6+)", "CSS Grid/Flexbox", "LocalStorage"],
    thumbnail: "assets/images/project-web-pulse.svg",
    highlight: "100/100 Lighthouse Performance & Accessibility",
    caseStudy: {
      client: "Academic & Open-Source Initiative",
      duration: "4 Weeks",
      role: "Front-End Developer & UI Architect",
      challenge: "Creating a responsive task and project board that remains snappy on low-spec hardware without reliance on heavy multi-megabyte frameworks.",
      solution: "Constructed an ultra-lightweight client-side component architecture leveraging native DOM APIs, custom CSS properties for horizontal lighting, and efficient event delegation.",
      keyFeatures: [
        "Zero external dependencies for rapid 0.3s First Contentful Paint",
        "Drag-and-drop kanban task cards with persistent browser storage",
        "Fluid responsive breakpoints spanning mobile phones up to 4K ultra-wide monitors",
        "Strict WCAG 2.1 AA accessibility compliance with keyboard navigation"
      ],
      formulaHighlight: {
        label: "Dynamic Horizontal Glow Calculation (CSS & JS)",
        code: `const updateGlow = (e) => {\n  const rect = card.getBoundingClientRect();\n  const xPercent = ((e.clientX - rect.left) / rect.width) * 100;\n  card.style.setProperty('--glow-x', \`\${xPercent}%\`);\n};`
      }
    }
  },
  {
    id: "graphic-brand-nexus",
    title: "Vanguard Tech - Comprehensive Brand Identity System",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    badge: "Brand Identity",
    shortDesc: "Full corporate visual identity including logo construction, geometric typography guidelines, vector icon sets, and digital brand collateral.",
    fullDesc: "Crafted a futuristic brand identity for an emerging IT solutions group. Developed vector logo marks based on golden-ratio geometric grids, a synchronized horizontal chromatic palette (deep dark violet to radiant electric blue), and high-impact digital collateral.",
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Typography System", "Vector Art"],
    thumbnail: "assets/images/project-graphic-nexus.svg",
    highlight: "Delivered 25+ Vector Assets & Brand Guidebook",
    caseStudy: {
      client: "Vanguard IT Solutions",
      duration: "2 Weeks",
      role: "Brand Identity & Graphic Designer",
      challenge: "The client needed a fresh, modern aesthetic that communicated engineering precision and forward-thinking innovation without looking generic.",
      solution: "Developed an iconic monogram fusing letterforms 'V' and 'T' with optical horizontal gradient cuts, paired with sleek modern sans typography and a comprehensive usage guide.",
      keyFeatures: [
        "Mathematical vector logo lockups configured for light and dark environments",
        "Curated typographic hierarchy with custom display headlines and monospaced accents",
        "Complete social media branding suite (banners, avatars, post templates)",
        "32-page corporate brand guideline detailing clear space, color theory, and prohibited usages"
      ],
      formulaHighlight: {
        label: "Color Balance Specification",
        code: `Base: Pitch Black (#07070A) | Low-Light: Dark Violet (#1E0B36)\nMid-Tone: Vivid Violet (#7C3AED) | Highlight: Electric Cyan-Blue (#38BDF8)`
      }
    }
  },
  {
    id: "excel-academic-tracker",
    title: "Academic Unit & GPA Performance Diagnostic System",
    category: "excel",
    categoryLabel: "Excel & Data Analytics",
    badge: "Educational Analytics",
    shortDesc: "Dynamic academic analytics workbook computing cumulative grade points, semester load simulations, and automated graduation audit statuses.",
    fullDesc: "Engineered a student-centric tracking system that replaces fragmented spreadsheets. Utilizes nested logic (`IFS`, `SUMPRODUCT`, `LET`), conditional color scales, and dynamic charts to visualize academic trajectories and projected honors qualifications.",
    tools: ["MS Excel", "SUMPRODUCT", "LET Formulas", "Conditional Formatting", "Interactive Charts"],
    thumbnail: "assets/images/project-excel-academic.svg",
    highlight: "Used by 150+ IT department peers",
    caseStudy: {
      client: "IT Student Academic Community",
      duration: "1.5 Weeks",
      role: "Lead Creator & Data Analyst",
      challenge: "IT curriculum courses feature fluctuating unit weights and prerequisite trees, leading to confusion regarding weighted GPA and graduation eligibility.",
      solution: "Constructed an automated credit-weighted GPA calculation matrix that provides real-time grade simulation, warning flags for prerequisites, and visual trend bars.",
      keyFeatures: [
        "Weighted GPA computation via `=SUMPRODUCT(Credits, Grades) / SUM(Credits)`",
        "Prerequisite tracking with automated boolean validation and color alerts",
        "Target GPA simulator showing exact future grades required for honors",
        "One-click printable semester report cards formatted for academic advisory review"
      ],
      formulaHighlight: {
        label: "Dynamic Weighted GPA Calculation with LET",
        code: `=LET(cr, Table[Units], gr, Table[NumericGrade], valid, ISNUMBER(gr), IF(SUM(cr*valid)>0, SUMPRODUCT(cr*valid, gr*valid)/SUM(cr*valid), "N/A"))`
      }
    }
  },
  {
    id: "graphic-event-cyber",
    title: "CyberPulse 2026 - Tech Symposium Visual Campaign",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    badge: "Print & Digital Media",
    shortDesc: "High-contrast visual design campaign featuring custom typography, 3D neon lighting textures, stage backdrops, and promotional merchandise.",
    fullDesc: "Designed the complete visual identity and marketing collateral for an inter-collegiate technology summit. Built bold typographic layouts, holographic gradient treatments, lanyard badges, and viral social media teasers.",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Digital Matte Painting"],
    thumbnail: "assets/images/project-graphic-cyber.svg",
    highlight: "Attracted 500+ attendees & 15k+ social views",
    caseStudy: {
      client: "NNVS & IT Department Summit",
      duration: "3 Weeks",
      role: "Creative Director & Lead Graphic Artist",
      challenge: "Stand out in crowded student social feeds and build excitement for a high-level IT symposium with a tight print production deadline.",
      solution: "Employed a cinematic dark-mode composition with horizontal streaks of violet and electric blue lighting, framing sharp modernist typography that commanded instant attention.",
      keyFeatures: [
        "Hero promotional posters optimized for large-format CMYK printing",
        "Over 18 customized social media carousel slides and animated story frames",
        "Event stage backdrop banner (12ft x 8ft) rendered in vector fidelity",
        "Custom ID badge passes with role-based horizontal color coding"
      ],
      formulaHighlight: {
        label: "Composition Balance Ratio",
        code: `Visual Contrast Ratio: 14.8:1 | Primary Lighting Angle: 90deg Horizontal Sweep`
      }
    }
  },
  {
    id: "web-dev-shop",
    title: "NovaGear - Modern Tech & Peripherals E-Commerce Experience",
    category: "web-dev",
    categoryLabel: "Web Development",
    badge: "Interactive Frontend",
    shortDesc: "Futuristic hardware retail front-end featuring multi-attribute filtering, instant cart management, responsive image optimization, and checkout simulation.",
    fullDesc: "Built an interactive shopping portal focused on computer peripherals and custom developer setups. Features fast client-side searching, category pills, dynamic cart drawer with live price and tax computation, and sleek horizontal gradient accents.",
    tools: ["HTML5", "CSS3 Modern Variables", "JavaScript", "SVG Graphics", "Responsive Web Design"],
    thumbnail: "assets/images/project-web-shop.svg",
    highlight: "Sub-50ms instant client-side search & filtering",
    caseStudy: {
      client: "Concept E-Commerce Project",
      duration: "3 Weeks",
      role: "Frontend Engineer & UI Designer",
      challenge: "Traditional shopping sites often feel sluggish with full-page refreshes for simple filtering, cart adjustments, and category browsing.",
      solution: "Engineered an asynchronous, reactive UI without bloated dependencies, implementing instant fuzzy filtering, floating cart drawers, and horizontal glow highlights.",
      keyFeatures: [
        "Live keyword filtering and price range slider with zero latency",
        "Interactive slide-out shopping cart with quantity multipliers and coupon validation",
        "Comprehensive mobile-first responsive layout with bottom-sheet interactions",
        "Smooth horizontal gradient borders that illuminate cards upon cursor interaction"
      ],
      formulaHighlight: {
        label: "Cart Real-Time Subtotal & Tax Pipeline",
        code: `const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);\nconst vat = +(subtotal * 0.12).toFixed(2);\nconst grandTotal = +(subtotal + vat).toFixed(2);`
      }
    }
  },
  {
    id: "excel-inventory-model",
    title: "Automated Supply Chain & Inventory Reorder Engine",
    category: "excel",
    categoryLabel: "Excel & Data Analytics",
    badge: "Supply Chain",
    shortDesc: "Operational inventory intelligence model featuring dynamic safety stock thresholds, EOQ (Economic Order Quantity) formulas, and automated reorder alerts.",
    fullDesc: "Designed an automated warehouse and inventory management model for hardware supplies. Features safety stock formulas, dynamic visual stock level meters, automated vendor purchase order generation, and predictive reorder flags.",
    tools: ["MS Excel", "INDEX-MATCH", "Conditional Logic", "Data Modeling", "Barcode Simulation"],
    thumbnail: "assets/images/project-excel-inventory.svg",
    highlight: "Zero out-of-stock incidents during pilot run",
    caseStudy: {
      client: "Hardware Logistics Case Study",
      duration: "2.5 Weeks",
      role: "Inventory Analyst & Systems Developer",
      challenge: "Frequent stockouts and over-ordering caused cash flow bottlenecks and delayed IT equipment deployment.",
      solution: "Formulated an automated inventory model integrating lead-time variance, daily burn rates, and automated threshold alerts.",
      keyFeatures: [
        "Automatic stock status flags (Normal, Low Stock, Critical Reorder, Overstocked)",
        "Economic Order Quantity (EOQ) calculator balancing storage costs vs. order fees",
        "Automated vendor order generation sheet populated via dynamic lookup formulas",
        "Visual stock utilization horizontal bars rendered via Excel conditional data bars"
      ],
      formulaHighlight: {
        label: "Safety Stock & Reorder Point Formulation",
        code: `=ROUNDUP((MaxDailyUsage * MaxLeadTimeDays) - (AvgDailyUsage * AvgLeadTimeDays) + (AvgDailyUsage * AvgLeadTimeDays), 0)`
      }
    }
  },
  {
    id: "graphic-social-suite",
    title: "Horizon UI/UX Design System & Social Creator Kit",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    badge: "UI/UX & Kit",
    shortDesc: "Modular design kit featuring 40+ atomic UI components, responsive typography tokens, social media templates, and aesthetic horizontal lighting overlays.",
    fullDesc: "A complete multi-channel design kit and UI component library created in Figma and Illustrator. Features high-definition social banner templates, podcast covers, tech thumbnails, and UI component cards designed to maintain brand cohesion across platforms.",
    tools: ["Figma", "Adobe Photoshop", "UI/UX Prototyping", "Design Systems"],
    thumbnail: "assets/images/project-graphic-social.svg",
    highlight: "1,200+ Figma Community Duplicates",
    caseStudy: {
      client: "Digital Content Creators & Tech Startups",
      duration: "2 Weeks",
      role: "UI/UX & Visual Asset Creator",
      challenge: "Creators struggle with maintaining cohesive visual standards across YouTube, LinkedIn, X, and personal portfolio platforms.",
      solution: "Engineered a master design library with reusable components, automated color palettes adhering to dark-violet to blue horizontal gradients, and preset export templates.",
      keyFeatures: [
        "Over 40 responsive component frames ready for production mockups",
        "Horizontal gradient light-leak overlays and chromatic textures",
        "Typography presets tuned for legibility on small mobile feeds",
        "Organized layers with atomic naming conventions and auto-layout configuration"
      ],
      formulaHighlight: {
        label: "Grid System Matrix",
        code: `8pt Spatial Grid | 12-Column Responsive Layout | 1.250 Major Third Modular Scale`
      }
    }
  }
];

// Interactive Excel Playground Datasets for the Live Dashboard Simulator
const excelSimulatorData = {
  sales: {
    title: "Showing all my clients",
    formula: "=SUMIFS(Sales[Revenue], Sales[Region], @SelectedRegion, Sales[Quarter], @SelectedQtr)",
    headers: ["Number", "Name", "Client", "Status"],
// input data for the clients names
    rows: [
      [1, "N/A", "Client 1", "0 Completed"],
    ],

    summaryCards: [
      { label: "Total clients", key: "totalComm", format: "currency" },
      { label: "Average clients", key: "avgMargin", format: "percent" },
      { label: "Top Performing Rep", key: "topRep", format: "text" }
    ],
    filterOptions: {
      regions: ["All Regions", "North", "West", "East", "South"],
      quarters: ["All Quarters", "Q1", "Q2"]
    }
  },
  academic: {
    title: "IT Student Academic Grade Point & Unit Audit Matrix",
    formula: "=LET(credits, Courses[Units], grades, Courses[GradePoint], SUMPRODUCT(credits, grades)/SUM(credits))",
    headers: ["Course Code", "Course Title", "Category", "Units", "Midterm", "Finals", "Grade Pt", "Remark"],
    rows: [
      ["IT-101", "CAPSTONE PROJECT AND RESEARCH 2", "Major", 3.0, 93, 90, 1.4, "Passed"],
      ["IT-102", "DATA STRUCTURES AND ALGORITHMS", "Major", 3, 95, 92, 1.3, "Passed"],
      ["IT-103", "INTEGRATIVE PROGRAMMING AND TECHNOLOGIES", "Major", 3, 95, 91, 1.4, "Passed"],
      ["IT-104", "OBJECT-ORIENTED PROGRAMMING", "Analytics", 3, 91, 87, 1.8, "Passed"],
      ["GE-001", "UNDERSTANDING THE SELF", "General Ed", 3, 92, 93, 1.50, "Passed"],
      ["IT-201", "PLATFORM TECHNOLOGIES", "Major", 3, 93, 89, 1.6, "Passed"],
      ["IT-202", "SYSTEM ADMINISTRATION AND MAINTENANCE", "Major", 3, 94, 92, 1.3, "Passed"],
      ["IT-203", "UI/UX & Digital Media Design", "Design Elective", 3, 90, 89, 1.7, "Passed"],
      ["IT-204", "Database Management Systems", "Major", 3, 92, 88, 1.7, "Passed"],
      ["GE-002", "PURPOSIVE COMMUNICATION", "General Ed", 3, 91, 94, 1.50, "Passed"]
    ],
    summaryCards: [
      { label: "Cumulative GWA / GPA", key: "gpa", format: "decimal" },
      { label: "Total Units Completed", key: "totalUnits", format: "number" },
      { label: "Highest Course Grade", key: "topGrade", format: "text" },
      { label: "Honors Qualification", key: "academicStanding", format: "text" }
    ],
    filterOptions: {
      categories: ["All Categories", "Major", "Analytics", "Design Elective", "Math/Foundations", "General Ed"]
    }
  },
  inventory: {
    title: "Project Finish Tracker",
    formula: "=IF([@[CurrentStock]] <= [@[ReorderLevel]], \"REORDER NOW\", \"OPTIMAL\")",
    headers: ["Number", "Name", "Project", "Status"],
    
    // Project is done put it here
    rows: [
      [1, "N/A", "0", "N/A"],
    ],
    summaryCards: [
      { label: "Total Inventory Valuation", key: "totalValuation", format: "currency" },
      { label: "Active Reorder Alerts", key: "reorderAlerts", format: "number" },
      { label: "Stock Health Rate", key: "stockHealth", format: "percent" },
      { label: "Total Units in Warehouse", key: "totalInStock", format: "number" }
    ],
    filterOptions: {
      categories: ["All Categories", "Peripherals", "Cables/Adapters", "Cameras", "Design Gear", "Mounts/Desk", "Networking", "Storage", "Tools"],
      statuses: ["All Statuses", "Optimal", "REORDER NOW"]
    }
  }
};
