import Menu from "@/components/dashboard/menu/Menu"

export default function Layout({ children }) {
    return (
        <main className="">
            <Menu/>
              {children}
        </main>
    );
  }