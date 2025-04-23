import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URLが指定されていません' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    const title = $('meta[property="og:title"]').attr('content') || $('title').text()
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')
    const image = $('meta[property="og:image"]').attr('content')

    return NextResponse.json({
      title,
      description,
      image,
      url
    })
  } catch (error) {
    console.error('OGPデータの取得に失敗しました:', error)
    return NextResponse.json({ error: 'OGPデータの取得に失敗しました' }, { status: 500 })
  }
} 