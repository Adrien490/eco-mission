/**
 * Remplace la couleur d'une icône SVG
 * @param iconSvg Le code SVG de l'icône
 * @param fillColor La couleur de remplissage (blanc par défaut)
 * @returns Le SVG avec la couleur mise à jour
 */
export const replaceIconColor = (
	iconSvg: string,
	fillColor: string = "white"
) => {
	if (!iconSvg) return "";

	// Remplacer fill="currentColor" par la couleur spécifiée et nettoyer le SVG
	const processedSvg = iconSvg
		.replace(/fill="currentColor"/g, `fill="${fillColor}"`)
		.trim()
		.replace(/\s+/g, " ");

	// Vérifier que le SVG est valide
	if (!processedSvg.startsWith("<svg") || !processedSvg.endsWith("</svg>")) {
		console.warn("Format SVG invalide après traitement");
		return "";
	}

	return processedSvg;
};
