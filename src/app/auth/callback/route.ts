import { createClient } from '@supabase/supabase-js'; // Import createClient for server-side
import { NextResponse, NextRequest } from 'next/server';

// Ensure you use your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY here
// as this route will interact with Supabase client-side for session setting,
// even though it's technically a server route, it simulates client behavior.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize a *separate* Supabase client for this server-side route
// This client can operate in a context where it receives the URL parameters.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next'); // This is the URL we want to redirect to after processing

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any, // Cast to any because verifyOtp type expects 'email' | 'phone'
    });

    if (!error) {
      // If verification is successful, Supabase should have set the session.
      // Now, redirect the user to the intended 'next' page.
      if (next) {
        return NextResponse.redirect(new URL(next, request.url));
      } else {
        // Fallback if 'next' is not provided, typically to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      console.error("Error verifying OTP:", error);
      // Redirect to an error page or login page with an error message
      return NextResponse.redirect(new URL(`/login?error=${error.message}`, request.url));
    }
  }

  // If no token_hash or type, redirect to login or an error page
  return NextResponse.redirect(new URL('/login', request.url));
}
