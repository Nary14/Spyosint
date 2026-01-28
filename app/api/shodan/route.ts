import { NextRequest, NextResponse } from "next/server"

const SHODAN_API_KEY = process.env.SHODAN_API_KEY

export async function POST(request: NextRequest) {
  if (!SHODAN_API_KEY) {
    return NextResponse.json(
      { error: "Shodan API key not configured" },
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

    switch (type) {
      case "ip":
        endpoint = `https://api.shodan.io/shodan/host/${value}?key=${SHODAN_API_KEY}`
        break
      case "domain":
        endpoint = `https://api.shodan.io/dns/domain/${value}?key=${SHODAN_API_KEY}`
        break
      case "search":
        endpoint = `https://api.shodan.io/shodan/host/search?key=${SHODAN_API_KEY}&query=${encodeURIComponent(value)}`
        break
      default:
        return NextResponse.json(
          { error: "Invalid type. Use: ip, domain, or search" },
          { status: 400 }
        )
    }

    const response = await fetch(endpoint)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || `Shodan API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Format response based on type
    if (type === "ip") {
      return NextResponse.json({
        ip: data.ip_str,
        organization: data.org,
        isp: data.isp,
        asn: data.asn,
        country: data.country_name,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        hostnames: data.hostnames || [],
        ports: data.ports || [],
        vulns: data.vulns || [],
        lastUpdate: data.last_update,
        services: (data.data || []).map((service: any) => ({
          port: service.port,
          protocol: service.transport,
          product: service.product,
          version: service.version,
          banner: service.data?.substring(0, 200),
          cpe: service.cpe || [],
        })),
        os: data.os,
        tags: data.tags || [],
      })
    } else if (type === "domain") {
      return NextResponse.json({
        domain: data.domain,
        subdomains: data.subdomains || [],
        records: {
          A: data.data?.filter((r: any) => r.type === "A").map((r: any) => r.value) || [],
          AAAA: data.data?.filter((r: any) => r.type === "AAAA").map((r: any) => r.value) || [],
          MX: data.data?.filter((r: any) => r.type === "MX").map((r: any) => r.value) || [],
          NS: data.data?.filter((r: any) => r.type === "NS").map((r: any) => r.value) || [],
          TXT: data.data?.filter((r: any) => r.type === "TXT").map((r: any) => r.value) || [],
          CNAME: data.data?.filter((r: any) => r.type === "CNAME").map((r: any) => r.value) || [],
        },
        tags: data.tags || [],
      })
    } else {
      return NextResponse.json({
        total: data.total,
        matches: (data.matches || []).slice(0, 20).map((match: any) => ({
          ip: match.ip_str,
          port: match.port,
          organization: match.org,
          country: match.location?.country_name,
          product: match.product,
          version: match.version,
          hostnames: match.hostnames || [],
        })),
      })
    }
  } catch (error) {
    console.error("Shodan API error:", error)
    return NextResponse.json(
      { error: "Failed to query Shodan" },
      { status: 500 }
    )
  }
}
