import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MOCK_SCENARIOS } from "@/data/mock-scenarios";
import { Layers, Upload, Github } from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="sidebar-header-block">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">SmartPlayer</span>
            <span className="sidebar-brand-tagline">LMS Content Engine</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Scenarios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MOCK_SCENARIOS.map((scenario) => {
                const href = `/scenario/${scenario.id}`;
                const isActive = location === href;
                return (
                  <SidebarMenuItem key={scenario.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={`sidebar-scenario-${scenario.id}`}
                    >
                      <Link href={href}>
                        <span className="scenario-icon">{scenario.icon}</span>
                        <div className="scenario-info">
                          <span className="scenario-name">{scenario.name}</span>
                          <span className="scenario-desc">{scenario.description}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/upload"} data-testid="sidebar-upload">
                  <Link href="/upload">
                    <Upload className="w-4 h-4" />
                    <span>Load JSON</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="sidebar-footer-block">
        <div className="sidebar-footer-inner">
          <Github className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="sidebar-footer-text">Agentic LMS Player v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
