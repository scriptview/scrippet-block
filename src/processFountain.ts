import React, { createElement } from "react";

import {
	ContextLine,
	JouvenceNotification,
	MetaInformation,
	NotificationCharacterOption,
} from "jouvence/types";
import { parseFountain } from "./jouvence/parse";

// references:
// https://react.dev/reference/react/createElement
// https://react.dev/reference/react/createElement#creating-an-element-without-jsx

export function mkProcessing() {
	const lines: string[] = [];

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

	function addXX(text: string, extra1: unknown, extra2: unknown) {
		lines.push(`${text}||${JSON.stringify(extra1)}||${JSON.stringify(extra2)}`);
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
		sceneHeading: function (sceneHeading: string, lineno: number) {
			addSI("sceneHeading", sceneHeading, lineno);
		},
		action: function (
			action: string,
			blocks: ContextLine[],
			options: NotificationOptions,
		) {
			addSXX("action", action, blocks, options);
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
		character: function (
			character: string,
			option: NotificationCharacterOption,
		) {
			addSX("character", character, option);
		},
		parenthetical: function (parenthetical: string) {
			addS("parenthetical", parenthetical);
		},
		dialogue: function (dialogue: string) {
			addS("dialogue", dialogue);
		},
		transition: function (transition: string) {
			addS("transition", transition);
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
		getResult(text: string): React.ReactElement {
			return createElement("div", { className: "scrippet-fountain-html" }, [
				createElement("p", { className: "action" }, text),
			]);
		},
	};
}

export function processFountain(text: string): React.ReactElement {
	const processing = mkProcessing();
	parseFountain(text, processing.getNotification());
	const element = processing.getResult(text);
	const bolded = text.replace(/\b\w{6,}\b/g, "<strong>$&</strong>");
	return element;
}
