# HTML Console Standalone Bundle

This folder lets you generate a static, standalone build of the HTML Console (wireframe explorer) without the rest of the application chrome.

## Prerequisites

- Node.js 18.x (or newer)
- npm 9.x (or newer)

## Build Steps

1. Install dependencies (run once per clone):

   ```bash
   npm install
   ```

2. Generate the standalone bundle:

   ```bash
   npm run build:html-console
   ```

   The compiled assets land in `standalone/html-console/dist/`.

3. Open `standalone/html-console/dist/index.html` in any modern browser (double-click, or serve with a static file server).

## Notes

- The bundle is still a React SPA; all routes are handled client-side. Loading `index.html` directly will show the HTML Console at `/settings/html-preview`.
- Because this is an isolated build, backend API calls made by individual wireframes may fail (they rely on your server). The console is intended for UI review only.

## Git Workflow Reminder

After generating or modifying the console, you can push the changes upstream with:

```bash
git status
git add .
git commit -m "Add/update HTML console standalone bundle"
git push
```

Feel free to adjust the commit message to match your change log standards.


