/**
 * Robust file download utility for ConvertHub.
 *
 * Uses a server-side API route (/api/download-file) to guarantee
 * correct filenames via the Content-Disposition HTTP header.
 *
 * This is the GOLD STANDARD for download naming — ALL browsers
 * respect Content-Disposition without exception.
 */

/**
 * Download from raw data (Uint8Array from pdf-lib, string, etc.)
 */
export async function downloadFile(
    data: any,
    filename: string,
    mimeType: string
): Promise<void> {
    const blob = new Blob([data], { type: mimeType });
    await triggerServerDownload(blob, filename);
}

/**
 * Download from an existing Blob object.
 */
export async function downloadBlob(
    blob: Blob,
    filename: string
): Promise<void> {
    await triggerServerDownload(blob, filename);
}

/**
 * Download from a data URL (e.g. base64 image).
 */
export async function downloadDataUrl(
    dataUrl: string,
    filename: string
): Promise<void> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await triggerServerDownload(blob, filename);
}

/**
 * Core download mechanism using a stateless POST form submission.
 *
 * This approach is 100% Vercel Serverless compatible because it stores
 * nothing in memory. It forces the browser to native-POST the blob,
 * and the Next.js API immediately responds with an attachment header.
 */
async function triggerServerDownload(
    blob: Blob,
    filename: string
): Promise<void> {
    // We cannot set <input type="file"> value directly. 
    // We must use a DataTransfer object to inject the Blob.
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File([blob], filename, { type: blob.type }));

    // Create a hidden form to submit directly to the API
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/download-file";
    form.enctype = "multipart/form-data";
    form.style.display = "none";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "file";
    fileInput.files = dataTransfer.files;
    form.appendChild(fileInput);

    const filenameInput = document.createElement("input");
    filenameInput.type = "hidden";
    filenameInput.name = "filename";
    filenameInput.value = filename;
    form.appendChild(filenameInput);

    document.body.appendChild(form);

    // Submitting a standard HTML form will force the browser to navigate.
    // However, because the server responds with 'Content-Disposition: attachment',
    // the browser intercepts the response as a download and STAYS on the current page.
    form.submit();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(form);
    }, 1000);
}
