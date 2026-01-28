import { NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    )
  }

  try {
    const { investigations, analysisType } = await request.json()

    if (!investigations || !Array.isArray(investigations)) {
      return NextResponse.json(
        { error: "Investigations array is required" },
        { status: 400 }
      )
    }

    const systemPrompt = `Tu es un analyste OSINT expert specialise dans la correlation de donnees d'investigations. 
Tu analyses les donnees fournies et identifies les connexions, patterns et risques potentiels.
Reponds toujours en francais avec un format structure.`

    const userPrompt = `Analyse les donnees suivantes provenant de plusieurs investigations OSINT et identifie les correlations:

${JSON.stringify(investigations, null, 2)}

Type d'analyse demandee: ${analysisType || "complete"}

Fournis:
1. Un resume executif des correlations trouvees
2. Les entites communes identifiees (personnes, organisations, IPs, domaines)
3. Les liens et connexions entre les investigations
4. Un score de risque global (0-100) avec justification
5. Des recommandations pour approfondir l'enquete
6. Les prochaines etapes suggerees

Format ta reponse de maniere claire et structuree.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://spyosint.vercel.app",
        "X-Title": "SpyOSINT Dashboard",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || `OpenRouter API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    // Extract risk score from content if mentioned
    const riskMatch = content.match(/score[^:]*:\s*(\d+)/i)
    const riskScore = riskMatch ? parseInt(riskMatch[1]) : 50

    return NextResponse.json({
      analysis: content,
      riskScore: Math.min(100, Math.max(0, riskScore)),
      model: data.model,
      usage: data.usage,
    })
  } catch (error) {
    console.error("OpenRouter API error:", error)
    return NextResponse.json(
      { error: "Failed to analyze with OpenRouter" },
      { status: 500 }
    )
  }
}
