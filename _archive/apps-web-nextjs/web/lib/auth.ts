// apps/web/lib/auth.ts
// Clerk auth helpers for Route Handlers and Server Components
import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Get the authenticated tenant's orgId (= tenantId in Prisma).
 * Throws 401 if not authenticated.
 */
export function getTenantId(): string {
  const { orgId } = auth();
  if (!orgId) {
    throw new Response('Organization required', { status: 401 });
  }
  return orgId;
}

/**
 * Returns { userId, orgId } or throws 401.
 */
export function requireAuth() {
  const { userId, orgId } = auth();
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return { userId, orgId };
}

export { currentUser };
