import { AppSidebar } from './AppSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AppLayout() {
  const location = useLocation();
  const isInbox = location.pathname === '/inbox';

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — clean search strip */}
        {!isInbox && (
          <header className="h-14 flex items-center justify-between px-6 border-b bg-background shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar qualquer coisa..."
                className="pl-10 h-9 bg-muted/50 border-0 rounded-lg text-sm placeholder:text-muted-foreground/70"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-[18px] w-[18px] text-muted-foreground" />
                <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-xs font-medium">AS</AvatarFallback>
              </Avatar>
            </div>
          </header>
        )}
        <main className={isInbox ? "flex-1 min-h-0" : "flex-1 overflow-auto"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
