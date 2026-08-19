/**
 * Feature: Work Orders
 * Point d'entrée du domaine Work Orders.
 */

export { default as WorkOrdersPage } from '../../pages/WorkOrders';

// Hook offline-first
export { useWorkOrderMutation, useWorkOrders } from '../../hooks/useWorkOrderMutation';
