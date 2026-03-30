import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inbox': 'Inbox',
  '/contatos': 'Contatos',
  '/tags': 'Tags',
  '/respostas-rapidas': 'Respostas Rápidas',
  '/fluxos': 'Fluxos',
  '/canais': 'Canais',
  '/grupos': 'Grupos',
  '/relatorios': 'Relatórios',
  '/configuracoes': 'Configurações',
};

export function AppLayout() {
  const location = useLocation();
  const isInbox = location.pathname === '/inbox';
  const title = pageTitles[location.pathname] || '';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - hidden on inbox for full-height experience */}
          {!isInbox && (
            <header className="h-14 flex items-center justify-between border-b bg-card px-4 gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground">
                  <Menu className="h-4 w-4" />
                </SidebarTrigger>
                {title && <h1 className="text-lg font-semibold">{title}</h1>}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar... (Ctrl+K)"
                    className="w-64 pl-9 h-9 bg-muted/50 border-0"
                  />
                </div>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground px-1">3</span>
                </Button>
              </div>
            </header>
          )}
          <main className={isInbox ? "flex-1 min-h-0" : "flex-1 overflow-auto"}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
