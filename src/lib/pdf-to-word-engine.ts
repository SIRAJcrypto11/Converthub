/**
 * ConvertHub — Smart PDF-to-Word Layout Reconstruction Engine
 *
 * This module analyses the raw positional text data from pdfjs-dist
 * and reconstructs a semantically structured document that the `docx`
 * library can then render into a properly formatted .docx file.
 *
 * Algorithms:
 *   1. Line Detection       – Y-coordinate grouping (±tolerance)
 *   2. Word Spacing          – X-gap analysis for proper spaces
 *   3. Paragraph Detection   – Vertical gap exceeding 1.5× line height
 *   4. Font/Style Detection  – fontName parsing for bold / italic
 *   5. Heading Inference      – fontSize comparison to body median
 *   6. List Detection         – Bullet / numbered prefix matching
 */

import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    PageBreak,
} from "docx";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RawTextItem {
    str: string;
    dir: string;
    // transform: [scaleX, skewX, skewY, scaleY, translateX, translateY]
    transform: number[];
    width: number;
    height: number;
    fontName: string;
    hasEOL: boolean;
}

interface ExtractedItem {
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontName: string;
    hasEOL: boolean;
}

interface TextLine {
    items: ExtractedItem[];
    y: number;
    minX: number;
    maxX: number;
    avgFontSize: number;
    text: string;
    isBold: boolean;
    isItalic: boolean;
}

interface DocParagraph {
    text: string;
    runs: RunInfo[];
    isHeading: boolean;
    headingLevel: 1 | 2 | 3;
    isList: boolean;
    listPrefix: string;
    alignment: "left" | "center" | "right";
    isPageBreak: boolean;
}

interface RunInfo {
    text: string;
    bold: boolean;
    italic: boolean;
    fontSize: number; // in half-points for docx
    fontFamily: string;
}

interface FontStyleMap {
    [fontName: string]: { bold: boolean; italic: boolean; family: string };
}

// ─── Constants ──────────────────────────────────────────────────────────────

const LINE_Y_TOLERANCE = 3; // px tolerance for same-line detection
const PARAGRAPH_GAP_FACTOR = 1.4; // gap > factor × lineHeight = new paragraph
const HEADING_SIZE_FACTOR = 1.25; // fontSize > factor × median = heading
const MIN_SPACE_FACTOR = 0.25; // gap > factor × charWidth = needs space

// ─── Font Detection ─────────────────────────────────────────────────────────

function parseFontStyle(fontName: string): {
    bold: boolean;
    italic: boolean;
    family: string;
} {
    const lower = fontName.toLowerCase();

    const bold =
        lower.includes("bold") ||
        lower.includes("heavy") ||
        lower.includes("black") ||
        lower.includes("semibold") ||
        lower.includes("demibold");

    const italic =
        lower.includes("italic") ||
        lower.includes("oblique") ||
        lower.includes("slant");

    // Try to extract a human-readable font family
    let family = "Calibri"; // default
    if (lower.includes("times") || lower.includes("serif")) {
        family = "Times New Roman";
    } else if (lower.includes("arial") || lower.includes("helvetica") || lower.includes("sans")) {
        family = "Arial";
    } else if (lower.includes("courier") || lower.includes("mono")) {
        family = "Courier New";
    } else if (lower.includes("calibri")) {
        family = "Calibri";
    } else if (lower.includes("cambria")) {
        family = "Cambria";
    } else if (lower.includes("georgia")) {
        family = "Georgia";
    } else if (lower.includes("garamond")) {
        family = "Garamond";
    } else if (lower.includes("verdana")) {
        family = "Verdana";
    } else if (lower.includes("tahoma")) {
        family = "Tahoma";
    } else if (lower.includes("trebuchet")) {
        family = "Trebuchet MS";
    }

    return { bold, italic, family };
}

// ─── Step 1: Extract structured items from pdfjs textContent ────────────────

function extractItems(textContent: any): ExtractedItem[] {
    const items: ExtractedItem[] = [];

    for (const item of textContent.items) {
        if (!item.str && !item.hasEOL) continue; // skip empty non-EOL items

        const t = item.transform;
        // transform: [scaleX, skewX, skewY, scaleY, translateX, translateY]
        const fontSize = Math.abs(t[0]) || Math.abs(t[3]) || 12;

        items.push({
            str: item.str || "",
            x: t[4],
            y: t[5],
            width: item.width || 0,
            height: item.height || fontSize,
            fontSize,
            fontName: item.fontName || "",
            hasEOL: item.hasEOL || false,
        });
    }

    return items;
}

