export type V1Node = {
  approvedRoutes: string[];
  availableRoutes: string[];
  createdAt: string | null;
  expiry: string | null;
  givenName: string;
  id: string;
  ipAddresses: string[];
  lastSeen: string | null;
  name: string;
  online: boolean;
  registerMethod: string;
  subnetRoutes: string[];
  tags: string[];
  user: V1User;
};

export type V1PreAuthKey = {
  aclTags: string[];
  createdAt: string | null;
  ephemeral: boolean;
  expiration: string | null;
  id: string;
  key: string;
  reusable: boolean;
  used: boolean;
  user: V1User;
};

export type V1User = {
  createdAt?: string | null;
  displayName?: string;
  email?: string;
  id: string;
  name: string;
  profilePicUrl?: string;
  provider?: string;
  providerId?: string;
};
