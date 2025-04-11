import { useCallback, useEffect, useRef, useState } from "react";
import { particleEffects, powerUps } from "../constants";
import { PowerUpType } from "../types";

interface PowerUp {
	id: string;
	name: string;
	icon: string;
	type: PowerUpType;
	effect: string;
	duration: number;
	rarity: "common" | "rare" | "epic";
}

interface UsePowerUpsProps {
	gameStarted: boolean;
	gameOver: boolean;
	isPaused: boolean;
	onPointsMultiplierChange: (value: number) => void;
	onGameSpeedChange: (value: number) => void;
	onItemsClear: () => void;
	onLifeAdded: () => void;
	onScoreBoost?: (value: number) => void;
}

// Interface pour les power-ups actifs
interface ActivePowerUp {
	id: string;
	endTime: number;
}

export function usePowerUps({
	gameStarted,
	gameOver,
	isPaused,
	onPointsMultiplierChange,
	onItemsClear,
	onLifeAdded,
	onScoreBoost = () => {},
}: UsePowerUpsProps) {
	const [currentPowerUp, setCurrentPowerUp] = useState<{
		powerUp: PowerUp;
		position: { x: number; y: number };
	} | null>(null);

	// Power-ups actifs
	const [activePowerUps, setActivePowerUps] = useState<
		Record<string, ActivePowerUp>
	>({});
	const [activePowerUpDetails, setActivePowerUpDetails] = useState<
		Record<string, ActivePowerUp>
	>({});

	const [showParticles, setShowParticles] = useState<{
		effect: "correctSort" | "levelUp" | "powerUp";
		x: number;
		y: number;
		colors: string[];
		count: number;
		speed: number;
		size: { min: number; max: number };
		duration: number;
		type?: string;
	} | null>(null);

	const [tip, setTip] = useState("");
	const [showTip, setShowTip] = useState(false);

	const powerUpTimerRef = useRef<NodeJS.Timeout | null>(null);
	const powerUpEndTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

	// Générer des power-ups aléatoirement
	useEffect(() => {
		if (!gameStarted || gameOver || isPaused || currentPowerUp) return;

		const spawnPowerUp = () => {
			// Sélectionner un power-up aléatoire en fonction de sa rareté
			const rarityChances = {
				common: 0.6,
				rare: 0.3,
				epic: 0.1,
			};

			// Filtrer les power-ups par rareté
			const possiblePowerUps = {
				common: powerUps.filter((p) => p.rarity === "common"),
				rare: powerUps.filter((p) => p.rarity === "rare"),
				epic: powerUps.filter((p) => p.rarity === "epic"),
			};

			// Déterminer la rareté du power-up à générer
			const rand = Math.random();
			let selectedRarity: "common" | "rare" | "epic";

			if (rand < rarityChances.common) {
				selectedRarity = "common";
			} else if (rand < rarityChances.common + rarityChances.rare) {
				selectedRarity = "rare";
			} else {
				selectedRarity = "epic";
			}

			// Sélectionner un power-up aléatoire de la rareté choisie
			const powerUpPool = possiblePowerUps[selectedRarity];
			const randomPowerUp =
				powerUpPool[Math.floor(Math.random() * powerUpPool.length)];

			// Générer une position aléatoire, mais pas trop près des bords
			const randomX = Math.random() * 70 + 15;
			const randomY = Math.random() * 40 + 20;

			setCurrentPowerUp({
				powerUp: randomPowerUp as PowerUp,
				position: { x: randomX, y: randomY },
			});

			// Faire disparaître le power-up après un certain temps s'il n'est pas récupéré
			setTimeout(() => {
				setCurrentPowerUp(null);
			}, 7000); // 7 secondes pour attraper le power-up
		};

		// Démarrer le timer pour générer des power-ups
		powerUpTimerRef.current = setInterval(() => {
			// 10% de chance de générer un power-up toutes les 15-25 secondes
			if (Math.random() < 0.1) {
				spawnPowerUp();
			}
		}, Math.random() * 10000 + 15000); // Entre 15 et 25 secondes

		return () => {
			if (powerUpTimerRef.current) {
				clearInterval(powerUpTimerRef.current);
			}
		};
	}, [gameStarted, gameOver, isPaused, currentPowerUp]);

	// Appliquer l'effet d'un power-up
	const applyPowerUpEffect = useCallback(
		(powerUp: PowerUp) => {
			const now = Date.now();
			const endTime = now + powerUp.duration;

			switch (powerUp.type) {
				case "magnet":
					// Power-up d'aimantation - tri automatique
					setActivePowerUpDetails((prev) => ({
						...prev,
						magnet: { id: powerUp.id, endTime },
					}));

					// Terminer après la durée
					if (powerUpEndTimersRef.current.magnet) {
						clearTimeout(powerUpEndTimersRef.current.magnet);
					}

					powerUpEndTimersRef.current.magnet = setTimeout(() => {
						setActivePowerUps((prev) => {
							const newState = { ...prev };
							delete newState[powerUp.id];
							return newState;
						});
						setActivePowerUpDetails((prev) => {
							const newDetails = { ...prev };
							delete newDetails.magnet;
							return newDetails;
						});
					}, powerUp.duration);
					break;

				case "extraLife":
					// Ajouter une vie
					onLifeAdded();
					// Effet instantané, ne pas ajouter aux power-ups actifs
					break;

				case "doublePoints":
					// Doubler les points
					onPointsMultiplierChange(2);

					setActivePowerUpDetails((prev) => ({
						...prev,
						doublePoints: { id: powerUp.id, endTime },
					}));

					// Terminer après la durée
					if (powerUpEndTimersRef.current.doublePoints) {
						clearTimeout(powerUpEndTimersRef.current.doublePoints);
					}

					powerUpEndTimersRef.current.doublePoints = setTimeout(() => {
						onPointsMultiplierChange(1);
						setActivePowerUps((prev) => {
							const newState = { ...prev };
							delete newState[powerUp.id];
							return newState;
						});
						setActivePowerUpDetails((prev) => {
							const newDetails = { ...prev };
							delete newDetails.doublePoints;
							return newDetails;
						});
					}, powerUp.duration);
					break;

				case "clearScreen":
					// Trier automatiquement tous les déchets à l'écran
					onItemsClear();
					// L'effet est instantané
					break;

				case "scoreBoost":
					// Nouveau power-up: ajoute des points instantanément
					onScoreBoost(50);
					break;
			}
		},
		[onLifeAdded, onPointsMultiplierChange, onItemsClear, onScoreBoost]
	);

	// Collecter un power-up
	const collectPowerUp = useCallback(
		(powerUpId: string, gameAreaRect: DOMRect | null) => {
			if (!currentPowerUp) return;

			const { powerUp } = currentPowerUp;

			// Ajouter le power-up aux power-ups actifs s'il a une durée
			if (powerUp.duration > 0) {
				setActivePowerUps((prev) => ({
					...prev,
					[powerUpId]: {
						id: powerUpId,
						endTime: Date.now() + powerUp.duration,
					},
				}));
			}

			// Effet de particules
			if (gameAreaRect) {
				const x = gameAreaRect.width * (currentPowerUp.position.x / 100);
				const y = gameAreaRect.height * (currentPowerUp.position.y / 100);

				setShowParticles({
					effect: "powerUp",
					x,
					y,
					...particleEffects.powerUp,
				});
			}

			// Appliquer l'effet du power-up
			applyPowerUpEffect(powerUp);

			// Supprimer le power-up actuel
			setCurrentPowerUp(null);

			// Afficher l'info-bulle
			setTip(powerUp.effect);
			setShowTip(true);
			setTimeout(() => setShowTip(false), 3000);
		},
		[currentPowerUp, applyPowerUpEffect]
	);

	// Nettoyer les timers lors du démontage
	useEffect(() => {
		return () => {
			if (powerUpTimerRef.current) {
				clearInterval(powerUpTimerRef.current);
			}
			// Nettoyer les timers des power-ups
			Object.values(powerUpEndTimersRef).forEach((timer) => {
				clearTimeout(timer);
			});
		};
	}, []);

	// Activer un power-up
	const activatePowerUp = useCallback(
		(powerUp: PowerUpType) => {
			// S'assurer qu'un seul power-up du même type est actif à la fois
			if (activePowerUps[powerUp]) {
				return;
			}

			const now = Date.now();
			const powerUpConfig = powerUps.find((p) => p.type === powerUp);

			if (!powerUpConfig) {
				console.error("PowerUp configuration not found:", powerUp);
				return;
			}

			// Effet de particules pour le power-up
			setShowParticles({
				effect: "powerUp",
				x: 50, // Centré
				y: 50, // Centré
				colors: ["#3498db", "#2980b9"],
				count: 15,
				speed: 5,
				size: { min: 5, max: 15 },
				duration: 1000,
			});

			// Activer l'effet du power-up selon son type
			switch (powerUp) {
				case "doublePoints":
					onPointsMultiplierChange(2);
					break;
				case "clearScreen":
					onItemsClear();
					break;
				case "extraLife":
					onLifeAdded();
					break;
				case "magnet":
					// La logique du magnet reste inchangée
					break;
				case "scoreBoost":
					// Nouveau power-up: ajoute 50 points instantanément
					onScoreBoost(50);
					break;
			}

			// Pour les power-ups avec durée, programmer leur fin
			if (powerUpConfig.duration > 0) {
				setActivePowerUps((prev) => ({
					...prev,
					[powerUp]: {
						id: powerUp,
						endTime: now + powerUpConfig.duration,
					},
				}));
			}
		},
		[
			activePowerUps,
			onItemsClear,
			onLifeAdded,
			onPointsMultiplierChange,
			onScoreBoost,
		]
	);

	// Dans useEffect qui gère l'expiration des power-ups
	useEffect(() => {
		if (isPaused || gameOver || !gameStarted) return;

		const powerUpTimer = setInterval(() => {
			const now = Date.now();
			let hasExpired = false;
			const newPowerUps = { ...activePowerUps };

			Object.keys(activePowerUps).forEach((key) => {
				const powerUp = activePowerUps[key];
				if (powerUp.endTime <= now) {
					// Désactiver l'effet selon le type
					switch (key as PowerUpType) {
						case "doublePoints":
							onPointsMultiplierChange(1);
							break;
						case "magnet":
							// Désactivation du magnet
							break;
					}

					// Supprimer le power-up expiré
					delete newPowerUps[key];
					hasExpired = true;
				}
			});

			if (hasExpired) {
				setActivePowerUps(newPowerUps);
			}
		}, 100);

		return () => clearInterval(powerUpTimer);
	}, [
		activePowerUps,
		gameOver,
		gameStarted,
		isPaused,
		onPointsMultiplierChange,
	]);

	return {
		currentPowerUp,
		activePowerUps,
		activePowerUpDetails,
		showParticles,
		tip,
		showTip,
		collectPowerUp,
		setShowParticles,
		setTip,
		setShowTip,
		activatePowerUp,
	};
}
