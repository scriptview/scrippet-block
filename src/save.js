import { useBlockProps } from "@wordpress/block-editor";

export default function Save(props) {
	const { content } = props.attributes;
	const blockProps = useBlockProps.save({
		className: `scrippet-block`,
	});

	return (
		<div {...blockProps}>
			<pre className="scrippet">{content}</pre>
		</div>
	);
}
