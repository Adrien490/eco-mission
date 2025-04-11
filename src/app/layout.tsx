import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Eco-Mission : Objectif Zéro Déchet | Jeu éducatif sur le recyclage",
	description:
		"Apprends à trier tes déchets correctement en jouant ! Un jeu éducatif et amusant pour sensibiliser à l'importance du recyclage et de la réduction des déchets.",
	keywords: [
		"recyclage",
		"écologie",
		"jeu éducatif",
		"zéro déchet",
		"tri sélectif",
		"environnement",
		"déchets",
	],
	authors: [{ name: "Eco-Mission Team" }],
	openGraph: {
		title: "Eco-Mission : Objectif Zéro Déchet",
		description: "Apprends à trier tes déchets correctement en jouant !",
		images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}
			>
				{children}
			</body>
		</html>
	);
}
