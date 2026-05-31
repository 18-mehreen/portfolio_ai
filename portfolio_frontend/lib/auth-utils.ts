import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Gets the current authenticated user from the session.
 * Returns the user object (id, email, name) or null if not authenticated.
 * For use in API routes and server components.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

/**
 * Requires authentication. Returns the user if authenticated,
 * or a 401 NextResponse if not.
 *
 * Usage in API routes:
 * ```
 * const user = await requireAuth();
 * if (user instanceof NextResponse) return user;
 * // user is now typed as { id, email, name }
 * ```
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return user;
}
