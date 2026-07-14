import PDFDocument from 'pdfkit';
import { Response } from 'express';

type SummaryItem = {
    label: string;
    value: string | number;
};

type GeneratePdfReportInput = {
    title: string;
    generatedAt?: Date;
    summary?: SummaryItem[];
    columns: string[];
    rows: (string | number)[][];
    filename: string;
};

export const generatePdfReport = (
    res: Response,
    { title, generatedAt = new Date(), summary, columns, rows, filename }: GeneratePdfReportInput
) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // ===== Header =====
    doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown(0.3);
    doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('gray')
        .text(`Generated on ${generatedAt.toLocaleString()}`, { align: 'center' });
    doc.fillColor('black');
    doc.moveDown(1);

    // ===== Summary Section =====
    if (summary && summary.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text('Summary');
        doc.moveDown(0.5);

        const boxWidth = 515;
        const itemsPerRow = 3;
        const itemWidth = boxWidth / itemsPerRow;
        let startY = doc.y;

        summary.forEach((item, index) => {
            const col = index % itemsPerRow;
            const row = Math.floor(index / itemsPerRow);
            const x = 40 + col * itemWidth;
            const y = startY + row * 45;

            doc
                .fontSize(8)
                .font('Helvetica')
                .fillColor('gray')
                .text(item.label.toUpperCase(), x, y, { width: itemWidth - 10 });

            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .fillColor('black')
                .text(String(item.value), x, y + 12, { width: itemWidth - 10 });
        });

        const totalRows = Math.ceil(summary.length / itemsPerRow);
        doc.y = startY + totalRows * 45 + 10;

        doc
            .moveTo(40, doc.y)
            .lineTo(555, doc.y)
            .strokeColor('#e0e0e0')
            .stroke();
        doc.moveDown(1);
    }

    // ===== Table Section =====
    doc.fontSize(12).font('Helvetica-Bold').text('Detailed Records');
    doc.moveDown(0.5);

    const tableWidth = 515;
    const columnWidth = tableWidth / columns.length;
    const rowHeight = 22;

    const drawTableHeader = (y: number) => {
        doc.rect(40, y, tableWidth, rowHeight).fill('#f3f4f6');
        doc.fillColor('black').fontSize(9).font('Helvetica-Bold');
        columns.forEach((col, i) => {
            doc.text(col, 44 + i * columnWidth, y + 6, {
                width: columnWidth - 8,
                ellipsis: true,
            });
        });
    };

    let y = doc.y;
    drawTableHeader(y);
    y += rowHeight;

    doc.font('Helvetica').fontSize(8);

    rows.forEach((row, rowIndex) => {
        if (y + rowHeight > 780) {
            doc.addPage();
            y = 40;
            drawTableHeader(y);
            y += rowHeight;
            doc.font('Helvetica').fontSize(8);
        }

        if (rowIndex % 2 === 0) {
            doc.rect(40, y, tableWidth, rowHeight).fill('#fafafa');
            doc.fillColor('black');
        }

        row.forEach((cell, i) => {
            doc.text(String(cell), 44 + i * columnWidth, y + 6, {
                width: columnWidth - 8,
                ellipsis: true,
            });
        });

        y += rowHeight;
    });

    if (rows.length === 0) {
        doc.fontSize(9).fillColor('gray').text('No records found.', 44, y + 6);
    }

    doc.end();
};