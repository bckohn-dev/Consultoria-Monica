// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host');

  if (host === 'mcnimobiliaria.com.br') {
    return NextResponse.redirect('https://www.mcnimobiliaria.com.br', 308);
  }

  return NextResponse.next();
}