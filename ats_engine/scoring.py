import sys
import json
import os

# Set Python Path for modularity
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import keyword_matcher
    import semantic
    import skill
    import evidence
    import suggestions
    import role_match
    
    from keyword_matcher import calculate_keyword_score
    from semantic import calculate_semantic_score
    from skill import calculate_skill_score
    from evidence import calculate_evidence_score
    from suggestions import generate_suggestions
    from role_match import rank_roles
except (ImportError, ModuleNotFoundError):
    # Fallback for some linter environments or execution contexts
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from keyword_matcher import calculate_keyword_score
    from semantic import calculate_semantic_score
    from skill import calculate_skill_score
    from evidence import calculate_evidence_score
    from suggestions import generate_suggestions
    from role_match import rank_roles



def calculate_full_ats_score(data):
    """
    Combines all modules to compute the final ATS score and analysis.
    """
    resume_text = data.get("resume_text", "")
    job_description = data.get("job_description", "")
    skills = data.get("skills", [])
    required_skills = data.get("required_skills", [])
    projects_text = data.get("projects_text", "")
    experience_text = data.get("experience_text", "")
    target_role = data.get("target_role", "")

    # 1. Keyword Score (30%)
    keyword_score = calculate_keyword_score(resume_text, job_description)

    # 2. Semantic Score (30%)
    semantic_score = calculate_semantic_score(resume_text, job_description)

    # 3. Skill Score (25%)
    skill_results = calculate_skill_score(skills, job_description, target_role)
    skill_score = skill_results.get("score", 0)
    matched_skills = skill_results.get("matched", [])
    missing_skills = skill_results.get("missing", [])

    # 4. Evidence Score (15%)
    evidence_score = calculate_evidence_score(skills, projects_text, experience_text)

    # Combined Score
    raw_final_score = float(
        (0.30 * keyword_score) +
        (0.30 * semantic_score) +
        (0.25 * skill_score) +
        (0.15 * evidence_score)
    )
    
    # Using format-based rounding to satisfy some linters that misinterpret round()
    final_score = float(f"{min(100.0, max(0.0, raw_final_score)):.1f}")



    # Response Object
    results = {
        "score": final_score,
        "keyword_score": keyword_score,
        "semantic_score": semantic_score,
        "skill_score": skill_score,
        "evidence_score": evidence_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }

    # Suggestions
    results["suggestions"] = generate_suggestions(results)
    
    # Role Ranking
    results["role_ranking"] = rank_roles(resume_text, skills)

    return results

if __name__ == "__main__":
    # Handle direct script execution for Node.js integration
    try:
        if len(sys.argv) > 1:
            input_json = sys.argv[1]
            data = json.loads(input_json)
            result = calculate_full_ats_score(data)
            print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
