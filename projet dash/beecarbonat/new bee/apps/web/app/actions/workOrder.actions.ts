"use server";

import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createWorkOrder(data: {
  title: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assetId?: string;
}) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error('Non autorisé');
  }

  if (!orgId) {
    throw new Error('Organisation requise');
  }

  const wo = await prisma.workOrder.create({
    data: {
      ...data,
      tenantId: orgId,
    },
  });

  revalidatePath('/work-orders');
  return wo;
}

export async function updateWorkOrderStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error('Non autorisé');
  }

  const wo = await prisma.workOrder.update({
    where: {
      id,
      tenantId: orgId,
    },
    data: {
      status,
    }
  });

  revalidatePath('/work-orders');
  return wo;
}

export async function deleteWorkOrder(id: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error('Non autorisé');
  }

  await prisma.workOrder.delete({
    where: {
      id,
      tenantId: orgId,
    }
  });

  revalidatePath('/work-orders');
}
