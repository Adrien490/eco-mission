import { useCallback, useEffect, useRef, useState } from "react";
import { specialEvents } from "../constants";

interface UseSpecialEventsProps {
	gameStarted: boolean;
	gameOver: boolean;
	isPaused: boolean;
	onItemRain: () => void;
	onBonusItem: () => void;
	onMixedItems: () => void;
}

export function useSpecialEvents({
	gameStarted,
	gameOver,
	isPaused,
	onItemRain,
	onBonusItem,
	onMixedItems,
}: UseSpecialEventsProps) {
	const [specialEventActive, setSpecialEventActive] = useState<string | null>(
		null
	);
	const [tip, setTip] = useState("");
	const [showTip, setShowTip] = useState(false);

	const specialEventTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Appliquer l'effet de l'événement spécial
	const handleSpecialEvent = useCallback(
		(eventId: string) => {
			switch (eventId) {
				case "itemRain":
					onItemRain();
					break;
				case "bonusItem":
					onBonusItem();
					break;
				case "mixedItems":
					onMixedItems();
					break;
			}
		},
		[onItemRain, onBonusItem, onMixedItems]
	);

	// Démarrer les événements spéciaux aléatoirement
	useEffect(() => {
		if (!gameStarted || gameOver || isPaused || specialEventActive) return;

		const startSpecialEvent = () => {
			// Sélectionner un événement en fonction de sa fréquence
			const frequencyWeights = {
				high: 0.5,
				medium: 0.3,
				low: 0.2,
			};

			// Filtrer les événements par fréquence
			const possibleEvents = {
				high: specialEvents.filter((e) => e.frequency === "high"),
				medium: specialEvents.filter((e) => e.frequency === "medium"),
				low: specialEvents.filter((e) => e.frequency === "low"),
			};

			// Déterminer la fréquence de l'événement à générer
			const rand = Math.random();
			let selectedFrequency: "high" | "medium" | "low";

			if (rand < frequencyWeights.high) {
				selectedFrequency = "high";
			} else if (rand < frequencyWeights.high + frequencyWeights.medium) {
				selectedFrequency = "medium";
			} else {
				selectedFrequency = "low";
			}

			// Sélectionner un événement aléatoire de la fréquence choisie
			const eventPool = possibleEvents[selectedFrequency];
			const randomEvent =
				eventPool[Math.floor(Math.random() * eventPool.length)];

			// Activer l'événement spécial
			setSpecialEventActive(randomEvent.id);
			setTip(randomEvent.description);
			setShowTip(true);

			// Effet de l'événement
			handleSpecialEvent(randomEvent.id);

			// Désactiver l'événement après sa durée
			setTimeout(() => {
				setSpecialEventActive(null);
				setShowTip(false);
			}, randomEvent.duration);
		};

		// Démarrer le timer pour générer des événements spéciaux
		specialEventTimerRef.current = setInterval(() => {
			// 15% de chance de démarrer un événement spécial toutes les 30-60 secondes
			if (Math.random() < 0.15) {
				startSpecialEvent();
			}
		}, Math.random() * 30000 + 30000); // Entre 30 et 60 secondes

		return () => {
			if (specialEventTimerRef.current) {
				clearInterval(specialEventTimerRef.current);
			}
		};
	}, [gameStarted, gameOver, isPaused, specialEventActive, handleSpecialEvent]);

	// Nettoyer les timers lors du démontage
	useEffect(() => {
		return () => {
			if (specialEventTimerRef.current) {
				clearInterval(specialEventTimerRef.current);
			}
		};
	}, []);

	return {
		specialEventActive,
		tip,
		showTip,
		setTip,
		setShowTip,
	};
}
