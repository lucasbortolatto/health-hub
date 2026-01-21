const BASE_URL = 'http://127.0.0.1:8000';

export function apiPath(path: string): string {
  // Ensure the path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}
