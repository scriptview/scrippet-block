export function processFountain(text: string): string {
	// return Promise.resolve("This will be fountain soon: " + fountain);
	const bolded = text.replace(/\b\w{6,}\b/g, "<strong>$&</strong>");
	return `<p class="action">${bolded}</p>`;
}
