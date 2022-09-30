interface Window {
  backendPath: string;
  frontendPath: string;
  hexToASCII: (hex: string) => string;
  fetchAccount: (accessToken: string, refreshToken: string) => Promise<ServerResponse>;
}

declare const backendPath: string;
declare const hexToASCII: (hex: string) => string;
declare const fetchAccount: (localStorage: any, accessToken: string, refreshToken: string) => Promise<ServerResponse>;

declare interface ServerResponse {
  success: boolean;
  status?: number;
  message?: string;
  [key: string]: any;
}