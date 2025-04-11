import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { gameItems } from "../constants";
import { GameItem, ItemType } from "../types";

// Backup au cas où gameItems serait undefined
const fallbackItems: GameItem[] = [
	{
		id: "bottle",
		name: "Bouteille plastique",
		emoji: "🍶",
		type: "recycle",
		tip: "Une bouteille plastique met jusqu'à 1000 ans à se décomposer.",
		points: 10,
		co2: 0.5,
	},
	{
		id: "apple",
		name: "Trognon de pomme",
		emoji: "🍎",
		type: "trash",
		tip: "Les déchets organiques peuvent être compostés pour créer un engrais naturel.",
		points: 5,
		co2: 0.2,
	},
	{
		id: "can",
		name: "Canette",
		emoji: "🥫",
		type: "recycle",
		tip: "Une canette d'aluminium peut être recyclée à l'infini.",
		points: 10,
		co2: 0.9,
	},
];

export interface GameState {
	score: number;
	lives: number;
	gameOver: boolean;
	gameStarted: boolean;
	isPaused: boolean;
	level: number;
	levelProgress: number;
	savedCO2: number;
	totalSorted: number;
	currentItems: Array<{
		id: string;
		item: GameItem;
		position: number;
		speed: number;
		horizontalPos: number;
		velocityX: number;
		motionValues: MotionValues;
		isSpecial?: boolean;
	}>;
	showTip: boolean;
	tip: string;
	countdown: number;
	isCountingDown: boolean;
	isNewHighScore: boolean;
	pointsMultiplier: number;
	speedModifier: number;
	gameSpeed: number;
	activePowerUps: Record<string, { id: string; endTime: number }>;
}

// Type pour les actions du reducer
export type GameAction =
	| { type: "UPDATE_SCORE"; payload: number }
	| { type: "UPDATE_LIVES"; payload: number }
	| { type: "SET_GAME_OVER"; payload?: boolean }
	| { type: "SET_GAME_STARTED"; payload: boolean }
	| { type: "TOGGLE_PAUSE" }
	| { type: "SET_PAUSE"; payload: boolean }
	| { type: "UPDATE_LEVEL_PROGRESS"; payload: number }
	| { type: "UPDATE_ITEMS"; payload: GameState["currentItems"] }
	| { type: "SHOW_TIP"; payload: string }
	| { type: "HIDE_TIP" }
	| { type: "RESET_STATE" }
	| { type: "SET_COUNTDOWN"; payload: number }
	| { type: "SET_COUNTING_DOWN"; payload: boolean }
	| { type: "MODIFY_MULTIPLIER"; payload: number }
	| { type: "MODIFY_SPEED"; payload: number }
	| { type: "UPDATE_CO2"; payload: number }
	| { type: "UPDATE_SORTED"; payload: number }
	| { type: "SET_NEW_HIGHSCORE"; payload: boolean };

export interface GameActions {
	startGame: () => void;
	stopGame: () => void;
	togglePause: () => void;
	handleSort: (itemId: string, binType: ItemType) => void;
	startCountdown: () => void;
	spawnRandomItem: () => void;
	hideTip: () => void;
}

// État initial du jeu
const initialGameState: GameState = {
	score: 0,
	lives: 3,
	gameOver: false,
	gameStarted: false,
	isPaused: false,
	level: 1,
	levelProgress: 0,
	savedCO2: 0,
	totalSorted: 0,
	currentItems: [],
	showTip: false,
	tip: "",
	countdown: 3,
	isCountingDown: false,
	isNewHighScore: false,
	pointsMultiplier: 1,
	speedModifier: 1,
	gameSpeed: 0.5,
	activePowerUps: {},
};

// Mettre à jour la définition pour le TypeScript
interface SpawnQueueItem {
	delay: number;
	item?: GameItem;
	items?: GameItem[];
}

// Type pour les valeurs de motion utilisées par Framer Motion
interface MotionValues {
	animationDuration: number;
	entryDelay: number;
	wobbleAmount: number;
	fallingDuration: number;
	spin?: boolean;
	spinSpeed?: number;
	spinDirection?: number;
	bounceIntensity?: number;
	// Propriétés spécifiques à Framer Motion
	stiffness?: number;
	damping?: number;
	ease?: string;
}

