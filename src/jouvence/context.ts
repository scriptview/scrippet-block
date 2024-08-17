import { mkDummyNotification } from "./notification";
import { BlockContext, Context, JouvenceNotification } from "./types";

export function mkBlockContext(): BlockContext {
	return {
		state: 0,
		nestedDepth: 0,
		line: "",
		lineno: 0,
		blocks: [],
		lastChunk: "",
	};
}

export function mkContext(notif?: JouvenceNotification): Context {
	const contextNotif = notif || mkDummyNotification();
	const context: Context = {
		state: 0,
		lineno: 0,
		blockContext: mkBlockContext(),
		metaInformation: {},
		previousLineBlank: true,
		nextLineBlank: undefined,
		notif: contextNotif,
	};
	return context;
}
