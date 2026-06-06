import { AppSidebar } from "@/components/app-sidebar";
import { AppProvider } from "@/app/context/app-context";
import { FooterNav } from "@/components/FooterNav";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ title, description, children }) {
  return (
    <SidebarProvider>
      <AppProvider>
        <AppSidebar />
        <SidebarInset className="h-svh min-w-0 overflow-hidden">
          <SiteHeader title={title} description={description} />
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-20 md:pb-0">
            {children}
          </div>
          <FooterNav />
        </SidebarInset>
      </AppProvider>
    </SidebarProvider>
  );
}