// ─── Step 2: Group items into lines by Y-coordinate ─────────────────────────

function groupIntoLines(items: ExtractedItem[]): TextLine[] {
    if (items.length === 0) return [];

    // Sort by Y descending (PDF coordinate: Y=0 is bottom), then by X ascending
    const sorted = [...items].sort((a, b) => {
        const yDiff = b.y - a.y; // higher Y = higher on page
        if (Math.abs(yDiff) > LINE_Y_TOLERANCE) return yDiff;
        return a.x - b.x; // left to right
    });

    const lines: TextLine[] = [];
    let currentLine: ExtractedItem[] = [sorted[0]];
    let currentY = sorted[0].y;

    for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];

        if (Math.abs(item.y - currentY) <= LINE_Y_TOLERANCE) {
            // Same line
            currentLine.push(item);
        } else {
            // Finalize current line and start new one
            lines.push(buildLine(currentLine));
            currentLine = [item];
            currentY = item.y;
        }
    }

    // Finalize last line
    if (currentLine.length > 0) {
        lines.push(buildLine(currentLine));
    }

    return lines;
}

function buildLine(items: ExtractedItem[]): TextLine {
    // Sort items within line by X position (left to right)
    items.sort((a, b) => a.x - b.x);

    // Build text with proper spacing
    let text = "";
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (i > 0) {
            const prev = items[i - 1];
            const gap = item.x - (prev.x + prev.width);
            const avgCharWidth =
                prev.str.length > 0 ? prev.width / prev.str.length : prev.fontSize * 0.5;

            // Insert space if gap is significant
            if (gap > avgCharWidth * MIN_SPACE_FACTOR) {
                text += " ";
            }
        }

        text += item.str;
    }

    // Detect predominant font style
    const fontVotes = items.reduce(
        (acc, item) => {
            const style = parseFontStyle(item.fontName);
            if (style.bold) acc.boldCount++;
            if (style.italic) acc.italicCount++;
            acc.total++;
            return acc;
        },
        { boldCount: 0, italicCount: 0, total: 0 }
    );

    const isBold = fontVotes.boldCount > fontVotes.total * 0.5;
    const isItalic = fontVotes.italicCount > fontVotes.total * 0.5;

    // Average font size for the line
    const avgFontSize =
        items.reduce((sum, item) => sum + item.fontSize, 0) / items.length;

    // Positions
    const minX = Math.min(...items.map((item) => item.x));
    const maxX = Math.max(...items.map((item) => item.x + item.width));

    return {
        items,
        y: items[0].y,
        minX,
        maxX,
        avgFontSize,
        text: text.trim(),
        isBold,
        isItalic,
    };
}

// ─── Step 3: Group lines into paragraphs ────────────────────────────────────

function groupIntoParagraphs(
    lines: TextLine[],
    pageWidth: number
): DocParagraph[] {
    if (lines.length === 0) return [];

    // Calculate median font size (= body text size)
    const fontSizes = lines.map((l) => l.avgFontSize).sort((a, b) => a - b);
    const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)] || 12;

    // Calculate typical line height from consecutive lines
    const lineGaps: number[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
        const gap = Math.abs(lines[i].y - lines[i + 1].y);
        if (gap > 0 && gap < medianFontSize * 4) {
            lineGaps.push(gap);
        }
    }
    const typicalLineHeight =
        lineGaps.length > 0
            ? lineGaps.sort((a, b) => a - b)[Math.floor(lineGaps.length / 2)]
            : medianFontSize * 1.2;

    const paragraphs: DocParagraph[] = [];
    let currentRuns: RunInfo[] = [];
    let currentText = "";
    let isCurrentBold = lines[0].isBold;
    let isCurrentItalic = lines[0].isItalic;
    let currentFontSize = lines[0].avgFontSize;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineText = line.text;

        if (!lineText) continue; // skip empty lines

        // Detect if this is a paragraph break
        let isParagraphBreak = false;
        if (i > 0) {
            const gap = Math.abs(lines[i - 1].y - line.y);
            isParagraphBreak = gap > typicalLineHeight * PARAGRAPH_GAP_FACTOR;
        }

        // Detect style change that should force a new paragraph
        const hasStyleChange =
            i > 0 &&
            (Math.abs(line.avgFontSize - currentFontSize) > 1 ||
                line.isBold !== isCurrentBold);

        if ((isParagraphBreak || hasStyleChange) && currentText.length > 0) {
            // Finalize current paragraph
            paragraphs.push(
                buildParagraph(currentText, currentRuns, medianFontSize, pageWidth)
            );
            currentRuns = [];
            currentText = "";
        }

        // Build run for this line
        const fontStyle = line.items[0]
            ? parseFontStyle(line.items[0].fontName)
            : { bold: false, italic: false, family: "Calibri" };

        // Create runs with inline style changes within the line
        const lineRuns = buildLineRuns(line);

        // If continuing a paragraph, add a space before this line
        if (currentText.length > 0) {
            currentText += " ";
            // Add a space run
            currentRuns.push({
                text: " ",
                bold: lineRuns[0]?.bold || false,
                italic: lineRuns[0]?.italic || false,
                fontSize: Math.round(line.avgFontSize * 2), // half-points
                fontFamily: fontStyle.family,
            });
        }

        currentRuns.push(...lineRuns);
        currentText += lineText;
        isCurrentBold = line.isBold;
        isCurrentItalic = line.isItalic;
        currentFontSize = line.avgFontSize;
    }

    // Finalize last paragraph
    if (currentText.length > 0) {
        paragraphs.push(
            buildParagraph(currentText, currentRuns, medianFontSize, pageWidth)
        );
    }

    return paragraphs;
}

