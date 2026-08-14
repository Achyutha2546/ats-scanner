import re
import math
from collections import Counter

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-z0-9\s]', '', text)
    return text

def calculate_cosine_similarity(text1, text2):
    """
    Computes Cosine Similarity manually as a fallback for scikit-learn.
    """
    words1 = clean_text(text1).split()
    words2 = clean_text(text2).split()
    
    if not words1 or not words2:
        return 0.0
        
    v1 = Counter(words1)
    v2 = Counter(words2)
    
    unique_words = set(v1.keys()) | set(v2.keys())
    
    dot_product = sum(v1.get(w, 0) * v2.get(w, 0) for w in unique_words)
    mag1 = math.sqrt(sum(v1.get(w, 0)**2 for w in unique_words))
    mag2 = math.sqrt(sum(v2.get(w, 0)**2 for w in unique_words))
    
    if mag1 == 0 or mag2 == 0:
        return 0.0
        
    return dot_product / (mag1 * mag2)


def calculate_keyword_score(resume_text, jd_text):
    """
    Computes Keyword Match Score using TF-IDF and Cosine Similarity.
    Uses scikit-learn if available, otherwise manual fallback.
    """
    if not resume_text or not jd_text:
        return 0.0

    resume_clean = clean_text(resume_text)
    jd_clean = clean_text(jd_text)

    # If the text is too short, return 0
    if len(resume_clean.split()) < 5 or len(jd_clean.split()) < 5:
        return 0.0

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
        from sklearn.metrics.pairwise import cosine_similarity # type: ignore
        
        vectorizer = TfidfVectorizer(stop_words='english')

        tfidf_matrix = vectorizer.fit_transform([resume_clean, jd_clean])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = float(similarity[0][0]) * 100
        return float(f"{score:.2f}")
    except (ImportError, Exception):
        # Manual fallback
        similarity = calculate_cosine_similarity(resume_text, jd_text)
        return float(f"{similarity * 100:.2f}")

