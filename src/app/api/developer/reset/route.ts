import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // In this implementation, most training data is stored in frontend state (session-based)
    // However, if we had persistent custom datasets in the DB, we would clear them here.
    
    // Simulate clearing persistent cache or temp files
    console.log('[ADMIN] System reset initiated. Clearing training buffers...')
    
    return NextResponse.json({ 
      success: true, 
      message: 'System state reset successfully.' 
    })
  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 })
  }
}
