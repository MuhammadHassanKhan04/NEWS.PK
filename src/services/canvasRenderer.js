// High-DPI HTML5 Canvas Renderer Engine for NewsPilot AI

export const ASPECT_RATIOS = {
  '4:5': { width: 1080, height: 1350, label: 'Instagram Portrait (4:5)' },
  '1:1': { width: 1080, height: 1080, label: 'Instagram Square (1:1)' },
  '9:16': { width: 1080, height: 1920, label: 'Story / Reel (9:16)' },
  '16:9': { width: 1600, height: 900, label: 'Twitter / LinkedIn (16:9)' }
};

// Helper to draw rounded rectangles
function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle, lineWidth = 1) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

// Robust Load Image Helper with CORS retry & fallback handling
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);

    if (src.startsWith('data:') || src.startsWith('blob:')) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const retryImg = new Image();
      retryImg.onload = () => resolve(retryImg);
      retryImg.onerror = () => resolve(null);
      retryImg.src = src;
    };
    img.src = src;
  });
}

// Helper: Wrap text onto lines intelligently
function wrapTextToLines(ctx, text, maxWidth, maxLines = 4) {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines.slice(0, maxLines);
}

// Tokenize line into word-by-word fragments matching any target words/phrases across line breaks
function tokenizeHeadlineLine(lineText, customHighlightWords = '') {
  if (!customHighlightWords || !customHighlightWords.trim()) {
    return [{ text: lineText, isHighlighted: false }];
  }

  // Collect raw target phrases (comma separated)
  const rawTargets = customHighlightWords
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (rawTargets.length === 0) {
    return [{ text: lineText, isHighlighted: false }];
  }

  // Build target words & phrases set
  const targetSet = new Set();
  rawTargets.forEach(target => {
    targetSet.add(target.toLowerCase());
    target.split(/\s+/).forEach(w => {
      const clean = w.toLowerCase().replace(/^[^\w$%\-+]+|[^\w$%\-+]+$/g, '');
      if (clean.length > 0) {
        targetSet.add(clean);
      }
    });
  });

  // Break lineText into words and spaces preserving exact spacing
  const items = lineText.match(/(\S+|\s+)/g) || [lineText];
  const tokens = [];

  items.forEach((item) => {
    if (/^\s+$/.test(item)) {
      tokens.push({ text: item, isHighlighted: false });
    } else {
      const cleanWord = item.toLowerCase().replace(/^[^\w$%\-+]+|[^\w$%\-+]+$/g, '');

      if (cleanWord && targetSet.has(cleanWord)) {
        const match = item.match(/^([^\w$%\-+]*)([\w$%\-+]+)([^\w$%\-+]*)$/);
        if (match) {
          if (match[1]) tokens.push({ text: match[1], isHighlighted: false });
          tokens.push({ text: match[2], isHighlighted: true });
          if (match[3]) tokens.push({ text: match[3], isHighlighted: false });
        } else {
          tokens.push({ text: item, isHighlighted: true });
        }
      } else {
        tokens.push({ text: item, isHighlighted: false });
      }
    }
  });

  return tokens;
}

