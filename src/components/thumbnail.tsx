import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: Props) => {
  if (!url) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-h-xs max-w-xs border rounded-lg my-2 cursor-zoom-in">
          <img
            alt="Message image"
            className="rounded-md object-cover size-full"
            src={url}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-xl max-w-xl border-none bg-transparent p-0 shadow-none">
        <img
          alt="Message image"
          className="rounded-md object-cover size-full"
          src={url}
        />
      </DialogContent>
    </Dialog>
  );
};
