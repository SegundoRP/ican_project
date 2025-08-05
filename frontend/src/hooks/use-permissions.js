import { useSelector } from 'react-redux';
import {
  canReceiveOrders,
  canDeliverOrders,
  isAvailableForDelivery,
  hasCompleteProfile,
  canAcceptOrder,
  canCancelOrder,
  canCompleteOrder,
  canRateOrder,
  needsProfileCompletion,
  getUserDisplayName,
  getRoleDisplayName
} from '@/utils/permissions';

/**
 * Hook for accessing user permissions and role-based features
 * @returns {Object} Permission helpers and user info
 */
export default function usePermissions() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return {
    // User state
    user,
    isAuthenticated,

    // Basic permissions
    canReceive: canReceiveOrders(user),
    canDeliver: canDeliverOrders(user),
    isAvailable: isAvailableForDelivery(user),
    hasProfile: hasCompleteProfile(user),
    needsProfile: needsProfileCompletion(user),

    // Display helpers
    displayName: getUserDisplayName(user),
    roleDisplay: getRoleDisplayName(user?.role),

    // Order-specific permissions (require order parameter)
    canAcceptOrder: (order) => canAcceptOrder(user, order),
    canCancelOrder: (order) => canCancelOrder(user, order),
    canCompleteOrder: (order) => canCompleteOrder(user, order),
    canRateOrder: (order) => canRateOrder(user, order),

    // Utility checks
    isReceiver: user?.role === 'RECEIVER',
    isDeliverer: user?.role === 'DELIVERER',
    isBoth: user?.role === 'RECEIVER_AND_DELIVERER',

    // User details
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || null,
    department: user?.department || null,
    condominium: user?.department?.condominium || null,
    rating: user?.rating || 0,
    totalReviews: user?.total_reviews || 0,
  };
}
