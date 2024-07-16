import React, { createElement } from "react";

import {
	ContextLine,
	JouvenceNotification,
	MetaInformation,
	NotificationCharacterOption,
} from "jouvence/types";
import { parseFountain } from "./jouvence/parse";
import { EmphasisPart, parseEmphasis } from "./jouvence/parse.emphasis";

// references:
// https://react.dev/reference/react/createElement
// https://react.dev/reference/react/createElement#creating-an-element-without-jsx

//
// *italics*
// **bold**
// ***bold italics***
// _underline_
//
function parsePartsChildren(
	text: string,
	parts: EmphasisPart[],
): React.ReactNode[] {
	const children: React.ReactNode[] = [];
	if (text.length > 0) {
		children.push(text);
	}
	parts.forEach((part) => {
		children.push(...parseEmphasisPart(part));
	});
	return children;
}

function parseEmphasisPart(part: EmphasisPart): React.ReactNode[] {
	const children: React.ReactNode[] = parsePartsChildren(part.text, part.parts);
	switch (part.type) {
		case ".":
			return parsePartsChildren(part.text, part.parts);
		case "_":
			return [
				createElement("u", {}, parsePartsChildren(part.text, part.parts)),
			];
		case "*":
			return [
				createElement("em", {}, parsePartsChildren(part.text, part.parts)),
			];
		case "**":
			return [
				createElement("strong", {}, parsePartsChildren(part.text, part.parts)),
			];
		case "***":
			return [
				createElement(
					"strong",
					{},
					createElement("em", {}, parsePartsChildren(part.text, part.parts)),
				),
			];
		default:
			return parsePartsChildren(part.text, part.parts);
	}
}

function formatText(text: string): React.ReactNode[] {
	const part = parseEmphasis(text);
	return parseEmphasisPart(part);
}

export function mkProcessing() {
	const lines: string[] = [];
	const children: React.ReactElement[] = [];

	function add(line: string) {
		lines.push(line);
	}

	function addS(text: string, p1: string) {
		lines.push(`${text}||${p1}`);
	}

	function addX(text: string, extra: unknown) {
		lines.push(`${text}||${JSON.stringify(extra)}`);
	}

	function addSX(text: string, p1: string, extra: unknown) {
		lines.push(`${text}||${p1}||${JSON.stringify(extra)}`);
	}

	function addSXX(text: string, p1: string, extra1: unknown, extra2: unknown) {
		lines.push(
			`${text}||${p1}||${JSON.stringify(extra1)}||${JSON.stringify(extra2)}`,
		);
	}

	function addSI(text: string, p1: string, p2: number) {
		lines.push(`${text}||${p1}||${p2}`);
	}

	function addSIX(text: string, p1: string, p2: number, extra: unknown) {
		lines.push(`${text}||${p1}||${p2}||${JSON.stringify(extra)}`);
	}

	const jouvenceNotification: JouvenceNotification = {
		startOfDocument: function () {
			add("startOfDocument");
		},
		titlePage: function (metaInformation: MetaInformation) {
			addX("titlePage", metaInformation);
		},
		sceneHeading: function (text: string, lineno: number) {
			addSI("sceneHeading", text, lineno);
			children.push(createElement("p", { className: "sceneheader" }, text));
		},
		action: function (
			text: string,
			blocks: ContextLine[],
			options: NotificationOptions,
		) {
			addSXX("action", text, blocks, options);
			children.push(
				createElement("p", { className: "action" }, formatText(text)),
			);
		},
		pageBreak: function () {
			add("pageBreak");
		},
		dualDialogueStart: function () {
			add("dualDialogueStart");
		},
		dualDialogueEnd: function () {
			add("dualDialogueEnd");
		},
		dialogueStart: function () {
			add("dialogueStart");
		},
		dialogueEnd: function () {
			add("dialogueEnd");
		},
		character: function (text: string, option: NotificationCharacterOption) {
			addSX("character", text, option);
			children.push(createElement("p", { className: "character" }, text));
		},
		parenthetical: function (text: string) {
			addS("parenthetical", text);
			children.push(
				createElement("p", { className: "parenthetical" }, `(${text})`),
			);
		},
		dialogue: function (text: string) {
			addS("dialogue", text);
			children.push(
				createElement("p", { className: "dialogue" }, formatText(text)),
			);
		},
		transition: function (text: string) {
			addS("transition", text);
			children.push(createElement("p", { className: "transition" }, text));
		},
		section: function (section: string, level: number, extra: number) {
			addSIX("section", section, level, extra);
		},
		synopsis: function (synopsis: string) {
			addS("synopsis", synopsis);
		},
		block: function (blocks: ContextLine[]) {
			addX("block", blocks);
		},
		endOfDocument: function () {
			add("endOfDocument");
		},
	};

	return {
		getNotification(): JouvenceNotification {
			return jouvenceNotification;
		},
		getResult(): React.ReactElement {
			return createElement(
				"div",
				{ className: "scrippet-fountain-html" },
				children,
			);
		},
	};
}

export function processFountain(text: string): React.ReactElement {
	const processing = mkProcessing();
	parseFountain(text || "", processing.getNotification());
	const element = processing.getResult();
	return element;
}
