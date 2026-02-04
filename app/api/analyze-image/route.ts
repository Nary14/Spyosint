import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, model } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SpyOSINT",
      },
      body: JSON.stringify({
        "model": model,
        "messages": [
          {
            "role": "user",
            "content": [
              { 
                "type": "text", 
                "text": "Tu es un expert OSINT. Analyse cette image et réponds suivant ce format strict : \n1. **IDENTIFICATION** : Sujet principal et détails.\n2. **INDICES** : Texte, logos ou lieux détectés.\n3. **Mots-clés pour recherche** : (Liste de mots pour Google).\n4. **GOOGLE DORKS** : Propose des commandes comme 'site:twitter.com sujet'.\n\nSois très précis sur les éléments qui permettent de retrouver la source originale." 
              },
              { "type": "image_url", "image_url": { "url": image } }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      const errorMsg = data.error.message || JSON.stringify(data.error);
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    if (data.choices && data.choices[0]) {
      return NextResponse.json({ analysis: data.choices[0].message.content });
    }

    return NextResponse.json({ error: "Réponse vide du modèle" }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}