import { useBlockProps } from "@wordpress/block-editor";

import { processFountain } from "./processFountain";

export default function Save(props) {
	const { fountainSource, fountainHtml } = props.attributes;
	const blockProps = useBlockProps.save({
		className: `scrippet-block`,
	});

	return (
		<div {...blockProps}>
			<pre className="scrippet-fountain-source" style={{ display: "none" }}>
				{fountainSource}
			</pre>
			<div
				className="scrippet-fountain-html"
				dangerouslySetInnerHTML={{ __html: fountainHtml }}
			/>
		</div>
	);
}
