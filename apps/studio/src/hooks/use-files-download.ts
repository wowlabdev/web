import { useMemoizedFn } from "ahooks";
import { strToU8, zipSync } from "fflate";

export type DownloadableFile = {
  content: string;
  fileName: string;
};

export function useFilesDownload() {
  const downloadFiles = useMemoizedFn(
    (files: DownloadableFile[], mimeType = "text/plain") => {
      for (const file of files) {
        triggerDownload(file.content, file.fileName, mimeType);
      }
    },
  );

  const downloadZip = useMemoizedFn(
    (files: DownloadableFile[], zipName: string) => {
      if (files.length === 0) {
        return;
      }

      const entries = Object.fromEntries(
        files.map((file) => [file.fileName, strToU8(file.content)]),
      );

      triggerDownload(zipSync(entries), zipName, "application/zip");
    },
  );

  return { downloadFiles, downloadZip };
}

function triggerDownload(data: BlobPart, fileName: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
