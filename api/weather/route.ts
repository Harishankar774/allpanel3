import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const icao = searchParams.get('icao');

  if (!icao) {
    return NextResponse.json({ error: 'ICAO code required' }, { status: 400 });
  }

  try {
    // Using CheckWX API for METAR data (requires API key)
    const apiKey = process.env.CHECKWX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(`https://api.checkwx.com/metar/${icao}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch METAR data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching METAR:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}