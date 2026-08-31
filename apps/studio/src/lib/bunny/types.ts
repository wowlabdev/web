export type BunnyVideo = {
  availableResolutions: string | null;
  averageWatchTime: number;
  captions: BunnyVideoCaption[] | null;
  category: string | null;
  chapters: BunnyVideoChapter[] | null;
  collectionId: string | null;
  dateUploaded: string;
  description: string | null;
  encodeProgress: number;
  framerate: number;
  guid: string;
  hasHighQualityPreview: boolean | null;
  hasMP4Fallback: boolean;
  hasOriginal: boolean | null;
  height: number;
  isPublic: boolean;
  jitEncodingEnabled: boolean | null;
  length: number;
  metaTags: BunnyVideoMetaTag[] | null;
  moments: BunnyVideoMoment[] | null;
  originalHash: string | null;
  outputCodecs: string;
  rotation: number | null;
  smartGenerateStatus: number | null;
  status: BunnyVideoStatus;
  storageSize: number;
  thumbnailBlurhash: string | null;
  thumbnailCount: number;
  thumbnailFileName: string | null;
  title: string;
  totalWatchTime: number;
  transcodingMessages: unknown[] | null;
  videoLibraryId: number;
  views: number;
  width: number;
};

export type BunnyVideoCaption = {
  label: string;
  srclang: string;
};

export type BunnyVideoChapter = {
  end: number;
  start: number;
  title: string;
};

export type BunnyVideoListResponse = {
  currentPage: number;
  items: BunnyVideo[];
  itemsPerPage: number;
  totalItems: number;
};

export type BunnyVideoMetaTag = {
  property: string;
  value: string;
};

export type BunnyVideoMoment = {
  label: string;
  timestamp: number;
};

export type BunnyVideoStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
