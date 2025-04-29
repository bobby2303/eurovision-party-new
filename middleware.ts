import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware is needed to handle WebSocket connections properly
export function middleware(request: NextRequest) {


  return NextResponse.next()
}

export const config = {
  
}


