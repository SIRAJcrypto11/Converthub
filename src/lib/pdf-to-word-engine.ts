/**
 * ConvertHub — PDF-to-Word Conversion Engine (v2)
 *
 * TWO MODES:
 *   1. "preserve" — Renders each PDF page as a high-resolution image
 *      and embeds it in Word → 100% visual fidelity.
 *   2. "editable" — Reconstructs text layout from positional data →
 *      editable text but may lose some formatting.
 */

import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    ImageRun,
    HeadingLevel,
    PageBreak,
    SectionType,
} from "docx";

// ─── Public Types ───────────────────────────────────────────────────────────

export type ConversionMode = "preserve" | "editable";

export interface ConversionProgress {
    stage: "reading" | "rendering" | "analyzing" | "building" | "complete";
    percent: number;
    message: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const RENDER_SCALE = 2; // 2× for crisp high-DPI images
const LINE_Y_TOLERANCE = 3;
const PARAGRAPH_GAP_FACTOR = 1.4;
const HEADING_SIZE_FACTOR = 1.25;
const MIN_SPACE_FACTOR = 0.25;

// A4 dimensions in EMU (English Metric Unit, 1 inch = 914400 EMU)
// A4 = 210mm × 297mm. With 0.5-inch margin on each side:
// Image area = ~190mm × ~267mm ≈ 7.48" × 10.51"
const PAGE_IMAGE_WIDTH_PX = Math.round(7.48 * 72 * RENDER_SCALE);  // pixels at render scale
const PAGE_IMAGE_HEIGHT_PX = Math.round(10.51 * 72 * RENDER_SCALE);

// Word dimensions (in points for ImageRun transformation)
const WORD_IMAGE_WIDTH = Math.round(7.48 * 72);   // ~539 points
const WORD_IMAGE_HEIGHT = Math.round(10.51 * 72);  // ~757 points

// ─── Helper: Load pdfjs ─────────────────────────────────────────────────────

async function loadPdfJs() {
    const pdfjs = await import("pdfjs-dist");
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }
    return pdfjs;
}

// ─── Helper: Canvas → PNG Uint8Array ────────────────────────────────────────

function canvasToUint8Array(canvas: HTMLCanvasElement): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Failed to convert canvas to PNG"));
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    resolve(new Uint8Array(arrayBuffer));
                };
                reader.onerror = () => reject(new Error("Failed to read canvas blob"));
                reader.readAsArrayBuffer(blob);
            },
            "image/png",
            1.0
        );
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// MODE 1: PRESERVE FORMAT (Image-Based) — DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

async function convertVisual(
    file: File,
    onProgress?: (p: ConversionProgress) => void
): Promise<Blob> {
    const report = (
        stage: ConversionProgress["stage"],
        percent: number,
        message: string
    ) => onProgress?.({ stage, percent, message });

    // ── Load PDF ──
    report("reading", 5, "Loading PDF...");
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (pdfjs.getDocument({ data: arrayBuffer })).promise;
    const numPages = pdf.numPages;
    report("reading", 10, `PDF loaded — ${numPages} page(s)`);

    // ── Render each page to high-res PNG ──
    const pageImages: { data: Uint8Array; width: number; height: number }[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const pct = 10 + Math.round((pageNum / numPages) * 60);
        report("rendering", pct, `Rendering page ${pageNum} of ${numPages}...`);

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: RENDER_SCALE });

        // Create off-screen canvas
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Cannot create canvas context");

        // Render PDF page to canvas
        await page.render({ canvasContext: ctx as any, canvas: canvas as any, viewport: viewport as any }).promise;

        // Convert to PNG bytes
        const pngData = await canvasToUint8Array(canvas);
        pageImages.push({
            data: pngData,
            width: viewport.width / RENDER_SCALE,  // original point width
            height: viewport.height / RENDER_SCALE, // original point height
        });

        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;
    }

    // ── Build DOCX with embedded images ──
    report("building", 75, "Building Word document...");

    const sections = pageImages.map((img, index) => {
        // Calculate image dimensions to fit the page while preserving aspect ratio
        const aspectRatio = img.width / img.height;
        let imgWidth = WORD_IMAGE_WIDTH;
        let imgHeight = Math.round(imgWidth / aspectRatio);

        // If image is taller than page area, scale down
        if (imgHeight > WORD_IMAGE_HEIGHT) {
            imgHeight = WORD_IMAGE_HEIGHT;
            imgWidth = Math.round(imgHeight * aspectRatio);
        }

        return {
            properties: {
                page: {
                    size: {
                        width: Math.round(img.width * 20),  // twips (1pt = 20 twips)
                        height: Math.round(img.height * 20),
                    },
                    margin: {
                        top: 360,    // 0.25 inch
                        right: 360,
                        bottom: 360,
                        left: 360,
                    },
                },
            },
            children: [
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: img.data,
                            transformation: {
                                width: imgWidth,
                                height: imgHeight,
                            },
                            type: "png",
                        }),
                    ],
                    spacing: { after: 0, before: 0 },
                }),
            ],
        };
    });

    const doc = new Document({
        creator: "ConvertHub",
        title: file.name.replace(/\.pdf$/i, ""),
        description: "Converted from PDF by ConvertHub — Format Preserved",
        sections,
    });

    report("building", 90, "Packaging DOCX...");
    const blob = await Packer.toBlob(doc);
    report("complete", 100, "Conversion complete!");
    return blob;
}

