# How to Push Your Code to GitHub

Follow these steps to upload your project to GitHub.

## 1. Create a Repository on GitHub

1.  Go to [GitHub.com](https://github.com) and log in.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  **Repository name**: Enter a name (e.g., `etl-connector-lookup`).
4.  **Public/Private**: Choose your preference.
5.  **Initialize this repository with**: Leave all these unchecked (no README, no .gitignore, no License) because we are pushing an existing project.
6.  Click **Create repository**.
7.  Copy the **HTTPS URL** provided (it looks like `https://github.com/username/repo-name.git`).

## 2. Prepare Your Local Project

1.  Open your terminal (Command Prompt or PowerShell) in your project folder:
    ```powershell
    cd c:\Users\Manikanta\Desktop\ETL
    ```

2.  Initialize Git (if you haven't already):
    ```powershell
    git init
    ```

3.  Add all files to the staging area:
    ```powershell
    git add .
    ```

4.  Commit the changes:
    ```powershell
    git commit -m "Initial commit: Enhanced ETL Connector Lookup app"
    ```

## 3. Connect and Push

1.  Link your local project to the GitHub repository (replace `YOUR_REPO_URL` with the URL you copied in Step 1):
    ```powershell
    git remote add origin YOUR_REPO_URL
    ```
    *Note: If you get an error saying "remote origin already exists", run `git remote set-url origin YOUR_REPO_URL` instead.*

2.  Push your code to the main branch:
    ```

## 4. How to Push Updates (Future Changes)

Whenever you make changes to your code and want to update GitHub, follow these 3 steps:

1.  **Add changes**:
    ```powershell
    git add .
    ```

2.  **Commit changes** (give a descriptive message):
    ```powershell
    git commit -m "Updated form with Google Sheets integration"
    ```

3.  **Push to GitHub**:
    ```powershell
    git push
    ```powershell
    git push -u origin main
    ```

## Troubleshooting

-   **Authentication**: If asked for a username and password, use your GitHub username and a **Personal Access Token** (not your password), or sign in via the browser prompt if available.
-   **Branch Name**: If `main` doesn't exist, try `master`: `git push -u origin master`.
