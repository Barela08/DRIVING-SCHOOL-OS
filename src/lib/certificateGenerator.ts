import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { CertificateTemplate, CourseCertificate, School } from '@/types';

export interface CertificateData {
  studentName: string;
  studentCode: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
  schoolName: string;
  instructorName?: string;
  rtoRegNo?: string;
  qrVerificationUrl: string;
}

/**
 * Format ISO date string into Indian formal date, e.g. "30 October 2026"
 */
export function formatCertificateDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Generate high-resolution QR code data URL
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });
}

/**
 * Generate a complete, high-quality PDF Certificate
 * Preserves uploaded template if provided, otherwise renders the official master design.
 */
export async function generateCertificatePdf(
  data: CertificateData,
  template?: CertificateTemplate,
  school?: School
): Promise<{ pdfBytes: Uint8Array; pdfDataUrl: string }> {
  const pdfDoc = await PDFDocument.create();
  
  // Standard A4 Landscape: 841.89 x 595.28 points
  const pageWidth = template?.width || 841.89;
  const pageHeight = template?.height || 595.28;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Generate QR Code PNG
  const qrDataUrl = await generateQrDataUrl(data.qrVerificationUrl);
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontTimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const config = template?.fields_config;

  // Check if a custom uploaded template image exists
  let customBackgroundRendered = false;
  if (template?.template_data_url && template.template_data_url.startsWith('data:image/')) {
    try {
      const isPng = template.template_data_url.startsWith('data:image/png');
      const base64Data = template.template_data_url.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      const bgImage = isPng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);
      page.drawImage(bgImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight
      });
      customBackgroundRendered = true;
    } catch (e) {
      console.warn('Could not load custom template background, falling back to master design', e);
    }
  }

  // If no custom template background was loaded, render the prestigious master vector template
  if (!customBackgroundRendered) {
    // 1. Soft Parchment / Ivory Canvas Background
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: rgb(0.992, 0.988, 0.965)
    });

    // 2. Outer Ornate Deep Navy Border
    page.drawRectangle({
      x: 18,
      y: 18,
      width: pageWidth - 36,
      height: pageHeight - 36,
      borderColor: rgb(0.067, 0.122, 0.224), // #111F39
      borderWidth: 2,
      color: rgb(0.992, 0.988, 0.965)
    });

    // 3. Luxurious Gold Metallic Inset Border
    page.drawRectangle({
      x: 26,
      y: 26,
      width: pageWidth - 52,
      height: pageHeight - 52,
      borderColor: rgb(0.792, 0.608, 0.165), // #CA9B2A Gold
      borderWidth: 4,
      color: rgb(0.992, 0.988, 0.965)
    });

    // 4. Thin Inner Navy Accent Border
    page.drawRectangle({
      x: 34,
      y: 34,
      width: pageWidth - 68,
      height: pageHeight - 68,
      borderColor: rgb(0.12, 0.2, 0.35),
      borderWidth: 1,
      color: rgb(0.992, 0.988, 0.965)
    });

    // 5. Four Corner Geometric Gold Filigrees
    const corners = [
      { x: 38, y: pageHeight - 68 }, // Top Left
      { x: pageWidth - 68, y: pageHeight - 68 }, // Top Right
      { x: 38, y: 38 }, // Bottom Left
      { x: pageWidth - 68, y: 38 } // Bottom Right
    ];
    corners.forEach(c => {
      page.drawRectangle({
        x: c.x,
        y: c.y,
        width: 30,
        height: 30,
        borderColor: rgb(0.792, 0.608, 0.165),
        borderWidth: 1.5,
        color: rgb(0.95, 0.92, 0.84)
      });
    });

    // 6. Header Top Bar Accent Ribbon
    page.drawRectangle({
      x: (pageWidth - 520) / 2,
      y: pageHeight - 55,
      width: 520,
      height: 3,
      color: rgb(0.792, 0.608, 0.165)
    });

    // 7. Subheader accreditation banner
    const accredText = 'GOVERNMENT RTO RECOGNIZED MOTOR TRAINING INSTITUTE';
    const accredW = fontHelveticaBold.widthOfTextAtSize(accredText, 8.5);
    page.drawText(accredText, {
      x: (pageWidth - accredW) / 2,
      y: pageHeight - 88,
      size: 8.5,
      font: fontHelveticaBold,
      color: rgb(0.792, 0.608, 0.165)
    });

    const rtoReg = data.rtoRegNo || school?.rto_registration_no || 'RTO Reg. No: MH-12/MDS/2018/042';
    const regW = fontHelvetica.widthOfTextAtSize(rtoReg, 8);
    page.drawText(rtoReg, {
      x: (pageWidth - regW) / 2,
      y: pageHeight - 100,
      size: 8,
      font: fontHelvetica,
      color: rgb(0.4, 0.45, 0.55)
    });

    // 8. Main Certificate Title
    const title = 'CERTIFICATE OF COURSE COMPLETION';
    const titleW = fontTimesBold.widthOfTextAtSize(title, 22);
    page.drawText(title, {
      x: (pageWidth - titleW) / 2,
      y: pageHeight - 130,
      size: 22,
      font: fontTimesBold,
      color: rgb(0.067, 0.122, 0.224)
    });

    const subtitle = '& PRACTICAL MOTOR DRIVING COMPETENCE';
    const subW = fontHelveticaBold.widthOfTextAtSize(subtitle, 11);
    page.drawText(subtitle, {
      x: (pageWidth - subW) / 2,
      y: pageHeight - 148,
      size: 11,
      font: fontHelveticaBold,
      color: rgb(0.792, 0.608, 0.165)
    });

    // Decorative divider below title
    page.drawLine({
      start: { x: (pageWidth - 320) / 2, y: pageHeight - 158 },
      end: { x: (pageWidth + 320) / 2, y: pageHeight - 158 },
      thickness: 1,
      color: rgb(0.792, 0.608, 0.165)
    });

    // 9. Solemn Certification Statement
    const certStatement = 'This is to certify that';
    const stmtW = fontTimesItalic.widthOfTextAtSize(certStatement, 14);
    page.drawText(certStatement, {
      x: (pageWidth - stmtW) / 2,
      y: pageHeight - 185,
      size: 14,
      font: fontTimesItalic,
      color: rgb(0.3, 0.35, 0.45)
    });

    // 10. Curriculum & Practical Session Mastery paragraph
    const p1 = 'has successfully completed all required dual-control practical driving classes, vehicle controls,';
    const p2 = 'traffic regulations, hazard mitigation, slope balance, and RTO curriculum requirements for:';
    const p1W = fontTimesRoman.widthOfTextAtSize(p1, 10.5);
    const p2W = fontTimesRoman.widthOfTextAtSize(p2, 10.5);
    page.drawText(p1, {
      x: (pageWidth - p1W) / 2,
      y: pageHeight - 275,
      size: 10.5,
      font: fontTimesRoman,
      color: rgb(0.25, 0.3, 0.4)
    });
    page.drawText(p2, {
      x: (pageWidth - p2W) / 2,
      y: pageHeight - 290,
      size: 10.5,
      font: fontTimesRoman,
      color: rgb(0.25, 0.3, 0.4)
    });

    // 11. Gold Embossed Seal Graphic (Bottom Center)
    const sealX = pageWidth / 2;
    const sealY = 95;
    page.drawCircle({
      x: sealX,
      y: sealY,
      size: 36,
      color: rgb(0.92, 0.78, 0.35),
      borderColor: rgb(0.792, 0.608, 0.165),
      borderWidth: 2
    });
    page.drawCircle({
      x: sealX,
      y: sealY,
      size: 30,
      borderColor: rgb(0.067, 0.122, 0.224),
      borderWidth: 1,
      color: rgb(0.95, 0.84, 0.45)
    });
    const sealText1 = 'OFFICIAL';
    const sealText2 = 'SEAL';
    const s1W = fontHelveticaBold.widthOfTextAtSize(sealText1, 8);
    const s2W = fontHelveticaBold.widthOfTextAtSize(sealText2, 9);
    page.drawText(sealText1, {
      x: sealX - s1W / 2,
      y: sealY + 4,
      size: 8,
      font: fontHelveticaBold,
      color: rgb(0.067, 0.122, 0.224)
    });
    page.drawText(sealText2, {
      x: sealX - s2W / 2,
      y: sealY - 8,
      size: 9,
      font: fontHelveticaBold,
      color: rgb(0.067, 0.122, 0.224)
    });

    // 12. Signatures Lines & Titles
    // Left: Chief Instructor
    page.drawLine({
      start: { x: 90, y: 105 },
      end: { x: 250, y: 105 },
      thickness: 1,
      color: rgb(0.5, 0.55, 0.65)
    });
    const insTitle = 'Chief Driving Instructor';
    const insSub = '(Technical & Practical Training)';
    page.drawText(insTitle, {
      x: 90,
      y: 90,
      size: 9,
      font: fontHelveticaBold,
      color: rgb(0.15, 0.2, 0.3)
    });
    page.drawText(insSub, {
      x: 90,
      y: 78,
      size: 8,
      font: fontHelvetica,
      color: rgb(0.45, 0.5, 0.6)
    });

    // Right: Director / Principal
    page.drawLine({
      start: { x: pageWidth - 260, y: 105 },
      end: { x: pageWidth - 100, y: 105 },
      thickness: 1,
      color: rgb(0.5, 0.55, 0.65)
    });
    const dirName = 'Rajesh Mehta';
    const dirTitle = 'Principal & Managing Director';
    const dirSub = '(Apex Motor Training Academy)';
    page.drawText(dirName, {
      x: pageWidth - 260,
      y: 112,
      size: 11,
      font: fontTimesBold,
      color: rgb(0.067, 0.122, 0.224)
    });
    page.drawText(dirTitle, {
      x: pageWidth - 260,
      y: 90,
      size: 9,
      font: fontHelveticaBold,
      color: rgb(0.15, 0.2, 0.3)
    });
    page.drawText(dirSub, {
      x: pageWidth - 260,
      y: 78,
      size: 8,
      font: fontHelvetica,
      color: rgb(0.45, 0.5, 0.6)
    });
  }

  // =========================================================================
  // DYNAMIC STUDENT DETAILS INSERTION
  // Supports configurable coordinates, font size, and alignment from template
  // =========================================================================

  // Helper for drawing text with alignment
  const drawField = (
    text: string,
    fieldCfg: any,
    defaultY: number,
    defaultSize: number,
    defaultFont: any,
    defaultColor: any,
    defaultAlign: 'center' | 'left' | 'right' = 'center',
    defaultX?: number
  ) => {
    if (!text) return;
    const size = fieldCfg?.fontSize || defaultSize;
    const font = fieldCfg?.fontWeight === 'bold' ? fontHelveticaBold : defaultFont;
    const color = defaultColor;
    const textW = font.widthOfTextAtSize(text, size);

    let x = fieldCfg?.x !== undefined ? fieldCfg.x : (defaultX !== undefined ? defaultX : pageWidth / 2);
    const y = fieldCfg?.y !== undefined ? fieldCfg.y : defaultY;
    const align = fieldCfg?.alignment || defaultAlign;

    if (align === 'center') {
      x = x - textW / 2;
    } else if (align === 'right') {
      x = x - textW;
    }

    page.drawText(text, {
      x,
      y,
      size,
      font,
      color
    });
  };

  // 1. Driving School Name (Header)
  const schoolName = data.schoolName || 'APEX MOTOR DRIVING SCHOOL';
  drawField(
    schoolName.toUpperCase(),
    config?.school_name,
    pageHeight - 74,
    21,
    fontHelveticaBold,
    rgb(0.067, 0.122, 0.224),
    'center'
  );

  // 2. Student Full Name (Large, prominent calligraphy/serif)
  const studentName = data.studentName;
  drawField(
    studentName,
    config?.student_name,
    pageHeight - 225,
    28,
    fontTimesBold,
    rgb(0.067, 0.122, 0.224),
    'center'
  );

  // Decorative underline under Student Name
  const nameW = fontTimesBold.widthOfTextAtSize(studentName, 28);
  const nameX = (pageWidth - nameW) / 2;
  page.drawLine({
    start: { x: nameX - 10, y: pageHeight - 231 },
    end: { x: nameX + nameW + 10, y: pageHeight - 231 },
    thickness: 1.5,
    color: rgb(0.792, 0.608, 0.165)
  });

  // 3. Unique Student ID
  const studentIdText = `Student Identification No: ${data.studentCode}`;
  drawField(
    studentIdText,
    config?.student_code,
    pageHeight - 247,
    10,
    fontHelveticaBold,
    rgb(0.35, 0.4, 0.5),
    'center'
  );

  // 4. Course Name (Bold, highlighted)
  const courseName = `« ${data.courseName} »`;
  drawField(
    courseName,
    config?.course_name,
    pageHeight - 322,
    16,
    fontHelveticaBold,
    rgb(0.067, 0.122, 0.224),
    'center'
  );

  // 5. Course Completion Date (Calculated from verified attendance records)
  const formattedDate = formatCertificateDate(data.completionDate);
  const dateText = `Date of Completion: ${formattedDate}`;
  drawField(
    dateText,
    config?.completion_date,
    pageHeight - 345,
    11,
    fontHelveticaBold,
    rgb(0.3, 0.35, 0.45),
    'center'
  );

  // 6. Assigned Instructor Name (Over left signature)
  if (data.instructorName) {
    drawField(
      data.instructorName,
      config?.instructor_name,
      112,
      11,
      fontTimesBold,
      rgb(0.067, 0.122, 0.224),
      'left',
      90
    );
  }

  // 7. Unique Serialized Certificate Number (Bottom left metadata)
  const certNoText = `Certificate No: ${data.certificateNumber}`;
  drawField(
    certNoText,
    config?.certificate_number,
    46,
    9.5,
    fontHelveticaBold,
    rgb(0.15, 0.2, 0.3),
    'left',
    46
  );

  // 8. Public Verification QR Code
  const qrX = config?.qr_code?.x !== undefined ? config.qr_code.x : (pageWidth - 110);
  const qrY = config?.qr_code?.y !== undefined ? config.qr_code.y : 42;
  const qrSize = config?.qr_code?.size !== undefined ? config.qr_code.size : 64;

  // QR Code white background badge
  page.drawRectangle({
    x: qrX - 4,
    y: qrY - 4,
    width: qrSize + 8,
    height: qrSize + 20,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.792, 0.608, 0.165),
    borderWidth: 1
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY + 12,
    width: qrSize,
    height: qrSize
  });

  const scanLabel = 'SCAN TO VERIFY';
  const scanW = fontHelveticaBold.widthOfTextAtSize(scanLabel, 6);
  page.drawText(scanLabel, {
    x: qrX + (qrSize - scanW) / 2,
    y: qrY + 2,
    size: 6,
    font: fontHelveticaBold,
    color: rgb(0.067, 0.122, 0.224)
  });

  // Save PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Convert to Data URL (base64) for immediate client preview/download
  let binary = '';
  const len = pdfBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(pdfBytes[i]);
  }
  const base64 = btoa(binary);
  const pdfDataUrl = `data:application/pdf;base64,${base64}`;

  return { pdfBytes, pdfDataUrl };
}

