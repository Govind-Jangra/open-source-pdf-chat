import mongoose from 'mongoose';

export default function dbConnectionFactory(MONGODB_URI: string) {
	const databaseConnection = mongoose.createConnection(MONGODB_URI, {});
	databaseConnection
		.asPromise()
		.then(() => console.log('Database connection established successfully.'))
		.catch(err => console.error('Error connecting database : ', err));

	return databaseConnection;
}
