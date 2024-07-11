import { useBlockProps } from "@wordpress/block-editor";

export default function Save(props) {
	const { generatedHtml } = props.attributes;
	const blockProps = useBlockProps.save({
		className: `scrippet-block`,
	});

	return (
		<div {...blockProps}>
			<pre className="scrippet">{generatedHtml}</pre>
		</div>
	);
}
