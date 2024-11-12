import { useParams } from "next/navigation";
import Quill from "quill";
import { useRef, useState } from "react";

import { createMessage } from "@/actions/messages";
import { Editor } from "@/components/editor";
import { useToast } from "@/hooks/use-toast";

interface Props {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: Props) => {
  const [editorKey, setEditorKey] = useState<number>(0);

  const params = useParams<{ workspaceId: string; channelId: string }>();
  const editorRef = useRef<Quill | null>(null);

  const { mutate, isPending } = createMessage();
  const { toast } = useToast();

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    mutate(
      {
        body,
        workspaceId: params.workspaceId,
        channelId: params.channelId,
      },
      {
        onError: (error) => {
          console.error(error);

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        },
      }
    );

    setEditorKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  );
};
