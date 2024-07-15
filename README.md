## Overview

This project is a full-stack RAG (Retrieval-Augmented Generation) based web application that allows users to create multiple PDF chats and ask questions from them. It leverages NextJs for the ui and backend part, Cloudflare Workers for the llm(llama3) and embedding model (bge-large), and secured authentication using clerk. The application uses LLAMA3 as the LLM (Language Learning Model), BGE-LARGE for embedding, and Pinecone as the vector database.

## Technologies Used

- **Frontend**: NextJs, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers
- **Database**: MongoDB, Pinecone
- **Authentication**: Clerk
- **Other**: Clerk for authentication, Firebase for storage of PDF files

## Setup Instructions

### Prerequisites

1. **Cloudflare Account**: Create an account on Cloudflare.
2. **Firebase Account**: Create an account on Firebase and set up a project.
3. **Pinecone Account**: Create an account on Pinecone and set up an index.

### Environment Variables

Create a `.env` file in the `nextjs` folder and populate it with the following values:

```
CLOUDFLARE_WORKER_URL=
DATABASE_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=
PINECONE_ENVIRONMENT=
PINECONE_API_KEY=
PINECONE_INDEX=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### Installation

1. **Cloudflare Worker Setup**:
   - Navigate to the `cloudflare-worker` folder:
     ```sh
     cd cloudflare-worker
     ```
   - Install dependencies and deploy the worker:
     ```sh
     npm install
     npm run deploy
     ```
   - Save the deployed URL and set it in the `CLOUDFLARE_WORKER_URL` variable in the `.env` file.

2. **NextJs Setup**:
   - Navigate back to the project root and then to the `nextjs` folder:
     ```sh
     cd ..
     cd nextjs
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Build and start the application:
     ```sh
     npm run build
     npm run start
     ```


## Contribution

Feel free to fork this repository and contribute in the repo.


