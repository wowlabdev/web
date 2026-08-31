import type { ResultExportDto } from "wowlab-common";

type CommonModule = typeof import("wowlab-common");

export function decodeResultExport(
  common: CommonModule,
  encoded: string,
): ResultExportDto {
  return common.parcelDecodeResultExport(encoded);
}

// Output stays within base64 + prefix/dot/type tokens so it survives chat/Discord/forum paste.
export function encodeResultExport(
  common: CommonModule,
  export_: ResultExportDto,
): string {
  return common.parcelEncodeResultExport(export_);
}
