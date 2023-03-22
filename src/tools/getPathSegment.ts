export default function getPathSegment<T>(path: string | undefined | null, index: number): T | undefined | null {
  if (path) {
    const splitPath = path.split("/");
    console.log(path);
    if (path.startsWith("/")) {
      splitPath.shift();
    }
    return splitPath[index] as T;
  }
  return undefined;
}
