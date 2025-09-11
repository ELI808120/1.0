import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import type { SiteData } from '../../src/types';
// FIX: Import Buffer to resolve TypeScript error "Cannot find name 'Buffer'". This is the standard way to access Buffer in modern Node.js.
import { Buffer } from 'buffer';

// The GitHub API endpoint for updating a file
const getRepoAPIUrl = (owner: string, repo: string, path: string) => 
  `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

// Simple function to format the new file content
const createNewFileContent = (data: SiteData): string => {
    const jsonString = JSON.stringify(data, null, 2);
    return `import type { SiteData } from '../types';\n\nexport const initialData: SiteData = ${jsonString};\n`;
};

// Main handler for the Netlify Function
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // 1. Check for POST request
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  // 2. Get environment variables
  const { GITHUB_PAT, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_REPO_BRANCH } = process.env;
  if (!GITHUB_PAT || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME || !GITHUB_REPO_BRANCH) {
      return {
          statusCode: 500,
          body: JSON.stringify({ message: "Server configuration error: Missing GitHub environment variables." }),
      };
  }
  const FILE_PATH = 'src/data/initialData.ts';
  const API_URL = getRepoAPIUrl(GITHUB_REPO_OWNER, GITHUB_REPO_NAME, FILE_PATH);

  try {
    // 3. Parse incoming site data
    const siteData = JSON.parse(event.body || '{}') as SiteData;
    if (!siteData || !siteData.siteSettings) {
        return { statusCode: 400, body: JSON.stringify({ message: "Bad Request: Invalid site data." }) };
    }
    
    // 4. Get the current file's SHA from GitHub (required for updates)
    const fetchFileResponse = await fetch(API_URL + `?ref=${GITHUB_REPO_BRANCH}`, {
        headers: { 'Authorization': `token ${GITHUB_PAT}` }
    });
    if (!fetchFileResponse.ok) {
        throw new Error(`Failed to fetch file SHA. Status: ${fetchFileResponse.status}`);
    }
    const fileData = await fetchFileResponse.json();
    const currentSha = fileData.sha;

    // 5. Prepare the new content and commit payload
    const newContentString = createNewFileContent(siteData);
    const encodedContent = Buffer.from(newContentString).toString('base64');

    const commitPayload = {
        message: `feat(content): Automated content update via CMS [skip ci]`,
        content: encodedContent,
        sha: currentSha,
        branch: GITHUB_REPO_BRANCH,
        committer: {
            name: "Course Admin Bot",
            email: "bot@netlify.app"
        }
    };

    // 6. Send the update request to GitHub API
    const updateResponse = await fetch(API_URL, {
        method: "PUT",
        headers: {
            'Authorization': `token ${GITHUB_PAT}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(commitPayload)
    });

    if (!updateResponse.ok) {
        const errorBody = await updateResponse.text();
        console.error("GitHub API Error:", errorBody);
        throw new Error(`GitHub API failed to update file. Status: ${updateResponse.status}`);
    }

    // 7. Success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Content updated successfully! A new deployment has been triggered." }),
    };

  } catch (error) {
    console.error("Error in update-content function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An internal error occurred.", error: error.message }),
    };
  }
};

export { handler };