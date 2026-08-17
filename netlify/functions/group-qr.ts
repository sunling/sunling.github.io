import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  const token = process.env.GH_RW_WORKSHOP_ASSETS_TOKEN;
  if (!token) {
    return { statusCode: 500, body: "Missing GH_RW_WORKSHOP_ASSETS_TOKEN" };
  }

  const repoName = process.env.GH_REPO_NAME || "workshop-assets";
  // Assuming the owner is sunling if not specified in repoName
  const fullRepoName = repoName.includes('/') ? repoName : `sunling/${repoName}`;
  const branch = process.env.GH_REPO_BRANCH || "main";
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${fullRepoName}/contents/group-qr/from-recording-to-practice-2026-08/latest.png?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      return { statusCode: response.status, body: "Failed to fetch QR code from GitHub" };
    }

    const data = await response.json();

    if (!data.download_url) {
      return { statusCode: 404, body: "QR code not found" };
    }

    return {
      statusCode: 302,
      headers: {
        Location: data.download_url,
      },
      body: "",
    };
  } catch (error) {
    console.error("Error fetching group QR code:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
