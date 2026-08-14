import sys
import os

# Ensure local modules are discoverable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from .scoring import calculate_full_ats_score # type: ignore
except (ImportError, ValueError):
    from scoring import calculate_full_ats_score # type: ignore

from skill import ROLE_SKILLS_MAP, calculate_skill_score # type: ignore
