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

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const status = searchParams.get('status')

  let query = supabase
    .from('translation_jobs')
    .select(`
      id, article_id, source_language, target_language, status, model,
      tokens_used, cost_usd, error_message, started_at, completed_at, created_at,
      kb_articles(slug)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Compute summary stats
  const stats = {
    total: data?.length || 0,
    completed: data?.filter(j => j.status === 'completed').length || 0,
    failed: data?.filter(j => j.status === 'failed').length || 0,
    inProgress: data?.filter(j => j.status === 'in_progress').length || 0,
    totalTokens: data?.reduce((sum, j) => sum + (j.tokens_used || 0), 0) || 0,
  }

  return NextResponse.json({ jobs: data, stats })
}
