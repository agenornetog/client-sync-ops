import {
  LayoutDashboard, MessageSquare, Users, Tags, Zap, GitBranch,
  Radio, UsersRound, BarChart3, Settings
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const mainNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Inbox', url: '/inbox', icon: MessageSquare, badge: 6 },
  { title: 'Contatos', url: '/contatos', icon: Users },
  { title: 'Tags', url: '/tags', icon: Tags },
  { title: 'Respostas Rápidas', url: '/respostas-rapidas', icon: Zap },
  { title: 'Fluxos', url: '/fluxos', icon: GitBranch },
  { title: 'Canais', url: '/canais', icon: Radio },
  { title: 'Grupos', url: '/grupos', icon: UsersRound },
  { title: 'Relatórios', url: '/relatorios', icon: BarChart3 },
];

const bottomNav = [
  { title: 'Configurações', url: '/configuracoes', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="w-[60px] shrink-0 h-screen flex flex-col items-center py-4 border-r bg-background">
        {/* Logo */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm mb-6">
          A
        </div>

        {/* Main nav */}
        <nav className="flex-1 flex flex-col items-center gap-1">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/');
            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.url}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.badge && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground px-1">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="flex flex-col items-center gap-1 mb-2">
          {bottomNav.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.url}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Avatar */}
          <div className="mt-2 h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            AS
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
