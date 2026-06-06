import prisma from '../utils/prisma';

const apiKey = process.env.OPENAI_API_KEY;

/**
 * Ask AgroBrain - Generative AI RAG Service
 * Implements a "Simulation Mode" fallback if no API key is provided.
 */
export async function askAgroBrain(userId: string, question: string): Promise<string> {
  const sensors = await prisma.sensorLog.findMany({
    take: 10,
    orderBy: { timestamp: 'desc' },
    include: { sensor: { include: { zone: true } } }
  });
  
  const knowledge = await prisma.cropKnowledge.findMany({ take: 5 });

  // SIMULATION MODE (Fallback if no API key)
  if (!apiKey) {
    console.log('🧠 [AgroBrain] Running in SIMULATION MODE (No OPENAI_API_KEY found)');
    await new Promise(r => setTimeout(r, 1500)); 

    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('tomate') || lowerQ.includes('tomato')) {
      return `**Analyse Simulée (Mode Hors-Ligne)** :\nLes tomates en Zone B montrent un taux d'humidité optimal selon vos derniers relevés de capteurs (${sensors.length > 0 ? sensors[0].value : 60}%). Cependant, gardez un œil sur le pH qui devrait rester entre 6.0 et 6.8.\n\n*Note: Ceci est une réponse générée localement. Ajoutez OPENAI_API_KEY pour l'IA complète.*`;
    }
    
    if (lowerQ.includes('ph') || lowerQ.includes('acid')) {
      return `**Analyse Simulée (Mode Hors-Ligne)** :\nJe vois que vous interrogez l'acidité des sols. D'après notre base de connaissance, des cultures comme le Ginseng demandent un pH entre 5.5 et 6.5. Voulez-vous que je planifie un ajustement de calcium ?\n\n*Note: Ajoutez votre clé OpenAI pour débloquer l'analyse sémantique profonde.*`;
    }

    return `**Analyse Simulée (Mode Hors-Ligne)** :\nJ'ai bien reçu votre question : "${question}".\nEn analysant vos ${sensors.length} dernières lectures de capteurs et la base de données de ${knowledge.length} cultures, tout semble stable. Le système Cyber-Compliance est actif.\n\n*Astuce : Renseignez la variable d'environnement OPENAI_API_KEY pour activer GPT-4.*`;
  }

  // FULL RAG MODE (Native fetch)
  try {
    const systemPrompt = `
Tu es AgroBrain, l'IA experte et autonome de la ferme AgroMaître.
Ton rôle est d'analyser les données de la ferme et d'agir comme un conseiller agronomique de haut niveau.

Tu as un accès exclusif à ces données en temps réel :
- **Données Capteurs Récentes** : ${JSON.stringify(sensors)}
- **Base de Connaissance des Cultures** : ${JSON.stringify(knowledge)}

**Tes directives** :
1. Sois très technique, précis et proactif.
2. Si une donnée capteur viole les règles de la base de connaissance, alerte l'utilisateur et propose un plan d'action.
3. Utilise un ton professionnel, scientifique, mais encourageant.
4. Formate tes réponses en Markdown clair (listes, puces, gras).
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    return data.choices[0].message.content || "Je n'ai pas pu formuler de réponse. Veuillez réessayer.";
  } catch (error: any) {
    console.error('❌ [AgroBrain] API Error:', error.message);
    throw new Error("L'IA AgroBrain est temporairement indisponible suite à une erreur réseau.");
  }
}
