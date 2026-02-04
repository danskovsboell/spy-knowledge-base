import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../../lib/supabase'

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return !!(authHeader && serviceKey && authHeader === `Bearer ${serviceKey}`)
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

  const { data, error } = await supabase
    .from('glossary')
    .select('id, term, language_code, translation, context')
    .order('term')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ terms: data })
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

  const body = await request.json()
  const { term, language_code, translation, context } = body

  if (!term || !language_code || !translation) {
    return NextResponse.json({ error: 'term, language_code, and translation are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('glossary')
    .upsert(
      { term, language_code, translation, context: context || null },
      { onConflict: 'term,language_code' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, term: data })
}

export async function DELETE(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase.from('glossary').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
