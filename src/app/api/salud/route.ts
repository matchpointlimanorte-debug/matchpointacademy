import { NextResponse } from 'next/server'

/** Healthcheck endpoint para Railway y monitorización. */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'Match Point Lima Norte',
    timestamp: new Date().toISOString(),
  })
}
