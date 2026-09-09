// Minimal dependency-free PDF writer for monthly statements.
// Produces a single-page (or multi-page) text PDF using the built-in Helvetica fonts.

type Line = { text: string; size?: number; bold?: boolean; gap?: number };

const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7E]/g, "-");

export function buildPdf(lines: Line[]): Blob {
  const pageHeight = 792;
  const pageWidth = 612;
  const marginTop = 60;
  const marginLeft = 54;
  const bottom = 60;

  // paginate
  const pages: Line[][] = [];
  let current: Line[] = [];
  let y = marginTop;
  for (const line of lines) {
    const h = (line.size ?? 10) + (line.gap ?? 5);
    if (y + h > pageHeight - bottom) {
      pages.push(current);
      current = [];
      y = marginTop;
    }
    current.push(line);
    y += h;
  }
  pages.push(current);

  const contents = pages.map((page) => {
    let cy = pageHeight - marginTop;
    let out = "";
    for (const line of page) {
      const size = line.size ?? 10;
      out += `BT /${line.bold ? "F2" : "F1"} ${size} Tf 1 0 0 1 ${marginLeft} ${cy} Tm (${esc(line.text)}) Tj ET\n`;
      cy -= size + (line.gap ?? 5);
    }
    return out;
  });

  const objects: string[] = [];
  const pageObjIds = pages.map((_, i) => 4 + i * 2);
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(
    `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  contents.forEach((content, i) => {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 ${3 + pages.length * 2 + 1} 0 R >> >> /Contents ${5 + i * 2} 0 R >>`,
    );
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
  });
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
