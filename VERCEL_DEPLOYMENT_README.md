# How to Deploy to Vercel

Vercel is the easiest way to deploy your React/Vite application. Since your code is already on GitHub, this process is very fast.

## Prerequisites
-   You must have your code pushed to GitHub (which you just did!).
-   You need a Vercel account.

## Step-by-Step Guide

1.  **Go to Vercel**:
    -   Visit [vercel.com](https://vercel.com) and sign up (or log in).
    -   **Tip**: Sign up using your **GitHub account**. This makes connecting your repo automatic.

2.  **Import Project**:
    -   On your Vercel dashboard, click **"Add New..."** > **"Project"**.
    -   You should see a list of your GitHub repositories.
    -   Find **`etl-connector-lookup`** (or whatever you named it) and click **"Import"**.

3.  **Configure Project**:
    -   **Framework Preset**: It should automatically detect **"Vite"**. If not, select it from the dropdown.
    -   **Root Directory**: Leave as `./`.
    -   **Build Command**: Leave as `npm run build` (default).
    -   **Output Directory**: Leave as `dist` (default).
    -   **Environment Variables**: You don't need any for this app (unless you want to hide your Google Script URL, but for now it's fine in the code).

4.  **Deploy**:
    -   Click **"Deploy"**.
    -   Wait a minute or two. Vercel will build your site.

5.  **Success!**:
    -   Once done, you will see a "Congratulations!" screen.
    -   Click the **preview image** or the **Visit** button to see your live website.
    -   You can share this URL with anyone!

## Automatic Updates
-   Now that it's connected, every time you run `git push` to update your GitHub repo, Vercel will **automatically** re-deploy your site with the new changes!
