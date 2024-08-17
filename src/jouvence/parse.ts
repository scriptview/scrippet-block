import {
	Context,
	ContextLine,
	ContextSlotLine,
	JouvenceNotification,
} from "./types";
import { doNotification } from "./notification";
import { parseBlock, extractBlocks } from "./parse.block";
import { mkBlockContext, mkContext } from "./context";

const debug = false;

// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
// TODO: complete that list
var whiteSpaces = " \f\n\r\t\v";

var reUnicodeLetterRanges = new RegExp("[A-Za-z]"); // TODO: add other UTF-8 characters

var SCENE_HEADING_PREFIXES = [
	"INT",
	"EXT",
	"EST",
	"INT./EXT",
	"INT/EXT",
	"I/E",
];

// the specification of the fountain format can be found at:
// http://fountain.io/syntax

// as the fountain syntax requires to know wether the
// next line is empty or not, we need to keep
// a buffer of 2 lines. This allows us to pass as a parameter
// to the actual processing whether the next (and also the previous) line was empty
function processLine(context: Context, line: string) {
	// we update the line number
	context.lineno++;

	if (debug) {
		console.log(`# lineno=${context.lineno} line=${line}`);
	}

	// we preprocess the line in case it contains
	// notes or comments
	const state = parseBlock(context.blockContext, line, context.lineno);
	if (debug) {
		console.log(`# parseBlock state=${state}`);
	}
	if (state === 0) {
		line = context.blockContext.line;
	} else {
		// the line contains a pending comment or note
		// we can't parse it for now!
		return;
	}

	// we need to associate the block context to the line
	// so that we can later process the actual content
	// of the line (emphasis + blocks)
	var lineInfo: ContextSlotLine = {
		line: line,
		lineno: context.lineno,
		blocks: extractBlocks(context.blockContext.blocks),
	};

	// if slot 0 is occupied, then we fill slot 1
	// if not we initialize slot 0
	if (context.line0) {
		context.line1 = lineInfo;
	} else {
		context.line0 = lineInfo;
		context.line1 = undefined;
	}

	// we need slot 1 to be filled to perform the actual processing
	if (context.line1) {
		context.nextLineBlank = isEmptyLine(context.line1.line);
		var lineParsed = false;

		while (!lineParsed) {
			lineParsed = parseLine(
				context,
				context.line0.line,
				context.line0.blocks,
				context.line0.lineno,
			);
		}
		// we memorize the state of the current line
		context.previousLineBlank = isEmptyLine(context.line0.line);
		context.line0 = context.line1;
		context.line1 = undefined;
	}

	// we reset the preprocess state
	context.blockContext = mkBlockContext();
}

function updateBlocksPositions(blocks: ContextLine[], offset: number) {
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].position = blocks[i].position + offset;
	}
}

// a line with 2 white spaces is a ine break, not an empty line
function isEmptyLine(line: string) {
	var count = 0;
	for (var i = 0; i < line.length; i++) {
		var c = line.charAt(i);
		if (whiteSpaces.indexOf(c) < 0) {
			return false;
		}
		count++;
	}
	return count < 2;
}

function inDialogueContext(context: Context): boolean {
	return (
		context.lastElementNature === "character" ||
		context.lastElementNature === "dialogue" ||
		context.lastElementNature === "parenthetical"
	);
}

function trimString(str: string, blocks: ContextLine[]) {
	var i = 0;
	var c;
	var start = 0;
	var end = 0;

	for (i = 0; i < str.length; i++) {
		c = str.charAt(i);
		if (whiteSpaces.indexOf(c) < 0) {
			start = i;
			break;
		}
	}

	for (i = str.length - 1; i >= 0; i--) {
		c = str.charAt(i);
		if (whiteSpaces.indexOf(c) < 0) {
			end = i;
			break;
		}
	}

	// we need to offset the blocks to take into account the trimming
	updateBlocksPositions(blocks, -start);

	// check if we have an empty line
	if (end === 0) {
		return "";
	} else {
		return str.substring(start, end + 1);
	}
}

