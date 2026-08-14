import re


def calculate_evidence_score(user_skills, projects_text, experience_text):
    """
    Computes Evidence Score based on whether skills appear in projects or experience.
    """
    if not user_skills:
        return 0.0
        
    combined_content = (projects_text + " " + experience_text).lower()
    
    if not combined_content.strip():
        return 0.0
    
    # Skills with evidence
    evidence_count = 0
    skills_to_check = list(user_skills) if user_skills else []
    for skill in skills_to_check:
        # Check if the skill name appears in the context as a word
        if re.search(r'\b' + re.escape(str(skill).lower()) + r'\b', combined_content):
            evidence_count += 1
            
    # Calculate score
    score = (evidence_count / len(skills_to_check)) * 100 if skills_to_check else 0.0
    
    return float(f"{score:.2f}")


