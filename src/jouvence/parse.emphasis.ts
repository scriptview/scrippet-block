export type PartType = "." | "_" | "*" | "**" | "***";

export interface EmphasisPart {
	type: PartType;
	text: string;
	parts: EmphasisPart[];
}

export function parseEmphasis(line: string): EmphasisPart {
	var part: EmphasisPart = {
		type: ".",
		text: "",
		parts: [],
	};
	parsePart(line, 0, part);
	return part;
}

function parsePart(line: string, index0: number, part: EmphasisPart): number {
	const length = line.length;
	let buffer = "";
	const delim = part.type;
	const hasDelim = delim[0] !== ".";

	function append(c: string) {
		buffer = buffer + c;
	}

	function next(ix: number, delta: number) {
		if (ix + delta < length) {
			return line.charAt(ix + delta);
		} else {
			return "";
		}
	}

	function tryPart(ix: number, type: PartType) {
		var newPart: EmphasisPart = {
			type: type,
			text: "",
			parts: [],
		};
		var result = parsePart(line, ix + type.length, newPart);
		if (result >= 0) {
			if (buffer.length > 0) {
				part.parts.push({
					type: ".",
					text: buffer,
					parts: [],
				});
				buffer = "";
			}
			part.parts.push(newPart);
		}
		return result;
	}

	let i: number;
	for (i = index0; i < length; i++) {
		const c = line.charAt(i);
		const previousIsSpace = i > 0 ? line.charAt(i - 1) === " " : false;

		if (c === "\\") {
			append(next(i, 1));
			i++;
			continue;
		}

		// check if we have a matching closing delimiter
		// a closing delimiter is a delimiter that is not preceded by a space
		if (hasDelim && c === delim[0] && !previousIsSpace) {
			var match = true;
			// check all the chars of the delimiter
			for (var delta = 0; delta < delim.length; delta++) {
				if (next(i, delta) !== delim[delta]) {
					match = false;
					break;
				}
			}
			if (match) {
				// end of parse here as we have our match
				part.parts.push({
					type: ".",
					text: buffer,
					parts: [],
				});
				buffer = "";
				return i + delim.length - 1;
			}
		}

		if (c === "_") {
			const result = tryPart(i, "_");
			if (result < 0) {
				append(c);
			} else {
				i = result;
			}
		} else if (c === "*") {
			if (next(i, 1) === "*") {
				if (next(i, 2) === "*") {
					const result = tryPart(i, "***");
					if (result < 0) {
						append(c);
					} else {
						i = result;
					}
				} else {
					const result = tryPart(i, "**");
					if (result < 0) {
						append(c);
					} else {
						i = result;
					}
				}
			} else {
				const result = tryPart(i, "*");
				if (result < 0) {
					append(c);
				} else {
					i = result;
				}
			}
		} else {
			append(c);
		}
	}

	// we could not find the closing delimiter
	if (hasDelim) {
		return -1;
	}

	if (buffer.length > 0) {
		part.parts.push({
			type: ".",
			text: buffer,
			parts: [],
		});
		buffer = "";
	}

	return i;
}
