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
            defaultSize={20}
            minSize={15}
          >
            <InternalSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={30}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
