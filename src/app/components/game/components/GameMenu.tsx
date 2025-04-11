"use client";
import { motion } from "framer-motion";
import React from "react";
import { binIcons } from "../constants";
import { replaceIconColor } from "../utils/uiHelpers";

interface GameMenuProps {
	environmentType: "forest" | "ocean";
	setEnvironmentType: (type: "forest" | "ocean") => void;
	startCountdown: () => void;
	showTutorial: () => void;
	highScore: number;
	totalCO2Saved: number;
	completedTutorial: boolean;
}

const GameMenu: React.FC<GameMenuProps> = ({
	environmentType,
	setEnvironmentType,
	startCountdown,
	showTutorial,
	highScore,
	totalCO2Saved,
	completedTutorial,
}) => {
	return (
		<div className="flex flex-col items-center gap-6 text-center px-4 py-10">
			<motion.h1
				className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-sky-500 text-transparent bg-clip-text mb-2"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Eco-Mission : Objectif Zéro Déchet
			</motion.h1>
			<motion.p
				className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				Trie les déchets correctement et sauve la planète !
			</motion.p>

			<motion.div
				className="w-full max-w-md p-6 bg-gradient-to-br from-emerald-50/90 to-sky-50/90 dark:from-slate-800/90 dark:to-slate-900/90 rounded-2xl shadow-lg border border-white/50 dark:border-slate-700/50 backdrop-blur-md"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.3 }}
			>
				{/* Choix du thème d'environnement */}
				<div className="mb-5">
					<h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
						Choisis ton environnement à protéger
					</h3>
					<div className="flex gap-5 justify-center">
						<motion.button
							onClick={() => setEnvironmentType("forest")}
							className={`px-5 py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 cursor-pointer ${
								environmentType === "forest"
									? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white ring-2 ring-emerald-300/50 ring-offset-2 dark:ring-offset-slate-800 shadow-md"
									: "bg-white/90 text-slate-700 hover:bg-white border border-white/50 shadow-md dark:bg-slate-700/90 dark:text-slate-300 dark:border-slate-600/50 backdrop-blur-sm"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="text-3xl">🌳</span>
							<span>Forêt</span>
							<span className="text-xs opacity-80">
								Plante des arbres pour capturer le CO2
							</span>
						</motion.button>
						<motion.button
							onClick={() => setEnvironmentType("ocean")}
							className={`px-5 py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 cursor-pointer ${
								environmentType === "ocean"
									? "bg-gradient-to-r from-sky-600 to-sky-500 text-white ring-2 ring-sky-300/50 ring-offset-2 dark:ring-offset-slate-800 shadow-md"
									: "bg-white/90 text-slate-700 hover:bg-white border border-white/50 shadow-md dark:bg-slate-700/90 dark:text-slate-300 dark:border-slate-600/50 backdrop-blur-sm"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<span className="text-3xl">🌊</span>
							<span>Océan</span>
							<span className="text-xs opacity-80">
								Préserve les océans de la pollution
							</span>
						</motion.button>
					</div>
				</div>

				{highScore > 0 && (
					<div className="mb-5 p-4 bg-gradient-to-r from-amber-100/80 to-amber-50/80 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg text-sm border border-amber-200/50 dark:border-amber-800/50 shadow-sm backdrop-blur-sm">
						<div className="flex items-center justify-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
									clipRule="evenodd"
								/>
							</svg>
							<p>Meilleur score : {highScore}</p>
						</div>
						<p className="text-xs text-amber-700 dark:text-amber-400 mt-1 text-center">
							Total CO2 économisé : {totalCO2Saved.toFixed(1)} kg
						</p>
					</div>
				)}

				<motion.button
					onClick={startCountdown}
					className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95 ring-2 ring-emerald-300/30 ring-offset-0 cursor-pointer"
					whileHover={{
						scale: 1.05,
						boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)",
					}}
					whileTap={{ scale: 0.95 }}
				>
					Commencer
				</motion.button>

				{!completedTutorial && (
					<motion.button
						onClick={showTutorial}
						className="w-full mt-3 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg shadow transition-all ring-2 ring-sky-300/30 ring-offset-0 cursor-pointer"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
					>
						Voir le tutoriel
					</motion.button>
				)}

				{/* Ajout d'une section informative */}
				<div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
					<h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
						Comment jouer
					</h4>
					<ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
						<li className="flex items-start gap-1.5">
							<span className="text-emerald-500 mt-0.5">✓</span>
							<span>Fais glisser les déchets vers la bonne poubelle</span>
						</li>
						<li className="flex items-start gap-1.5">
							<span className="text-emerald-500 mt-0.5">✓</span>
							<span>Gagne des points en triant correctement</span>
						</li>
						<li className="flex items-start gap-1.5">
							<span className="text-emerald-500 mt-0.5">✓</span>
							<span>Améliore l&apos;environnement en économisant du CO2</span>
						</li>
					</ul>
				</div>
			</motion.div>

			<motion.div
				className="mt-4 p-6 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg w-full max-w-2xl border border-white/50 dark:border-slate-700/50 backdrop-blur-md"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				<h2 className="font-bold text-xl text-emerald-700 dark:text-emerald-400 mb-3">
					Comment jouer :
				</h2>
				<p className="mb-4 text-slate-700 dark:text-slate-300">
					Des objets vont tomber du haut de l&apos;écran. Fais-les glisser vers
					la bonne zone :
				</p>
				<div className="flex justify-around w-full mt-6 flex-wrap gap-4">
					<motion.div
						className="flex flex-col items-center"
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<div
							className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md border-2 border-emerald-400/30"
							dangerouslySetInnerHTML={{
								__html: replaceIconColor(binIcons.recycle),
							}}
						/>
						<p className="mt-2 font-medium">Recycler</p>
						<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
							Papier, Verre, Plastique
						</p>
					</motion.div>
					<motion.div
						className="flex flex-col items-center"
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<div
							className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md border-2 border-rose-400/30"
							dangerouslySetInnerHTML={{
								__html: replaceIconColor(binIcons.trash),
							}}
						/>
						<p className="mt-2 font-medium">Déchets</p>
						<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
							Déchets organiques
						</p>
					</motion.div>
					<motion.div
						className="flex flex-col items-center"
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<div
							className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-sky-500 to-sky-600 rounded-lg flex items-center justify-center shadow-md border-2 border-sky-400/30"
							dangerouslySetInnerHTML={{
								__html: replaceIconColor(binIcons.reuse),
							}}
						/>
						<p className="mt-2 font-medium">Réutiliser</p>
						<p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
							Vêtements, Appareils
						</p>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
};

export default GameMenu;
