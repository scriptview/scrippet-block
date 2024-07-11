/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import { useEffect } from "@wordpress/element";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { PlainText, useBlockProps } from "@wordpress/block-editor";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

import { processFountain } from "./processFountain";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, isSelected }) {
	const { fountainSource = "", generatedHtml = "" } = attributes;
	const blockProps = useBlockProps();

	console.log(
		`@@ fountainSource: ${fountainSource}, generatedHtml: ${generatedHtml}`,
	);

	useEffect(() => {
		if (fountainSource) {
			processFountain(fountainSource).then((html) => {
				setAttributes({ generatedHtml: html });
			});
		}
	}, [fountainSource, setAttributes]);

	return (
		<div {...blockProps}>
			{isSelected && (
				<>
					<pre className="mermaid-editor wp-block-code">
						<PlainText
							onChange={(newContent) => {
								setAttributes({ fountainSource: newContent });
							}}
							value={fountainSource}
						/>
					</pre>
					<hr />
				</>
			)}
			{__(`${generatedHtml}`, "scrippet-block")}
		</div>
	);
}
