import { NextRequest, NextResponse } from 'next/server'
import { MovieService } from '@/services'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const { data } = await MovieService.searchMovie(query)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching anime:', error)
    return NextResponse.json({ error: 'Failed to search anime' }, { status: 500 })
  }
}

