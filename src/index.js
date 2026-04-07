import { Toucan } from 'toucan-js';

const base64 = require('base-64');
const JSONbig = require('json-bigint');
import { Buffer } from 'node:buffer';
import { authenticateGithubApp, createGithubHeaders } from './utils.js';

async function getAnnouncements() {
	console.log('Fetching announcements from database...');
	const url = `https://api.droptopfour.com/v1/announcements`;
	const response = await fetch(url);

	if (!response.ok) {
		console.error('Failed to fetch announcements from API');
		throw new Error('Failed to fetch announcements from API');
	}
	const data = await response.json();
	console.log('Announcements fetched successfully');
	return data;
}

async function getApps() {
	console.log('Fetching community apps from database...');
	const url = `https://api.droptopfour.com/v1/community-apps`;
	const response = await fetch(url);

	if (!response.ok) {
		console.error('Failed to fetch community apps from API');
		throw new Error('Failed to fetch community apps from API');
	}
	const data = await response.json();
	console.log('Community apps fetched successfully:', data.length);
	return data;
}

async function getDroptopVersion() {
	console.log('Fetching latest Droptop version from database...');
	const url = `https://api.droptopfour.com/v1/droptop`;
	const response = await fetch(url);

	if (!response.ok) {
		console.error('Failed to fetch latest Droptop version from API');
		throw new Error('Failed to fetch latest Droptop version from API');
	}
	const data = await response.json();
	console.log('Latest Droptop version fetched successfully:', data.version);
	return data;
}

async function getThemes() {
	console.log('Fetching community themes from database...');
	const url = `https://api.droptopfour.com/v1/community-themes`;
	const response = await fetch(url);

	if (!response.ok) {
		console.error('Failed to fetch community themes from API');
		throw new Error('Failed to fetch community themes from API');
	}
	const data = await response.json();
	console.log('Community themes fetched successfully:', data.length);
	return data;
}

async function updateApps(token, url, communityApps) {
	console.log('Updating community apps on GitHub...');

	const path = 'data/community_apps/community_apps.json';
	let completeUrl = `${url}${path}`;

	let response = await fetch(completeUrl, {
		method: 'GET',
		headers: createGithubHeaders(token),
	});

	if (!response.ok) {
		console.error('Failed to fetch community apps file');
		return;
	}

	const fileData = await response.json();
	const contentDecoded = base64.decode(fileData.content);
	let jsonData = JSONbig.parse(contentDecoded);

	jsonData.apps = communityApps;
	jsonData.apps.sort((a, b) => a.id - b.id).reverse();
	const updatedContent = JSONbig.stringify(jsonData, null, 4);
	const updatedContentEncoded = Buffer.from(updatedContent, 'utf-8').toString('base64');

	response = await fetch(completeUrl, {
		method: 'PUT',
		headers: createGithubHeaders(token),
		body: JSON.stringify({
			message: 'Updated apps from db',
			content: updatedContentEncoded,
			sha: fileData.sha,
		}),
	});

	if (!response.ok) {
		console.error('Failed to commit updated Community Apps');
	}

	console.log('Community apps updated successfully');
}

async function updateThemes(token, url, communityThemes) {
	console.log('Updating community themes on GitHub...');

	const path = 'data/community_themes/community_themes.json';
	let completeUrl = `${url}${path}`;

	let response = await fetch(completeUrl, {
		method: 'GET',
		headers: createGithubHeaders(token),
	});

	if (!response.ok) {
		console.error('Failed to fetch community themes file');
		return;
	}

	const fileData = await response.json();
	const contentDecoded = base64.decode(fileData.content);
	let jsonData = JSONbig.parse(contentDecoded);

	jsonData.themes = communityThemes;
	jsonData.themes.sort((a, b) => a.id - b.id).reverse();
	const updatedContent = JSONbig.stringify(jsonData, null, 4);
	const updatedContentEncoded = Buffer.from(updatedContent, 'utf-8').toString('base64');

	response = await fetch(completeUrl, {
		method: 'PUT',
		headers: createGithubHeaders(token),
		body: JSON.stringify({
			message: 'Updated themes from db',
			content: updatedContentEncoded,
			sha: fileData.sha,
		}),
	});

	if (!response.ok) {
		console.error('Failed to commit updated Community Themes');
	}

	console.log('Community themes updated successfully');
}

async function updateDroptopVersion(token, url, droptopVersion) {
	console.log('Updating latest Droptop version on GitHub...');

	const path = 'data/version.json';
	let completeUrl = `${url}${path}`;

	let response = await fetch(completeUrl, {
		method: 'GET',
		headers: createGithubHeaders(token),
	});

	if (!response.ok) {
		console.error('Failed to fetch Droptop version file');
		return;
	}

	const fileData = await response.json();
	const contentDecoded = base64.decode(fileData.content);
	let jsonData = JSONbig.parse(contentDecoded);

	jsonData.version = droptopVersion.version;
	jsonData.miniversion = droptopVersion.miniversion;

	const updatedContent = JSONbig.stringify(jsonData, null, 4);
	const updatedContentEncoded = Buffer.from(updatedContent, 'utf-8').toString('base64');

	response = await fetch(completeUrl, {
		method: 'PUT',
		headers: createGithubHeaders(token),
		body: JSON.stringify({
			message: 'Updated Droptop version from db',
			content: updatedContentEncoded,
			sha: fileData.sha,
		}),
	});

	if (!response.ok) {
		console.error('Failed to commit updated Droptop version');
	}

	console.log('Latest Droptop version updated successfully');
}

export default {
	async scheduled(event, env, ctx) {
		const sentry = new Toucan({
			dsn: env.SENTRY_DSN,
			context: ctx,
		});

		const url = `https://api.github.com/repos/Droptop-Four/${env.GLOBALDATA_REPO}/contents/`;

		try {
			console.log('Starting Global data update');
			console.log('Fetching data from database...');

			const communityApps = await getApps();
			const communityThemes = await getThemes();
			const droptopVersion = await getDroptopVersion();
			// const announcements = await getAnnouncements();
			// const changelog = await getChangelog();

			console.log('Data fetched successfully');
			console.log('Updating Global data on GitHub...');

			let token;
			if (env.GITHUB_APP_ID && env.GITHUB_APP_PRIVATE_KEY) {
				console.log('Using GitHub App OAuth authentication');
				token = await authenticateGithubApp(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY, env.GLOBALDATA_REPO);
			} else {
				throw new Error('No GitHub authentication credentials found');
			}

			await updateApps(token, url, communityApps);
			await updateThemes(token, url, communityThemes);
			await updateDroptopVersion(token, url, droptopVersion);
			// await updateAnnouncements(token, url, announcements);
			// await updateChangelog(token, url, changelog);

			console.log('Global data updated successfully');
		} catch (error) {
			sentry.captureException(error);
			console.error('Error updating Global data:', error.message);
		}
	},
};
