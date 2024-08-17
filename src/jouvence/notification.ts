import {
	Context,
	ContextLine,
	JouvenceNotification,
	MetaInformation,
	NotificationCharacterOption,
	NotificationOptions,
} from "./types";

type FnCharacter = () => void;

// this function returns a wrapper around the user provided notification
// instance
export function doNotification(
	context: Context,
	notif: JouvenceNotification,
	debug: boolean,
): JouvenceNotification {
	// we accumulate the dialogue elements in case there is
	// a dual dialogue
	var isInDualDialogue = false;
	var currentDialogueElements: FnCharacter[] = [];

	function flushDialogueElements() {
		// we flush the pending notifications
		if (currentDialogueElements.length > 0) {
			notif.dialogueStart();
			currentDialogueElements.forEach(function (f) {
				f();
			});
			notif.dialogueEnd();
		}
		currentDialogueElements.length = 0;
	}

	function endDialogue() {
		flushDialogueElements();
		if (isInDualDialogue) {
			notif.dualDialogueEnd();
			isInDualDialogue = false;
		}
	}
	return {
		startOfDocument: function () {
			if (debug) {
				console.log("startOfDocument");
			}
			notif.startOfDocument();
			context.lastElementNature = "startOfDocument";
		},
		titlePage: function (metaInformation: MetaInformation) {
			if (debug) {
				console.log("titlePage:", metaInformation);
			}
			notif.titlePage(metaInformation);
			context.lastElementNature = "titlePage";
		},
		sceneHeading: function (sceneHeading: string, lineno: number) {
			if (debug) {
				console.log("sceneHeading:<" + sceneHeading + ">");
			}
			endDialogue();
			notif.sceneHeading(sceneHeading, lineno);
			context.lastElementNature = "sceneHeading";
		},
		action: function (
			action: string,
			blocks: ContextLine[],
			options: NotificationOptions,
		) {
			if (debug) {
				console.log("action:<" + action + "> options:", options);
			}
			endDialogue();
			notif.action(action, blocks, options);
			context.lastElementNature = "action";
		},
		pageBreak: function () {
			if (debug) {
				console.log("pageBreak");
			}
			endDialogue();
			notif.pageBreak();
			context.lastElementNature = "pageBreak";
		},
		character: function (
			character: string,
			option: NotificationCharacterOption,
		) {
			if (debug) {
				console.log("character:<" + character + "> option:", option);
			}
			// if we have pending dialogue elements
			if (currentDialogueElements.length > 0) {
				if (option.isDualDialogue && !isInDualDialogue) {
					// we notify that a dual dialogue started
					// unless we are already in a dual dialogue
					// (there can't be 3 characters in a dual dialogue)
					notif.dualDialogueStart();
					isInDualDialogue = true;
					flushDialogueElements();
				} else {
					// this dialogue may be closing a dual dialogue
					flushDialogueElements();
					if (isInDualDialogue) {
						notif.dualDialogueEnd();
						isInDualDialogue = false;
					}
				}
			}

			// TODO: still needed?
			// we remove the property from the options
			// as it is not needed anymore
			// delete option.isDualDialogue;

			currentDialogueElements.push(function () {
				notif.character(character, option);
			});
			context.lastElementNature = "character";
		},
		parenthetical: function (parenthetical: string) {
			if (debug) {
				console.log("parenthetical:<" + parenthetical + ">");
			}
			currentDialogueElements.push(function () {
				notif.parenthetical(parenthetical);
			});
			context.lastElementNature = "parenthetical";
		},
		dialogue: function (dialogue: string) {
			if (debug) {
				console.log("dialogue:<" + dialogue + ">");
			}
			currentDialogueElements.push(function () {
				notif.dialogue(dialogue);
			});
			context.lastElementNature = "dialogue";
		},
		transition: function (transition: string) {
			if (debug) {
				console.log("transition:<" + transition + ">");
			}
			endDialogue();
			notif.transition(transition);
			context.lastElementNature = "transition";
		},
		section: function (section: string, level: number, lineno: number) {
			if (debug) {
				console.log("section:" + level + "<" + section + ">");
			}
			endDialogue();
			notif.section(section, level, lineno);
			context.lastElementNature = "section";
		},
		synopsis: function (synopsis: string) {
			if (debug) {
				console.log("synopsis:<" + synopsis + ">");
			}
			notif.synopsis(synopsis);
			context.lastElementNature = "synopsis";
		},
		block: function (blocks: ContextLine[]) {
			if (debug) {
				console.log("block:<" + blocks + ">");
			}
			notif.block(blocks);
		},
		dialogueStart: function () {
			if (debug) {
				console.log("dialogueStart");
			}
			notif.dialogueStart();
			context.lastElementNature = "dialogueStart";
		},
		dialogueEnd: function () {
			if (debug) {
				console.log("dialogueEnd");
			}
			notif.dialogueEnd();
			context.lastElementNature = "dialogueEnd";
		},
		dualDialogueStart: function () {
			if (debug) {
				console.log("dualDialogueStart");
			}
			notif.dualDialogueStart();
			context.lastElementNature = "dualDialogueStart";
		},
		dualDialogueEnd: function () {
			if (debug) {
				console.log("dualDialogueEnd");
			}
			notif.dualDialogueEnd();
			context.lastElementNature = "dualDialogueEnd";
		},
		endOfDocument: function () {
			if (debug) {
				console.log("endOfDocument");
			}
			endDialogue();
			notif.endOfDocument();
			context.lastElementNature = "endOfDocument";
		},
	};
}

export function mkDummyNotification(): JouvenceNotification {
	// this is a default implementation of a jouvence notification
	// you can copy and paste this code to use as a starting point for
	// an application specific implementation

	var jouvenceNotification = {
		startOfDocument: function () {
			console.log("startOfDocument");
		},
		titlePage: function (metaInformation: MetaInformation) {
			console.log("titlePage:", metaInformation);
		},
		sceneHeading: function (sceneHeading: string, lineno: number) {
			console.log("sceneHeading:<" + sceneHeading + ">", lineno);
		},
		action: function (
			action: string,
			blocks: ContextLine[],
			options: NotificationOptions,
		) {
			console.log("action:<" + action + "> options:", options);
		},
		pageBreak: function () {
			console.log("pageBreak");
		},
		dualDialogueStart: function () {
			console.log("dualDialogueStart");
		},
		dualDialogueEnd: function () {
			console.log("dualDialogueEnd");
		},
		dialogueStart: function () {
			console.log("dialogueStart");
		},
		dialogueEnd: function () {
			console.log("dialogueEnd");
		},
		character: function (
			character: string,
			option: NotificationCharacterOption,
		) {
			if (option.extension) {
				console.log("character:<" + character + "> option:", option);
			} else {
				console.log("character:<" + character + ">");
			}
		},
		parenthetical: function (parenthetical: string) {
			console.log("parenthetical:<" + parenthetical + ">");
		},
		dialogue: function (dialogue: string) {
			console.log("dialogue:<" + dialogue + ">");
		},
		transition: function (transition: string) {
			console.log("transition:<" + transition + ">");
		},
		section: function (section: string, level: number, extra: number) {
			console.log("section:" + level + "<" + section + ">", extra);
		},
		synopsis: function (synopsis: string) {
			console.log("synopsis:<" + synopsis + ">");
		},
		block: function (blocks: ContextLine[]) {
			console.log("block:<" + blocks + ">");
		},
		endOfDocument: function () {
			console.log("endOfDocument");
		},
	};

	return jouvenceNotification;
}
