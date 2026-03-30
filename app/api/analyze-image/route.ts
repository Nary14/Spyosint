import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, model } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": model,
        "messages": [
          {
            "role": "user",
            "content": [
              { "type": "text", "text": "Identify this person or location. List 5 precise OSINT search keywords." },
              { "type": "image_url", "image_url": { "url": image } }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json({ identification: "Erreur Modèle", search_keywords: [] });
    }

    // On passe la description brute de Nemotron à l'étape suivante (Dolphin)
    const rawAnalysis = data.choices[0].message.content;
    
    // On simule un format JSON simple pour le frontend en attendant Dolphin
    return NextResponse.json({ 
        raw_vision: rawAnalysis,
        identification: "Analyse visuelle terminée...",
        search_keywords: [rawAnalysis.substring(0, 50)] // Extraction temporaire
    });

  } catch (error) {
    return NextResponse.json({ identification: "Erreur Système" }, { status: 500 });
  }
}