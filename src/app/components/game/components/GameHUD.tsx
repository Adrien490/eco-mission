"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface GameHUDProps {
	score: number;
	level: number;
	levelProgress: number;
	lives: number;
	savedCO2: number;
	pointsMultiplier: number;
	isPaused: boolean;
	onTogglePause: () => void;
	activePowerUps: Record<string, { id: string; endTime: number }>;
	powerUps: Array<{ id: string; name: string; icon: string; duration: number }>;
}

const GameHUD: React.FC<GameHUDProps> = ({
	score,
	level,
	levelProgress,
	lives,
	savedCO2,
	pointsMultiplier,
	isPaused,
	onTogglePause,
	activePowerUps,
	powerUps,
}) => {
	// Animation du score
	const [displayedScore, setDisplayedScore] = useState(score);
	// Suivi du niveau précédent pour l'animation
	const [prevLevel, setPrevLevel] = useState(level);
	// État pour l'animation de changement de niveau
	const [isLevelChanging, setIsLevelChanging] = useState(false);

	useEffect(() => {
		if (score > displayedScore) {
			// Animation du score qui augmente
			const interval = setInterval(() => {
				setDisplayedScore((prev) => {
					const diff = score - prev;
					const increment = Math.max(1, Math.floor(diff / 10));
					if (diff <= increment) {
						clearInterval(interval);
						return score;
					}
					return prev + increment;
				});
			}, 50);

			return () => clearInterval(interval);
		} else if (score < displayedScore) {
			// Si le score diminue (rare), mettre à jour instantanément
			setDisplayedScore(score);
		}
	}, [score, displayedScore]);

	useEffect(() => {
		// Vérifier si le niveau a changé
		if (level !== prevLevel) {
			// Activer l'animation
			setIsLevelChanging(true);

			// Désactiver l'animation après un délai
			setTimeout(() => {
				setIsLevelChanging(false);
			}, 3000);

			// Mettre à jour le niveau précédent
			setPrevLevel(level);
		}
	}, [level, prevLevel]);

	return (
		<>
			<motion.div
				className="relative z-10 w-full flex flex-col gap-2 sm:gap-3"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* Barre supérieure améliorée */}
				<div className="flex items-center justify-between px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-white/50 dark:border-slate-700/50">
					{/* Scores et vies */}
					<div className="flex items-center gap-4">
						{/* Score avec effet de brillance */}
						<div className="relative">
							<div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-yellow-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span className="text-lg sm:text-xl">{score}</span>
							</div>

							{/* Animation de points si points doublés */}
							{pointsMultiplier > 1 && (
								<motion.div
									className="absolute -top-1 -right-2 text-xs font-bold bg-yellow-500 text-white px-1.5 py-0.5 rounded-md"
									initial={{ scale: 0 }}
									animate={{ scale: [0, 1.2, 1] }}
									transition={{ duration: 0.3 }}
								>
									x{pointsMultiplier}
								</motion.div>
							)}
						</div>

						{/* Vies avec animation */}
						<div className="flex items-center gap-1.5">
							{[...Array(3)].map((_, index) => (
								<motion.div
									key={`life-${index}`}
									className={`h-5 w-5 ${
										index < lives
											? "text-red-500"
											: "text-gray-300 dark:text-gray-600"
									}`}
									initial={{ scale: 0 }}
									animate={{
										scale: index < lives ? [1, 1.2, 1] : 1,
										opacity: index < lives ? 1 : 0.5,
									}}
									transition={{
										duration: 0.5,
										delay: index * 0.1 + 0.1,
										scale: { duration: index < lives ? 0.3 : 0 },
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										className="h-5 w-5"
									>
										<path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
									</svg>
								</motion.div>
							))}
						</div>
					</div>

					{/* Niveau et bouton de pause */}
					<div className="flex items-center gap-3">
						{/* Niveau */}
						<div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-700/80 px-2 py-1 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 text-slate-600 dark:text-slate-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
							</svg>
							<motion.span
								className={
									isLevelChanging
										? "text-green-600 dark:text-green-400 font-bold"
										: ""
								}
								animate={
									isLevelChanging
										? {
												scale: [1, 1.2, 1, 1.1, 1],
												color: ["#059669", "#10b981", "#059669"],
										  }
										: { scale: 1 }
								}
								transition={{ duration: 2.5, repeat: 0 }}
							>
								Niveau {level}
							</motion.span>
						</div>

						{/* Affichage du CO2 économisé */}
						<div className="hidden sm:flex items-center gap-1.5 bg-emerald-100/80 dark:bg-emerald-900/30 px-2 py-1 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{savedCO2.toFixed(1)} kg</span>
						</div>

						{/* Bouton de pause */}
						<motion.button
							onClick={onTogglePause}
							className="p-1.5 sm:p-2 bg-white/90 dark:bg-slate-700/90 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-white/50 dark:border-slate-600/50 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 backdrop-blur-sm cursor-pointer"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							aria-label={isPaused ? "Reprendre" : "Pause"}
						>
							{isPaused ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-slate-600 dark:text-slate-300"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
										clipRule="evenodd"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-slate-600 dark:text-slate-300"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</motion.button>
					</div>
				</div>

				{/* Barre de progression du niveau améliorée */}
				<div className="w-full h-2 sm:h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-full mb-2 sm:mb-3 overflow-hidden shadow-inner backdrop-blur-sm relative">
					<motion.div
						className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500"
						style={{ width: `${levelProgress}%` }}
						initial={{ width: 0 }}
						animate={{ width: `${levelProgress}%` }}
						transition={{ duration: 0.5, ease: "easeOut" }}
					/>
					{/* Curseur indiquant le niveau actuel */}
					<div className="absolute inset-0 flex justify-center items-center pointer-events-none">
						<div className="text-xs font-bold text-white text-shadow mix-blend-difference">
							{levelProgress.toFixed(0)}%
						</div>
					</div>
					{/* Indicateurs de progression par paliers */}
					<div className="absolute inset-0 flex justify-between px-2">
						{[25, 50, 75].map((threshold) => (
							<div
								key={threshold}
								className={`h-full w-px ${
									levelProgress >= threshold ? "bg-white/50" : "bg-slate-500/30"
								}`}
								style={{ left: `${threshold}%` }}
							/>
						))}
					</div>
				</div>

				{/* Niveau avec effet de badge */}
				<motion.div
					className={`absolute top-14 right-4 rounded-full px-3 py-1 z-20 font-bold ${
						isLevelChanging
							? "bg-green-500 text-white shadow-lg"
							: "bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300"
					}`}
					animate={
						isLevelChanging ? { scale: [1, 1.2, 1], y: [0, -10, 0] } : {}
					}
					transition={{ duration: 0.5 }}
				>
					Niveau {level}
				</motion.div>

				{/* Power-ups actifs avec animation améliorée */}
				{Object.keys(activePowerUps).length > 0 && (
					<div className="flex gap-2 justify-center">
						{Object.entries(activePowerUps).map(([key, details]) => {
							const powerUp = powerUps.find((p) => p.id === key);
							if (!powerUp) return null;

							// Calculer le temps restant
							const now = Date.now();
							const remaining = Math.max(0, (details.endTime - now) / 1000);
							const remainingPercent =
								(remaining / (powerUp.duration / 1000)) * 100;

							return (
								<motion.div
									key={key}
									className="relative px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-lg flex items-center gap-2 shadow-md border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
									initial={{ opacity: 0, scale: 0.8, y: 20 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.8, y: 20 }}
									transition={{ duration: 0.3 }}
								>
									<div
										className="w-6 h-6"
										dangerouslySetInnerHTML={{ __html: powerUp.icon }}
									/>
									<div className="flex flex-col">
										<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
											{powerUp.name}
										</span>
										<div className="w-full h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden mt-0.5">
											<motion.div
												className="h-full bg-blue-500"
												style={{ width: `${remainingPercent}%` }}
												initial={{ width: "100%" }}
												animate={{ width: `${remainingPercent}%` }}
												transition={{ duration: 0.3, ease: "linear" }}
											/>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</motion.div>
		</>
	);
};

export default GameHUD;
