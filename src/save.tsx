import { useBlockProps } from "@wordpress/block-editor";

import { FountainBlock } from "./fountain-block";

export default function Save(props) {
	const { fountainSource } = props.attributes;
	const blockProps = useBlockProps.save({
		className: `scrippet-block`,
	});

	console.log(`@@ save> fountainSource: ${fountainSource}`);
	return (
		<div {...blockProps}>
			<pre className="scrippet-fountain-source">{fountainSource}</pre>
			{/* <FountainBlock text={fountainSource} /> */}
		</div>
	);
}
