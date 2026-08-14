import json
from ats_engine.scoring import calculate_full_ats_score

test_data = {
    "resume_text": "Experienced Python developer with a strong background in Machine Learning and Data Science. Proficient in Pandas, NumPy, and Scikit-learn. Worked on projects involving Natural Language Processing and Computer Vision.",
    "job_description": "We are looking for a Data Scientist with expertise in Python, Machine Learning, and statistics. Experience with NLP and Scikit-learn is a plus.",
    "skills": ["Python", "Machine Learning", "Pandas", "NumPy", "Scikit-learn"],
    "projects_text": "Built a sentiment analysis tool using NLP. Developed a recommendation engine using collaborative filtering.",
    "experience_text": "Data Scientist at AI Corp. Leveraged Python and machine learning for predictive analytics.",
    "target_role": "Data Scientist"
}

try:
    result = calculate_full_ats_score(test_data)
    print("ATS Score Result:")
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")
