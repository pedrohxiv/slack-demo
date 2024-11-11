import { ALargeSmall, ImageIcon, SendHorizonal, Smile } from "lucide-react";
import Quill, { type QuillOptions } from "quill";
import type { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";
import {
  type MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: ({ image, body }: { image: File | null; body: string }) => void;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  onCancel?: () => void;
  placeholder?: string;
  variant?: "create" | "update";
}

export const Editor = ({
  onSubmit,
  defaultValue = [],
  disabled = false,
  innerRef,
  onCancel,
  placeholder = "Writing something...",
  variant = "create",
}: Props) => {
  const [text, setText] = useState<string>("");
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const submitRef = useRef(onSubmit);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const placeholderRef = useRef(placeholder);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);

    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
    placeholderRef.current = placeholder;
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);

    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);

    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = "";
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              onClick={toggleToolbar}
              size="sm"
              variant="ghost"
            >
              <ALargeSmall className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={disabled}
              onClick={() => {}}
              size="sm"
              variant="ghost"
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                onClick={() => {}}
                size="sm"
                variant="ghost"
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                disabled={disabled}
                onClick={() => {}}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#007A5A] hover:bg-[#007A5A]/80 text-white"
                disabled={disabled || isEmpty}
                onClick={() => {}}
                size="sm"
                variant="outline"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-muted-foreground"
                  : "bg-[#007A5A] hover:bg-[#007A5A]/80 text-white"
              )}
              disabled={disabled || isEmpty}
              onClick={() => {}}
              size="sm"
            >
              <SendHorizonal className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <p className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <strong className="">Shift + Return</strong> to add a new line
      </p>
    </div>
  );
};
