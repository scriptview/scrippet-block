import { useEffect, useState } from "@wordpress/element";
import { processFountain } from "./processFountain";

interface FountainBlockProps {
	/** The block of text to render */
	text: string;
}

export function FountainBlock({ text }: FountainBlockProps) {
	const [fountainHtml, setFountainHtml] = useState<string>("");
	useEffect(() => {
		if (text) {
			const result = processFountain(text);
			setFountainHtml(result);
		}
	}, [text]);

	return <p>{fountainHtml}</p>;
}