function buildLineRuns(line: TextLine): RunInfo[] {
    // Group consecutive items with the same font style into runs
    const runs: RunInfo[] = [];
    let currentRunText = "";
    let currentStyle = line.items[0]
        ? parseFontStyle(line.items[0].fontName)
        : { bold: false, italic: false, family: "Calibri" };
    let currentSize = line.items[0]?.fontSize || 12;

    for (let i = 0; i < line.items.length; i++) {
        const item = line.items[i];
        const style = parseFontStyle(item.fontName);

        // Check if style changed
        if (
            style.bold !== currentStyle.bold ||
            style.italic !== currentStyle.italic ||
            Math.abs(item.fontSize - currentSize) > 1
        ) {
            // Finalize current run
            if (currentRunText) {
                runs.push({
                    text: currentRunText,
                    bold: currentStyle.bold,
                    italic: currentStyle.italic,
                    fontSize: Math.round(currentSize * 2), // half-points
                    fontFamily: currentStyle.family,
                });
            }
            currentRunText = "";
            currentStyle = style;
            currentSize = item.fontSize;
        }

        // Add spacing
        if (i > 0) {
            const prev = line.items[i - 1];
            const gap = item.x - (prev.x + prev.width);
            const avgCharWidth =
                prev.str.length > 0 ? prev.width / prev.str.length : prev.fontSize * 0.5;
            if (gap > avgCharWidth * MIN_SPACE_FACTOR) {
                currentRunText += " ";
            }
        }

        currentRunText += item.str;
    }

    // Finalize last run
    if (currentRunText) {
        runs.push({
            text: currentRunText,
            bold: currentStyle.bold,
            italic: currentStyle.italic,
            fontSize: Math.round(currentSize * 2), // half-points
            fontFamily: currentStyle.family,
        });
    }

    return runs;
}

function buildParagraph(
    text: string,
    runs: RunInfo[],
    medianFontSize: number,
    pageWidth: number
): DocParagraph {
    // Detect heading
    const avgRunSize =
        runs.length > 0
            ? runs.reduce((sum, r) => sum + r.fontSize, 0) / runs.length / 2 // convert back from half-points
            : medianFontSize;

    const sizeRatio = avgRunSize / medianFontSize;
    const isHeading = sizeRatio >= HEADING_SIZE_FACTOR;

    let headingLevel: 1 | 2 | 3 = 3;
    if (sizeRatio >= 1.8) headingLevel = 1;
    else if (sizeRatio >= 1.5) headingLevel = 2;
    else headingLevel = 3;

    // Detect list
    const listMatch = text.match(
        /^(\s*)([\u2022\u2023\u25E6\u2043\u2219•\-\*]|\d+[.)]\s|[a-zA-Z][.)]\s)/
    );
    const isList = !!listMatch;
    const listPrefix = listMatch ? listMatch[2] : "";

    // Detect alignment (crude: check if text is centered relative to page)
    let alignment: "left" | "center" | "right" = "left";
    // We'll default to left for now; alignment detection is complex

    return {
        text,
        runs: runs.length > 0
            ? runs
            : [
                {
                    text,
                    bold: false,
                    italic: false,
                    fontSize: Math.round(medianFontSize * 2),
                    fontFamily: "Calibri",
                },
            ],
        isHeading,
        headingLevel,
        isList,
        listPrefix,
        alignment,
        isPageBreak: false,
    };
}

