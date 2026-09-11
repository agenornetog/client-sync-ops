import { useAuth } from "@/contexts/AuthContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Tags, 
  Users, 
  ClipboardList, 
  FileText, 
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function AppLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Patrimônios", path: "/patrimonios", icon: Package },
    { name: "Inventários", path: "/inventarios", icon: ClipboardList },
    { name: "Relatórios", path: "/relatorios", icon: FileText },
    // Admin only
    ...(isAdmin ? [
      { name: "Locais", path: "/locais", icon: MapPin },
      { name: "Categorias", path: "/categorias", icon: Tags },
      { name: "Usuários", path: "/usuarios", icon: Users },
    ] : []),
    { name: "Configurações", path: "/configuracoes", icon: Settings },
  ];

  const Navigation = () => (
    <nav className="space-y-1 p-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden border-b p-4 flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="font-bold text-lg">Paróquia</div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 flex flex-col">
            <div className="p-6 border-b">
              <h2 className="font-bold text-xl">Menu</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Navigation />
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full flex justify-start gap-2" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r h-screen sticky top-0">
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl">Inventário Paroquial</h1>
          <p className="text-sm text-muted-foreground capitalize mt-1">
            {profile?.nome || profile?.email} ({profile?.role})
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Navigation />
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full flex justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav - Only core items for quick access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur z-10 flex justify-around p-2 pb-safe">
        {menuItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
