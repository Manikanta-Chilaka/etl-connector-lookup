# How to Host on GitHub

Since **Git** is not currently installed on your computer (or not in your PATH), we need to set that up first.

## Phase 1: Install Git
1.  Download Git for Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2.  Run the installer. You can click "Next" through most options, but make sure **"Git from the command line and also from 3rd-party software"** is selected.
3.  After installation, **restart your terminal** (close and reopen VS Code or PowerShell) to make the `git` command available.

## Phase 2: Prepare the Project
1.  Open `vite.config.js` in this project.
2.  Add the `base` property with your repository name.
    *   *Example*: If you plan to name your GitHub repository `etl-connector-lookup`, your config should look like this:
    ```javascript
    export default defineConfig({
      plugins: [react()],
      base: '/etl-connector-lookup/', // <--- Add this line!
    })
    ```

## Phase 3: Create GitHub Repository
1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right -> **New repository**.
3.  Name it (e.g., `etl-connector-lookup`).
4.  Make it **Public**.
5.  Do **not** check "Initialize with README" (you already have one).
6.  Click **Create repository**.

## Phase 4: Push Code (Run these commands in terminal)
Once Git is installed and you have restarted the terminal:

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Commit changes
git commit -m "Initial commit"

# 4. Link to GitHub (Replace URL with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/etl-connector-lookup.git

# 5. Push to GitHub
git push -u origin master
```

## Phase 5: Deploy to GitHub Pages
1.  Go to your repository on GitHub.
2.  Click **Settings** (top tab).
3.  Click **Pages** (left sidebar).
4.  Under **Source**, select **GitHub Actions**.
5.  Click **Configure** on "Static HTML" or "Vite" if it suggests it, OR:
    *   Simply go back to your code.
    *   Create a file `.github/workflows/deploy.yml` with the content below.

### `.github/workflows/deploy.yml`
(Copy and paste this into a new file in your project)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Once you push this file to GitHub, the "Actions" tab will show the deployment running. When it finishes, your site will be live!