/**
 * Generates an SVG string representation of the Certificate for crisp in-browser rendering
 * Matches the PDF layout with 100% visual consistency.
 */
export function generateCertificateSvg(
  data: CertificateData,
  qrDataUrl: string
): string {
  const formattedDate = formatCertificateDate(data.completionDate);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 595" class="w-full h-auto shadow-2xl select-none" style="font-family: 'Times New Roman', serif;">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E2C169" />
          <stop offset="50%" stop-color="#CA9B2A" />
          <stop offset="100%" stop-color="#9A7215" />
        </linearGradient>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCFBF7" />
          <stop offset="100%" stop-color="#F7F4EB" />
        </linearGradient>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.15" />
        </filter>
      </defs>

      <!-- Parchment Background -->
      <rect width="842" height="595" fill="url(#bgGrad)" />

      <!-- Ornate Outer Navy Border -->
      <rect x="18" y="18" width="806" height="559" fill="none" stroke="#111F39" stroke-width="2" />

      <!-- Gold Metallic Inset Border -->
      <rect x="26" y="26" width="790" height="543" fill="none" stroke="url(#goldGrad)" stroke-width="4" />

      <!-- Thin Inner Border -->
      <rect x="34" y="34" width="774" height="527" fill="none" stroke="#1F3356" stroke-width="1" />

      <!-- Corner Ornaments -->
      <rect x="38" y="38" width="28" height="28" fill="#F4EEDC" stroke="url(#goldGrad)" stroke-width="1.5" />
      <rect x="776" y="38" width="28" height="28" fill="#F4EEDC" stroke="url(#goldGrad)" stroke-width="1.5" />
      <rect x="38" y="529" width="28" height="28" fill="#F4EEDC" stroke="url(#goldGrad)" stroke-width="1.5" />
      <rect x="776" y="529" width="28" height="28" fill="#F4EEDC" stroke="url(#goldGrad)" stroke-width="1.5" />

      <!-- Header Ribbon -->
      <rect x="161" y="52" width="520" height="3" fill="url(#goldGrad)" />

      <!-- Driving School Name -->
      <text x="421" y="80" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="21" fill="#111F39" letter-spacing="1.5">
        ${data.schoolName.toUpperCase()}
      </text>

      <!-- RTO Accreditation Subheader -->
      <text x="421" y="96" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="8.5" fill="#CA9B2A" letter-spacing="2">
        GOVERNMENT RTO RECOGNIZED MOTOR TRAINING INSTITUTE
      </text>
      <text x="421" y="108" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8" fill="#64748B">
        ${data.rtoRegNo || 'RTO Reg. No: MH-12/MDS/2018/042 • Pune, Maharashtra'}
      </text>

      <!-- Certificate Title -->
      <text x="421" y="142" text-anchor="middle" font-family="'Times New Roman', serif" font-weight="bold" font-size="23" fill="#111F39" letter-spacing="0.5">
        CERTIFICATE OF COURSE COMPLETION
      </text>
      <text x="421" y="160" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="11" fill="#CA9B2A" letter-spacing="1">
        &amp; PRACTICAL MOTOR DRIVING COMPETENCE
      </text>

      <line x1="261" y1="168" x2="581" y2="168" stroke="url(#goldGrad)" stroke-width="1" />

      <!-- Statement -->
      <text x="421" y="196" text-anchor="middle" font-style="italic" font-size="14" fill="#475569">
        This is to certify that
      </text>

      <!-- Student Full Name -->
      <text x="421" y="240" text-anchor="middle" font-weight="bold" font-size="29" fill="#111F39">
        ${data.studentName}
      </text>
      <line x1="240" y1="248" x2="602" y2="248" stroke="url(#goldGrad)" stroke-width="1.5" />

      <!-- Student Code -->
      <text x="421" y="266" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="10" fill="#64748B" letter-spacing="0.5">
        Student Identification No: ${data.studentCode}
      </text>

      <!-- Course Description text -->
      <text x="421" y="295" text-anchor="middle" font-size="10.5" fill="#334155">
        has successfully completed all required dual-control practical driving classes, vehicle controls,
      </text>
      <text x="421" y="310" text-anchor="middle" font-size="10.5" fill="#334155">
        traffic regulations, hazard mitigation, slope balance, and RTO curriculum requirements for:
      </text>

      <!-- Course Name -->
      <text x="421" y="342" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="16" fill="#111F39">
        « ${data.courseName} »
      </text>

      <!-- Completion Date -->
      <text x="421" y="365" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="11" fill="#475569">
        Date of Completion: ${formattedDate}
      </text>

      <!-- Center Gold Embossed Seal -->
      <g transform="translate(421, 495)">
        <circle r="36" fill="url(#goldGrad)" filter="url(#shadow)" stroke="#A07817" stroke-width="1.5" />
        <circle r="30" fill="#FBF7EB" stroke="#111F39" stroke-width="1" />
        <text x="0" y="-4" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="8" fill="#111F39" letter-spacing="1">OFFICIAL</text>
        <text x="0" y="10" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="10" fill="#CA9B2A" letter-spacing="1.5">SEAL</text>
      </g>

      <!-- Signatures -->
      <!-- Left: Chief Instructor -->
      <g transform="translate(90, 485)">
        <text x="0" y="-12" font-weight="bold" font-size="12" fill="#111F39">${data.instructorName || 'Vikram Shinde'}</text>
        <line x1="0" y1="0" x2="160" y2="0" stroke="#94A3B8" stroke-width="1" />
        <text x="0" y="16" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="9" fill="#1E293B">Chief Driving Instructor</text>
        <text x="0" y="28" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8" fill="#64748B">(Technical &amp; Practical Training)</text>
      </g>

      <!-- Right: Director / Principal -->
      <g transform="translate(582, 485)">
        <text x="0" y="-12" font-weight="bold" font-size="12" fill="#111F39">Rajesh Mehta</text>
        <line x1="0" y1="0" x2="160" y2="0" stroke="#94A3B8" stroke-width="1" />
        <text x="0" y="16" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="9" fill="#1E293B">Principal &amp; Managing Director</text>
        <text x="0" y="28" font-family="'Helvetica Neue', Arial, sans-serif" font-size="8" fill="#64748B">(Apex Motor Training Academy)</text>
      </g>

      <!-- Bottom Metadata: Certificate Number -->
      <text x="46" y="555" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="9.5" fill="#1E293B">
        Certificate No: <tspan fill="#0284C7">${data.certificateNumber}</tspan>
      </text>

      <!-- Bottom Right QR Code -->
      <g transform="translate(732, 502)">
        <rect x="-4" y="-4" width="72" height="84" fill="#FFFFFF" stroke="#CA9B2A" stroke-width="1" rx="4" />
        <image href="${qrDataUrl}" x="0" y="0" width="64" height="64" />
        <text x="32" y="73" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="bold" font-size="6" fill="#111F39" letter-spacing="0.5">
          SCAN TO VERIFY
        </text>
      </g>
    </svg>
  `;
}