// ─── Step 4: Convert paragraphs to docx Paragraph objects ──────────────────

function toDocxParagraphs(paragraphs: DocParagraph[]): Paragraph[] {
    const result: Paragraph[] = [];

    for (const p of paragraphs) {
        if (p.isPageBreak) {
            result.push(
                new Paragraph({
                    children: [new PageBreak()],
                })
            );
            continue;
        }

        const children: TextRun[] = p.runs.map((run) => {
            return new TextRun({
                text: run.text,
                bold: run.bold,
                italics: run.italic,
                size: run.fontSize, // half-points
                font: run.fontFamily,
            });
        });

        // Build heading level if applicable
        let heading: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;
        if (p.isHeading) {
            switch (p.headingLevel) {
                case 1:
                    heading = HeadingLevel.HEADING_1;
                    break;
                case 2:
                    heading = HeadingLevel.HEADING_2;
                    break;
                case 3:
                    heading = HeadingLevel.HEADING_3;
                    break;
            }
        }

        // Adjust children for list items
        if (p.isList && children.length > 0 && p.listPrefix) {
            const firstRunText = p.runs[0].text;
            const cleaned = firstRunText.replace(p.listPrefix, "").trimStart();
            children[0] = new TextRun({
                text: `${p.listPrefix} ${cleaned}`,
                bold: p.runs[0].bold,
                italics: p.runs[0].italic,
                size: p.runs[0].fontSize,
                font: p.runs[0].fontFamily,
            });
        }

        // Construct final options as a single immutable object
        const spacing = p.isHeading
            ? { after: 200, before: 240 }
            : { after: 120, line: 276 };

        const indent = p.isList ? { left: 720 } : undefined;

        result.push(
            new Paragraph({
                children,
                spacing,
                heading,
                indent,
            })
        );
    }

    return result;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface ConversionProgress {
    stage: "reading" | "analyzing" | "building" | "complete";
    percent: number;
    message: string;
}

/**
 * Converts a PDF file to a DOCX Blob using smart layout reconstruction.
 *
 * @param file        The PDF file to convert.
 * @param onProgress  Callback for progress updates.
 * @returns           A Blob containing the DOCX file.
 */
export async function convertPdfToDocx(
    file: File,
    onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> {
    const report = (
        stage: ConversionProgress["stage"],
        percent: number,
        message: string
    ) => {
        onProgress?.({ stage, percent, message });
    };

    // ── Stage 1: Load PDF ──
    report("reading", 5, "Loading PDF...");

    const pdfjs = await import("pdfjs-dist");
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    report("reading", 15, `PDF loaded — ${numPages} page(s) detected`);

    // ── Stage 2: Extract and analyse each page ──
    const allSections: Paragraph[][] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const pagePercent = 15 + Math.round((pageNum / numPages) * 50);
        report(
            "analyzing",
            pagePercent,
            `Analyzing page ${pageNum} of ${numPages}...`
        );

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
        const textContent = await page.getTextContent();

        // Extract structured items
        const items = extractItems(textContent);

        if (items.length === 0) {
            // Empty page or scanned image — add a note
            allSections.push([
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `[Page ${pageNum} — no extractable text detected. This page may contain scanned images. Use the OCR tool for scanned documents.]`,
                            italics: true,
                            color: "999999",
                            size: 20,
                        }),
                    ],
                    spacing: { after: 200 },
                }),
            ]);
            continue;
        }

        // Group into lines
        const lines = groupIntoLines(items);

        // Group lines into paragraphs
        const paragraphs = groupIntoParagraphs(lines, viewport.width);

        // Convert to docx paragraphs
        const docxParagraphs = toDocxParagraphs(paragraphs);

        allSections.push(docxParagraphs);
    }

    // ── Stage 3: Build DOCX ──
    report("building", 75, "Constructing Word document...");

    // Build sections with page breaks between pages
    const sections = allSections.map((pageParagraphs, index) => {
        return {
            properties:
                index > 0
                    ? { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }
                    : { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: pageParagraphs,
        };
    });

    const doc = new Document({
        creator: "ConvertHub",
        title: file.name.replace(/\.pdf$/i, ""),
        description: "Converted from PDF by ConvertHub",
        sections,
    });

    report("building", 90, "Packaging DOCX file...");
    const blob = await Packer.toBlob(doc);

    report("complete", 100, "Conversion complete!");
    return blob;
}
