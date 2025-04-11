"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { binIcons } from "../constants";

interface TutorialProps {
	onComplete: () => void;
	onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
	const [step, setStep] = useState(0);
	const totalSteps = tutorialSteps.length;

	const nextStep = () => {
		if (step < totalSteps - 1) {
			setStep(step + 1);
		} else {
			completeTutorial();
		}
	};

	const completeTutorial = () => {
		onComplete();
	};

	const skipTutorial = () => {
		onSkip();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
			<AnimatePresence mode="wait">
				<motion.div
					key={`tutorial-step-${step}`}
					className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 relative shadow-xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
				>
					<div className="absolute -top-4 -right-4">
						<button
							onClick={skipTutorial}
							className="px-3 py-1.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm cursor-pointer"
						>
							Passer <span className="ml-1">✕</span>
						</button>
					</div>

					<div className="mb-4">
						<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
							<div
								className="bg-green-500 h-2 rounded-full transition-all duration-300"
								style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
							></div>
						</div>
					</div>

					<div className="text-center mb-6">
						<h2 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">
							{tutorialSteps[step].title}
						</h2>

						<div className="my-6 flex justify-center">
							{tutorialSteps[step].illustration}
						</div>

						<p className="text-gray-700 dark:text-gray-300 mb-4">
							{tutorialSteps[step].description}
						</p>

						{tutorialSteps[step].tip && (
							<div className="bg-green-50 dark:bg-green-900/30 p-3 rounded text-sm text-gray-700 dark:text-gray-300 mb-4">
								<span className="font-bold">Astuce :</span>{" "}
								{tutorialSteps[step].tip}
							</div>
						)}
					</div>

					<div className="flex justify-center">
						<button
							onClick={nextStep}
							className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow transition-colors"
						>
							{step < totalSteps - 1 ? "Suivant" : "Commencer à jouer"}
						</button>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

const tutorialSteps = [
	{
		title: "Bienvenue dans Eco-Mission !",
		description:
			"Apprenez à trier vos déchets tout en vous amusant. Votre mission est de sauver la planète en triant correctement les déchets qui tombent.",
		illustration: (
			<div className="w-32 h-32 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full flex items-center justify-center text-5xl">
				🌍
			</div>
		),
		tip: "Vous pouvez jouer sur ordinateur ou sur mobile !",
	},
	{
		title: "Les objets tombent du ciel",
		description:
			"Des objets vont tomber du haut de l'écran. Votre mission est de les faire glisser vers la bonne poubelle avant qu'ils ne touchent le sol.",
		illustration: (
			<div className="relative h-40 w-32 flex items-center justify-center">
				<div className="animate-bounce absolute text-4xl">📦</div>
				<svg
					className="w-full absolute bottom-0"
					height="10"
					viewBox="0 0 100 10"
				>
					<line
						x1="0"
						y1="5"
						x2="100"
						y2="5"
						stroke="#888"
						strokeWidth="2"
						strokeDasharray="5,5"
					/>
				</svg>
			</div>
		),
		tip: "Plus vous attendez, plus les objets tombent vite !",
	},
	{
		title: "Trois types de conteneurs",
		description:
			"Faites glisser les objets vers le bon conteneur : recyclage, déchets ou réutilisation.",
		illustration: (
			<div className="flex justify-around w-full">
				<div className="flex flex-col items-center">
					<div
						className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center text-white mb-2"
						dangerouslySetInnerHTML={{
							__html: binIcons.recycle.replace(
								/fill="currentColor"/g,
								'fill="white"'
							),
						}}
					/>
					<span className="text-xs">Recycler</span>
				</div>
				<div className="flex flex-col items-center">
					<div
						className="w-14 h-14 bg-red-500 rounded-lg flex items-center justify-center text-white mb-2"
						dangerouslySetInnerHTML={{
							__html: binIcons.trash.replace(
								/fill="currentColor"/g,
								'fill="white"'
							),
						}}
					/>
					<span className="text-xs">Déchets</span>
				</div>
				<div className="flex flex-col items-center">
					<div
						className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-2"
						dangerouslySetInnerHTML={{
							__html: binIcons.reuse.replace(
								/fill="currentColor"/g,
								'fill="white"'
							),
						}}
					/>
					<span className="text-xs">Réutiliser</span>
				</div>
			</div>
		),
		tip: "Chaque type de déchet a sa place !",
	},
	{
		title: "Attention aux power-ups !",
		description:
			"Pendant le jeu, des power-ups apparaîtront. Attrapez-les pour obtenir des avantages temporaires.",
		illustration: (
			<div className="flex gap-4 justify-center">
				<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white animate-pulse">
					⏱️
				</div>
				<div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white animate-pulse">
					🧲
				</div>
				<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white animate-pulse">
					❤️
				</div>
			</div>
		),
		tip: "Les power-ups peuvent ralentir le temps, ajouter des vies, ou trier automatiquement !",
	},
	{
		title: "Gagnez des points et sauvez la planète",
		description:
			"Chaque déchet correctement trié vous rapporte des points et réduit l'empreinte carbone. Essayez d'atteindre le meilleur score !",
		illustration: (
			<div className="relative">
				<div className="text-3xl font-bold text-green-600">+10</div>
				<div className="text-sm text-gray-500">Score</div>
				<div className="absolute inset-0 flex items-center justify-center opacity-30">
					<div className="w-28 h-28 bg-green-500 rounded-full"></div>
				</div>
			</div>
		),
		tip: "Votre progression est sauvegardée automatiquement entre les parties !",
	},
];

export default Tutorial;
