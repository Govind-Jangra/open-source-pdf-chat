export async function getEmbeddings(text: string): Promise<number[]> {
    try {
        const response = await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/embedding`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text})
    });

        // Extract the embedding data from the response
        const results = await response.json();
        return results.vectors as number[];  // Return the embedding as an array of numbers

    } catch (error) {
        // Log the error for debugging purposes and rethrow it
        console.error("Error creating embeddings", error);
        throw error;
    }
}
