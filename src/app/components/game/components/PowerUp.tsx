"use client";

import { motion } from "framer-motion";
import { PowerUpType } from "../types";

// Définition de l'interface PowerUp
interface PowerUp {
	id: string;
	name: string;
	icon: string;
	type: PowerUpType;
	effect: string;
	duration: number;
	rarity: "common" | "rare" | "epic";
}

interface PowerUpProps {
	powerUp: PowerUp;
	position: { x: number; y: number };
	onCollect: (powerUpId: string) => void;
}

export function PowerUp({ powerUp, position, onCollect }: PowerUpProps) {
	const color = getPowerUpColor(powerUp.type);
	const rarityEffects = getRarityEffects(powerUp.rarity || "common");

	return (
		<motion.div
			className="absolute cursor-pointer touch-none"
			style={{
				left: `${position.x}%`,
				top: `${position.y}%`,
				zIndex: 25,
			}}
			initial={{ scale: 0, opacity: 0, rotate: -15 }}
			animate={{
				scale: [0.9, 1.1, 0.9],
				opacity: 1,
				rotate: [-5, 5, -5],
				y: [0, -10, 0],
			}}
			transition={{
				scale: { repeat: Infinity, duration: 1.5 },
				rotate: { repeat: Infinity, duration: 2 },
				y: { repeat: Infinity, duration: 1.2 },
			}}
			exit={{ scale: 0, opacity: 0, y: 50, transition: { duration: 0.3 } }}
			onClick={() => onCollect(powerUp.id)}
			whileHover={{ scale: 1.2 }}
			whileTap={{ scale: 1.2 }}
		>
			<div
				className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative`}
			>
				{/* Halo de rareté */}
				<motion.div
					className="absolute inset-0 rounded-full"
					style={{
						background: `radial-gradient(circle, ${rarityEffects.glowColor} 0%, transparent 70%)`,
					}}
					animate={{
						scale: [1, 1.5, 1],
						opacity: [0.4, 0.7, 0.4],
					}}
					transition={{
						repeat: Infinity,
						duration: rarityEffects.glowPulseDuration,
						ease: "easeInOut",
					}}
				/>

				{/* Cercle principal */}
				<motion.div
					className="absolute inset-2 rounded-full shadow-lg"
					style={{
						background: `linear-gradient(135deg, ${color}, ${rarityEffects.secondaryColor})`,
						border: `2px solid ${rarityEffects.borderColor}`,
					}}
					animate={{
						scale: [1, 1.1, 1],
						rotate: [0, 360],
					}}
					transition={{
						scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
						rotate: { repeat: Infinity, duration: 15, ease: "linear" },
					}}
				/>

				{/* Particules d'énergie (uniquement pour rare/epic) */}
				{(powerUp.rarity === "rare" || powerUp.rarity === "epic") && (
					<>
						{[...Array(5)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white"
								style={{
									boxShadow: `0 0 5px 2px ${rarityEffects.particleColor}`,
								}}
								initial={{
									x: 0,
									y: 0,
									opacity: 0,
								}}
								animate={{
									x: [
										0,
										Math.cos(i * 72 * (Math.PI / 180)) *
											(window.innerWidth < 640 ? 20 : 25),
									],
									y: [
										0,
										Math.sin(i * 72 * (Math.PI / 180)) *
											(window.innerWidth < 640 ? 20 : 25),
									],
									opacity: [0, 0.8, 0],
								}}
								transition={{
									repeat: Infinity,
									duration: 1.5,
									delay: i * 0.3,
									ease: "easeInOut",
								}}
							/>
						))}
					</>
				)}

				{/* Icône du power-up */}
				<div
					className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 drop-shadow-xl"
					dangerouslySetInnerHTML={{
						__html: colorizeIcon(powerUp.icon, "white"),
					}}
				/>
			</div>

			{/* Nom et rareté du power-up */}
			<div
				className="absolute -bottom-6 sm:-bottom-7 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md text-[10px] sm:text-xs whitespace-nowrap border"
				style={{ borderColor: rarityEffects.borderColor }}
			>
				<span className="font-semibold">{powerUp.name}</span>
				<span
					className="ml-1 text-[8px] sm:text-[10px] px-1 rounded"
					style={{ color: rarityEffects.textColor }}
				>
					{powerUp.rarity?.toUpperCase()}
				</span>
			</div>
		</motion.div>
	);
}

// Couleurs pour les différents types de power-ups
function getPowerUpColor(type: string): string {
	switch (type) {
		case "slowTime":
			return "#3498db"; // Blue
		case "magnet":
			return "#e74c3c"; // Red
		case "extraLife":
			return "#2ecc71"; // Green
		case "doublePoints":
			return "#f39c12"; // Orange
		case "clearScreen":
			return "#9b59b6"; // Purple
		default:
			return "#34495e"; // Dark blue
	}
}

// Effets visuels en fonction de la rareté
function getRarityEffects(rarity: string): {
	glowColor: string;
	borderColor: string;
	secondaryColor: string;
	textColor: string;
	glowPulseDuration: number;
	particleColor: string;
} {
	switch (rarity) {
		case "epic":
			return {
				glowColor: "rgba(155, 89, 182, 0.8)", // Purple glow
				borderColor: "#9b59b6",
				secondaryColor: "#8e44ad",
				textColor: "#8e44ad",
				glowPulseDuration: 1.5,
				particleColor: "#9b59b6",
			};
		case "rare":
			return {
				glowColor: "rgba(52, 152, 219, 0.8)", // Blue glow
				borderColor: "#3498db",
				secondaryColor: "#2980b9",
				textColor: "#2980b9",
				glowPulseDuration: 2,
				particleColor: "#3498db",
			};
		case "common":
		default:
			return {
				glowColor: "rgba(46, 204, 113, 0.5)", // Green glow
				borderColor: "#2ecc71",
				secondaryColor: "#27ae60",
				textColor: "#27ae60",
				glowPulseDuration: 3,
				particleColor: "#2ecc71",
			};
	}
}

// Fonction pour coloriser l'icône SVG
function colorizeIcon(iconSvg: string, color: string): string {
	return iconSvg.replace(/fill="[^"]*"/g, `fill="${color}"`);
}

export default PowerUp;
