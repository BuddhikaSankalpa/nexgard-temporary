function pdfText(value) {
  return String(value).normalize('NFKD').replace(/[^\x20-\x7E]/g, '?').replace(/[\\()]/g, '\\$&');
}

export function downloadReportPdf(title, lines) {
  const content = ['BT', '/F1 18 Tf', '50 790 Td', `(${pdfText(title)}) Tj`, '/F1 11 Tf',
    ...lines.flatMap(line => ['0 -24 Td', `(${pdfText(line)}) Tj`]), 'ET'].join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let output = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(output.length);
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { output += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const url = URL.createObjectURL(new Blob([output], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
