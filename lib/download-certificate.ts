export async function downloadCertificateNode(
  node: HTMLElement,
  fileName: string
): Promise<void> {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(node, { backgroundColor: "#FCFAF2", scale: 2 });
  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
