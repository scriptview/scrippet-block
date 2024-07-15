import * as fs from "fs-extra";
import * as path from "path";
import {
	ContextLine,
	JouvenceNotification,
	MetaInformation,
	NotificationCharacterOption,
} from "../src/jouvence/types";

async function readFixture(name: string): Promise<string> {
	const filePath = path.join(__dirname, "fixtures", name);
	const content = await fs.readFile(filePath, { encoding: "utf8" });
	return content;
}

export function mkFixtureNotification(name: string) {
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
		async getInput() {
			const input = await readFixture(`${name}.fountain`);
			return input;
		},
		async getExpected() {
			const expected = await readFixture(`${name}.notif`);
			return expected.split(/\r?\n/);
		},
		getNotification(): JouvenceNotification {
			return jouvenceNotification;
		},
		getResult() {
			return lines;
		},
		async writeResult() {
			const fname = path.join(__dirname, "fixtures", `${name}.result`);
			await fs.writeFile(fname, lines.join("\n"));
		},
	};
}
