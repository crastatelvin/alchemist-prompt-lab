TECHNIQUES = [
    {"id": "zero_shot", "name": "Zero-Shot", "description": "Direct question, no examples.", "template": "Explain {topic} in simple terms.", "example": "Explain quantum entanglement in simple terms."},
    {"id": "few_shot", "name": "Few-Shot", "description": "Provide 2-3 examples.", "template": "Input: ... Output: ...", "example": "Classify sentiment with two examples, then classify: 'It was okay'."},
    {"id": "chain_of_thought", "name": "Chain-of-Thought", "description": "Reason step-by-step.", "template": "Think step by step: {problem}", "example": "Think step by step: 120km at 60km/h then 80km at 40km/h."},
    {"id": "role_prompting", "name": "Role Prompting", "description": "Assign expert role.", "template": "You are a {expert}. {task}", "example": "You are a cybersecurity expert. Review this code for vulnerabilities."},
    {"id": "tree_of_thought", "name": "Tree-of-Thought", "description": "Explore branches.", "template": "Path A, Path B, Path C for: {problem}", "example": "Should we migrate monolith to microservices? Evaluate paths."},
    {"id": "self_consistency", "name": "Self-Consistency", "description": "Generate multiple attempts and pick the best.", "template": "Try three approaches and return the most consistent answer.", "example": "Give 3 approaches to learn programming and pick best."},
    {"id": "react", "name": "ReAct", "description": "Reason + act steps.", "template": "Thought/Action/Observation/Final Answer: {question}", "example": "Should a startup prioritize product or marketing first?"},
    {"id": "constraint_based", "name": "Constraint-Based", "description": "Constrain output shape and rules.", "template": "Task: {task} Constraints: max words, bullets only.", "example": "Explain machine learning in 100 words, bullet points, no jargon."},
]


def get_all_techniques():
    return TECHNIQUES


def get_technique(technique_id: str):
    return next((t for t in TECHNIQUES if t["id"] == technique_id), None)
