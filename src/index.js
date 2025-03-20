import * as Realm from 'realm-web';
import { Toucan } from 'toucan-js';
const { sign } = require('@tsndr/cloudflare-worker-jwt');

const base64 = require('base-64');
const JSONbig = require('json-bigint');

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




export default {
	async scheduled(event, env, ctx) {
		const sentry = new Toucan({
			dsn: env.SENTRY_DSN,
			context: ctx,
		});

		const url = `https://api.github.com/repos/Droptop-Four/GlobalData/contents/`;

		try {

			const token = authenticateGithub(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY);

			const mongo_user = await realmLogin(env.REALM_APPID, env.REALM_APIKEY);
			const app_collection = mongo_user.mongoClient('mongodb-atlas').db(env.CREATIONS_DB).collection(env.APP_COLLECTION)
			const theme_collection = mongo_user.mongoClient('mongodb-atlas').db(env.CREATIONS_DB).collection(env.THEME_COLLECTION);
			const droptop_collection = mongo_user.mongoClient('mongodb-atlas').db(env.DROPTOP_DB).collection(env.DROPTOP_COLLECTION)

			await updateApps(token, app_collection, url);
			await updateThemes(token, theme_collection, url);
			await updateDroptopInfos(token, droptop_collection, url);

			console.log('Downloads updated successfully');
		} catch (error) {
			sentry.captureException(error);
			console.error('Error updating downloads:', error.message);
		}


	},
};
