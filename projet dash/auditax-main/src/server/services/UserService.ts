import { prisma } from '../../lib/prisma';

export class UserService {
  /**
   * Syncs user details from Clerk to our local PostgreSQL DB.
   */
  static async syncUser(clerkId: string, email: string, firstName?: string, lastName?: string) {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      // Find or create default organization (for multi-tenant setups, this would be dynamic)
      let defaultOrg = await prisma.organization.findFirst();
      if (!defaultOrg) {
        defaultOrg = await prisma.organization.create({
          data: {
            name: 'AuditMaster Enterprise',
            domain: 'auditmaster.io'
          }
        });
      }

      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          organizationId: defaultOrg.id,
          role: 'AUDITOR' // Default role
        }
      });
    } else {
      user = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          firstName,
          lastName
        }
      });
    }

    return user;
  }

  static async getUserProfile(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        organization: true,
        assignedTasks: true
      }
    });
  }
}
