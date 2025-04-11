import { useEffect, useState } from "react";

// Interface pour les données de progression utilisateur
interface UserProgress {
	highScore: number;
	totalCO2Saved: number;
	totalItemsSorted: number;
	level: number;
	completedTutorial: boolean;
}

// Clé utilisée pour le stockage local
const STORAGE_KEY = "eco-mission-progress";

// Données initiales pour un nouvel utilisateur
const initialUserProgress: UserProgress = {
	highScore: 0,
	totalCO2Saved: 0,
	totalItemsSorted: 0,
	level: 1,
	completedTutorial: false,
};

export function useLocalStorage() {
	const [userProgress, setUserProgress] =
		useState<UserProgress>(initialUserProgress);
	const [isLoaded, setIsLoaded] = useState(false);

	// Charger les données du localStorage au démarrage
	useEffect(() => {
		// Dans certains environnements (SSR), window n'est pas disponible
		if (typeof window === "undefined") return;

		try {
			const savedData = localStorage.getItem(STORAGE_KEY);
			if (savedData) {
				const parsedData = JSON.parse(savedData) as UserProgress;
				setUserProgress(parsedData);
			}
		} catch (error) {
			console.error("Erreur lors du chargement des données:", error);
			// En cas d'erreur, utiliser les données par défaut
			setUserProgress(initialUserProgress);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	// Sauvegarder les données dans le localStorage
	const saveProgress = (progress: Partial<UserProgress>) => {
		if (typeof window === "undefined") return;

		try {
			// Mettre à jour l'état local avec les nouvelles données
			const updatedProgress = { ...userProgress, ...progress };
			setUserProgress(updatedProgress);

			// Sauvegarder dans le localStorage
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
		} catch (error) {
			console.error("Erreur lors de la sauvegarde des données:", error);
		}
	};

	// Réinitialiser toutes les données
	const resetProgress = () => {
		if (typeof window === "undefined") return;

		try {
			setUserProgress(initialUserProgress);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUserProgress));
		} catch (error) {
			console.error("Erreur lors de la réinitialisation des données:", error);
		}
	};

	// Mettre à jour le score si c'est un nouveau record
	const updateHighScore = (score: number) => {
		let isNewRecord = false;

		// Utiliser une fonction de mise à jour d'état pour éviter les boucles d'update
		setUserProgress((prevProgress) => {
			isNewRecord = score > prevProgress.highScore;
			if (isNewRecord) {
				return { ...prevProgress, highScore: score };
			}
			return prevProgress;
		});

		// Sauvegarder dans localStorage si c'est un nouveau record
		if (isNewRecord) {
			try {
				const updatedProgress = JSON.parse(
					localStorage.getItem(STORAGE_KEY) || "{}"
				);
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({
						...updatedProgress,
						highScore: score,
					})
				);
			} catch (error) {
				console.error("Erreur lors de la mise à jour du highScore:", error);
			}
		}

		return isNewRecord;
	};

	// Mettre à jour les statistiques de tri
	const updateGameStats = (itemsSorted: number, co2Saved: number) => {
		// Utiliser une fonction de mise à jour d'état pour éviter les boucles d'update
		setUserProgress((prevProgress) => ({
			...prevProgress,
			totalItemsSorted: prevProgress.totalItemsSorted + itemsSorted,
			totalCO2Saved: prevProgress.totalCO2Saved + co2Saved,
		}));

		// Sauvegarder dans localStorage - utiliser la dernière version
		try {
			const updatedProgress = JSON.parse(
				localStorage.getItem(STORAGE_KEY) || "{}"
			);
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					...updatedProgress,
					totalItemsSorted:
						(updatedProgress.totalItemsSorted || 0) + itemsSorted,
					totalCO2Saved: (updatedProgress.totalCO2Saved || 0) + co2Saved,
				})
			);
		} catch (error) {
			console.error("Erreur lors de la mise à jour des statistiques:", error);
		}
	};

	// Marquer le tutoriel comme complété
	const completeTutorial = () => {
		saveProgress({ completedTutorial: true });
	};

	return {
		userProgress,
		isLoaded,
		saveProgress,
		resetProgress,
		updateHighScore,
		updateGameStats,
		completeTutorial,
	};
}

export default useLocalStorage;
