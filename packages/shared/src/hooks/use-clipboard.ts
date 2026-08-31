import { useBoolean, useMemoizedFn, useTimeout } from "ahooks";

export function useClipboard(timeout = 2000) {
  const [copied, { setFalse: clearCopied, setTrue: setCopied }] =
    useBoolean(false);

  useTimeout(clearCopied, copied ? timeout : undefined);

  const copy = useMemoizedFn(async (text: string) => {
    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied();
  });

  return { copied, copy };
}
