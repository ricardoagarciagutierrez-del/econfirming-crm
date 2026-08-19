const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const designDir = path.join(src, 'design');
if (!fs.existsSync(designDir)) fs.mkdirSync(designDir, { recursive: true });

// Write tokens TypeScript file
const tokensTs = `// Auto-generated BCI-like design tokens
export const colors = {
  primary: '#C8102E',
  primary600: '#aa0f25',
  primary100: '#fff5f6',
  accent: '#0b63b6',
  dark: '#0f1724',
  muted: '#6b7280',
  surface: '#ffffff',
};

export const radius = '12px';
export const shadows = {
  sm: '0 6px 18px rgba(16,24,40,0.06)',
  md: '0 10px 30px rgba(16,24,40,0.08)'
};
`;
fs.writeFileSync(path.join(designDir, 'tokens.ts'), tokensTs, 'utf8');

// Write branding CSS
const brandingCss = `/* Auto-generated branding variables for BCI look */
:root {
  --bci-primary: #C8102E;
  --bci-primary-600: #aa0f25;
  --bci-primary-100: #fff5f6;
  --bci-accent: #0b63b6;
  --bci-dark: #0f1724;
  --bci-muted: #6b7280;
  --bci-surface: #ffffff;
  --bci-radius: 12px;
  --bci-shadow-sm: 0 6px 18px rgba(16,24,40,0.06);
  --bci-shadow-md: 0 10px 30px rgba(16,24,40,0.08);
}

/* Minimal helpers */
.bci-btn { background: var(--bci-primary); color: white; border-radius: 8px; }
.bci-card { background: var(--bci-surface); border-radius: var(--bci-radius); box-shadow: var(--bci-shadow-sm); }
`;
fs.writeFileSync(path.join(designDir, 'branding.css'), brandingCss, 'utf8');

// Ensure index.css imports the branding file at the top
const indexCssPath = path.join(src, 'index.css');
let indexCss = fs.existsSync(indexCssPath) ? fs.readFileSync(indexCssPath, 'utf8') : '';
const importLine = "@import './design/branding.css';\n";
if (!indexCss.includes("design/branding.css")) {
  indexCss = importLine + indexCss;
  fs.writeFileSync(indexCssPath, indexCss, 'utf8');
  console.log('Inserted branding import into src/index.css');
} else {
  console.log('src/index.css already imports branding.css');
}

console.log('Created design tokens and branding CSS.');

// eslint-disable-next-line no-process-exit
process.exit(0);
