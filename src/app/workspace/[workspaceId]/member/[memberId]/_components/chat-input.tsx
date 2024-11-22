import { useParams } from "next/navigation";
import Quill from "quill";
import { useRef, useState } from "react";

import { createMessage } from "@/actions/messages";
import { generateUploadUrl } from "@/actions/upload";
import { Editor } from "@/components/editor";
import { useToast } from "@/hooks/use-toast";

interface Props {
  placeholder: string;
  conversationId: string;
}

export const ChatInput = ({ placeholder, conversationId }: Props) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [editorKey, setEditorKey] = useState<number>(0);

  const params = useParams<{ workspaceId: string; memberId: string }>();
  const editorRef = useRef<Quill | null>(null);

  const { mutate: generateUploadUrlMutate } = generateUploadUrl();
  const { mutate: createMessageMutate } = createMessage();
  const { toast } = useToast();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);

      editorRef.current?.enable(false);

      const values: {
        body: string;
        image?: string;
        workspaceId: string;
        conversationId?: string;
      } = {
        body,
        image: undefined,
        workspaceId: params.workspaceId,
        conversationId,
      };

      if (image) {
        const url = await generateUploadUrlMutate({ throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessageMutate(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsPending(false);

      editorRef.current?.enable(true);
    }
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
