import re

ROLE_SKILLS_MAP = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST API', 'Typescript', 'Next.js', 'Redux', 'Tailwind', 'Webpack', 'Babel'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'MySQL', 'REST API', 'Docker', 'PostgreSQL', 'Redis', 'GraphQL', 'AWS', 'microservices'],
  'Data Scientist': ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Statistics', 'TensorFlow', 'Scikit-learn', 'PyTorch', 'NLP', 'SQL', 'Tableau'],
  'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API', 'Git', 'Typescript', 'SQL', 'PostgreSQL', 'Express', 'HTML', 'CSS'],
  'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Git', 'Objective-C', 'iOS SDK', 'Android SDK', 'Java'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Jenkins', 'Terraform', 'Ansible', 'Bash', 'Prometheus', 'Grafana'],
  'UI/UX Designer': ['Figma', 'User Interface', 'User Experience', 'Prototyping', 'Adobe XD', 'Wireframing', 'Sketch', 'Photoshop', 'Illustrator'],
  'ML Engineer': ['Machine Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Python', 'Keras', 'Hadoop', 'Spark', 'C++'],
  'Cyber Security Analyst': ['Security', 'Network Security', 'Penetration Testing', 'Firewalls', 'Encryption', 'Threat Analysis', 'SIEM', 'Compliance', 'SOC']
}

# Skill synonyms for better matching
SKILL_SYNONYMS = {
  'html': ['html5', 'html', 'xhtml'],
  'css': ['css3', 'css', 'scss', 'sass', 'less', 'flexbox', 'grid'],
  'javascript': ['js', 'es6', 'ecmascript', 'javascript', 'js/ts'],
  'typescript': ['ts', 'typescript'],
  'react': ['react.js', 'reactjs', 'react', 'react native'],
  'node.js': ['nodejs', 'node', 'node.js'],
  'mongodb': ['mongo', 'mongodb'],
  'rest api': ['rest', 'restful', 'apis', 'api', 'rest api', 'rest apis'],
  'machine learning': ['ml', 'machine learning'],
  'ui/ux': ['ui', 'ux', 'design', 'ui/ux designer', 'ui/ux'],
  'postgresql': ['postgres', 'postgresql', 'psql'],
  'next.js': ['nextjs', 'next.js', 'next'],
  'express': ['expressjs', 'express.js', 'express'],
  'python': ['python3', 'py', 'python'],
  'docker': ['containerization', 'containers', 'docker'],
  'kubernetes': ['k8s', 'kubernetes'],
  'aws': ['amazon web services', 'aws'],
  'git': ['github', 'gitlab', 'version control', 'git']
}

def normalize_skill(skill):
    if not skill:
        return ""
    s = skill.lower().strip()
    s_cleaned = re.sub(r'[^a-z0-9]', '', s)
    
    # Check for direct synonyms
    for canonical, variations in SKILL_SYNONYMS.items():
        if s in variations or s_cleaned in [v.replace(' ', '').replace('.', '').replace('/', '') for v in variations]:
            return canonical
        if s == canonical:
            return canonical
    return s_cleaned or s

def calculate_skill_score(user_skills, jd_text, target_role):
    """
    Computes Skill Match Score based on extracted and required skills.
    """
    # 1. Determine Required Skills
    required_skills = []
    
    if target_role and target_role in ROLE_SKILLS_MAP:
        required_skills = ROLE_SKILLS_MAP[target_role]
    elif jd_text:
        # Simple extraction from JD text (can be improved with more robust NLP)
        jd_lower = jd_text.lower()
        for role, skills in ROLE_SKILLS_MAP.items():
            if role.lower() in jd_lower:
                required_skills.extend(skills)
        # Unique skills
        required_skills = list(set(required_skills))
        
    if not required_skills:
        # Fallback to search any global skill set in JD
        global_skills = [s for sublist in ROLE_SKILLS_MAP.values() for s in sublist]
        required_skills = [s for s in global_skills if re.search(r'\b' + re.escape(s.lower()) + r'\b', jd_text.lower())]
        required_skills = list(set(required_skills))
    
    if not required_skills:
        # Default skill set if nothing found
        return {"score": 0.0, "matched": [], "missing": []}

    # Deduplicate required_skills based on normalized canonical form (e.g. HTML & HTML5)
    canonical_req_map = {}
    for req in required_skills:
        norm = normalize_skill(req)
        if norm not in canonical_req_map:
            canonical_req_map[norm] = req

    user_skills_norm = set([normalize_skill(s) for s in user_skills if s])
    matched_skills = []
    missing_skills = []

    for norm_req, original_req in canonical_req_map.items():
        if norm_req in user_skills_norm:
            matched_skills.append(original_req)
        else:
            missing_skills.append(original_req)

    # Calculate score
    score = (len(matched_skills) / len(canonical_req_map)) * 100 if canonical_req_map else 0.0
    
    return {
        "score": float(f"{score:.2f}"),
        "matched": matched_skills,
        "missing": missing_skills
    }