// the parse method should return false
// to indicate that the line should be parsed
// again
function parseLine(
	context: Context,
	line: string,
	blocks: ContextLine[],
	lineno: number,
) {
	var trim = trimString(line, blocks);
	var currentLineBlank = isEmptyLine(line);
	var colonPosition;

	// handle situation where a block is on its own line
	if (currentLineBlank && blocks.length > 0) {
		context.notif.block(blocks);
	}

	if (context.state === 0) {
		// beginning of the file... we can have a title page
		if (currentLineBlank) {
			return true;
		}
		colonPosition = line.indexOf(":");
		if (colonPosition < 0) {
			// no ':' in the first non empty line
			// that means that we don't have any Title page
			// we update the state and reprocess the line
			context.state = 10;
			return false;
		} else {
			// we do have a property definition
			// meaning we have a Title page
			context.state = 2;
			context.metaInformation = {};

			extractKeyValue(context, line, colonPosition);
		}
	} else if (context.state == 2) {
		// we are inside a title page
		if (line.charAt(0) === "\t" || line.substring(0, 3) === "   ") {
			// a value is there
			if (!context.currentKey) {
				throw new Error(`internal error`);
			}
			context.metaInformation[context.currentKey].push(line.trim());
		} else {
			colonPosition = line.indexOf(":");
			if (colonPosition > 0) {
				extractKeyValue(context, line, colonPosition);
			} else {
				// no value, no key ... we are in the content of the script
				// we public the content of the meta information,
				// update the state and reprocess the line
				context.notif.titlePage(context.metaInformation);
				context.state = 10;
				return false;
			}
		}
	} else if (context.state == 10) {
		if (!currentLineBlank) {
			// we catch the "centered action text"
			// https://fountain.io/syntax/#centered-text
			var result = extractTextBetweenDelims(trim, 0, "><");
			if (
				result &&
				result.before.trim().length === 0 &&
				result.after.trim().length === 0
			) {
				// we update the positions of the blocks : we adjust based
				// on the size of the preceding string and 1 for the '>'
				updateBlocksPositions(blocks, result.before.length + 1);

				context.notif.action(trimString(result.between, blocks), blocks, {
					alignment: "centered",
				});
			} else if (
				trim.charAt(0) === "=" &&
				trim.length >= 3 &&
				trim.charAt(1) === "=" &&
				trim.charAt(2) === "="
			) {
				context.notif.pageBreak();
			} else if (
				trim.charAt(0) === "#" &&
				processSection(context, trim, lineno)
			) {
				// we had a section
			} else if (trim.charAt(0) === "=" && processSynopsis(context, trim)) {
				// we had a synopsis
			} else if (
				((context.previousLineBlank && context.nextLineBlank) ||
					line.charAt(0) === ">") &&
				processTransition(context, line)
			) {
				// we had a transition
			} else if (
				context.previousLineBlank &&
				processSceneHeading(context, trim, lineno)
			) {
				// we had a scene heading
			} else if (
				context.previousLineBlank &&
				!context.nextLineBlank &&
				processCharacter(context, trim)
			) {
				// we had a character
			} else if (!context.previousLineBlank && inDialogueContext(context)) {
				processDialogElement(context, trim);
			} else {
				// the fallback mode is: action
				context.notif.action(trim, blocks, {});
			}
		}
	} else {
		throw new Error("Invalid state:" + context.state);
	}

	// we consider the line as being parsed
	return true;
}

function extractKeyValue(
	context: Context,
	line: string,
	colonPosition: number,
) {
	var key = line.substring(0, colonPosition).trim();
	// edge case: what if the key is of length 0?
	context.currentKey = key;
	context.metaInformation[context.currentKey] = [];

	if (colonPosition < line.length) {
		var value = line.substring(colonPosition + 1).trim();
		if (value.length > 0) {
			context.metaInformation[context.currentKey].push(value);
		}
	}
}

// this method extracts the text between 2 delimiters
// and returns the textBefore, the textBetween, and the textAfter
function extractTextBetweenDelims(
	line: string,
	startPosition: number,
	delims: string,
) {
	var state = 0;
	var result = {
		before: "",
		between: "",
		after: "",
	};
	for (var i = startPosition; i < line.length; i++) {
		var c = line.charAt(i);
		if (state === 0 && c === delims[0]) {
			result.before = line.substring(startPosition, i);
			state = 1;
		} else if (state === 1 && c === delims[1]) {
			result.after = line.substring(i + 1);
			state = 3;
			break;
		} else if (state === 1) {
			result.between = result.between + c;
		}
	}

	if (state === 3) {
		return result;
	} else {
		return false;
	}
}

