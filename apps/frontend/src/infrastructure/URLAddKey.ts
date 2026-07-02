export default function URLAddValue(url: URL, key: string, value: string): URL {
  url.searchParams.append(key, value);
  return url;
}