// Render User's Logo at their chosen position & size
function renderBrandLogo(ctx, logoImg, brand, width, height) {
  const position = brand?.logoPosition || 'top-left';
  const logoH = brand?.logoSize || 80;
  const padding = 60;

  let x = padding;
  let y = padding;

  let logoW = logoH;
  if (logoImg && logoImg.height) {
    logoW = (logoImg.width / logoImg.height) * logoH;
  }

  if (position === 'top-right') {
    x = width - padding - logoW;
    y = padding;
  } else if (position === 'bottom-left') {
    x = padding;
    y = height - padding - logoH - 40;
  } else if (position === 'bottom-right') {
    x = width - padding - logoW;
    y = height - padding - logoH - 40;
  } else {
    x = padding;
    y = padding;
  }

  if (logoImg) {
    ctx.drawImage(logoImg, x, y, logoW, logoH);
  } else {
    const fontFamily = brand?.fontFamily || 'Outfit';
    ctx.save();
    ctx.font = `900 ${Math.round(logoH * 0.35)}px "${fontFamily}", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('dP', x, y + Math.round(logoH * 0.4));
    ctx.font = `900 ${Math.round(logoH * 0.22)}px "${fontFamily}", sans-serif`;
    ctx.fillText('STARTUP', x, y + Math.round(logoH * 0.7));
    ctx.fillText('PAKISTAN', x, y + Math.round(logoH * 0.95));
    ctx.restore();
  }
}

// Render User's Enabled Social Icons Bar (Prominent, High Visibility)
function renderSocialBar(ctx, centerX, y, socialIconsConfig) {
  ctx.save();
  const iconMap = [
    { key: 'facebook', label: 'f' },
    { key: 'instagram', label: '📷' },
    { key: 'twitter', label: '𝕏' },
    { key: 'linkedin', label: 'in' },
    { key: 'youtube', label: '▶' },
    { key: 'website', label: 'www' }
  ];

  const enabledIcons = iconMap.filter(item => socialIconsConfig?.[item.key] !== false);
  if (enabledIcons.length === 0) {
    ctx.restore();
    return;
  }

  const spacing = 64; // Increased spacing for larger icons
  const startX = centerX - ((enabledIcons.length - 1) * spacing) / 2;

  ctx.textAlign = 'center';

  enabledIcons.forEach((iconObj, idx) => {
    const x = startX + idx * spacing;
    
    // Background Glass Circle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y - 7, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Icon Label Text
    ctx.font = '800 20px "Outfit", "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText(iconObj.label, x, y);
    ctx.shadowBlur = 0;
  });
  ctx.restore();
}

// Render Editorial Background Fallback
function renderFallbackEditorialBackground(ctx, width, height, category) {
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0f1d');
  bgGrad.addColorStop(0.5, '#111827');
  bgGrad.addColorStop(1, '#05070d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.5, height * 0.35, 20, width * 0.5, height * 0.35, 450);
  glow.addColorStop(0, 'rgba(255, 200, 0, 0.15)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

// Main Canvas Render Function
export async function renderPosterToCanvas(canvas, posterData, brandKit) {
  if (!canvas) return;

  const ratio = ASPECT_RATIOS[posterData.platformRatio || '4:5'] || ASPECT_RATIOS['4:5'];
  const width = ratio.width;
  const height = ratio.height;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Preload Images
  const [mainImg, logoImg] = await Promise.all([
    loadImage(posterData.imageUrl),
    loadImage(brandKit?.logo)
  ]);

  // Clear Canvas
  ctx.clearRect(0, 0, width, height);

  renderStartupPakistanExactTemplate(ctx, width, height, posterData, brandKit, mainImg, logoImg);
}

// ----------------------------------------------------
// TEMPLATE: STARTUP PAKISTAN (EXACT HIGHLIGHT LAYOUT)
// ----------------------------------------------------
function renderStartupPakistanExactTemplate(ctx, width, height, poster, brand, mainImg, logoImg) {
  const highlightColor = brand.accentColor || '#ffc800'; // Vibrant Yellow (#ffc800)
  const fontFamily = brand.fontFamily || 'Outfit';

  // 1. Background Image or Fallback Graphic
  if (mainImg) {
    try {
      const imgRatio = mainImg.width / mainImg.height;
      const canvasRatio = width / height;
      let renderW = width;
      let renderH = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        renderW = height * imgRatio;
        offsetX = -(renderW - width) / 2;
      } else {
        renderH = width / imgRatio;
        offsetY = -(renderH - height) / 2;
      }
      ctx.drawImage(mainImg, offsetX, offsetY, renderW, renderH);
    } catch (e) {
      renderFallbackEditorialBackground(ctx, width, height, poster.category);
    }
  } else {
    renderFallbackEditorialBackground(ctx, width, height, poster.category);
  }

  // 2. Bottom Dark Vignette Gradient
  const overlay = ctx.createLinearGradient(0, height * 0.3, 0, height);
  overlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
  overlay.addColorStop(0.35, 'rgba(0, 0, 0, 0.65)');
  overlay.addColorStop(0.85, 'rgba(0, 0, 0, 0.95)');
  overlay.addColorStop(1, '#000000');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, height * 0.3, width, height * 0.7);

  // Top Subtle Shadow Vignette
  const topOverlay = ctx.createLinearGradient(0, 0, 0, 200);
  topOverlay.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  topOverlay.addColorStop(1, 'transparent');
  ctx.fillStyle = topOverlay;
  ctx.fillRect(0, 0, width, 200);

  // 3. Render Brand Logo
  renderBrandLogo(ctx, logoImg, brand, width, height);

  // 4. Headline Text with Word-Level Yellow Highlights for ONLY user specified words
  const headlineText = poster.headline || 'At Just 17, Muhammad Hassan Khan Founded Ikotek Solutions and Successfully Delivered 100+ Projects';
  const customHighlightWords = poster.highlightWords || '';

  ctx.font = `900 44px "${fontFamily}", sans-serif`;
  const rawLines = wrapTextToLines(ctx, headlineText, width - 140, 4);

  const lineGap = 68;
  let textY = height - 140 - (rawLines.length * lineGap);

  ctx.textAlign = 'left';

  rawLines.forEach((lineText) => {
    const tokens = tokenizeHeadlineLine(lineText, customHighlightWords);

    // Calculate total line width for centering
    let totalLineW = 0;
    tokens.forEach(tok => {
      totalLineW += ctx.measureText(tok.text).width;
    });

    let currX = (width - totalLineW) / 2;

    tokens.forEach((tok) => {
      const tokW = ctx.measureText(tok.text).width;

      if (tok.isHighlighted) {
        // Yellow Highlight Box for ONLY this word/fragment!
        const boxPaddingX = 10;
        const boxHeight = 56;
        const boxX = currX - (boxPaddingX / 2);
        const boxY = textY - 42;

        drawRoundedRect(ctx, boxX, boxY, tokW + boxPaddingX, boxHeight, 8, highlightColor, null);

        // Black Text Inside Box
        ctx.fillStyle = '#000000';
        ctx.fillText(tok.text, currX, textY);
      } else {
        // Crisp Simple White Text (Zero Yellow Box!)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(tok.text, currX, textY);
        ctx.shadowBlur = 0;
      }

      currX += tokW;
    });

    textY += lineGap;
  });

  // 5. Render Enabled Social Media Icons Bar (Prominent Size)
  renderSocialBar(ctx, width / 2, height - 50, brand?.socialIcons);
}

export function exportCanvasAsPNG(canvas, filename = 'newspilot-poster.png') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export function exportCanvasAsJPG(canvas, filename = 'newspilot-poster.jpg') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.click();
}

export function exportCanvasAsPDF(canvas, filename = 'newspilot-poster.pdf') {
  if (!canvas) return;
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfWindow = window.open("");
  pdfWindow.document.write(`
    <html>
      <head><title>${filename}</title></head>
      <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#000;">
        <img src="${imgData}" style="max-width:100%; height:auto;" />
        <script>setTimeout(() => { window.print(); }, 500);</script>
      </body>
    </html>
  `);
}
