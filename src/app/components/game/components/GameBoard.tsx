"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { binIcons } from "../constants";
import { GameItem, ItemType } from "../types";
import { replaceIconColor } from "../utils/uiHelpers";
import Particles from "./Particles";

interface GameBoardProps {
	currentItems: Array<{
		id: string;
		item: GameItem;
		position: number;
		speed: number;
		horizontalPos: number;
		velocityX: number;
		motionValues: {
			animationDuration: number;
			entryDelay: number;
			wobbleAmount: number;
			fallingDuration: number;
			spin?: boolean;
			spinSpeed?: number;
			spinDirection?: number;
			bounceIntensity?: number;
			stiffness?: number;
			damping?: number;
			ease?: string;
		};
		isSpecial?: boolean;
	}>;
	handleSort: (itemId: string, binType: ItemType) => void;
	specialEventActive: string | null;
	showParticles: {
		effect: "correctSort" | "levelUp" | "powerUp";
		x: number;
		y: number;
		colors: string[];
		count: number;
		speed: number;
		size: { min: number; max: number };
		duration: number;
		type?: string;
	} | null;
	onParticlesComplete: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
	currentItems,
	handleSort,
	specialEventActive,
	showParticles,
	onParticlesComplete,
}) => {
	const gameAreaRef = useRef<HTMLDivElement>(null);
	const [boardHeight, setBoardHeight] = useState("80vh");
	const [touchMode, setTouchMode] = useState(false);
	const [isClient, setIsClient] = useState(false);

	// S'assurer que le rendu se fait côté client pour manipuler le DOM
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Adapter la hauteur du jeu en fonction de la taille de l'écran
	useEffect(() => {
		const updateHeight = () => {
			const isMobile = window.innerWidth < 640; // sm breakpoint in Tailwind
			const viewportHeight = window.innerHeight;
			setTouchMode(isMobile || "ontouchstart" in window);

			if (isMobile) {
				// Sur mobile, optimiser pour une meilleure expérience tactile
				setBoardHeight(`${Math.min(viewportHeight * 0.7, 550)}px`);
			} else {
				// Sur desktop, on peut utiliser une hauteur relative plus grande
				setBoardHeight(`${Math.min(viewportHeight * 0.8, 700)}px`);
			}
		};

		if (isClient) {
			updateHeight();
			window.addEventListener("resize", updateHeight);
			return () => window.removeEventListener("resize", updateHeight);
		}
	}, [isClient]);

	// Préparation de l'animation de mouvement horizontal avec trajectoire en zigzag plus naturelle
	// Remplacer le code existant par une approche plus standardisée et optimisée
	const generatePath = (velocityX: number) => {
		// Nombre réduit de points pour une meilleure performance
		const numberOfPoints = 6;
		const xPath = [0];
		const timePoints = [0];

		// Générer une trajectoire plus prévisible avec une sinusoïde standardisée
		for (let i = 1; i <= numberOfPoints; i++) {
			const step = i / numberOfPoints;
			// Amplitude qui diminue progressivement pour un mouvement plus naturel
			const amplitude = 45 * (1 - step * 0.4);
			// Fréquence standardisée pour un mouvement plus cohérent
			const frequency = Math.PI * 2.5;
			// Direction basée sur velocityX mais avec une magnitude plus constante
			const direction = Math.sign(velocityX);

			// Calcul optimisé de la position horizontale
			const xValue = direction * amplitude * Math.sin(step * frequency);

			xPath.push(xValue);
			timePoints.push(step);
		}

		return { xPath, timePoints };
	};

	return (
		<motion.div
			ref={gameAreaRef}
			className={`relative w-full bg-gradient-to-b from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-700 overflow-hidden shadow-2xl transition-all duration-300`}
			style={{ height: boardHeight }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			{/* Instruction visuelle pour mobile */}
			{touchMode && currentItems.length > 0 && (
				<motion.div
					className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md z-30 pointer-events-none"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.3 }}
				>
					<p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-3 w-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
							/>
						</svg>
						Glissez les déchets vers la bonne poubelle
					</p>
				</motion.div>
			)}

			{/* Conteneurs de tri en bas */}
			<div className="absolute bottom-0 left-0 w-full flex justify-around p-2 sm:p-3 z-10">
				{isClient &&
					["recycle", "trash", "reuse"].map((binType, index) => {
						const colors = {
							recycle: {
								bg: "from-green-500 to-green-600",
								border: "border-green-400",
								hover: "hover:shadow-green-400/30",
								text: "Recycler",
							},
							trash: {
								bg: "from-red-500 to-red-600",
								border: "border-red-400",
								hover: "hover:shadow-red-400/30",
								text: "Déchets",
							},
							reuse: {
								bg: "from-blue-500 to-blue-600",
								border: "border-blue-400",
								hover: "hover:shadow-blue-400/30",
								text: "Réutiliser",
							},
						};

						const color = colors[binType as keyof typeof colors];

						return (
							<motion.div
								key={binType}
								className={`bg-gradient-to-b ${color.bg} rounded-xl w-[31%] h-16 sm:h-20 md:h-24 flex flex-col items-center justify-center text-white font-bold shadow-lg border-4 ${color.border} ${color.hover} dark:hover:shadow-xl transition-all duration-300 cursor-pointer`}
								whileHover={{
									scale: 1.05,
									y: -5,
									boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
									transition: { duration: 0.2 },
								}}
								whileTap={{ scale: 0.95 }}
								initial={{ y: 100, opacity: 0 }}
								animate={{
									y: 0,
									opacity: 1,
									transition: {
										duration: 0.5,
										delay: index * 0.1 + 0.1,
									},
								}}
								onClick={() => {
									// Sur mobile, permettre le clic direct sur les conteneurs
									if (touchMode && currentItems.length > 0) {
										// Trouver l'élément le plus bas (le plus avancé dans la chute)
										const lowestItem = currentItems.reduce((prev, current) =>
											prev.position > current.position ? prev : current
										);

										// Si l'élément est suffisamment bas (pour éviter des clics accidentels)
										if (lowestItem.position > 60) {
											handleSort(lowestItem.id, binType as ItemType);
										}
									}
								}}
							>
								<div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
									<div
										dangerouslySetInnerHTML={{
											__html: replaceIconColor(
												binIcons[binType as keyof typeof binIcons]
											),
										}}
									/>
								</div>
								<span className="mt-1 text-[10px] sm:text-xs md:text-sm font-medium">
									{color.text}
								</span>
							</motion.div>
						);
					})}
			</div>

			{/* Objets tombants améliorés */}
			<AnimatePresence>
				{isClient &&
					currentItems.map(
						({
							id,
							item,
							position,
							horizontalPos,
							motionValues,
							velocityX,
							isSpecial,
						}) => {
							// Déterminer si l'objet doit être difficile à identifier (événement spécial)
							const isMixedItem = specialEventActive === "mixedItems";

							// Calculer la taille de l'objet en fonction de l'appareil
							const size = touchMode
								? "w-14 h-14 sm:w-16 sm:h-16"
								: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16";

							// Utiliser des couleurs différentes pour les objets spéciaux
							const bgColor = isSpecial
								? "bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-500 dark:to-yellow-600"
								: "bg-white/90 dark:bg-slate-800/90";

							const haloColor = isSpecial
								? "bg-yellow-400/30 dark:bg-yellow-500/30"
								: "bg-gray-400/30 dark:bg-gray-500/30";

							// Calculer la priorité d'affichage basée sur la position verticale
							// Les items plus bas ont une priorité plus élevée pour éviter les problèmes d'affichage
							const zIndexValue = Math.min(20 + Math.floor(position / 5), 30);

							// Calculer la durée de chute basée sur motionValues
							const fallingDuration = motionValues.fallingDuration;
							// Valeur de rotation basée sur motionValues
							const rotationAmount = motionValues.wobbleAmount;

							// Extraire les nouvelles propriétés
							const shouldSpin = motionValues.spin || false;
							const spinSpeed = motionValues.spinSpeed || 2;
							const spinDirection = motionValues.spinDirection || 1;
							const bounceIntensity = motionValues.bounceIntensity || 0;

							// Configuration d'animation standardisée pour une meilleure prévisibilité
							const { xPath, timePoints } = generatePath(velocityX);

							// Préparation des animations de rotation
							const rotationAnimation = shouldSpin
								? { rotate: [0, spinDirection * 360] }
								: {
										rotate: [
											rotationAmount,
											-rotationAmount * 0.8,
											rotationAmount * 1.2,
											-rotationAmount * 0.5,
										],
								  };

							// Configuration de l'animation de rotation optimisée
							const rotationTransition = shouldSpin
								? {
										rotate: {
											duration: Math.min(fallingDuration / spinSpeed, 3),
											repeat: 0,
											ease: "easeOut",
										},
								  }
								: {
										rotate: {
											duration: Math.min(fallingDuration * 0.5, 4),
											repeat: 2,
											repeatType: "reverse",
											ease: "easeInOut",
										},
								  };

							return (
								<motion.div
									key={id}
									className="absolute flex flex-col items-center cursor-move touch-none will-change-transform"
									style={{
										left: `${horizontalPos}%`,
										zIndex: zIndexValue,
										filter: isMixedItem ? "blur(1px) brightness(0.9)" : "none",
									}}
									initial={{
										y: "-5%",
										x: 0,
										scale: 0.5,
										opacity: 0,
										rotate: shouldSpin ? 0 : rotationAmount,
									}}
									animate={{
										y: ["-5%", "95%"], // Trajectoire verticale standardisée
										x: xPath,
										scale: 1,
										opacity: 1,
										...rotationAnimation,
									}}
									transition={{
										y: {
											duration: fallingDuration,
											ease: bounceIntensity > 0 ? "circOut" : "easeInOut",
											times: [0, 1],
										},
										x: {
											duration: fallingDuration,
											times: timePoints,
											ease: "easeInOut",
										},
										...rotationTransition,
										scale: {
											duration: 0.5,
											delay: motionValues.entryDelay,
											ease: "easeOut",
										},
										opacity: {
											duration: 0.3,
											delay: motionValues.entryDelay,
										},
									}}
									exit={{
										scale: 0,
										opacity: 0,
										y: "110%",
										transition: { duration: 0.2 },
									}}
									drag
									dragConstraints={gameAreaRef}
									dragElastic={touchMode ? 0.7 : 0.5}
									dragTransition={{
										bounceStiffness: motionValues.stiffness || 600,
										bounceDamping: motionValues.damping || 20,
										power: 0.8,
									}}
									dragMomentum={false}
									onDragStart={() => {
										if (touchMode && navigator.vibrate) {
											navigator.vibrate(20);
										}
									}}
									onDragEnd={(event, info) => {
										const gameRect =
											gameAreaRef.current?.getBoundingClientRect();
										if (!gameRect) return;

										const y = info.point.y;
										const velocity = info.velocity.y;
										const isFastFlick = velocity > 500;

										if (
											y > gameRect.bottom - (touchMode ? 100 : 140) ||
											isFastFlick
										) {
											const x = info.point.x - gameRect.left;
											const width = gameRect.width / 3;

											if (touchMode && navigator.vibrate) {
												navigator.vibrate(30);
											}

											if (x < width) {
												handleSort(id, "recycle");
											} else if (x < width * 2) {
												handleSort(id, "trash");
											} else {
												handleSort(id, "reuse");
											}
										}
									}}
									whileDrag={{
										scale: touchMode ? 1.5 : 1.4,
										zIndex: 40,
										boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
										rotate: 0,
									}}
								>
									{/* Container avec effets visuels améliorés */}
									<div
										className={`relative flex items-center justify-center p-2 sm:p-2.5
										${bgColor} 
										rounded-full ${size} shadow-lg backdrop-blur-sm border border-white/50 dark:border-slate-700/50 transition-all`}
									>
										{/* Halo pulsant amélioré */}
										<motion.div
											className={`absolute inset-0 rounded-full ${haloColor} opacity-0`}
											animate={{
												opacity: [0, isSpecial ? 0.5 : 0.3, 0],
												scale: [0.9, 1.1, 0.9],
											}}
											transition={{
												duration: 2,
												ease: "easeInOut",
												repeat: Infinity,
												repeatDelay: 0.2,
											}}
										/>

										{/* Traînée visuelle améliorée pendant le drag */}
										<motion.div
											className={`absolute inset-0 rounded-full ${
												isSpecial
													? "bg-yellow-400/40 dark:bg-yellow-500/40"
													: "bg-blue-400/30 dark:bg-blue-500/30"
											}`}
											initial={{ opacity: 0, scale: 0.8 }}
											whileDrag={{
												opacity: 0.8,
												scale: [0.9, 1.2, 0.9],
												transition: {
													scale: {
														repeat: Infinity,
														duration: 0.8, // Plus rapide
													},
												},
											}}
											exit={{ opacity: 0, scale: 0.8 }}
										/>

										{/* Illustration SVG ou emoji avec animation améliorée */}
										<motion.div
											className="w-full h-full flex items-center justify-center"
											animate={{
												scale: isSpecial ? [1, 1.15, 1] : [1, 1.05, 1],
												rotate: isSpecial ? [0, 5, 0, -5, 0] : 0,
											}}
											transition={{
												scale: {
													duration: isSpecial ? 1.2 : 2,
													repeat: Infinity,
													repeatType: "mirror",
													ease: "easeInOut",
												},
												rotate: {
													duration: 1.5,
													repeat: Infinity,
													repeatType: "mirror",
													ease: "easeInOut",
												},
											}}
										>
											{item.svgIcon ? (
												<div
													className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center ${
														isSpecial
															? "filter drop-shadow-[0_0_4px_rgba(255,255,0,0.6)]"
															: ""
													}`}
													dangerouslySetInnerHTML={{
														__html: item.svgIcon,
													}}
												/>
											) : (
												<div className="text-xl sm:text-2xl md:text-3xl">
													{item.emoji}
												</div>
											)}
										</motion.div>

										{/* Badge spécial pour les objets spéciaux */}
										{isSpecial && (
											<motion.div
												className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
												animate={{
													scale: [1, 1.2, 1],
													boxShadow: [
														"0 0 0 0 rgba(250, 204, 21, 0.4)",
														"0 0 0 8px rgba(250, 204, 21, 0)",
														"0 0 0 0 rgba(250, 204, 21, 0.4)",
													],
												}}
												transition={{
													scale: {
														duration: 1,
														repeat: Infinity,
														repeatType: "loop",
													},
													boxShadow: {
														duration: 1.5,
														repeat: Infinity,
														repeatType: "loop",
													},
												}}
											>
												★
											</motion.div>
										)}
									</div>

									{/* Nom de l'objet avec style amélioré */}
									<motion.div
										className={`text-[10px] sm:text-xs ${
											isSpecial
												? "bg-yellow-200/90 dark:bg-yellow-800/90 text-yellow-800 dark:text-yellow-200"
												: "bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200"
										} p-1 px-2 sm:p-1.5 rounded-lg shadow-md mt-1 font-medium border border-white/50 dark:border-slate-700/50 max-w-[90px] sm:max-w-[120px] text-center backdrop-blur-sm`}
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1, duration: 0.3 }}
										whileHover={{ scale: 1.05 }}
										whileDrag={{ opacity: 0.7 }}
									>
										{item.name}
									</motion.div>
								</motion.div>
							);
						}
					)}
			</AnimatePresence>

			{/* Particules et halos avec meilleure visibilité */}
			{isClient && showParticles && (
				<Particles
					effect={showParticles.effect}
					x={showParticles.x}
					y={showParticles.y}
					colors={showParticles.colors}
					count={showParticles.count}
					speed={showParticles.speed}
					size={showParticles.size}
					duration={showParticles.duration}
					type={(showParticles.type as "halo" | "stars" | "pulse") || "stars"}
					onComplete={onParticlesComplete}
				/>
			)}
		</motion.div>
	);
};

export default GameBoard;
