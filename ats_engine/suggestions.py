def generate_suggestions(results):
    """
    Generates actionable suggestions based on ATS scoring results.
    """
    suggestions = []
    
    keyword_score = results.get("keyword_score", 0)
    skill_score = results.get("skill_score", 0)
    semantic_score = results.get("semantic_score", 0)
    evidence_score = results.get("evidence_score", 0)
    missing_skills = results.get("missing_skills", [])
    matched_skills = results.get("matched_skills", [])

    if keyword_score < 40:
        suggestions.append("Low Keyword Alignment: Identify technical terms in job description and incorporate them naturally.")
    
    if skill_score < 50:
        suggestions.append(f"Low Skill Match: Consider adding missing technical skills: {', '.join(missing_skills[:3])}")
    
    if semantic_score < 40:
        suggestions.append("Low Semantic Similarity: Rewrite project/experience descriptions to better align with the core themes of the job description.")
    
    if evidence_score < 40:
        suggestions.append("Low Skill Evidence: Demonstrate your skills in practical projects or work experience.")
    
    # Actionable Specific Suggestions
    if missing_skills:
        for sk in missing_skills[:2]:
            suggestions.append(f"Include a project demonstrating expertise in {sk}.")
            
    if not matched_skills:
        suggestions.append("Ensure your skill list is clearly defined and matches industry-standard terminology.")
    
    return suggestions