export function useGameLogic(
	updateHighScore: (score: number) => boolean,
	updateGameStats: (totalSorted: number, savedCO2: number) => void
) {
	// Constantes du jeu
	const MAX_LEVEL = 10; // Niveau maximum du jeu

	// Références pour les timers et état
	const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
	const speedIncreaseRef = useRef<NodeJS.Timeout | null>(null);
	const tipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const processingItemsRef = useRef<Set<string>>(new Set());
	const lastLifeLossTimeRef = useRef<number>(0);
	const isLosingLifeRef = useRef<boolean>(false);
	const spawnQueueRef = useRef<SpawnQueueItem[]>([]);
	const spawnInProgressRef = useRef<boolean>(false);
	const lastSpawnTimeRef = useRef<number>(Date.now());
	const nextSpawnTimerRef = useRef<NodeJS.Timeout | null>(null);
	const statsUpdatedRef = useRef<boolean>(false);
	const lastMovementCheckRef = useRef<number>(Date.now());
	const levelUpRef = useRef<{ newLevel: number; hasLeveledUp: boolean } | null>(
		null
	);

	// Références de fonctions pour briser les dépendances circulaires
	const spawnSpecificItemRef = useRef<(item: GameItem) => void>(null!);
	const spawnRandomItemRef = useRef<() => void>(null!);
	const processSpawnQueueRef = useRef<() => void>(null!);
	const scheduleItemSpawnRef = useRef<
		(delay?: number, item?: GameItem, items?: GameItem[]) => void
	>(null!);
	const spawnWaveRef = useRef<() => void>(null!);

	// Amélioration de la configuration du jeu
	const gameConfig = useMemo(
		() => ({
			initialSpeed: 0.9, // Augmenté pour un démarrage plus dynamique
			maxSimultaneousItems: 3,
			spawnInterval: { min: 850, max: 1500 }, // Réduit pour plus d'action
			itemsPerWave: { min: 1, max: 3 },
			movementComplexity: 0.6,
			wobbleIntensity: { min: 2.5, max: 5.5 }, // Augmenté pour plus d'effet visuel
			spinChance: 0.4, // Augmenté pour plus d'animations
			bonusLifeFrequency: 100,
			fallingSpeedVariation: 0.25, // Plus de variation pour des mouvements naturels
			forgivenessTime: 300,
			horizontalMovementSpeed: { min: 0.7, max: 1.2 }, // Augmenté significativement pour un mouvement constant
			specialItemFrequency: 0.15, // Plus d'objets spéciaux
			livesStart: 3,
			speedIncreaseFactor: 0.05,
			// Nouveaux paramètres pour l'accélération progressive
			constantAcceleration: 0.005, // Augmenté pour une meilleure dynamique
			maxItemSpeed: 3.5, // Vitesse maximale augmentée
			// Paramètres pour Framer Motion
			bounceStiffness: 200, // Rigidité du rebond pour Framer Motion
			bounceDamping: 10, // Amortissement du rebond
			animationEasing: "easeOut", // Type d'interpolation pour animations
			// Fréquence des vérifications du mouvement
			movementCheckInterval: 1500, // Plus fréquent
		}),
		[]
	);

	// Référence pour stocker la configuration du jeu
	const gameConfigRef = useRef(gameConfig);

	// Déclaration du reducer et du state avant toute référence
	const [gameState, dispatch] = useReducer(
		(state: GameState, action: GameAction): GameState => {
			switch (action.type) {
				case "UPDATE_SCORE":
					return { ...state, score: state.score + action.payload };
				case "UPDATE_LIVES":
					const newLives = Math.max(
						0,
						Math.min(state.lives + action.payload, 3)
					); // Max 3 vies
					return {
						...state,
						lives: newLives,
						gameOver: newLives === 0,
					};
				case "SET_GAME_OVER":
					return { ...state, gameOver: action.payload ?? true };
				case "SET_GAME_STARTED":
					return { ...state, gameStarted: action.payload };
				case "TOGGLE_PAUSE":
					return { ...state, isPaused: !state.isPaused };
				case "SET_PAUSE":
					return { ...state, isPaused: action.payload };
				case "UPDATE_LEVEL_PROGRESS":
					const newProgress = state.levelProgress + action.payload;
					if (newProgress >= 100 && state.level < MAX_LEVEL) {
						// Déclencher le changement de niveau
						const newLevel = state.level + 1;

						// Stocker l'information de level-up pour traitement ultérieur
						levelUpRef.current = {
							newLevel,
							hasLeveledUp: true,
						};

						// Renvoyer l'état mis à jour sans appeler dispatch
						return {
							...state,
							level: newLevel,
							levelProgress: 0,
							gameSpeed: Math.min(state.gameSpeed + 0.1, 1.5),
						};
					}
					return { ...state, levelProgress: newProgress };
				case "UPDATE_ITEMS":
					return { ...state, currentItems: action.payload };
				case "SHOW_TIP":
					return { ...state, showTip: true, tip: action.payload };
				case "HIDE_TIP":
					return { ...state, showTip: false };
				case "RESET_STATE":
					return initialGameState;
				case "SET_COUNTDOWN":
					return { ...state, countdown: action.payload };
				case "SET_COUNTING_DOWN":
					return { ...state, isCountingDown: action.payload };
				case "MODIFY_MULTIPLIER":
					return { ...state, pointsMultiplier: action.payload };
				case "MODIFY_SPEED":
					return { ...state, speedModifier: action.payload };
				case "UPDATE_CO2":
					return { ...state, savedCO2: state.savedCO2 + action.payload };
				case "UPDATE_SORTED":
					// Progression spécifique par niveau - beaucoup plus rapide pour le niveau 1
					const baseProgression = 20; // Progression de base très rapide

					// Facteur de progression dépendant du niveau - niveau 1 beaucoup plus rapide
					let progressFactor = 1;
					if (state.level === 1) {
						// Niveau 1: progression ultra rapide (3x plus rapide)
						progressFactor = 3;
					} else if (state.level === 2) {
						// Niveau 2: progression rapide (1.5x)
						progressFactor = 1.5;
					} else {
						// Niveau 3+: progression normale
						progressFactor = 1;
					}

					// Calculer l'incrément de progression
					const progressIncrement =
						(baseProgression / (5 + (state.level - 1))) * progressFactor;

					return {
						...state,
						totalSorted: state.totalSorted + action.payload,
						levelProgress: state.levelProgress + progressIncrement,
					};
				case "SET_NEW_HIGHSCORE":
					return { ...state, isNewHighScore: action.payload };
				default:
					return state;
			}
		},
		initialGameState
	);

	// Calcul de la durée de chute
	const calculateFallingDuration = useCallback(
		(level: number, gameSpeed: number, speedModifier: number) => {
			const baseDuration = 8 - level * 0.4;
			const adjustedDuration = baseDuration / (gameSpeed * speedModifier);
			return Math.max(3, Math.min(adjustedDuration, 8));
		},
		[]
	);

	// Calcul du délai entre spawns (modifié pour une seule configuration)
	const calculateNextSpawnDelay = useCallback(() => {
		// Intervalles de base
		const { spawnInterval } = gameConfigRef.current;

		// Intervalle de base adapté au niveau
		const baseDelay = Math.max(
			spawnInterval.max - gameState.level * 100,
			spawnInterval.min
		);

		// Ajustement aléatoire pour éviter la monotonie
		const randomFactor = 0.8 + Math.random() * 0.4;

		// Réduction en fonction du modificateur de vitesse et du niveau
		const adjustedDelay =
			(baseDelay * randomFactor) /
			(gameState.speedModifier * (1 + gameState.level * 0.1));

		return Math.max(500, adjustedDelay);
	}, [gameState.level, gameState.speedModifier]);

	// Calculer le nombre d'objets à générer dans une vague
	const calculateItemsPerWave = useCallback(() => {
		const { itemsPerWave } = gameConfigRef.current;

		// Base: nombre d'objets selon la configuration de base
		const baseCount = Math.floor(
			Math.random() * (itemsPerWave.max - itemsPerWave.min + 1) +
				itemsPerWave.min
		);

		// Bonus selon le niveau: +1 objet tous les 2 niveaux
		const levelBonus = Math.min(Math.floor(gameState.level / 2), 5);

		return baseCount + levelBonus;
	}, [gameState.level]);

	// Nouvelle fonction pour contrôler le nombre maximum d'objets en jeu
	const checkMaxItems = useCallback(() => {
		const { maxSimultaneousItems } = gameConfigRef.current;

		// Maximum d'objets + bonus de niveau
		const levelBonus = Math.min(Math.floor(gameState.level / 1.5), 6);

		// Limite stricte au nombre total d'objets pour éviter l'encombrement
		const absoluteMax = Math.min(maxSimultaneousItems + levelBonus, 10);

		return gameState.currentItems.length < absoluteMax;
	}, [gameState.currentItems.length, gameState.level]);

	// Gérer la file d'attente de spawn
	const processSpawnQueue = useCallback(() => {
		if (
			gameState.isPaused ||
			gameState.gameOver ||
			spawnQueueRef.current.length === 0 ||
			spawnInProgressRef.current
		) {
			return;
		}

		spawnInProgressRef.current = true;

		const nextSpawn = spawnQueueRef.current.shift();
		if (!nextSpawn) {
			spawnInProgressRef.current = false;
			return;
		}

		const minSpawnInterval =
			Math.max(1200 - gameState.level * 70, 500) / gameState.speedModifier;
		const timeSinceLastSpawn = Date.now() - lastSpawnTimeRef.current;
		const additionalDelay = Math.max(0, minSpawnInterval - timeSinceLastSpawn);

		nextSpawnTimerRef.current = setTimeout(() => {
			// Si c'est un groupe d'objets, tous les générer avec un léger décalage
			if (nextSpawn.items && nextSpawn.items.length > 0) {
				nextSpawn.items.forEach((item, index) => {
					setTimeout(() => {
						if (!gameState.isPaused && !gameState.gameOver) {
							spawnSpecificItemRef.current(item);
						}
					}, index * 150); // Léger décalage entre chaque objet d'une même vague
				});
			} else if (nextSpawn.item) {
				spawnSpecificItemRef.current(nextSpawn.item);
			} else {
				spawnRandomItemRef.current();
			}

			lastSpawnTimeRef.current = Date.now();
			spawnInProgressRef.current = false;

			// Vérifier si la file n'est pas vide avant de continuer
			if (spawnQueueRef.current.length > 0) {
				processSpawnQueueRef.current();
			} else if (!gameState.gameOver && !gameState.isPaused) {
				// Planifier la prochaine vague après un certain délai
				setTimeout(() => {
					if (!gameState.gameOver && !gameState.isPaused) {
						spawnWaveRef.current();
					}
				}, calculateNextSpawnDelay());
			}
		}, additionalDelay + nextSpawn.delay);
	}, [
		gameState.isPaused,
		gameState.gameOver,
		gameState.level,
		gameState.speedModifier,
		calculateNextSpawnDelay,
	]);

	// Assigner la référence
	processSpawnQueueRef.current = processSpawnQueue;

	// Fonction pour générer une vague d'objets
	const spawnWave = useCallback(() => {
		if (gameState.isPaused || gameState.gameOver) return;

		// Vérifier d'abord si on n'a pas déjà trop d'objets
		if (!checkMaxItems()) {
			// Si trop d'objets, reporter la vague pour plus tard
			setTimeout(() => {
				if (!gameState.gameOver && !gameState.isPaused) {
					spawnWaveRef.current();
				}
			}, 1500);
			return;
		}

		// Déterminer combien d'objets générer dans cette vague
		const rawItemCount = calculateItemsPerWave();
		// Limiter le nombre d'objets en fonction de ce qui est déjà en jeu
		const availableSlots = Math.max(0, 8 - gameState.currentItems.length);
		const itemCount = Math.min(rawItemCount, availableSlots);

		// Si on ne peut pas générer d'objets maintenant, on reporte
		if (itemCount <= 0) {
			setTimeout(() => {
				if (!gameState.gameOver && !gameState.isPaused) {
					spawnWaveRef.current();
				}
			}, 1000);
			return;
		}

		// Choisir des objets aléatoires
		const items = [];
		const itemsToUse =
			!gameItems || gameItems.length === 0 ? fallbackItems : gameItems;

		for (let i = 0; i < itemCount; i++) {
			const randomItem =
				itemsToUse[Math.floor(Math.random() * itemsToUse.length)];
			if (randomItem) {
				items.push(randomItem);
			}
		}

		// Ajouter la vague à la file d'attente avec un délai croissant entre objets
		for (let i = 0; i < items.length; i++) {
			// Espacer les objets dans le temps pour éviter qu'ils apparaissent tous en même temps
			const delay = 200 + i * 400; // Augmente progressivement le délai
			scheduleItemSpawnRef.current(delay, items[i]);
		}
	}, [
		gameState.isPaused,
		gameState.gameOver,
		gameState.currentItems.length,
		calculateItemsPerWave,
		checkMaxItems,
	]);

	// Référence pour la fonction de vague
	spawnWaveRef.current = spawnWave;

	// Planifier un spawn d'objet - version mise à jour
	const scheduleItemSpawn = useCallback(
		(delay = 0, item?: GameItem, items?: GameItem[]) => {
			spawnQueueRef.current.push({ delay, item, items });
			processSpawnQueueRef.current();
		},
		[]
	);

	// Assigner la référence
	scheduleItemSpawnRef.current = scheduleItemSpawn;

	// Générer un objet aléatoire
	const spawnRandomItem = useCallback(() => {
		if (gameState.isPaused || gameState.gameOver) return;

		const itemsToUse =
			!gameItems || gameItems.length === 0 ? fallbackItems : gameItems;

		if (itemsToUse.length === 0) {
			console.error("Erreur: Aucun item disponible pour le jeu");
			return;
		}

		const randomItem =
			itemsToUse[Math.floor(Math.random() * itemsToUse.length)];

		if (!randomItem) {
			console.error("Erreur: randomItem est undefined");
			return;
		}

		spawnSpecificItemRef.current(randomItem);

		// Ne pas planifier automatiquement le prochain spawn ici
		// Cela sera géré par le système de vagues
	}, [gameState.isPaused, gameState.gameOver]);

	// Assigner la référence
	spawnRandomItemRef.current = spawnRandomItem;

	// Effet pour gérer la pause et la reprise du spawn
	useEffect(() => {
		if (gameState.isPaused) {
			if (nextSpawnTimerRef.current) {
				clearTimeout(nextSpawnTimerRef.current);
				nextSpawnTimerRef.current = null;
			}
		} else if (gameState.gameStarted && !gameState.gameOver) {
			if (
				gameState.currentItems.length === 0 &&
				spawnQueueRef.current.length === 0
			) {
				spawnWaveRef.current();
			} else if (checkMaxItems() && spawnQueueRef.current.length === 0) {
				// Générer une nouvelle vague si on est sous le nombre maximum d'objets
				// et qu'il n'y a pas déjà des objets en attente
				const randomDelay = Math.random() * 1000 + 500;
				setTimeout(() => {
					if (!gameState.isPaused && !gameState.gameOver) {
						spawnWaveRef.current();
					}
				}, randomDelay);
			}
		}
	}, [
		gameState.isPaused,
		gameState.gameStarted,
		gameState.gameOver,
		gameState.currentItems.length,
		checkMaxItems,
	]);

	// Fonction sécurisée pour perdre une vie
	const loseLife = useCallback(() => {
		const now = Date.now();
		// Protection de temps - empêcher plusieurs pertes de vie dans un intervalle court (500ms)
		if (isLosingLifeRef.current || now - lastLifeLossTimeRef.current < 500) {
			return false;
		}

		isLosingLifeRef.current = true;
		lastLifeLossTimeRef.current = now;

		dispatch({ type: "UPDATE_LIVES", payload: -1 });

		// Réinitialiser le flag après un délai
		setTimeout(() => {
			isLosingLifeRef.current = false;
		}, 500);

		return true;
	}, []);

	// Gérer le tri d'un objet
	const handleSort = useCallback(
		(itemId: string, binType: ItemType) => {
			// Ignorer si le jeu est en pause ou terminé
			if (gameState.isPaused || gameState.gameOver) return;

			// Vérifier si l'objet est déjà en cours de traitement
			if (processingItemsRef.current.has(itemId)) return;
			processingItemsRef.current.add(itemId);

			dispatch({
				type: "UPDATE_ITEMS",
				payload: gameState.currentItems.filter((i) => i.id !== itemId),
			});

			const item = gameState.currentItems.find((i) => i.id === itemId);
			if (item) {
				const isCorrect = item.item.type === binType;

				if (isCorrect) {
					// Tri correct
					const basePoints = item.item.points || 10;
					const pointsGained = Math.round(
						basePoints * gameState.pointsMultiplier
					);
					const co2Saved = item.item.co2 || 0.5;

					// Mettre à jour le score et CO2 sauvé (une seule fois)
					dispatch({ type: "UPDATE_SCORE", payload: pointsGained });
					dispatch({ type: "UPDATE_CO2", payload: co2Saved });
					dispatch({ type: "UPDATE_SORTED", payload: 1 });

					// Afficher le conseil
					dispatch({ type: "SHOW_TIP", payload: item.item.tip });
					if (tipTimeoutRef.current) {
						clearTimeout(tipTimeoutRef.current);
					}
					tipTimeoutRef.current = setTimeout(
						() => dispatch({ type: "HIDE_TIP" }),
						3000
					);
				} else {
					// Tri incorrect - utiliser la fonction sécurisée
					if (loseLife()) {
						// Afficher le message d'erreur seulement si la vie a été effectivement perdue
						dispatch({
							type: "SHOW_TIP",
							payload: `Erreur ! ${
								item.item.name
							} devrait aller dans : ${translateBinType(item.item.type)}`,
						});
						if (tipTimeoutRef.current) {
							clearTimeout(tipTimeoutRef.current);
						}
						tipTimeoutRef.current = setTimeout(
							() => dispatch({ type: "HIDE_TIP" }),
							3000
						);
					}
				}

				// Nettoyer la référence de l'objet traité après un délai plus long
				setTimeout(() => {
					processingItemsRef.current.delete(itemId);
				}, 300);
			}
		},
		[
			gameState.isPaused,
			gameState.gameOver,
			gameState.currentItems,
			gameState.pointsMultiplier,
			loseLife,
		]
	);

	// Traduire le type de poubelle
	const translateBinType = (type: ItemType): string => {
		switch (type) {
			case "recycle":
				return "Recycler";
			case "trash":
				return "Déchets";
			case "reuse":
				return "Réutiliser";
			default:
				return "";
		}
	};

	// Mettre le jeu en pause
	const togglePause = useCallback(() => {
		dispatch({ type: "TOGGLE_PAUSE" });
	}, []);

	// Réinitialisation de l'état du jeu
	const resetState = useCallback(() => {
		dispatch({ type: "RESET_STATE" });

		// Vider la file d'attente de spawn
		spawnQueueRef.current = [];
		spawnInProgressRef.current = false;
		if (nextSpawnTimerRef.current) {
			clearTimeout(nextSpawnTimerRef.current);
		}
		// Nettoyer les timeouts pour les conseils
		if (tipTimeoutRef.current) {
			clearTimeout(tipTimeoutRef.current);
		}
	}, []);

	// Ajouter une vie
	const addLife = useCallback(() => {
		dispatch({ type: "UPDATE_LIVES", payload: 1 });
	}, []);

	// Nouvelle fonction pour vérifier et traiter les objets qui sortent de l'écran
	const processOutOfBoundsItems = useCallback(() => {
		if (gameState.isPaused || gameState.gameOver) return;

		dispatch({
			type: "UPDATE_ITEMS",
			payload: gameState.currentItems
				.map((item) => {
					// Si l'objet atteint le bas de l'écran, perdre une vie
					if (item.position > 90 && !gameState.gameOver) {
						// Utiliser la même fonction de protection que pour le tri
						if (!processingItemsRef.current.has(item.id)) {
							processingItemsRef.current.add(item.id);

							// Utiliser la fonction sécurisée pour perdre une vie
							loseLife();

							// Nettoyer la référence après un délai plus long
							setTimeout(() => {
								processingItemsRef.current.delete(item.id);
							}, 300);
						}

						// Marquer pour suppression
						return {
							...item,
							position: 999, // Position hors écran pour suppression
						};
					}
					return item;
				})
				.filter((item) => item.position <= 100),
		});
	}, [
		gameState.isPaused,
		gameState.gameOver,
		gameState.currentItems,
		loseLife,
	]);

	// Garantir que les objets se déplacent toujours
	const updateItems = useCallback(() => {
		if (gameState.isPaused || gameState.gameOver) return;

		const updatedItems = gameState.currentItems.map((item) => {
			// Calculer la nouvelle position horizontale
			let newHorizontalPos = item.horizontalPos + item.velocityX;
			let newVelocityX = item.velocityX;

			// Rebond amélioré sur les bords avec effet de bounce
			const MARGIN = 5; // Marge des bords
			if (newHorizontalPos < MARGIN || newHorizontalPos > 100 - MARGIN) {
				// Inverser la direction avec un léger boost d'énergie (effet rebond)
				newVelocityX = -newVelocityX * 1.15;

				// Repositionner correctement l'objet
				newHorizontalPos = newHorizontalPos < MARGIN ? MARGIN : 100 - MARGIN;
			}

			// Variations de mouvement pour un effet plus naturel (réduit pour éviter l'arrêt)
			if (Math.random() < 0.08) {
				const variation = (Math.random() * 2 - 1) * 0.15;
				newVelocityX = newVelocityX + variation;
			}

			// Garantir une vitesse horizontale minimale plus élevée
			const MIN_VELOCITY = 0.25; // Augmenté pour assurer un mouvement constant
			if (Math.abs(newVelocityX) < MIN_VELOCITY) {
				const forcedDirection = Math.random() > 0.5 ? 1 : -1;
				newVelocityX = forcedDirection * (0.35 + Math.random() * 0.4); // Vitesse minimale augmentée
			}

			// Récupérer la constante d'accélération du jeu
			const { constantAcceleration, maxItemSpeed } = gameConfigRef.current;

			// Calculer la nouvelle vitesse avec accélération, mais limitée par le maximum
			// Accélération constante plus élevée pour éviter la stagnation
			let newSpeed = item.speed + constantAcceleration * 1.2;

			// Garantir une vitesse verticale minimale plus élevée
			const MIN_SPEED = 0.35; // Augmenté pour éviter les arrêts
			newSpeed = Math.max(MIN_SPEED, Math.min(newSpeed, maxItemSpeed));

			// Mettre à jour la position verticale également
			const newPosition = item.position + newSpeed;

			return {
				...item,
				horizontalPos: newHorizontalPos,
				velocityX: newVelocityX,
				position: newPosition,
				speed: newSpeed,
			};
		});

		dispatch({ type: "UPDATE_ITEMS", payload: updatedItems });
	}, [gameState.isPaused, gameState.gameOver, gameState.currentItems]);

	// Fonction améliorée pour vérifier et réactiver les objets immobiles
	const checkAndReviveStoppedItems = useCallback(() => {
		if (gameState.isPaused || gameState.gameOver) return;

		const now = Date.now();
		const MOVEMENT_CHECK_INTERVAL = gameConfigRef.current.movementCheckInterval;

		// Vérification plus fréquente
		if (now - lastMovementCheckRef.current < MOVEMENT_CHECK_INTERVAL) return;

		lastMovementCheckRef.current = now;

		let needsUpdate = false;
		const updatedItems = gameState.currentItems.map((item) => {
			// Seuils plus stricts pour détecter les objets quasi-immobiles
			if (Math.abs(item.velocityX) < 0.2 || item.speed < 0.3) {
				needsUpdate = true;
				// Réactiver l'objet avec des valeurs plus élevées
				const direction = Math.random() > 0.5 ? 1 : -1;
				return {
					...item,
					// Vitesse horizontale significativement augmentée
					velocityX: direction * (0.8 + Math.random() * 0.6),
					// Vitesse verticale améliorée
					speed: Math.max(0.5, item.speed + 0.2),
				};
			}
			return item;
		});

		// Mettre à jour uniquement si des changements ont été apportés
		if (needsUpdate) {
			dispatch({ type: "UPDATE_ITEMS", payload: updatedItems });
		}
	}, [gameState.isPaused, gameState.gameOver, gameState.currentItems]);

	// Fonction améliorée pour le spawn d'objets spécifiques
	const spawnSpecificItem = useCallback(
		(specificItem: GameItem) => {
			if (gameState.isPaused || gameState.gameOver) return;

			if (!specificItem) {
				console.error("Erreur: Item spécifique invalide");
				return;
			}

			const randomId = `${specificItem.id}-${Date.now()}-${Math.random()
				.toString(36)
				.substring(2, 9)}`;

			const {
				movementComplexity,
				wobbleIntensity,
				fallingSpeedVariation,
				horizontalMovementSpeed,
				bounceStiffness,
				bounceDamping,
				animationEasing,
			} = gameConfigRef.current;

			// Positionnement horizontal initial - éviter les bords
			const safeMargin = 10; // Marge de sécurité plus grande
			const horizontalPos = Math.random() * (100 - 2 * safeMargin) + safeMargin;

			// Mouvement horizontal amélioré - plus fluide et constant
			const direction = Math.random() > 0.5 ? 1 : -1;
			// Vitesse horizontale significativement augmentée
			const velocityX =
				direction *
				(horizontalMovementSpeed.min * 1.5 +
					Math.random() *
						(horizontalMovementSpeed.max - horizontalMovementSpeed.min));

			// Vitesse de chute optimisée et garantie
			const baseSpeed = 0.7 + Math.random() * 0.3 + gameState.level * 0.05;
			const speedVariation =
				(Math.random() * 1.2 - 0.6) * fallingSpeedVariation;
			// Vitesse minimale garantie et augmentée
			const speed = Math.max(0.5, baseSpeed + speedVariation * baseSpeed);

			// Effets visuels optimisés pour Framer Motion
			const shouldSpin = Math.random() < 0.2;
			const spinDirection = Math.random() > 0.5 ? 1 : -1;

			// Wobble plus naturel
			const wobbleAmount =
				wobbleIntensity.min +
				Math.random() * (wobbleIntensity.max - wobbleIntensity.min);

			// Durée d'animation calculée pour une fluidité optimale
			const complexityFactor =
				1 - movementComplexity * 0.4 - gameState.level * 0.03;
			const baseDuration = calculateFallingDuration(
				gameState.level,
				gameState.gameSpeed,
				gameState.speedModifier
			);

			// Valeurs d'animation optimisées pour Framer Motion - avec rotation contrôlée
			const motionValues: MotionValues = {
				animationDuration: 0.5 + Math.random() * 0.4, // Plus lisse
				entryDelay: Math.random() * 0.15, // Délai réduit pour plus de réactivité
				wobbleAmount: wobbleAmount,
				fallingDuration: baseDuration * complexityFactor,
				spin: shouldSpin,
				spinSpeed: 2 + Math.random() * 3, // Rotation plus visible et énergique
				spinDirection: spinDirection,
				// Rebond plus naturel et dynamique
				bounceIntensity: Math.random() > 0.5 ? 0.4 + Math.random() * 0.5 : 0,
				// Propriétés spécifiques à Framer Motion
				stiffness: bounceStiffness,
				damping: bounceDamping,
				ease: animationEasing,
			};

			dispatch({
				type: "UPDATE_ITEMS",
				payload: [
					...gameState.currentItems,
					{
						id: randomId,
						item: specificItem,
						position: 0,
						speed: speed,
						horizontalPos: horizontalPos,
						velocityX: velocityX,
						motionValues: motionValues,
						isSpecial:
							Math.random() < gameConfigRef.current.specialItemFrequency,
					},
				],
			});
		},
		[
			gameState.isPaused,
			gameState.gameOver,
			calculateFallingDuration,
			gameState.level,
			gameState.gameSpeed,
			gameState.speedModifier,
			gameState.currentItems,
		]
	);

	// Assigner la référence
	spawnSpecificItemRef.current = spawnSpecificItem;

	// Ajouter un nouvel effet pour gérer les changements de niveau
	useEffect(() => {
		if (levelUpRef.current && levelUpRef.current.hasLeveledUp) {
			const { newLevel } = levelUpRef.current;

			// Marquer comme traité pour éviter les exécutions multiples
			levelUpRef.current.hasLeveledUp = false;

			// Message personnalisé selon le niveau
			let levelMessage = `Niveau ${newLevel} ! Difficulté augmentée.`;

			// Message spécifique pour le passage du niveau 1 au niveau 2
			if (newLevel === 2) {
				levelMessage =
					"Niveau 2 ! La difficulté augmente significativement à partir de maintenant.";
			} else if (newLevel === 3) {
				levelMessage =
					"Niveau 3 ! Le jeu devient plus complexe, soyez rapide !";
			} else if (newLevel >= 4) {
				levelMessage = `Niveau ${newLevel} ! Vous êtes maintenant un expert, relevez le défi !`;
			}

			// Afficher le message personnalisé
			dispatch({
				type: "SHOW_TIP",
				payload: levelMessage,
			});

			if (tipTimeoutRef.current) {
				clearTimeout(tipTimeoutRef.current);
			}

			tipTimeoutRef.current = setTimeout(
				() => dispatch({ type: "HIDE_TIP" }),
				3000
			);

			// Déclencher les célébrations de façon différée
			setTimeout(() => {
				// Récupérer les objets festifs pour le nouveau niveau
				// Générer une vague spéciale pour célébrer le nouveau niveau
				const eventItems: GameItem[] = [];
				const itemsToUse =
					!gameItems || gameItems.length === 0 ? fallbackItems : gameItems;

				// Vague plus importante pour célébrer le niveau
				const celebrationCount = Math.min(newLevel + 2, 5); // Limiter à 5 max

				for (let i = 0; i < celebrationCount; i++) {
					const randomItem =
						itemsToUse[Math.floor(Math.random() * itemsToUse.length)];
					if (randomItem) {
						eventItems.push(randomItem);
					}
				}

				// Programmer la vague avec un délai
				let spawnDelay = 0;
				for (let i = 0; i < eventItems.length; i++) {
					// Espacer les objets pour une meilleure expérience visuelle
					spawnDelay += 300;

					// Planifier le spawn avec temporisation croissante
					const itemToSpawn = eventItems[i];
					setTimeout(() => {
						if (!gameState.gameOver && !gameState.isPaused) {
							spawnSpecificItemRef.current(itemToSpawn);
						}
					}, spawnDelay);
				}
			}, 800);
		}
	}, [gameState.level, gameState.gameOver, gameState.isPaused]);

	// Nouvelle fonction pour fermer manuellement un tip
	const hideTip = useCallback(() => {
		dispatch({ type: "HIDE_TIP" });
		// Nettoyer le timeout existant s'il y en a un
		if (tipTimeoutRef.current) {
			clearTimeout(tipTimeoutRef.current);
			tipTimeoutRef.current = null;
		}
	}, []);

	// Fonction pour démarrer le jeu - simplifiée
	const startGame = useCallback(() => {
		// Référence pour le dernier contrôle de mouvement
		lastMovementCheckRef.current = Date.now();

		// Réinitialiser l'état
		dispatch({ type: "SET_GAME_STARTED", payload: true });
		dispatch({ type: "SET_PAUSE", payload: false });
		dispatch({ type: "UPDATE_SCORE", payload: 0 });

		// Nombre de vies initial
		const initialLives = gameConfigRef.current.livesStart;
		dispatch({ type: "UPDATE_LIVES", payload: initialLives });

		dispatch({ type: "SET_GAME_OVER", payload: false });
		dispatch({ type: "UPDATE_ITEMS", payload: [] });
		dispatch({ type: "UPDATE_LEVEL_PROGRESS", payload: 0 });
		dispatch({ type: "UPDATE_CO2", payload: 0 });
		dispatch({ type: "UPDATE_SORTED", payload: 0 });
		dispatch({ type: "MODIFY_MULTIPLIER", payload: 1 });
		dispatch({
			type: "MODIFY_SPEED",
			payload: gameConfigRef.current.initialSpeed,
		});
		dispatch({ type: "SET_NEW_HIGHSCORE", payload: false });

		// Réinitialiser la file d'attente
		spawnQueueRef.current = [];
		spawnInProgressRef.current = false;
		lastSpawnTimeRef.current = Date.now();

		// Message de début de jeu
		dispatch({
			type: "SHOW_TIP",
			payload:
				"Niveau 1 : Niveau d'introduction facile. Triez quelques déchets pour passer au niveau suivant !",
		});

		if (tipTimeoutRef.current) {
			clearTimeout(tipTimeoutRef.current);
		}

		tipTimeoutRef.current = setTimeout(
			() => dispatch({ type: "HIDE_TIP" }),
			3000
		);

		// Générer une première vague d'objets
		spawnWaveRef.current();

		// Lancer la boucle du jeu pour gérer la logique
		gameLoopRef.current = setInterval(() => {
			if (gameState.isPaused || gameState.gameOver) return;

			// Vérifier les objets qui sont sortis de l'écran
			processOutOfBoundsItems();

			// Mettre à jour la position des objets
			updateItems();

			// Vérifier périodiquement si des objets sont immobiles
			checkAndReviveStoppedItems();
		}, 50); // Interval court pour une mise à jour fluide

		// Augmentation progressive de la difficulté
		const speedIncreaseFactor = gameConfigRef.current.speedIncreaseFactor;

		speedIncreaseRef.current = setInterval(() => {
			if (gameState.isPaused || gameState.gameOver) return;

			// Vitesse augmentée dépend du modificateur de vitesse actuel
			const baseSpeedIncrease = speedIncreaseFactor;

			// Légère augmentation progressive de la vitesse sans ralentissement
			dispatch({
				type: "MODIFY_SPEED",
				payload: Math.min(gameState.gameSpeed + baseSpeedIncrease, 1.8), // Maximum augmenté
			});
		}, 20000); // Toutes les 20 secondes
	}, [
		gameState.isPaused,
		gameState.gameOver,
		gameState.gameSpeed,
		processOutOfBoundsItems,
		updateItems,
		checkAndReviveStoppedItems,
	]);

	// Mettre à jour démarrer le compte à rebours
	const startCountdown = useCallback(() => {
		resetState();
		dispatch({ type: "SET_GAME_STARTED", payload: true });
		// Démarrer le jeu directement sans compte à rebours
		dispatch({ type: "SET_COUNTING_DOWN", payload: false });
		dispatch({ type: "SET_COUNTDOWN", payload: 0 });
		startGame();
	}, [resetState, startGame]);

	// Arrêter le jeu
	const stopGame = useCallback(() => {
		if (gameLoopRef.current) clearInterval(gameLoopRef.current);
		if (speedIncreaseRef.current) clearInterval(speedIncreaseRef.current);
		if (nextSpawnTimerRef.current) clearTimeout(nextSpawnTimerRef.current);
		if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);

		// Réinitialiser la file d'attente
		spawnQueueRef.current = [];
		spawnInProgressRef.current = false;
	}, []);

	// Nettoyer les intervalles à la fin du jeu
	useEffect(() => {
		if (gameState.gameOver && !statsUpdatedRef.current) {
			stopGame();

			// Marquer que les statistiques ont été mises à jour
			statsUpdatedRef.current = true;

			// Sauvegarder le score et vérifier si c'est un nouveau record
			const isNewRecord = updateHighScore(gameState.score);
			dispatch({ type: "SET_NEW_HIGHSCORE", payload: isNewRecord });

			// Sauvegarder les statistiques
			updateGameStats(gameState.totalSorted, gameState.savedCO2);
		} else if (!gameState.gameOver) {
			// Réinitialiser la référence quand le jeu n'est plus en game over
			statsUpdatedRef.current = false;
		}

		return () => {
			stopGame();
		};
	}, [
		gameState.gameOver,
		gameState.score,
		gameState.totalSorted,
		gameState.savedCO2,
		updateHighScore,
		updateGameStats,
		stopGame,
	]);

	return {
		// Game state
		score: gameState.score,
		lives: gameState.lives,
		gameOver: gameState.gameOver,
		currentItems: gameState.currentItems,
		gameSpeed: gameState.gameSpeed,
		tip: gameState.tip,
		showTip: gameState.showTip,
		gameStarted: gameState.gameStarted,
		savedCO2: gameState.savedCO2,
		totalSorted: gameState.totalSorted,
		isPaused: gameState.isPaused,
		countdown: gameState.countdown,
		isCountingDown: gameState.isCountingDown,
		level: gameState.level,
		levelProgress: gameState.levelProgress,
		isNewHighScore: gameState.isNewHighScore,
		pointsMultiplier: gameState.pointsMultiplier,
		speedModifier: gameState.speedModifier,

		// Actions
		startGame,
		stopGame,
		togglePause,
		handleSort,
		startCountdown,
		spawnRandomItem,
		hideTip,
		setPointsMultiplier: (value: number) =>
			dispatch({ type: "MODIFY_MULTIPLIER", payload: value }),
		setSpeedModifier: (value: number) =>
			dispatch({ type: "MODIFY_SPEED", payload: value }),
		addLife,
		resetState,
	};
}
