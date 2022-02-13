interface Window {
  backendPath: string;
}

declare const backendPath: string;
declare const hexToASCII: (hex: string) => string;

declare interface ServerResponse {
  success: boolean;
  status?: number;
  message?: string;
  [key: string]: any;
}