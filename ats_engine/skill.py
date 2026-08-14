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
  'html': ['html5', 'xhtml'],
  'css': ['css3', 'scss', 'sass'],
  'javascript': ['js', 'es6', 'ecmascript'],
  'react': ['react.js', 'reactjs'],
  'node.js': ['nodejs', 'node'],
  'mongodb': ['mongo'],
  'rest api': ['rest', 'restful', 'apis'],
  'machine learning': ['ml'],
  'ui/ux': ['ui', 'ux', 'design'],
  'postgresql': ['postgres'],
  'next.js': ['nextjs', 'next'],
  'express': ['expressjs', 'express.js']
}

def normalize_skill(skill):
    if not skill:
        return ""
    s = skill.lower().strip()
    s_cleaned = re.sub(r'[^a-z0-9]', '', s)
    
    # Check for direct synonyms
    for canonical, variations in SKILL_SYNONYMS.items():
        if s in variations or s_cleaned in [v.replace(' ', '').replace('.', '') for v in variations]:
            return canonical
        if s == canonical:
            return canonical
    return s

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

    user_skills_norm = [normalize_skill(s) for s in user_skills if s]
    matched_skills = []
    missing_skills = []

    for req in required_skills:
        norm_req = normalize_skill(req)
        # Check if the required skill or any of its variations is in the user's skill set
        found = False
        if norm_req in user_skills_norm:
            found = True
        else:
            # Check variations of required skill
            synonyms = SKILL_SYNONYMS.get(norm_req, [])
            if any(normalize_skill(syn) in user_skills_norm for syn in synonyms):
                found = True
        
        if found:
            matched_skills.append(req)
        else:
            missing_skills.append(req)

    # Calculate score
    score = (len(matched_skills) / len(required_skills)) * 100
    
    return {
        "score": float(f"{score:.2f}"),
        "matched": matched_skills,
        "missing": missing_skills
    }

