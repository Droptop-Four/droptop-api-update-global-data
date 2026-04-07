import { sign } from '@tsndr/cloudflare-worker-jwt';


export async function authenticateGithubApp(appId, privateKey, repo) {
    try {
        console.log(`[OAuth] Starting GitHub App authentication with App ID: ${appId}`);
        const token = await generateGithubAppJWT(appId, privateKey);
        console.debug(`[OAuth] JWT generated successfully`);
        const accessToken = await getGithubInstallationAccessToken(token, 'Droptop-Four', repo);
        console.log(`[OAuth] GitHub App authentication successful`);
        return accessToken;
    } catch (error) {
        console.error(`[OAuth FAILED] ${error.message}`);
        throw error;
    }
}

export const createGithubHeaders = (token) => ({
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2026-03-10',
    'User-Agent': 'droptop-api-update-global-data',
});

async function generateGithubAppJWT(appId, privateKey) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 600;

    const payload = {
        iat,
        exp,
        iss: appId,
    };

    const token = await sign(payload, privateKey, { algorithm: 'RS256' });
    return token;
}

async function getGithubInstallationAccessToken(appJWT, owner, repo) {
    const installationUrl = `https://api.github.com/repos/${owner}/${repo}/installation`;

    console.debug(`[OAuth Debug] Requesting installation from: ${installationUrl}`);
    console.debug(`[OAuth Debug] JWT starts with: ${appJWT.substring(0, 20)}...`);

    const installationResponse = await fetch(installationUrl, {
        headers: {
            Authorization: `Bearer ${appJWT}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'droptop-api-update-global-data',
        },
    });

    if (!installationResponse.ok) {
        const errorBody = await installationResponse.text();
        console.error(`[OAuth Error] Installation response body: ${errorBody}`);
        throw new Error(`Failed to get GitHub installation: ${installationResponse.status} - ${errorBody}`);
    }

    const installation = await installationResponse.json();
    const installationId = installation.id;
    console.debug(`[OAuth Debug] Installation ID: ${installationId}`);

    const tokenUrl = `https://api.github.com/app/installations/${installationId}/access_tokens`;
    console.debug(`[OAuth Debug] Requesting access token from: ${tokenUrl}`);

    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${appJWT}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'droptop-api-update-global-data',
        },
    });

    if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.text();
        console.error(`[OAuth Error] Token response body: ${errorBody}`);
        throw new Error(`Failed to get installation access token: ${tokenResponse.status} - ${errorBody}`);
    }

    const tokenData = await tokenResponse.json();
    console.debug(`[OAuth Debug] Access token acquired successfully`);
    return tokenData.token;
}
