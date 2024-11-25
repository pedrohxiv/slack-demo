"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePanel } from "@/hooks/use-panel";

import { InternalSidebar } from "./_components/internal-sidebar";
import { Profile } from "./_components/profile";
import { Sidebar } from "./_components/sidebar";
import { Thread } from "./_components/thread";
import { Toolbar } from "./_components/toolbar";

interface Props {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: Props) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className="bg-[#5E2C5F]"
            defaultSize={24.15}
            minSize={20}
          >
            <InternalSidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75.85} minSize={24.15}>
            {children}
          </ResizablePanel>
          {(!!parentMessageId || !!profileMemberId) && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={24.15} minSize={20}>
                {parentMessageId ? (
                  <Thread messageId={parentMessageId} onClose={onClose} />
                ) : profileMemberId ? (
                  <Profile memberId={profileMemberId} onClose={onClose} />
                ) : null}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
