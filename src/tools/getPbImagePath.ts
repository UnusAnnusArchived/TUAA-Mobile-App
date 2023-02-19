import { pb } from "../endpoints";

export default function getPbImagePath(
  sub: string,
  recordId: string,
  filename: string,
  x?: number,
  y?: number
): string {
  return `${pb}/api/files/${sub}/${recordId}/${filename}${x && y ? `?thumb=${x}x${y}` : ""}`;
}
