export default function downloadJson(filename: string, object: unknown): void {
  const a = document.createElement('a');
  a.href = `data:application/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(object),
  )}`;
  a.download = filename;
  a.click();
  a.remove();
}
