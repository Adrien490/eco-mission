"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ecoFacts, powerUps } from "../constants";
import { useGameLogic } from "../hooks/useGameLogic";
import useLocalStorage from "../hooks/useLocalStorage";
import { usePowerUps } from "../hooks/usePowerUps";
import { useSpecialEvents } from "../hooks/useSpecialEvents";
import Background from "./Background";
import GameBoard from "./GameBoard";
import GameHUD from "./GameHUD";
import GameMenu from "./GameMenu";
import GameOver from "./GameOver";
import PowerUp from "./PowerUp";
import Tutorial from "./Tutorial";

export function Game() {
	// État général du jeu
	const [environmentType, setEnvironmentType] = useState<"forest" | "ocean">(
		"forest"
	);

	const [showTutorial, setShowTutorial] = useState(false);
	const [showFact, setShowFact] = useState<string | null>(null);
	const [isGameActive, setIsGameActive] = useState(false); // État pour suivre si le jeu est actif
	// Nouvel état pour l'animation de changement de niveau
	const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

	// Référence pour l'effet sonore de level up
	const levelUpSoundRef = useRef<HTMLAudioElement | null>(null);

	// Hooks personnalisés
	const {
		userProgress,

		updateHighScore,
		updateGameStats,
		completeTutorial,
	} = useLocalStorage();

	// Logique principale du jeu - sans paramètre de difficulté
	const gameLogic = useGameLogic(updateHighScore, updateGameStats);

	// Afficher un fait écologique aléatoire
	const displayRandomFact = useCallback(() => {
		// Utiliser les ecoFacts depuis les constantes pour avoir une plus grande variété
		const randomFact = ecoFacts[Math.floor(Math.random() * ecoFacts.length)];
		setShowFact(randomFact);

		// Le fait disparaît après 8 secondes
		setTimeout(() => setShowFact(null), 8000);
	}, []);

	// Effet pour afficher occasionnellement des faits pendant le jeu
	useEffect(() => {
		if (
			!gameLogic.gameStarted ||
			gameLogic.isPaused ||
			gameLogic.gameOver ||
			showFact
		) {
			return;
		}

		// Afficher un fait écologique toutes les 30-60 secondes
		const factTimer = setInterval(() => {
			// La probabilité augmente avec le temps pour s'assurer qu'un fait s'affiche
			const randomProb = Math.random();
			if (randomProb < 0.2) {
				// 20% de chance toutes les 5 secondes = environ 45 secondes d'attente moyenne
				displayRandomFact();
				clearInterval(factTimer); // Effacer le timer après l'affichage d'un fait
			}
		}, 5000);

		return () => clearInterval(factTimer);
	}, [
		gameLogic.gameStarted,
		gameLogic.isPaused,
		gameLogic.gameOver,
		showFact,
		displayRandomFact,
	]);

	// Afficher un fait au changement de niveau
	useEffect(() => {
		// Détecter un changement de niveau et afficher un fait écologique
		if (
			gameLogic.level > 1 &&
			!showFact &&
			gameLogic.gameStarted &&
			!gameLogic.gameOver
		) {
			// Délai pour ne pas afficher immédiatement avec le message de niveau
			setTimeout(() => {
				displayRandomFact();
			}, 3000);
		}
	}, [
		gameLogic.level,
		showFact,
		gameLogic.gameStarted,
		gameLogic.gameOver,
		displayRandomFact,
	]);

	// Effet pour détecter le changement de niveau - amélioré avec son
	useEffect(() => {
		if (gameLogic.level > 1 && !gameLogic.gameOver && gameLogic.gameStarted) {
			// Afficher l'animation de changement de niveau
			setShowLevelUp(gameLogic.level);

			// Jouer le son de level up
			if (levelUpSoundRef.current) {
				levelUpSoundRef.current.currentTime = 0;
				levelUpSoundRef.current
					.play()
					.catch((err) => console.log("Erreur lecture audio:", err));
			}

			// Cacher l'animation après quelques secondes
			setTimeout(() => {
				setShowLevelUp(null);
			}, 3000);
		}
	}, [gameLogic.level, gameLogic.gameOver, gameLogic.gameStarted]);

	// Gestion des power-ups
	const powerUpsLogic = usePowerUps({
		gameStarted: gameLogic.gameStarted,
		gameOver: gameLogic.gameOver,
		isPaused: gameLogic.isPaused,
		onPointsMultiplierChange: (multiplier) => {
			gameLogic.setPointsMultiplier(multiplier);
		},
		onGameSpeedChange: (speedModifier) => {
			gameLogic.setSpeedModifier(speedModifier);
		},
		onItemsClear: () => {
			// Fonction appelée quand tous les items doivent être supprimés
			gameLogic.currentItems.forEach((item) => {
				gameLogic.handleSort(item.id, item.item.type);
			});
		},
		onLifeAdded: () => {
			gameLogic.addLife();
		},
		onScoreBoost: (points) => {
			// Ajout du score boost
			gameLogic.addScore(points);
		},
	});

	// Gestion des événements spéciaux
	const specialEventsLogic = useSpecialEvents({
		gameStarted: gameLogic.gameStarted,
		gameOver: gameLogic.gameOver,
		isPaused: gameLogic.isPaused,
		onItemRain: () => {
			// Générer une pluie d'objets plus intense avec le nouveau système de file d'attente
			const baseDelay = 100; // Délai initial très court
			const spawnCount = 12; // Plus d'objets pour un effet visuel impressionnant

			for (let i = 0; i < spawnCount; i++) {
				// Utiliser directement le spawn du game logic
				setTimeout(() => {
					if (!gameLogic.gameOver && !gameLogic.isPaused) {
						gameLogic.spawnRandomItem();
					}
				}, baseDelay + i * 200); // Espacer les objets pour éviter les superpositions
			}
		},
		onBonusItem: () => {
			// Fonction appelée pour générer un objet bonus - implémentation améliorée
			// Au lieu d'un timer, utiliser le nouveau système pour un flux continu
			const bonusCount = 7;
			const baseDelay = 300;

			for (let i = 0; i < bonusCount; i++) {
				setTimeout(() => {
					if (!gameLogic.gameOver && !gameLogic.isPaused) {
						gameLogic.spawnRandomItem();
					}
				}, baseDelay + i * 700);
			}
		},
		onMixedItems: () => {
			// Pendant l'événement "mixedItems", augmenter temporairement le flux d'items
			// avec le nouveau système de file d'attente
			const mixedCount = 10;
			const baseDelay = 200;

			for (let i = 0; i < mixedCount; i++) {
				const randomDelay = Math.random() * 300;
				setTimeout(() => {
					if (!gameLogic.gameOver && !gameLogic.isPaused) {
						gameLogic.spawnRandomItem();
					}
				}, baseDelay + i * 500 + randomDelay);
			}
		},
	});

	// Gérer la fin du tutoriel
	const handleTutorialComplete = () => {
		setShowTutorial(false);
		completeTutorial();
	};

	// Colleter un power-up
	const handleCollectPowerUp = useCallback(
		(powerUpId: string) => {
			if (!powerUpsLogic.currentPowerUp) return;

			const gameAreaElement = document.querySelector(".game-area");
			const rect = gameAreaElement?.getBoundingClientRect() || null;

			powerUpsLogic.collectPowerUp(powerUpId, rect);

			// Possibilité d'afficher un fait écologique lors de la collecte d'un power-up
			// avec une faible probabilité
			if (Math.random() < 0.3 && !showFact) {
				displayRandomFact();
			}
		},
		[powerUpsLogic, displayRandomFact, showFact]
	);

	// Gérer le retour au menu
	const handleReturnToMenu = useCallback(() => {
		// Arrêter complètement le jeu
		gameLogic.stopGame();
		// Réinitialiser l'état du jeu
		setIsGameActive(false);
		gameLogic.resetState();
	}, [gameLogic]);

	// Démarrer le jeu
	const handleStartGame = useCallback(() => {
		setIsGameActive(true);
		gameLogic.startCountdown();
	}, [gameLogic]);

	// Créer l'élément audio au montage
	useEffect(() => {
		levelUpSoundRef.current = new Audio("/sounds/level-up.mp3");
		return () => {
			if (levelUpSoundRef.current) {
				levelUpSoundRef.current.pause();
				levelUpSoundRef.current = null;
			}
		};
	}, []);

	return (
		<div className="w-full max-w-4xl mx-auto flex flex-col items-center px-2 sm:px-0">
			{/* Tutoriel */}
			{showTutorial && (
				<Tutorial
					onComplete={handleTutorialComplete}
					onSkip={() => setShowTutorial(false)}
				/>
			)}

			{!isGameActive ? (
				<GameMenu
					environmentType={environmentType}
					setEnvironmentType={setEnvironmentType}
					startCountdown={handleStartGame}
					showTutorial={() => setShowTutorial(true)}
					highScore={userProgress.highScore}
					totalCO2Saved={userProgress.totalCO2Saved}
					completedTutorial={userProgress.completedTutorial}
				/>
			) : (
				<div className="w-full px-2 sm:px-4">
					{/* Interface utilisateur du jeu */}
					<GameHUD
						score={gameLogic.score}
						level={gameLogic.level}
						levelProgress={gameLogic.levelProgress}
						lives={gameLogic.lives}
						savedCO2={gameLogic.savedCO2}
						pointsMultiplier={gameLogic.pointsMultiplier}
						isPaused={gameLogic.isPaused}
						onTogglePause={gameLogic.togglePause}
						activePowerUps={powerUpsLogic.activePowerUpDetails}
						powerUps={powerUps}
					/>

					{/* Zone de jeu */}
					<div className="game-area relative">
						{/* Arrière-plan dynamique */}
						<Background
							score={gameLogic.score}
							gameStarted={gameLogic.gameStarted}
							savedCO2={gameLogic.savedCO2}
							environmentType={environmentType}
						/>

						{/* Animation de passage de niveau */}
						<AnimatePresence>
							{showLevelUp && (
								<motion.div
									className="absolute inset-0 flex items-center justify-center z-50"
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 1.2 }}
									transition={{ duration: 0.5 }}
								>
									<div className="relative">
										{/* Cercles d'effet radial */}
										<motion.div
											className="absolute inset-0 rounded-full border-2 border-white/30"
											initial={{ scale: 1, opacity: 0 }}
											animate={{ scale: [1, 1.5, 2], opacity: [0, 0.5, 0] }}
											transition={{ duration: 2, repeat: Infinity }}
										/>

										<div className="bg-gradient-to-br from-green-600 to-green-400 px-10 py-8 rounded-xl shadow-2xl transform text-center">
											<motion.div
												initial={{ y: -20, opacity: 0 }}
												animate={{ y: 0, opacity: 1 }}
												transition={{ delay: 0.2, duration: 0.5 }}
												className="mb-3"
											>
												<span className="bg-white/20 px-4 py-1 rounded-full text-white text-sm font-medium">
													Félicitations!
												</span>
											</motion.div>

											<div className="text-center text-white">
												<motion.h2
													className="text-5xl font-bold mb-2"
													initial={{ scale: 0.8 }}
													animate={{ scale: [0.8, 1.2, 1] }}
													transition={{ duration: 0.8 }}
												>
													NIVEAU {showLevelUp}
												</motion.h2>
												<motion.p
													className="text-xl"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 0.5 }}
												>
													C&apos;est parti !
												</motion.p>

												<motion.div
													className="mt-4 flex justify-center items-center"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 0.7 }}
												>
													<div className="px-4 py-1 bg-white/30 rounded-lg text-sm">
														Nouveaux défis débloqués
													</div>
												</motion.div>
											</div>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Pause overlay */}
						{gameLogic.isPaused && (
							<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
								<div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg shadow-lg text-center">
									<h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
										Jeu en pause
									</h3>
									<button
										onClick={gameLogic.togglePause}
										className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg cursor-pointer"
									>
										Reprendre
									</button>
								</div>
							</div>
						)}

						<GameBoard
							currentItems={gameLogic.currentItems}
							handleSort={gameLogic.handleSort}
							specialEventActive={specialEventsLogic.specialEventActive}
							showParticles={powerUpsLogic.showParticles}
							onParticlesComplete={() => powerUpsLogic.setShowParticles(null)}
						/>

						{/* Power-ups */}
						<AnimatePresence>
							{powerUpsLogic.currentPowerUp && (
								<PowerUp
									powerUp={powerUpsLogic.currentPowerUp.powerUp}
									position={powerUpsLogic.currentPowerUp.position}
									onCollect={handleCollectPowerUp}
								/>
							)}
						</AnimatePresence>

						{/* Message de conseil pédagogique */}
						<AnimatePresence>
							{gameLogic.showTip && (
								<div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-lg max-w-[90%] text-center z-40">
									<button
										onClick={gameLogic.hideTip}
										className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-700 rounded-full shadow-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
										aria-label="Fermer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
									<div className="text-sm sm:text-base text-green-600 dark:text-green-400 font-medium">
										{gameLogic.tip}
									</div>
								</div>
							)}
						</AnimatePresence>

						{/* Barre d'environnement simplifiée en haut à droite */}
						<div className="absolute top-2 right-2 bg-white/80 dark:bg-slate-800/80 p-1.5 rounded-full shadow-md z-40 backdrop-blur-sm">
							<div className="flex items-center">
								<span
									className={`text-xl ${
										environmentType === "forest"
											? "text-emerald-500"
											: "text-blue-500"
									}`}
									title={environmentType === "forest" ? "Forêt" : "Océan"}
								>
									{environmentType === "forest" ? "🌳" : "🌊"}
								</span>
							</div>
							{/* Mini-barre de progression en dessous de l'icône */}
							<div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
								<div
									className={`h-full transition-all duration-500 ${
										environmentType === "forest"
											? "bg-emerald-500"
											: "bg-blue-500"
									}`}
									style={{
										width: `${Math.min(100, (gameLogic.savedCO2 / 50) * 100)}%`,
									}}
								/>
							</div>
						</div>

						{/* Bouton de débogage pour le développement - uniquement visible en mode développement */}
						{process.env.NODE_ENV === "development" && (
							<div className="absolute bottom-2 right-2 z-50">
								<button
									onClick={() => {
										// Forcer le passage au niveau suivant (pour le débogage)
										for (let i = 0; i < 100; i++) {
											gameLogic.handleSort(`debug-${i}`, "recycle");
										}
									}}
									className="bg-slate-800/40 hover:bg-slate-800/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
									title="Passer au niveau suivant (débogage)"
								>
									Debug: Next Level
								</button>
							</div>
						)}

						{/* Fait écologique amélioré */}
						<AnimatePresence>
							{showFact && (
								<div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-800/95 p-4 rounded-xl shadow-xl max-w-sm text-center z-50 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
									<button
										onClick={() => setShowFact(null)}
										className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full"
										aria-label="Fermer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
									<div className="flex flex-col items-center gap-2">
										<div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-blue-600 dark:text-blue-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
										<h3 className="font-bold text-lg text-blue-800 dark:text-blue-300">
											Le saviez-vous ?
										</h3>
										<p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
											{showFact}
										</p>
									</div>
								</div>
							)}
						</AnimatePresence>
					</div>

					{/* Écran de fin de jeu */}
					<AnimatePresence>
						{gameLogic.gameOver && (
							<GameOver
								score={gameLogic.score}
								isNewHighScore={gameLogic.isNewHighScore}
								savedCO2={gameLogic.savedCO2}
								totalSorted={gameLogic.totalSorted}
								totalCO2Saved={userProgress.totalCO2Saved + gameLogic.savedCO2}
								totalItemsSorted={
									userProgress.totalItemsSorted + gameLogic.totalSorted
								}
								onRestart={gameLogic.startCountdown}
								onReturnToMenu={handleReturnToMenu}
							/>
						)}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}

export default Game;
