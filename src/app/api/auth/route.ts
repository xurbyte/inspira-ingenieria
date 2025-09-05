import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'asdasd123'
    
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 })
    }
    
  } catch (error) {
    console.error('Error in authentication:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
