import os
import sys

# Ensure local modules are discoverable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from skill import ROLE_SKILLS_MAP, calculate_skill_score # type: ignore




def rank_roles(resume_text, resume_skills):
    """
    Evaluates the resume against all defined roles and returns a ranked list.
    """
    role_scores = []
    
    for role, skills in ROLE_SKILLS_MAP.items():
        # Compute skill score for each role
        skill_res = calculate_skill_score(resume_skills, resume_text, role)
        score = skill_res.get("score", 0)
        
        # Add basic weighting for role name in resume text
        if role.lower() in resume_text.lower():
            score += 10
            
        role_scores.append({"role": role, "score": min(100.0, float(f"{score:.1f}"))})

        
    # Sort roles by score descending
    ranked_roles = sorted(role_scores, key=lambda x: x["score"], reverse=True)
    
    return ranked_roles
