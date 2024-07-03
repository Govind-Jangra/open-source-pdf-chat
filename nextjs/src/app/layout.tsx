import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from '@/components/Provider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'PDF Chat',
	description:
		'Pdf Chat is an open source project that allows you to search through PDFs using a chat interface.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body className={inter.className}>
				<ClerkProvider>
					<Providers>
						{children}
						<Toaster />
					</Providers>
				</ClerkProvider>
			</body>
		</html>
	);
}