// ═══════════════════════════════════════════════════════════════════════════
// MODE 2: EDITABLE TEXT (Layout Reconstruction)
// ═══════════════════════════════════════════════════════════════════════════

// ─ Types ─

interface ExtractedItem {
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontName: string;
}

interface TextLine {
    items: ExtractedItem[];
    y: number;
    avgFontSize: number;
    text: string;
    isBold: boolean;
    isItalic: boolean;
}

interface RunInfo {
    text: string;
    bold: boolean;
    italic: boolean;
    fontSize: number;
    fontFamily: string;
}

interface DocParagraph {
    runs: RunInfo[];
    isHeading: boolean;
    headingLevel: 1 | 2 | 3;
    isList: boolean;
    listPrefix: string;
}

// ─ Font detection ─

function parseFontStyle(fontName: string) {
    const lower = fontName.toLowerCase();
    const bold = lower.includes("bold") || lower.includes("heavy") || lower.includes("black") || lower.includes("semibold");
    const italic = lower.includes("italic") || lower.includes("oblique");

    let family = "Calibri";
    if (lower.includes("times") || lower.includes("serif")) family = "Times New Roman";
    else if (lower.includes("arial") || lower.includes("helvetica") || lower.includes("sans")) family = "Arial";
    else if (lower.includes("courier") || lower.includes("mono")) family = "Courier New";
    else if (lower.includes("calibri")) family = "Calibri";
    else if (lower.includes("cambria")) family = "Cambria";
    else if (lower.includes("georgia")) family = "Georgia";
    else if (lower.includes("verdana")) family = "Verdana";

    return { bold, italic, family };
}

// ─ Extraction ─

function extractItems(textContent: any): ExtractedItem[] {
    const items: ExtractedItem[] = [];
    for (const item of textContent.items) {
        if (!item.str) continue;
        const t = item.transform;
        const fontSize = Math.abs(t[0]) || Math.abs(t[3]) || 12;
        items.push({
            str: item.str,
            x: t[4],
            y: t[5],
            width: item.width || 0,
            height: item.height || fontSize,
            fontSize,
            fontName: item.fontName || "",
        });
    }
    return items;
}

// ─ Line grouping ─

function groupIntoLines(items: ExtractedItem[]): TextLine[] {
    if (items.length === 0) return [];

    const sorted = [...items].sort((a, b) => {
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > LINE_Y_TOLERANCE) return yDiff;
        return a.x - b.x;
    });

    const lines: TextLine[] = [];
    let current: ExtractedItem[] = [sorted[0]];
    let currentY = sorted[0].y;

    for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];
        if (Math.abs(item.y - currentY) <= LINE_Y_TOLERANCE) {
            current.push(item);
        } else {
            lines.push(buildLine(current));
            current = [item];
            currentY = item.y;
        }
    }
    if (current.length > 0) lines.push(buildLine(current));
    return lines;
}

