import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { raw_vision } = await req.json();

    if (!raw_vision) {
      return NextResponse.json({ full_report: "Erreur : Aucune donnée visuelle reçue." });
    }

    // --- ÉTAPE 1 : EXTRACTION DES MOTS-CLÉS PAR DOLPHIN ---
    const dolphinKeyRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        "messages": [
          { 
            "role": "system", 
            "content": "Extract only the most important search terms from this description. Output format: Term1, Term2, Term3. No intro, no outro." 
          },
          { "role": "user", "content": raw_vision }
        ]
      })
    });
    
    const keyData = await dolphinKeyRes.json();
    const keywords = keyData.choices?.[0]?.message?.content || "Military person USA flag";

    // --- ÉTAPE 2 : SCRAPING GOOGLE (Plus robuste) ---
    const query = encodeURIComponent(keywords);
    const searchUrl = `https://www.google.com/search?q=${query}&num=5&hl=fr`;
    
    let webData = "";
    try {
      const resSearch = await fetch(searchUrl, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
        }
      });
      const html = await resSearch.text();
      const $ = cheerio.load(html);
      
      // On cible les descriptions de résultats Google
      $('div.VwiC3b, div.BNeawe').each((_, el) => { 
        webData += $(el).text() + " "; 
      });
    } catch (e) {
      webData = "Aucune donnée web accessible.";
    }

    // --- ÉTAPE 3 : GÉNÉRATION DU RAPPORT FINAL OSINT ---
    const finalRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        "messages": [
          { 
            "role": "system", 
            "content": "Tu es un agent OSINT. À partir de l'analyse visuelle et des données web, crée un rapport structuré : \n## 🆔 IDENTIFICATION\n## 📝 BIOGRAPHIE\n## 📍 LOCALISATION\n## 💡 HYPOTHÈSES. Sois très précis." 
          },
          { 
            "role": "user", 
            "content": `ANALYSE VISUELLE : ${raw_vision}\n\nDONNÉES WEB TROUVÉES : ${webData}` 
          }
        ]
      })
    });

    const finalData = await finalRes.json();
    
    return NextResponse.json({ 
        full_report: finalData.choices?.[0]?.message?.content || "Dolphin n'a pas pu générer le rapport.",
        keywords: keywords 
    });

  } catch (error: any) {
    console.error("Dolphin/Crawl Error:", error);
    return NextResponse.json({ 
      full_report: "### ⚠️ ERREUR D'INVESTIGATION\nLe module de recherche a rencontré un problème technique. Vérifiez votre clé API OpenRouter ou la connexion internet.",
      error: error.message 
    }, { status: 500 });
  }
}