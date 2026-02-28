import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  CreditCard,
  Settings,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './ui/sidebar';
import { mockDoctorProfile } from '../data/mockData';
import { useTheme } from 'next-themes';
import { useAuth } from '../hooks/useAuth';


interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const subscription = mockDoctorProfile.subscription;

  const navItems = [
    { path: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/doctor/patients', icon: Users, label: 'Patients' },
    { path: '/doctor/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/doctor/reports', icon: FileText, label: 'Reports' },
    { path: '/doctor/billing', icon: CreditCard, label: 'Billing' },
    { path: '/doctor/settings', icon: Settings, label: 'Settings' },
  ];

  const getBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'PRO':
        return 'default';
      case 'STARTER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="offcanvas">
        <SidebarHeader className="px-2 pt-2">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="grid size-9 place-items-center rounded-xl shadow-sm bg-white overflow-hidden">
              <img src="/nirog-logo.png" alt="Nirog Ai" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold">Nirog Ai</span>
                <Badge
                  variant={getBadgeVariant(subscription.plan)}
                  className="h-5 px-2 text-[10px]"
                >
                  {subscription.plan}
                </Badge>
              </div>
              <span className="truncate text-xs text-muted-foreground">
                Doctor workspace
              </span>
            </div>
          </div>
          <SidebarTrigger className="hidden md:inline-flex" />
          <Separator className="my-2" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="space-y-2 p-2">
            <div className="rounded-lg bg-sidebar-accent/40 px-3 py-2">
              <p className="text-xs font-semibold truncate">{user?.name || mockDoctorProfile.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.position || mockDoctorProfile.specialty}
              </p>
              {user?.qualification && (
                <p className="text-xs text-muted-foreground/70 truncate">{user.qualification}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-full justify-start"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              {isDark ? 'Light mode' : 'Dark mode'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => { logout(); navigate('/'); }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/70 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-1 items-center justify-between">
            <div className="text-sm font-medium text-foreground/90">
              Nirog Ai
            </div>
            <div className="flex items-center gap-2" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
