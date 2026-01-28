import { NextRequest, NextResponse } from "next/server"

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY

export async function POST(request: NextRequest) {
  if (!VIRUSTOTAL_API_KEY) {
    return NextResponse.json(
      { error: "VirusTotal API key not configured" },
      { status: 500 }
    )
  }

  try {
    const { type, value } = await request.json()

    if (!type || !value) {
      return NextResponse.json(
        { error: "Type and value are required" },
        { status: 400 }
      )
    }

    let endpoint = ""
    let method = "GET"
    let body: string | undefined

    switch (type) {
      case "url":
        // URL needs to be base64 encoded
        const urlId = Buffer.from(value).toString("base64").replace(/=/g, "")
        endpoint = `https://www.virustotal.com/api/v3/urls/${urlId}`
        break
      case "domain":
        endpoint = `https://www.virustotal.com/api/v3/domains/${value}`
        break
      case "ip":
        endpoint = `https://www.virustotal.com/api/v3/ip_addresses/${value}`
        break
      case "hash":
        endpoint = `https://www.virustotal.com/api/v3/files/${value}`
        break
      default:
        return NextResponse.json(
          { error: "Invalid type. Use: url, domain, ip, or hash" },
          { status: 400 }
        )
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        "x-apikey": VIRUSTOTAL_API_KEY,
        "Content-Type": "application/json",
      },
      body,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || `VirusTotal API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const attributes = data.data?.attributes || {}
    const stats = attributes.last_analysis_stats || {}
    const results = attributes.last_analysis_results || {}

    // Format the response
    const formattedResponse = {
      type,
      value,
      reputation: attributes.reputation,
      stats: {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        timeout: stats.timeout || 0,
      },
      totalEngines: Object.keys(results).length,
      detections: Object.entries(results)
        .filter(([_, result]: [string, any]) => 
          result.category === "malicious" || result.category === "suspicious"
        )
        .map(([engine, result]: [string, any]) => ({
          engine,
          category: result.category,
          result: result.result,
        })),
      lastAnalysisDate: attributes.last_analysis_date
        ? new Date(attributes.last_analysis_date * 1000).toISOString()
        : null,
      // Additional info based on type
      ...(type === "domain" && {
        registrar: attributes.registrar,
        creation_date: attributes.creation_date,
        last_update_date: attributes.last_update_date,
      }),
      ...(type === "ip" && {
        country: attributes.country,
        asn: attributes.asn,
        as_owner: attributes.as_owner,
        network: attributes.network,
      }),
      ...(type === "hash" && {
        meaningful_name: attributes.meaningful_name,
        type_description: attributes.type_description,
        size: attributes.size,
        sha256: attributes.sha256,
        md5: attributes.md5,
      }),
    }

    return NextResponse.json(formattedResponse)
  } catch (error) {
    console.error("VirusTotal API error:", error)
    return NextResponse.json(
      { error: "Failed to query VirusTotal" },
      { status: 500 }
    )
  }
}
