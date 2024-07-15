export type BlockNature = "comment" | "note";
export type ElementNature =
  | "startOfDocument"
  | "titlePage"
  | "character"
  | "dialogueStart"
  | "dialogueEnd"
  | "dualDialogueStart"
  | "dualDialogueEnd"
  | "dialogue"
  | "sceneHeading"
  | "action"
  | "pageBreak"
  | "transition"
  | "section"
  | "synopsis"
  | "endOfDocument"
  | "parenthetical";

export type MetaInformation = Record<string, string[]>;

export interface ContextLine {
  nature: BlockNature;
  position: number;
  content: string[];
}

export interface BlockContent {
  nature: BlockNature;
  before: string;
  start: {
    lineno: number;
    column: number;
  };
  end?: {
    lineno: number;
    column: number;
  };
  content: string[];
}

export interface ContextSlotLine {
  line: string;
  lineno: number;
  blocks: ContextLine[];
}

// context using when extractying blocks from input
export interface BlockContext {
  state: number;
  nestedDepth: number;
  lineno: number;
  line: string;
  blocks: BlockContent[];
  lastChunk: string;
}

export interface Context {
  state: number;
  lineno: number;
  blockContext: BlockContext;
  metaInformation: MetaInformation;
  lastElementNature?: ElementNature;
  currentKey?: string;
  previousLineBlank: boolean;
  nextLineBlank: unknown;
  notif: JouvenceNotification;
  line0?: ContextSlotLine; // slot #0: current line
  line1?: ContextSlotLine; // slot #1: next line
}

export type NotificationOptions = Record<string, string>;

export interface NotificationCharacterOption {
  extension?: string;
  isDualDialogue: boolean;
}

export interface JouvenceNotification {
  startOfDocument(): void;
  titlePage(metaInformation: MetaInformation): void;
  sceneHeading(sceneHeading: string, lineno: number): void;
  action(
    action: string,
    blocks: ContextLine[],
    options: NotificationOptions
  ): void;
  character(name: string, option: NotificationCharacterOption): void;
  block(blocks: ContextLine[]): void;
  pageBreak(): void;
  dualDialogueStart(): void;
  dualDialogueEnd(): void;
  dialogueStart(): void;
  dialogueEnd(): void;
  parenthetical(text: string): void;
  dialogue(text: string): void;
  transition(text: string): void;
  synopsis(text: string): void;
  section(section: string, level: number, lineno: number): void;
  endOfDocument(): void;
}
