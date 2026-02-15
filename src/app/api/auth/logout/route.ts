import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    cookieStore.delete('at26_session');
    return NextResponse.redirect(new URL('/', request.url));
}
