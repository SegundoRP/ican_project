/**
 * Permission helper functions for role-based access control
 */

/**
 * Check if user can receive orders
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const canReceiveOrders = (user) => {
  if (!user || !user.role) return false;
  return user.role === 'RECEIVER' || user.role === 'RECEIVER_AND_DELIVERER';
};

/**
 * Check if user can deliver orders
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const canDeliverOrders = (user) => {
  if (!user || !user.role) return false;
  return user.role === 'DELIVERER' || user.role === 'RECEIVER_AND_DELIVERER';
};

/**
 * Check if user is available for delivery
 * @param {Object} user - User object with role and availability properties
 * @returns {boolean}
 */
export const isAvailableForDelivery = (user) => {
  if (!canDeliverOrders(user)) return false;
  return user.is_available_for_delivery === true;
};

/**
 * Check if user has completed profile setup
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const hasCompleteProfile = (user) => {
  if (!user) return false;

  // Check required fields
  const requiredFields = [
    'first_name',
    'last_name',
    'email',
    'role',
    'department'
  ];

  return requiredFields.every(field => {
    const value = user[field];
    if (field === 'department') {
      return value && value.id;
    }
    return value && value !== '';
  });
};

/**
 * Check if user can accept a specific order
 * @param {Object} user - User object
 * @param {Object} order - Order object
 * @returns {boolean}
 */
export const canAcceptOrder = (user, order) => {
  if (!canDeliverOrders(user)) return false;
  if (!isAvailableForDelivery(user)) return false;
  if (!order) return false;

  // Check order status
  if (order.status !== 'PENDING') return false;

  // Check if user is not the receiver
  if (order.receiver && order.receiver.id === user.id) return false;

  // Check if order is in same condominium
  if (user.department && order.receiver_department) {
    const userCondominiumId = user.department.condominium?.id;
    const orderCondominiumId = order.receiver_department.condominium?.id;

    if (userCondominiumId !== orderCondominiumId) return false;
  }

  return true;
};

/**
 * Check if user can cancel an order
 * @param {Object} user - User object
 * @param {Object} order - Order object
 * @returns {boolean}
 */
export const canCancelOrder = (user, order) => {
  if (!user || !order) return false;

  // Receiver can cancel their own pending orders
  if (order.receiver && order.receiver.id === user.id) {
    return order.status === 'PENDING' || order.status === 'ACCEPTED';
  }

  // Deliverer can cancel accepted orders they're delivering
  if (order.deliverer && order.deliverer.id === user.id) {
    return order.status === 'ACCEPTED';
  }

  return false;
};

/**
 * Check if user can complete an order
 * @param {Object} user - User object
 * @param {Object} order - Order object
 * @returns {boolean}
 */
export const canCompleteOrder = (user, order) => {
  if (!user || !order) return false;

  // Only deliverer can complete an order
  if (order.deliverer && order.deliverer.id === user.id) {
    return order.status === 'IN_PROGRESS';
  }

  return false;
};

/**
 * Check if user can rate an order
 * @param {Object} user - User object
 * @param {Object} order - Order object
 * @returns {boolean}
 */
export const canRateOrder = (user, order) => {
  if (!user || !order) return false;

  // Only receiver can rate a completed order
  if (order.receiver && order.receiver.id === user.id) {
    return order.status === 'COMPLETED' && !order.review;
  }

  return false;
};

/**
 * Get user display name
 * @param {Object} user - User object
 * @returns {string}
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';

  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }

  if (user.first_name) {
    return user.first_name;
  }

  if (user.email) {
    return user.email.split('@')[0];
  }

  return 'User';
};

/**
 * Get role display name
 * @param {string} role - Role constant
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    'RECEIVER': 'Receiver',
    'DELIVERER': 'Repartidev',
    'RECEIVER_AND_DELIVERER': 'Receiver & Repartidev'
  };

  return roleNames[role] || 'Unknown Role';
};

/**
 * Get order status display name
 * @param {string} status - Order status constant
 * @returns {string}
 */
export const getOrderStatusDisplayName = (status) => {
  const statusNames = {
    'PENDING': 'Pending',
    'ACCEPTED': 'Accepted',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  };

  return statusNames[status] || 'Unknown';
};

/**
 * Get order status color class
 * @param {string} status - Order status constant
 * @returns {string}
 */
export const getOrderStatusColor = (status) => {
  const statusColors = {
    'PENDING': 'text-yellow-600 bg-yellow-50',
    'ACCEPTED': 'text-blue-600 bg-blue-50',
    'IN_PROGRESS': 'text-purple-600 bg-purple-50',
    'COMPLETED': 'text-green-600 bg-green-50',
    'CANCELLED': 'text-red-600 bg-red-50'
  };

  return statusColors[status] || 'text-gray-600 bg-gray-50';
};

/**
 * Check if user needs to complete profile
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const needsProfileCompletion = (user) => {
  if (!user) return false;

  // Check if missing department information
  if (!user.department || !user.department.id) {
    return true;
  }

  // Check if missing role
  if (!user.role) {
    return true;
  }

  // Check if missing basic info
  if (!user.first_name || !user.last_name) {
    return true;
  }

  return false;
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string}
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (includeTime) {
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
