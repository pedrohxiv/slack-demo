import { ALargeSmall, ImageIcon, SendHorizonal, Smile, X } from "lucide-react";
import Image from "next/image";
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

import { EmojiPopover } from "@/components/emoji-popover";
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
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);
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

  const onEmojiSelect = (emoji: string) => {
    const quill = quillRef.current;

    quill?.insertText(quill.getSelection()?.index || 0, emoji);
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
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) {
                  return;
                }

                const body = JSON.stringify(quill.getContents());

                submitRef.current({ body, image: addedImage });
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

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        accept="image/*"
        className="hidden"
        onChange={(e) => setImage(e.target.files![0])}
        ref={imageElementRef}
        type="file"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          {
            "opacity-50": disabled,
          }
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                >
                  <X className="size-3.5" />
                </button>
              </Hint>
              <Image
                alt="Uploaded"
                className="rounded-xl overflow-hidden border object-cover"
                fill
                src={URL.createObjectURL(image)}
              />
            </div>
          </div>
        )}
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
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="sm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                onClick={() => imageElementRef.current?.click()}
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
                onClick={onCancel}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#007A5A] hover:bg-[#007A5A]/80 text-white"
                disabled={disabled || isEmpty}
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
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
              onClick={() =>
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                })
              }
              size="sm"
            >
              <SendHorizonal className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === "create" && (
        <p
          className={cn(
            "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
            {
              "opacity-100": !isEmpty,
            }
          )}
        >
          <strong className="mr-1">Shift + Return</strong>to add a new line
        </p>
      )}
    </div>
  );
};
