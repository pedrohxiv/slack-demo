import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

import { api } from "../../convex/_generated/api";

type Options = {
  onSuccess?: (data: string | null) => void;
  onError?: (error: Error) => void;
  throwError?: boolean;
};

export const generateUploadUrl = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useMutation(api.upload.generateUploadUrl);

  const mutate = useCallback(
    async (options?: Options) => {
      try {
        setIsPending(true);

        const response = await mutation();

        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setIsPending(false);
      }
    },
    [mutation]
  );

  return { mutate, isPending };
};
