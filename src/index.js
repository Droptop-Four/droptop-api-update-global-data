import * as Realm from 'realm-web';
import { Toucan } from 'toucan-js';
const { sign } = require('@tsndr/cloudflare-worker-jwt');

const base64 = require('base-64');
const JSONbig = require('json-bigint');
import { Buffer } from 'buffer';

const {
	BSON: { ObjectId },
} = Realm;

async function realmLogin(appId, apiKey) {
	const app = new Realm.App({ id: appId });
	const credentials = Realm.Credentials.apiKey(apiKey);
	const user = await app.logIn(credentials);
	console.assert(user.id === app.currentUser.id);
	return user;
}

async function updateApps(token, collection, url) {
	const path = 'data/community_apps/community_apps.json';

	let completeUrl = `${url}${path}?ref=tests`;

	let response = await fetch(completeUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'update-community-apps-themes-downloads',
		},
	});

	if (!response.ok) {
		console.error('Failed to fetch community apps file');
		return;
	}

	const fileData = await response.json();
	const contentDecoded = base64.decode(fileData.content);
	let jsonData = JSONbig.parse(contentDecoded);
	const mongoDocuments = await collection.find();
	jsonData.apps = mongoDocuments;
	jsonData.apps.sort((a, b) => a.id - b.id).reverse();
	const updatedContent = JSONbig.stringify(jsonData, null, 4);
	const updatedContentEncoded = Buffer.from(updatedContent, 'utf-8').toString('base64');

	response = await fetch(completeUrl, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'droptop-api-update-global-data',
		},
		body: JSON.stringify({
			message: 'Updated apps from db',
			content: updatedContentEncoded,
			sha: fileData.sha,
			branch: 'tests',
		}),
	});

	if (!response.ok) {
		console.error('Failed to commit updated Community Apps');
	}
}

async function updateThemes(token, collection, url) {
	const path = 'data/community_themes/community_themes.json';

	let completeUrl = `${url}${path}?ref=tests`;

	let response = await fetch(completeUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'update-community-apps-themes-downloads',
		},
	});

	if (!response.ok) {
		console.error('Failed to fetch community themes file');
		return;
	}

	const fileData = await response.json();
	const contentDecoded = base64.decode(fileData.content);
	let jsonData = JSONbig.parse(contentDecoded);
	const mongoDocuments = await collection.find();
	jsonData.themes = mongoDocuments;
	jsonData.themes.sort((a, b) => a.id - b.id).reverse();
	const updatedContent = JSONbig.stringify(jsonData, null, 4);
	const updatedContentEncoded = Buffer.from(updatedContent, 'utf-8').toString('base64');

	response = await fetch(completeUrl, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'droptop-api-update-global-data',
		},
		body: JSON.stringify({
			message: 'Updated themes from db',
			content: updatedContentEncoded,
			sha: fileData.sha,
			branch: 'tests',
		}),
	});

	if (!response.ok) {
		console.error('Failed to commit updated Community Themes');
	}
}

export default {
	async scheduled(event, env, ctx) {
		const sentry = new Toucan({
			dsn: env.SENTRY_DSN,
			context: ctx,
		});

		const url = `https://api.github.com/repos/Droptop-Four/GlobalData/contents/`;

		try {
			// const token = authenticateGithub(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY);

			const token = env.TOKEN;

			const mongo_user = await realmLogin(env.REALM_APPID, env.REALM_APIKEY);
			const app_collection = mongo_user.mongoClient('mongodb-atlas').db(env.CREATIONS_DB).collection(env.APP_COLLECTION);
			const theme_collection = mongo_user.mongoClient('mongodb-atlas').db(env.CREATIONS_DB).collection(env.THEME_COLLECTION);

			await updateApps(token, app_collection, url);
			await updateThemes(token, theme_collection, url);
		} catch (error) {
			sentry.captureException(error);
			console.error('Error updating downloads:', error.message);
		}

		console.log('Downloads updated successfully');
	},
};
