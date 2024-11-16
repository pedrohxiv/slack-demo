"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { InternalSidebar } from "./_components/internal-sidebar";
import { Sidebar } from "./_components/sidebar";
import { Toolbar } from "./_components/toolbar";

interface Props {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: Props) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className="bg-[#5E2C5F]"
            defaultSize={24.15}
            minSize={14.2}
          >
            <InternalSidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75.85} minSize={24.15}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
