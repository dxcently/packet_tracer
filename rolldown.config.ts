import { RolldownOptions, Plugin } from 'rolldown';
import fs from 'node:fs';
import path from 'node:path';

const pagesDir = './src/frontend/pages';

const pages: string[] = fs.readdirSync(pagesDir).filter((f) =>
  fs.statSync(path.join(pagesDir, f)).isDirectory()
);

const watchHtmlPlugin = (page: string): Plugin => ({
  name: 'watch-html-and-copy',
  
  buildStart() {
    const htmlPath = path.resolve(pagesDir, page, 'index.html');
    if (fs.existsSync(htmlPath)) {
      this.addWatchFile(htmlPath);
    }
  },

  async generateBundle() {
    const source = path.resolve(pagesDir, page, 'index.html');
    const destDir = path.resolve('public', page);
    
    if (fs.existsSync(source)) {
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(source, path.join(destDir, 'index.html'));
      console.log(`Copied ${page}/index.html`);
    }
  }
});

const configs: RolldownOptions[] = pages.map((page) => {
  const entryTsx = path.join(pagesDir, page, 'index.tsx');
  const entryTs = path.join(pagesDir, page, 'index.ts');
  const inputPath = fs.existsSync(entryTsx) ? entryTsx
    : fs.existsSync(entryTs) ? entryTs
    : path.join(pagesDir, page, 'index.js');

  return {
    input: inputPath,
    output: {
      dir: `public/${page}`,
      format: 'esm',
    },
    plugins: [watchHtmlPlugin(page)],
  };
});

export default configs;