function processSceneHeading(context: Context, line: string, lineno: number) {
	var sceneHeading: boolean | string = false;
	if (line.charAt(0) === "." && line.length > 1 && line.charAt(1) !== ".") {
		// power user mode
		sceneHeading = line.substring(1).trim();
	} else {
		var firstWord = getWord(line, 0, " .");

		//console.log("FirstWord:", firstWord);
		if (SCENE_HEADING_PREFIXES.indexOf(firstWord.toUpperCase()) >= 0) {
			sceneHeading = line.trim();
		}
	}

	if (sceneHeading) {
		// TODO: extract scene number
		context.notif.sceneHeading(sceneHeading, lineno);
		return true;
	} else {
		return false;
	}
}

function processCharacter(context: Context, line: string) {
	var isDualDialogue = false;
	// we check if the last character of the line
	// is a caret - '^'
	// this would indicate a dual dialogue
	// assumption: line has been trimmed
	if (line.charAt(line.length - 1) === "^") {
		isDualDialogue = true;
		line = line.substring(0, line.length - 1).trim();
	}

	var character: boolean | string = false;
	if (line.charAt(0) === "@") {
		// power user mode
		character = line.substring(1).trim();
	} else {
		var name = getWord(line, 0, "(").trim();

		if (name.length > 0) {
			if (name.toUpperCase() === name) {
				// name needs to be all upper-case
				// and must contain at least one letter
				for (var i = 0; i < name.length; i++) {
					if (isCharacter(name.charAt(i))) {
						character = line;
						break;
					}
				}
			}
		}
	}

	if (character) {
		var extension;
		var result = extractTextBetweenDelims(character, 0, "()");
		if (result) {
			character = result.before.trim();
			extension = result.between.trim();
		}
		if (extension) {
			context.notif.character(character, {
				extension: extension,
				isDualDialogue: isDualDialogue,
			});
		} else {
			context.notif.character(character, {
				isDualDialogue: isDualDialogue,
			});
		}
		return true;
	} else {
		return false;
	}
}

function processDialogElement(context: Context, line: string) {
	if (line.charAt(0) === "(") {
		var cp = line.indexOf(")");
		if (cp > 0) {
			context.notif.parenthetical(line.substring(1, cp));
			// we allow to have dialogue after the closing parenthesis
			var remaining = line.substring(cp + 1).trim();
			if (remaining.length > 0) {
				context.notif.dialogue(remaining);
			}
		} else {
			context.notif.parenthetical(line.substring(1));
		}
	} else {
		context.notif.dialogue(line);
	}
}

function processTransition(context: Context, line: string) {
	var transition: boolean | string = false;

	if (line.charAt(0) == ">") {
		// power user
		transition = line.substring(1).trim();
	} else if (line.substring(line.length - 3) === "TO:") {
		if (line.toUpperCase() === line) {
			// we are all upper case
			transition = line.trim();
		}
	}
	if (transition) {
		context.notif.transition(transition);
		return true;
	} else {
		return false;
	}
}

function processSection(context: Context, line: string, lineno: number) {
	var level = 0;
	var i = 0;

	for (i = 0; i < line.length; i++) {
		var c = line.charAt(i);
		if (c == "#") {
			level++;
		} else if (c != " " && c != "\t") {
			break;
		}
	}
	var section = line.substring(i).trim();
	context.notif.section(section, level, lineno);
	return true;
}

function processSynopsis(context: Context, line: string) {
	var synopsis = line.substring(1).trim();
	context.notif.synopsis(synopsis);
	return true;
}

function getWord(line: string, from: number, delim: string) {
	for (var i = from; i < line.length; i++) {
		var c = line.charAt(i);
		if (delim.indexOf(c) >= 0) {
			return line.substring(from, i);
		}
	}
	return line.substring(from);
}

function isCharacter(c: string) {
	return reUnicodeLetterRanges.test(c);
}

/*
 * parsing of a fountain string
 * notif is the interface receiving the notification during parsing
 */
export function parseFountain(input: string, notif: JouvenceNotification) {
	var eolMatcher = /\r?\n/;

	// initialize the parsing context
	var context = mkContext();

	// we replace the notification with a wrapper
	context.notif = doNotification(context, notif, false);

	// we split the input line in eol seperated lines
	const lines = input.split(eolMatcher);

	// first notification
	context.notif.startOfDocument();

	for (const line of lines) {
		processLine(context, line);
	}
	// we flush the last line by passing an empty line
	processLine(context, "");

	if (context.state === 2) {
		// only the title page was provided
		context.notif.titlePage(context.metaInformation);
	}
	context.notif.endOfDocument();
}
