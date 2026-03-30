import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    // Simulation d'une recherche Google avec un User-Agent pro
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=5`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const links: string[] = [];

    // Extraction des URLs des résultats de recherche
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/url?q=')) {
        const cleanLink = href.split('/url?q=')[1].split('&')[0];
        // On ignore les liens internes Google
        if (!cleanLink.includes('google.com') && !cleanLink.includes('support.google')) {
          links.push(decodeURIComponent(cleanLink));
        }
      }
    });

    // Retourne les 3 meilleurs liens
    return NextResponse.json({ links: [...new Set(links)].slice(0, 3) });

  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Échec de la recherche" }, { status: 500 });
  }
}