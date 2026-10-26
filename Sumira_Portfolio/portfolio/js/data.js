// =========================================================
// data.js – all personal content in one place
// PRACTICAL 2: const + object literals
// PRACTICAL 5: arrays of objects
// PRACTICAL 11: ES6 module (export)
// =========================================================

export const profile = {
  name: 'Sumira Wandile',
  college: 'Symbiosis Institute of Technology, Nagpur',
  degree: 'B.Tech in Computer Science Engineering',
  year: 'third-year',
  cgpa: 8.62,
  location: 'Nagpur, India',
  email: 'wandilesumira@gmail.com',
  github: 'https://github.com/Sumirawandile',
  roles: ['Data Analytics', 'Backend Development in Java', 'Data Engineering', 'Machine Learning'],
  interests: ['Data Pipelines', 'Machine Learning', 'Backend Development', 'Research']
};

export const stats = [
  { label: 'CGPA (till Sem 4)', value: 8.62, decimals: 2 },
  { label: 'Projects built', value: 4 },
  { label: 'Certifications', value: 6 },
  { label: 'Hackathons & challenges', value: 3 }
];

export const timeline = [
  {
    type: 'work',
    date: 'May 2026 – Jun 2026',
    title: 'Data Engineering Intern',
    org: 'Keyy – Sozo Advisory Pvt Ltd',
    points: [
      'Analysed the production database schema and worked with live credit card rewards and payments data',
      'Wrote Python scripts that parse large JSON files and auto-generate SQL INSERT and UPDATE queries at scale',
      'Imported generated SQL into Google Cloud SQL via Cloud Storage when direct connectors were restricted'
    ]
  },
  {
    type: 'edu',
    date: 'Aug 2024 – Present',
    title: 'B.Tech, Computer Science Engineering',
    org: 'Symbiosis Institute of Technology, Nagpur',
    points: ['CGPA 8.62 / 10 (till 4th semester)']
  },
  {
    type: 'edu',
    date: '2022 – 2024',
    title: 'HSC (Class XII) – Science',
    org: 'Raisoni College, Nagpur',
    points: ['Scored 77%']
  },
  {
    type: 'edu',
    date: '2022',
    title: 'CBSE (Class X)',
    org: 'Sevasadan Saksham CBSE School, Nagpur',
    points: ['Scored 86.2%']
  }
];

export const skills = [
  { name: 'Python', cat: 'Languages' },
  { name: 'Java', cat: 'Languages' },
  { name: 'C', cat: 'Languages' },
  { name: 'SQL', cat: 'Languages' },
  { name: 'JavaScript', cat: 'Web' },
  { name: 'HTML', cat: 'Web' },
  { name: 'CSS', cat: 'Web' },
  { name: 'jQuery', cat: 'Web' },
  { name: 'Pandas', cat: 'Libraries' },
  { name: 'NumPy', cat: 'Libraries' },
  { name: 'Streamlit', cat: 'Libraries' },
  { name: 'Google Cloud SQL', cat: 'Tools' },
  { name: 'MySQL', cat: 'Tools' },
  { name: 'GitHub', cat: 'Tools' },
  { name: 'VS Code', cat: 'Tools' },
  { name: 'Google Colab', cat: 'Tools' },
  { name: 'Data Pipelines', cat: 'Concepts' },
  { name: 'DBMS', cat: 'Concepts' },
  { name: 'REST APIs', cat: 'Concepts' },
  { name: 'OOP', cat: 'Concepts' },
  { name: 'Data Preprocessing', cat: 'Concepts' },
  { name: 'DSA (in progress)', cat: 'Concepts' }
];

export const achievements = [
  {
    featured: true,
    tag: 'Research Conference',
    title: 'Paper Presentation – ICCIS',
    file: 'assets/certificates/iccis-bits-goa.pdf',
    place: 'BITS Pilani, K K Birla Goa Campus',
    text: 'Presented the REACT research paper on AI-driven emergency resource allocation for disaster-affected zones.'
  },
  {
    tag: 'Hackathon · 2026',
    title: 'CodeAstra 2.0',
    file: 'assets/certificates/codeastra-rgit.pdf',
    place: 'Rajiv Gandhi Institute of Technology, Mumbai',
    text: 'Took part in a 24-hour offline hackathon in the AI/ML track, building a working prototype with my team.'
  },
  {
    tag: 'Hackathon · 2025',
    title: 'EY Techathon 6.0',
    file: 'assets/certificates/ey-techathon.pdf',
    place: 'Ernst & Young',
    text: 'Participated in EY’s national technology hackathon.'
  },
  {
    tag: 'Case Study · 2025',
    title: 'ICICI Lombard Business Strategy Case Study',
    file: 'assets/certificates/icici-lombard-iitb.pdf',
    place: 'IIT Bombay',
    text: 'Worked on a business strategy case challenge for ICICI Lombard.'
  }
];

// "file" = path to the certificate (PDF or image) inside assets/certificates/,
// or a full online link (e.g. a HackerRank certificate URL).
// If a local file is missing, its "View certificate" link hides itself.
export const certifications = [
  { name: 'Python Certification', by: 'Red Hat', file: 'assets/certificates/redhat-python.pdf' },
  { name: 'Design and Analysis of Algorithms', by: 'Infosys Springboard', file: 'assets/certificates/infosys-daa.pdf' },
  { name: 'Data Science Summer School', by: 'Hertie School', file: 'assets/certificates/hertie-data-science.pdf' },
  { name: 'SQL (Intermediate)', by: 'HackerRank', file: 'https://www.hackerrank.com/certificates/a2c945ac1e0e' },
  { name: 'SQL (Basic)', by: 'HackerRank', file: 'https://www.hackerrank.com/certificates/07c123e9ddb6' },
  { name: 'Python (Basic)', by: 'HackerRank', file: 'assets/certificates/hackerrank-python.pdf' }
];
