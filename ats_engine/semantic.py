import re
import math
from collections import Counter

# Manual fallback for cosine similarity
def calculate_manual_cosine(text1, text2):
    """
    Computes Cosine Similarity manually for TF-IDF fallback.
    """
    words1 = text1.lower().split()
    words2 = text2.lower().split()
    
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

def calculate_semantic_score(resume_text, jd_text):
    """
    Computes Semantic Similarity Score using SBERT (or manual fallback).
    """
    if not resume_text or not jd_text:
        return 0.0

    # 1. Try SBERT
    try:
        from sentence_transformers import SentenceTransformer, util # type: ignore
        model = SentenceTransformer('all-MiniLM-L6-v2')
        embeddings1 = model.encode(resume_text, convert_to_tensor=True)
        embeddings2 = model.encode(jd_text, convert_to_tensor=True)
        similarity = util.cos_sim(embeddings1, embeddings2)

        score = float(similarity[0][0]) * 100
        return float(f"{score:.2f}")
    except (ImportError, Exception):
        pass


    # 2. Try scikit-learn
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
        from sklearn.metrics.pairwise import cosine_similarity # type: ignore
        
        vectorizer = TfidfVectorizer(stop_words='english', analyzer='char_wb', ngram_range=(2, 4))

        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = float(similarity[0][0]) * 100
        return float(f"{score:.2f}")
    except (ImportError, Exception):
        pass


    # 3. Manual Fallback
    similarity = calculate_manual_cosine(resume_text, jd_text)
    return float(f"{similarity * 100:.2f}")

