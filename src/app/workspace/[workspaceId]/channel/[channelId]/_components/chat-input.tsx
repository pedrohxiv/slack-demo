import Quill from "quill";
import { useRef } from "react";

import { Editor } from "@/components/editor";

interface Props {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: Props) => {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="px-5 w-full">
      <Editor
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
        placeholder={placeholder}
        variant="update"
      />
    </div>
  );
};