function buildLine(items: ExtractedItem[]): TextLine {
    items.sort((a, b) => a.x - b.x);

    let text = "";
    for (let i = 0; i < items.length; i++) {
        if (i > 0) {
            const prev = items[i - 1];
            const gap = items[i].x - (prev.x + prev.width);
            const avgCW = prev.str.length > 0 ? prev.width / prev.str.length : prev.fontSize * 0.5;
            if (gap > avgCW * MIN_SPACE_FACTOR) text += " ";
        }
        text += items[i].str;
    }

    const fonts = items.reduce(
        (a, item) => {
            const s = parseFontStyle(item.fontName);
            if (s.bold) a.b++;
            if (s.italic) a.i++;
            a.t++;
            return a;
        },
        { b: 0, i: 0, t: 0 }
    );

    return {
        items,
        y: items[0].y,
        avgFontSize: items.reduce((s, it) => s + it.fontSize, 0) / items.length,
        text: text.trim(),
        isBold: fonts.b > fonts.t * 0.5,
        isItalic: fonts.i > fonts.t * 0.5,
    };
}

// ─ Paragraph grouping ─

function groupIntoParagraphs(lines: TextLine[], pageWidth: number): DocParagraph[] {
    if (lines.length === 0) return [];

    const sizes = lines.map((l) => l.avgFontSize).sort((a, b) => a - b);
    const medianSize = sizes[Math.floor(sizes.length / 2)] || 12;

    const gaps: number[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
        const g = Math.abs(lines[i].y - lines[i + 1].y);
        if (g > 0 && g < medianSize * 4) gaps.push(g);
    }
    const typicalGap = gaps.length > 0
        ? gaps.sort((a, b) => a - b)[Math.floor(gaps.length / 2)]
        : medianSize * 1.2;

    const paragraphs: DocParagraph[] = [];
    let currentRuns: RunInfo[] = [];
    let currentText = "";
    let prevSize = lines[0].avgFontSize;
    let prevBold = lines[0].isBold;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.text) continue;

        let isBreak = false;
        if (i > 0) {
            const gap = Math.abs(lines[i - 1].y - line.y);
            isBreak = gap > typicalGap * PARAGRAPH_GAP_FACTOR;
        }

        const styleChanged = i > 0 && (
            Math.abs(line.avgFontSize - prevSize) > 1 || line.isBold !== prevBold
        );

        if ((isBreak || styleChanged) && currentText.length > 0) {
            paragraphs.push(finalizeParagraph(currentText, currentRuns, medianSize));
            currentRuns = [];
            currentText = "";
        }

        const lineRuns = buildLineRuns(line);
        if (currentText.length > 0) currentText += " ";
        currentRuns.push(...lineRuns);
        currentText += line.text;
        prevSize = line.avgFontSize;
        prevBold = line.isBold;
    }

    if (currentText.length > 0) {
        paragraphs.push(finalizeParagraph(currentText, currentRuns, medianSize));
    }

    return paragraphs;
}

function buildLineRuns(line: TextLine): RunInfo[] {
    const runs: RunInfo[] = [];
    let runText = "";
    let curStyle = line.items[0] ? parseFontStyle(line.items[0].fontName) : { bold: false, italic: false, family: "Calibri" };
    let curSize = line.items[0]?.fontSize || 12;

    for (let i = 0; i < line.items.length; i++) {
        const item = line.items[i];
        const style = parseFontStyle(item.fontName);

        if (style.bold !== curStyle.bold || style.italic !== curStyle.italic || Math.abs(item.fontSize - curSize) > 1) {
            if (runText) runs.push({ text: runText, bold: curStyle.bold, italic: curStyle.italic, fontSize: Math.round(curSize * 2), fontFamily: curStyle.family });
            runText = "";
            curStyle = style;
            curSize = item.fontSize;
        }

        if (i > 0) {
            const prev = line.items[i - 1];
            const gap = item.x - (prev.x + prev.width);
            const avgCW = prev.str.length > 0 ? prev.width / prev.str.length : prev.fontSize * 0.5;
            if (gap > avgCW * MIN_SPACE_FACTOR) runText += " ";
        }
        runText += item.str;
    }

    if (runText) runs.push({ text: runText, bold: curStyle.bold, italic: curStyle.italic, fontSize: Math.round(curSize * 2), fontFamily: curStyle.family });
    return runs;
}

