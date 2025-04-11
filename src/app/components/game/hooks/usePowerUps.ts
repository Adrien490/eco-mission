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
	onPointsMultiplierChange: (multiplier: number) => void;
	onGameSpeedChange: (speedModifier: number) => void;
	onItemsClear: () => void;
	onLifeAdded: () => void;
}

export function usePowerUps({
	gameStarted,
	gameOver,
	isPaused,
	onPointsMultiplierChange,
	onGameSpeedChange,
	onItemsClear,
	onLifeAdded,
}: UsePowerUpsProps) {
	const [currentPowerUp, setCurrentPowerUp] = useState<{
		powerUp: PowerUp;
		position: { x: number; y: number };
	} | null>(null);

	const [activePowerUps, setActivePowerUps] = useState<string[]>([]);
	const [activePowerUpDetails, setActivePowerUpDetails] = useState<
		Record<string, { id: string; endTime: number }>
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
				case "slowTime":
					// Ralentir la chute des objets
					onGameSpeedChange(0.4); // 60% plus lent (0.4 au lieu de 1.0)

					// Enregistrer les détails pour pouvoir revenir à la vitesse normale
					setActivePowerUpDetails((prev) => ({
						...prev,
						slowTime: { id: powerUp.id, endTime },
					}));

					// Créer un timer pour terminer l'effet
					if (powerUpEndTimersRef.current.slowTime) {
						clearTimeout(powerUpEndTimersRef.current.slowTime);
					}

					powerUpEndTimersRef.current.slowTime = setTimeout(() => {
						onGameSpeedChange(1); // Revenir à la vitesse normale
						setActivePowerUps((prev) => prev.filter((id) => id !== powerUp.id));
						setActivePowerUpDetails((prev) => {
							const newDetails = { ...prev };
							delete newDetails.slowTime;
							return newDetails;
						});
					}, powerUp.duration);
					break;

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
						setActivePowerUps((prev) => prev.filter((id) => id !== powerUp.id));
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
					setActivePowerUps((prev) => prev.filter((id) => id !== powerUp.id)); // Effet instantané
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
						setActivePowerUps((prev) => prev.filter((id) => id !== powerUp.id));
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
					setActivePowerUps((prev) => prev.filter((id) => id !== powerUp.id));
					break;
			}
		},
		[onGameSpeedChange, onLifeAdded, onPointsMultiplierChange, onItemsClear]
	);

	// Collecter un power-up
	const collectPowerUp = useCallback(
		(powerUpId: string, gameAreaRect: DOMRect | null) => {
			if (!currentPowerUp) return;

			const { powerUp } = currentPowerUp;

			// Ajouter le power-up aux power-ups actifs
			setActivePowerUps((prev) => [...prev, powerUpId]);

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
	};
}
