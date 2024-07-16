/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import { useEffect, useState } from "@wordpress/element";

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
	const { fountainSource = "" } = attributes;

	const blockProps = useBlockProps();

	useEffect(function () {
		const initialText = processFountain(fountainSource);
		setAttributes({ fountainHtml: initialText });
	}, []);

	function onChangeContent(newContent: string) {
		setAttributes({
			fountainSource: newContent,
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<>
					<pre className="mermaid-editor wp-block-code">
						<PlainText onChange={onChangeContent} value={fountainSource} />
					</pre>
					<hr />
					<p className="mermaid-preview">Preview: </p>
				</>
			)}
			{processFountain(fountainSource)}
		</div>
	);
}
