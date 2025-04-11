"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { backgroundElements, environmentThemes } from "../constants";

interface BackgroundProps {
	score: number;
	gameStarted: boolean;
	savedCO2: number;
	environmentType?: "forest" | "ocean";
}

export function Background({
	score,
	gameStarted,
	savedCO2,
	environmentType = "forest",
}: BackgroundProps) {
	const [elementsState, setElementsState] = useState<{
		clouds: number;
		trees: number;
		birds: number;
		forest: number;
		ocean: number;
		fish: number;
		flowers: number;
	}>({
		clouds: 0,
		trees: 0,
		birds: 0,
		forest: 0,
		ocean: 0,
		fish: 0,
		flowers: 0,
	});

	const [environmentMessage, setEnvironmentMessage] = useState<string>("");
	const [showMessage, setShowMessage] = useState<boolean>(false);
	// Utiliser useRef pour stocker la valeur précédente de CO2 sans provoquer de re-rendus
	const previousCO2Ref = useRef<number>(0);

	// Charger la valeur précédente de CO2 depuis localStorage au chargement initial
	useEffect(() => {
		previousCO2Ref.current = Number(localStorage.getItem("previousCO2") || "0");
	}, []);

	// Mettre à jour l'environnement en fonction du CO2 économisé
	useEffect(() => {
		if (!gameStarted) return; // Ne rien faire si le jeu n'est pas démarré

		const theme = environmentThemes[environmentType];
		if (!theme) return;

		let currentThreshold = theme.thresholds[0];

		// Trouver le palier actuel basé sur le CO2 économisé
		for (let i = theme.thresholds.length - 1; i >= 0; i--) {
			if (savedCO2 >= theme.thresholds[i].co2) {
				currentThreshold = theme.thresholds[i];
				break;
			}
		}

		// Mettre à jour les éléments de l'environnement
		const newElementsState = {
			clouds: Math.min(3, Math.floor(score / 50)), // Nuages basés sur le score
			trees: 0,
			birds: 0,
			forest: 0,
			ocean: 0,
			fish: 0,
			flowers: 0,
		};

		// Ajouter les éléments du palier actuel
		currentThreshold.elements.forEach((element) => {
			newElementsState[element as keyof typeof newElementsState] =
				currentThreshold.count;
		});

		setElementsState(newElementsState);

		// Si on vient de franchir un palier, afficher le message
		for (const threshold of theme.thresholds) {
			if (savedCO2 >= threshold.co2 && previousCO2Ref.current < threshold.co2) {
				setEnvironmentMessage(threshold.message);
				setShowMessage(true);
				setTimeout(() => setShowMessage(false), 5000);
				break;
			}
		}

		// Mettre à jour la référence sans déclencher de re-rendu
		previousCO2Ref.current = savedCO2;
	}, [savedCO2, score, environmentType, gameStarted]);

	// Effet séparé pour gérer les interactions avec localStorage - s'exécute moins fréquemment
	useEffect(() => {
		if (!gameStarted) return; // Ne pas interagir avec localStorage si le jeu n'est pas actif

		// Limite la fréquence des écritures dans localStorage
		const timeoutId = setTimeout(() => {
			localStorage.setItem("previousCO2", savedCO2.toString());
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [savedCO2, gameStarted]);

	if (!gameStarted) return null;

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
			{/* Indicateur d'environnement caché car déplacé dans Game.tsx */}
			{/* <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full shadow-md z-30 flex items-center gap-2">
				<span className="text-sm font-medium">
					{environmentType === "forest" ? (
						<>
							<span className="text-green-600 dark:text-green-400">Forêt</span>{" "}
							🌳
						</>
					) : (
						<>
							<span className="text-blue-600 dark:text-blue-400">Océan</span> 🌊
						</>
					)}
				</span>
				<div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div
						className={`h-full ${
							environmentType === "forest" ? "bg-green-500" : "bg-blue-500"
						}`}
						style={{
							width: `${Math.min(100, (savedCO2 / 50) * 100)}%`,
							transition: "width 1s ease-out",
						}}
					/>
				</div>
			</div> */}

			{/* Message environnemental */}
			{showMessage && (
				<motion.div
					className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900/60 p-3 rounded-lg shadow-lg z-40"
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -50, opacity: 0 }}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
				>
					<p className="text-green-800 dark:text-green-200 font-medium text-center">
						{environmentMessage}
					</p>
				</motion.div>
			)}

			{/* Arrière-plan coloré en fonction de l'environnement */}
			<div
				className="absolute inset-0 transition-colors duration-1000 ease-in-out"
				style={{
					background:
						environmentType === "forest"
							? "linear-gradient(to bottom, #e0f7fa, #c8e6c9)"
							: "linear-gradient(to bottom, #bbdefb, #b3e5fc)",
					opacity: 0.5,
				}}
			/>

			{/* Nuages */}
			{backgroundElements
				.find((el) => el.id === "clouds")
				?.positions.slice(0, elementsState.clouds)
				.map((pos, index) => (
					<motion.div
						key={`cloud-${index}`}
						className="absolute"
						style={{
							left: `${pos.x}%`,
							top: `${pos.y}%`,
							opacity: pos.opacity,
							transform: `scale(${pos.scale * 1.5})`, // 50% plus grand
						}}
						initial={{ scale: 0 }}
						animate={{
							scale: pos.scale * 1.5, // 50% plus grand
							x: [0, 10, 0, -10, 0],
							y: [0, 5, 0, -5, 0],
						}}
						transition={{
							scale: { duration: 1 },
							x: { repeat: Infinity, duration: 20, ease: "easeInOut" },
							y: { repeat: Infinity, duration: 15, ease: "easeInOut" },
						}}
						dangerouslySetInnerHTML={{
							__html:
								backgroundElements.find((el) => el.id === "clouds")?.svg || "",
						}}
					/>
				))}

			{/* Environnement: Forêt */}
			{environmentType === "forest" && (
				<>
					{/* Arbres de la forêt */}
					{backgroundElements
						.find((el) => el.id === "forest")
						?.positions.slice(0, elementsState.forest)
						.map((pos, index) => (
							<motion.div
								key={`forest-${index}`}
								className="absolute"
								style={{
									left: `${pos.x}%`,
									bottom: `${100 - pos.y}%`,
									opacity: pos.opacity,
									transform: `scale(${pos.scale * 1.8})`, // 80% plus grand
								}}
								initial={{ scale: 0, y: 50 }}
								animate={{
									scale: pos.scale * 1.8, // 80% plus grand
									y: 0,
								}}
								transition={{
									duration: 1.5,
									ease: "backOut",
								}}
								dangerouslySetInnerHTML={{
									__html:
										backgroundElements.find((el) => el.id === "forest")?.svg ||
										"",
								}}
							/>
						))}

					{/* Fleurs */}
					{backgroundElements
						.find((el) => el.id === "flowers")
						?.positions.slice(0, elementsState.flowers)
						.map((pos, index) => (
							<motion.div
								key={`flower-${index}`}
								className="absolute"
								style={{
									left: `${pos.x}%`,
									bottom: `${100 - pos.y}%`,
									opacity: pos.opacity,
									transform: `scale(${pos.scale * 1.5})`, // 50% plus grand
								}}
								initial={{ scale: 0 }}
								animate={{
									scale: pos.scale * 1.5, // 50% plus grand
									rotate: [0, 5, 0, -5, 0],
								}}
								transition={{
									scale: { duration: 1 },
									rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" },
								}}
								dangerouslySetInnerHTML={{
									__html:
										backgroundElements.find((el) => el.id === "flowers")?.svg ||
										"",
								}}
							/>
						))}
				</>
			)}

			{/* Environnement: Océan */}
			{environmentType === "ocean" && (
				<>
					{/* Eau */}
					{backgroundElements
						.find((el) => el.id === "ocean")
						?.positions.slice(0, elementsState.ocean)
						.map((pos, index) => (
							<motion.div
								key={`ocean-${index}`}
								className="absolute"
								style={{
									left: `${pos.x}%`,
									bottom: `${100 - pos.y}%`,
									opacity: pos.opacity,
									transform: `scale(${pos.scale * 1.8})`, // 80% plus grand
								}}
								initial={{ scale: 0 }}
								animate={{
									scale: pos.scale * 1.8, // 80% plus grand
									y: [0, 5, 0, -5, 0],
								}}
								transition={{
									scale: { duration: 1 },
									y: { repeat: Infinity, duration: 8, ease: "easeInOut" },
								}}
								dangerouslySetInnerHTML={{
									__html:
										backgroundElements.find((el) => el.id === "ocean")?.svg ||
										"",
								}}
							/>
						))}

					{/* Poissons */}
					{backgroundElements
						.find((el) => el.id === "fish")
						?.positions.slice(0, elementsState.fish)
						.map((pos, index) => (
							<motion.div
								key={`fish-${index}`}
								className="absolute"
								style={{
									left: `${pos.x}%`,
									bottom: `${100 - pos.y}%`,
									opacity: pos.opacity,
									transform: `scale(${pos.scale * 1.5})`, // 50% plus grand
								}}
								initial={{ x: -50 }}
								animate={{
									x: [null, 100, -100],
									y: [null, -5, 5, 0],
									scale: pos.scale * 1.5, // 50% plus grand
								}}
								transition={{
									x: {
										repeat: Infinity,
										duration: 20 + index * 5,
										ease: "linear",
										repeatType: "loop",
									},
									y: {
										repeat: Infinity,
										duration: 3,
										ease: "easeInOut",
									},
								}}
								dangerouslySetInnerHTML={{
									__html:
										backgroundElements.find((el) => el.id === "fish")?.svg ||
										"",
								}}
							/>
						))}
				</>
			)}

			{/* Oiseaux - communs aux deux environnements */}
			{backgroundElements
				.find((el) => el.id === "birds")
				?.positions.slice(0, elementsState.birds)
				.map((pos, index) => (
					<motion.div
						key={`bird-${index}`}
						className="absolute"
						style={{
							left: `${pos.x}%`,
							top: `${pos.y}%`,
							opacity: pos.opacity,
							transform: `scale(${pos.scale * 1.3})`, // 30% plus grand
						}}
						initial={{ x: -100 }}
						animate={{
							x: [null, 100, -100],
							y: [null, pos.y - 5, pos.y + 5, pos.y],
							scale: pos.scale * 1.3, // 30% plus grand
						}}
						transition={{
							x: {
								repeat: Infinity,
								duration: 20 + index * 5,
								ease: "linear",
								repeatType: "loop",
							},
							y: {
								repeat: Infinity,
								duration: 5,
								ease: "easeInOut",
								times: [0, 0.2, 0.6, 1],
							},
						}}
						dangerouslySetInnerHTML={{
							__html:
								backgroundElements.find((el) => el.id === "birds")?.svg || "",
						}}
					/>
				))}
		</div>
	);
}

export default Background;
