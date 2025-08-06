"use client";

import { Navbar, Dropdown, Breadcrumb, Avatar } from "flowbite-react";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineUserGroup,
  HiLogout,
  HiOutlineTruck,
} from "react-icons/hi";
import { logout as setLogout } from "@/redux/features/authSlice";
import { useLogoutMutation } from '@/redux/features/authApiSlice';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useCurrentUser } from '@/hooks/use-users';
import usePermissions from '@/hooks/use-permissions';

export default function MenuDashboard({dictDashboard}) {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { canDeliver, displayName } = usePermissions();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(setLogout());
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 justify-between items-center">
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="">
          <span className="text-blue-700 text-xl font-bold ">
            Dashboard Logo
          </span>
        </Navbar.Brand>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="avatar_user"
              img="https://unavatar.io/segundorp"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm font-bold">{displayName}</span>
            <span className="block truncate text-sm font-medium">
              {currentUser?.email || 'Loading...'}
            </span>
          </Dropdown.Header>
          <Dropdown.Item icon={HiOutlineChartBar} href="/dashboard">
            {dictDashboard.Menu.Dropdown.Dashboard}
          </Dropdown.Item>
          <Dropdown.Item icon={HiOutlineShoppingCart} href="/dashboard/ordenes">
            {dictDashboard.Menu.Dropdown.Orders}
          </Dropdown.Item>
          {canDeliver && (
            <Dropdown.Item icon={HiOutlineTruck} href="/dashboard/available-orders">
              Available Orders
            </Dropdown.Item>
          )}
          <Dropdown.Item icon={HiOutlineUserGroup} href="/dashboard/repartidevs">
            {dictDashboard.Menu.Dropdown.Repartidevs}
          </Dropdown.Item>
          <Dropdown.Item icon={HiOutlineUser} href="/dashboard/profile">
            My Profile
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={HiLogout} className="text-red-500" onClick={handleLogout}>
            {dictDashboard.Menu.Dropdown.Logout}
          </Dropdown.Item>
        </Dropdown>
      </Navbar>

      <div className="flex justify-center bg-white sm:flex sm:justify-start sm:pl-16 pb-4">
        <Breadcrumb aria-label="Default breadcrumb example">
          <Breadcrumb.Item href="/dashboard" icon={HiOutlineHome}>
          {dictDashboard.Menu.Breadcrumb.Home}
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/dashboard" icon={HiOutlineChartBar}>
          {dictDashboard.Menu.Breadcrumb.Dashboard}
          </Breadcrumb.Item>
          <Breadcrumb.Item href="" icon={HiOutlineUser}>
          {dictDashboard.Menu.Breadcrumb.User}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
}
