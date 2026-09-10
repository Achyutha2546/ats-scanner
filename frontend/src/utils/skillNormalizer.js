// Comprehensive skill synonyms mapping to prevent false missing skill warnings
export const SKILL_SYNONYMS = {
  'html': ['html5', 'html', 'xhtml'],
  'css': ['css3', 'css', 'scss', 'sass', 'less', 'flexbox', 'grid'],
  'javascript': ['js', 'javascript', 'es6', 'ecmascript', 'js/ts'],
  'typescript': ['ts', 'typescript'],
  'react': ['react.js', 'reactjs', 'react', 'react native'],
  'node.js': ['nodejs', 'node.js', 'node'],
  'mongodb': ['mongo', 'mongodb'],
  'rest api': ['rest', 'restful', 'rest api', 'api', 'apis'],
  'machine learning': ['ml', 'machine learning'],
  'ui/ux': ['ui', 'ux', 'ui/ux', 'design', 'user experience', 'user interface'],
  'postgresql': ['postgres', 'postgresql', 'psql'],
  'next.js': ['nextjs', 'next.js', 'next'],
  'express': ['expressjs', 'express.js', 'express'],
  'python': ['python3', 'py', 'python'],
  'docker': ['containerization', 'containers', 'docker'],
  'kubernetes': ['k8s', 'kubernetes'],
  'aws': ['amazon web services', 'aws'],
  'git': ['github', 'gitlab', 'version control', 'git'],
  'vue': ['vue.js', 'vuejs', 'vue'],
  'angular': ['angularjs', 'angular'],
  'c++': ['cpp', 'c++'],
  'c#': ['csharp', 'c#', '.net']
};

export const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  const s = skill.toLowerCase().trim();
  const sCleaned = s.replace(/[^a-z0-9]/g, '');
  
  for (const [canonical, variations] of Object.entries(SKILL_SYNONYMS)) {
    const normVariations = variations.map(v => v.toLowerCase().replace(/[^a-z0-9]/g, ''));
    if (s === canonical || variations.includes(s) || normVariations.includes(sCleaned)) {
      return canonical;
    }
  }
  return sCleaned || s;
};

export const isSkillMatch = (skillA, skillB) => {
  if (!skillA || !skillB) return false;
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);
  if (normA === normB) return true;
  return normA.includes(normB) || normB.includes(normA);
};
