import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET as string

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    // Valida contra variables de entorno o base de datos
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' })

      const res = NextResponse.json({ success: true })
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hora
      })

      return res
    }

    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ error: 'Error en autenticación' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // elimina cookie
  })
  return res
}
