import random
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="AgroMaître Vision API",
    description="Micro-service d'Intelligence Artificielle pour le diagnostic visuel des cultures.",
    version="2.0.0"
)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base de connaissance pour la détection simulée
DISEASES_DB = {
    "tomato": ["Late Blight (Mildiou)", "Leaf Mold (Moisissure)", "Spider Mites (Acariens)"],
    "lavender": ["Root Rot (Pourriture)", "Aphids (Pucerons)"],
    "ginseng": ["Rhizoctonia", "Powdery Mildew (Oïdium)"]
}

TREATMENTS_DB = {
    "Late Blight (Mildiou)": "Appliquer un traitement fongicide à base de cuivre et réduire l'humidité ambiante.",
    "Leaf Mold (Moisissure)": "Améliorer la circulation de l'air et appliquer du bicarbonate de potassium.",
    "Spider Mites (Acariens)": "Utiliser des acariens prédateurs ou pulvériser de l'huile de neem.",
    "Root Rot (Pourriture)": "Stopper l'irrigation immédiatement. Appliquer du Trichoderma dans le sol.",
    "Aphids (Pucerons)": "Introduire des coccinelles ou pulvériser un savon insecticide noir.",
    "Rhizoctonia": "Traiter le sol avec un bio-fongicide et assurer un bon drainage.",
    "Powdery Mildew (Oïdium)": "Pulvériser une solution de soufre ou de lait (10%)."
}

@app.post("/analyze")
async def analyze_plant(
    crop: str = Form("tomato"), 
    file: UploadFile = File(...)
):
    """
    Reçoit une image de culture et simule une analyse par un réseau de neurones convolutif (CNN).
    """
    # 1. Simulation d'une analyse de modèle ML
    possible_diseases = DISEASES_DB.get(crop.lower(), ["Pathogène Inconnu"])
    detected = random.choice(possible_diseases)
    confidence = round(random.uniform(0.75, 0.99), 2)
    
    treatment = TREATMENTS_DB.get(detected, "Consulter l'Agro-Brain pour un diagnostic détaillé.")
    severity = random.choice(["Low", "Medium", "High", "Critical"])
    
    # Simulation de latence (calcul GPU)
    import asyncio
    await asyncio.sleep(2)
    
    return {
        "status": "success",
        "crop": crop,
        "filename": file.filename,
        "detected": detected,
        "confidence": confidence,
        "treatment": treatment,
        "severity": severity
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
