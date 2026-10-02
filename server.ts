import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Google GenAI on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server-side Gemini API routes
app.post('/api/gemini/generate-description', async (req: Request, res: Response) => {
  try {
    const { productName, category, fabric, style, keyFeatures } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Le nom du produit est requis.' });
    }

    const prompt = `Tu es le rédacteur en chef et directeur artistique de la marque de vêtements de luxe "Give to God", une marque inspirée par la foi chrétienne, la gratitude, l'élégance et le streetwear contemporain haut de gamme.
Rédige une description produit captivante en français pour le produit suivant :
- Nom : ${productName}
- Catégorie : ${category || 'Vêtement'}
- Tissu / Matière : ${fabric || '100% Coton peigné premium'}
- Style : ${style || 'Élégant, inspirant, moderne'}
- Caractéristiques : ${keyFeatures || 'Coupe confortable, broderie soignée'}

Consignes strictes :
1. Rédige en français soigné, inspirant et valorisant.
2. Structure la réponse avec :
   - Un paragraphe d'introduction émotionnel et valorisant (2 à 3 phrases).
   - Une section "Détails & Finitions" (3 à 4 puces avec des tirets).
   - Un court conseil de style ("Comment le porter").
3. N'inclus pas de balises markdown complexes ni d'astérisques excessifs, reste propre et facile à lire.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "Tu es un expert en e-commerce de mode et copywriting de luxe.",
        temperature: 0.7,
      },
    });

    const description = response.text || '';
    return res.json({ description });
  } catch (error: any) {
    console.error('Erreur Gemini generate-description:', error);
    return res.status(500).json({
      error: 'Erreur lors de la génération de la description avec Gemini.',
      details: error.message,
    });
  }
});

app.post('/api/gemini/generate-offer', async (req: Request, res: Response) => {
  try {
    const { offerName, targetDiscount, occasion } = req.body;

    const prompt = `Tu es l'expert marketing de la marque de mode "Give to God".
Génère une proposition de texte promotionnel pour l'offre suivante :
- Titre / Thème : ${offerName || 'Offre Spéciale'}
- Réduction visée : ${targetDiscount || '20%'}
- Occasion : ${occasion || 'Lancement de collection / Saison'}

Réponds en JSON avec le format exact suivant :
{
  "title": "Titre accrocheur de l'offre (court, max 60 caractères)",
  "badge": "Texte court pour le badge promo (ex: -20% Vente Flash)",
  "description": "Texte court et persuasif pour convaincre l'acheteur (max 150 caractères)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Erreur Gemini generate-offer:', error);
    return res.status(500).json({
      error: 'Erreur lors de la génération de l\'offre.',
      details: error.message,
    });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Give to God server démarré sur http://localhost:${port}`);
  });
}

startServer();