function finalizeParagraph(text: string, runs: RunInfo[], medianSize: number): DocParagraph {
    const avgSize = runs.length > 0 ? runs.reduce((s, r) => s + r.fontSize, 0) / runs.length / 2 : medianSize;
    const ratio = avgSize / medianSize;
    const isHeading = ratio >= HEADING_SIZE_FACTOR;
    let headingLevel: 1 | 2 | 3 = 3;
    if (ratio >= 1.8) headingLevel = 1;
    else if (ratio >= 1.5) headingLevel = 2;

    const listMatch = text.match(/^(\s*)([\u2022\u2023\u25E6\u2043\u2219•\-\*]|\d+[.)]\s|[a-zA-Z][.)]\s)/);
    const isList = !!listMatch;
    const listPrefix = listMatch ? listMatch[2] : "";

    return {
        runs: runs.length > 0 ? runs : [{ text, bold: false, italic: false, fontSize: Math.round(medianSize * 2), fontFamily: "Calibri" }],
        isHeading,
        headingLevel,
        isList,
        listPrefix,
    };
}

// ─ Convert paragraphs to docx ─

function toDocxParagraphs(paragraphs: DocParagraph[]): Paragraph[] {
    return paragraphs.map((p) => {
        const children = p.runs.map((r) => new TextRun({
            text: r.text,
            bold: r.bold,
            italics: r.italic,
            size: r.fontSize,
            font: r.fontFamily,
        }));

        let heading: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;
        if (p.isHeading) {
            heading = p.headingLevel === 1 ? HeadingLevel.HEADING_1 : p.headingLevel === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
        }

        return new Paragraph({
            children,
            heading,
            spacing: p.isHeading ? { after: 200, before: 240 } : { after: 120, line: 276 },
            indent: p.isList ? { left: 720 } : undefined,
        });
    });
}

// ─ Editable text conversion ─

async function convertEditable(
    file: File,
    onProgress?: (p: ConversionProgress) => void
): Promise<Blob> {
    const report = (stage: ConversionProgress["stage"], percent: number, message: string) =>
        onProgress?.({ stage, percent, message });

    report("reading", 5, "Loading PDF...");
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (pdfjs.getDocument({ data: arrayBuffer })).promise;
    const numPages = pdf.numPages;
    report("reading", 15, `PDF loaded — ${numPages} page(s)`);

    const allSections: Paragraph[][] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const pct = 15 + Math.round((pageNum / numPages) * 50);
        report("analyzing", pct, `Analyzing page ${pageNum} of ${numPages}...`);

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
        const textContent = await page.getTextContent();
        const items = extractItems(textContent);

        if (items.length === 0) {
            allSections.push([
                new Paragraph({
                    children: [new TextRun({
                        text: `[Page ${pageNum} — no text detected. Use OCR for scanned documents.]`,
                        italics: true,
                        color: "999999",
                        size: 20,
                    })],
                }),
            ]);
            continue;
        }

        const lines = groupIntoLines(items);
        const paragraphs = groupIntoParagraphs(lines, viewport.width);
        allSections.push(toDocxParagraphs(paragraphs));
    }

    report("building", 75, "Building Word document...");

    const sections = allSections.map((children) => ({
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children,
    }));

    const doc = new Document({
        creator: "ConvertHub",
        title: file.name.replace(/\.pdf$/i, ""),
        description: "Converted from PDF by ConvertHub — Editable Text",
        sections,
    });

    report("building", 90, "Packaging DOCX...");
    const blob = await Packer.toBlob(doc);
    report("complete", 100, "Conversion complete!");
    return blob;
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converts a PDF file to a DOCX Blob.
 *
 * @param file       The PDF file to convert.
 * @param mode       "preserve" = image-based (perfect format), "editable" = text extraction.
 * @param onProgress Callback for progress updates.
 */
export async function convertPdfToDocx(
    file: File,
    mode: ConversionMode = "preserve",
    onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> {
    if (mode === "preserve") {
        return convertVisual(file, onProgress);
    }
    return convertEditable(file, onProgress);
}
