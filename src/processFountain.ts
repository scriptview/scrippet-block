export function processFountain(text: string): string {
	// return Promise.resolve("This will be fountain soon: " + fountain);
	return text.replace(/\b\w{6,}\b/g, "<strong>$&</strong>");
}
