'use client';

import OrderListWithFilters from "@/components/dashboard/orders/OrderListWithFilters";
import NuevaOrden from "@/components/dashboard/modals/NuevaOrden";
import { useMyRequests, useMyDeliveries } from '@/hooks/use-orders';
import usePermissions from '@/hooks/use-permissions';

export default function OrdersPageClient({ dictionary }) {
  const dictionaryDashboard = dictionary.DashboardPage;
  const { canReceive, canDeliver } = usePermissions();

  // Fetch statistics
  const { data: myRequests } = useMyRequests();
  const { data: myDeliveries } = useMyDeliveries();

  // Calculate stats
  const stats = {
    totalOrders: (myRequests?.count || 0) + (myDeliveries?.count || 0),
    requests: myRequests?.count || 0,
    deliveries: myDeliveries?.count || 0,
    pendingOrders: myRequests?.results?.filter(o => o.status === 1).length || 0,
    activeDeliveries: myDeliveries?.results?.filter(o => o.status === 4 || o.status === 5).length || 0
  };

  return (
    <main className="mt-28 p-4 sm:p-6 bg-slate-300 min-h-screen">
      <section className="flex flex-col gap-5 lg:grid xl:grid-cols-7">
        <article className="bg-white p-5 rounded-xl lg:grid xl:col-span-6">
          <div>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-yellow-200 inline-block">
                {dictionaryDashboard.OrdersPage.Title}
              </h1>
              {canReceive && (
                <NuevaOrden dict={dictionaryDashboard.Home.DataTablesHome} />
              )}
            </header>

            <OrderListWithFilters
              dictionary={dictionaryDashboard.Home.DataTablesHome}
            />
          </div>
        </article>

        {/* Stats Cards */}
        <div className="flex flex-col gap-4">
          {/* Total Orders Card */}
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{dictionaryDashboard.OrdersPage.Cards.Orders.Title}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            {canReceive && (
              <p className="text-xs text-gray-500 mt-2">
                {stats.pendingOrders} pending
              </p>
            )}
          </div>

          {/* Requests Card (for receivers) */}
          {canReceive && (
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{dictionaryDashboard.OrdersPage.Cards.Requests.Title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.requests}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Deliveries Card (for deliverers) */}
          {canDeliver && (
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">My Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.deliveries}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {stats.activeDeliveries > 0 && (
                <p className="text-xs text-orange-600 mt-2">
                  {stats.activeDeliveries} active
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
