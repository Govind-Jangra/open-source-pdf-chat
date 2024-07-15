import { Pinecone } from '@pinecone-database/pinecone';
import { convertToASCII } from './utils';
import { getEmbeddings } from './get-embeddings';

export async function retrieveMatchesByEmbeddings(embeddings: number[], fileKey: string) {
	const pinecone = new Pinecone({
		apiKey: process.env.PINECONE_API_KEY as string,
	});

	const index = pinecone.Index(process.env.PINECONE_INDEX as string);

	try {
		const namespace = convertToASCII(fileKey);

		const queryResults = await index.namespace(namespace).query({
			vector: embeddings,
			topK: 3,
			includeMetadata: true,
		});

		return queryResults.matches || [];
	} catch (err) {
		console.error('Error Querying Embeddings', err);
		throw err;
	}
}

/**
 * Finds and matches query embeddings with document embeddings
 * @param query - The query string to be embedded
 * @param fileKey - Identifier for the vectors in Pinecone
 * @returns A string containing the top matching documents
 */
export async function getQualifiedContext(query: string, fileKey: string) {
	const queryEmbeddings = await getEmbeddings(query);

	const matches = await retrieveMatchesByEmbeddings(queryEmbeddings, fileKey);

	const qualifyResult = matches.filter(
		match => match.score && match.score > parseFloat(process.env.CUTOFF_SCORE || '0.6')
	);

	type Metadata = {
		text: string;
		pageNumber: number;
	};

	let docs = qualifyResult.map(match => (match.metadata as Metadata).text);
	return docs.join('\n').substring(0, 3000);
}
