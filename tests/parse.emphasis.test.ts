import { text } from "stream/consumers";
import { parseEmphasis } from "../src/jouvence/parse.emphasis";

describe("parse emphasis", function () {
	describe("simple string parsing", function () {
		it("should parse a regular line (1)", function () {
			var part = parseEmphasis("allo");
			var parts = part.parts;
			expect(Array.isArray(parts)).toBe(true);
			expect(parts.length).toBe(1);
			expect(parts[0].text).toBe("allo");
			expect(parts[0].type).toBe(".");
		});

		it("should parse a regular line (2)", function () {
			var part = parseEmphasis("how are you doing ?");
			var parts = part.parts;
			expect(Array.isArray(parts)).toBe(true);
			expect(parts.length).toBe(1);
			expect(parts[0].text).toBe("how are you doing ?");
			expect(parts[0].type).toBe(".");
		});

		it('should parse a line with "*"', function () {
			var part = parseEmphasis("how are *you* doing ?");

			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how are ",
						parts: [],
					},
					{
						type: "*",
						text: "",
						parts: [
							{
								type: ".",
								text: "you",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " doing ?",
						parts: [],
					},
				],
			});
		});
		it('should parse a line with "**"', function () {
			var part = parseEmphasis("how are **you** doing ?");

			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how are ",
						parts: [],
					},
					{
						type: "**",
						text: "",
						parts: [
							{
								type: ".",
								text: "you",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " doing ?",
						parts: [],
					},
				],
			});
		});
		it('should parse a line with "***"', function () {
			var part = parseEmphasis("how are ***you*** doing ?");

			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how are ",
						parts: [],
					},
					{
						type: "***",
						text: "",
						parts: [
							{
								type: ".",
								text: "you",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " doing ?",
						parts: [],
					},
				],
			});
		});
		it('should parse a line with "_"', function () {
			var part = parseEmphasis("how are _you_ doing ?");

			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how are ",
						parts: [],
					},
					{
						type: "_",
						text: "",
						parts: [
							{
								type: ".",
								text: "you",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " doing ?",
						parts: [],
					},
				],
			});
		});
	});

	describe("embedded parsing", function () {
		it("should parse emphasis inside emphasis", function () {
			var part = parseEmphasis("how *are _you_ doing* ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how ",
						parts: [],
					},
					{
						type: "*",
						text: "",
						parts: [
							{
								type: ".",
								text: "are ",
								parts: [],
							},
							{
								type: "_",
								text: "",
								parts: [
									{
										type: ".",
										text: "you",
										parts: [],
									},
								],
							},
							{
								type: ".",
								text: " doing",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " ?",
						parts: [],
					},
				],
			});
		});
		it("should parse 2 non embedded emphasis", function () {
			var part = parseEmphasis("how *are* _you_ doing ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how ",
						parts: [],
					},
					{
						type: "*",
						text: "",
						parts: [
							{
								type: ".",
								text: "are",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " ",
						parts: [],
					},
					{
						type: "_",
						text: "",
						parts: [
							{
								type: ".",
								text: "you",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " doing ?",
						parts: [],
					},
				],
			});
		});
	});
	describe("incomplete emphasis", function () {
		it("should parse non closed emphasis (1)", function () {
			var part = parseEmphasis("how *are you doing ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how *are you doing ?",
						parts: [],
					},
				],
			});
		});
		it("should parse non closed emphasis (2)", function () {
			var part = parseEmphasis("how **are you doing ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how **are you doing ?",
						parts: [],
					},
				],
			});
		});
		it("should parse non closed emphasis (3)", function () {
			var part = parseEmphasis("how **are you_ doing ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how **are you_ doing ?",
						parts: [],
					},
				],
			});
		});
	});
	describe("escaped character", function () {
		it("should process escaped character (1)", function () {
			var part = parseEmphasis("how \\*are you doing ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how *are you doing ?",
						parts: [],
					},
				],
			});
		});

		it("should process escaped character (2)", function () {
			var part = parseEmphasis("how \\*are* you doing ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how *are* you doing ?",
						parts: [],
					},
				],
			});
		});

		it("should process escaped character (3)", function () {
			var part = parseEmphasis("how *are \\*you* doing ?");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "how ",
						parts: [],
					},
					{
						type: "*",
						text: "",
						parts: [
							{
								type: ".",
								text: "are *you",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " doing ?",
						parts: [],
					},
				],
			});
		});

		it("should process fountain.io escape example", function () {
			var part = parseEmphasis(
				"Steel enters the code on the keypad: **\\*9765\\***",
			);
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "Steel enters the code on the keypad: ",
						parts: [],
					},
					{
						type: "**",
						text: "",
						parts: [
							{
								type: ".",
								text: "*9765*",
								parts: [],
							},
						],
					},
				],
			});
		});
	});

	describe("edge cases", function () {
		it("'should parse edge cases (1)", function () {
			var part = parseEmphasis("word1 ***word2* word3");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "word1 **",
						parts: [],
					},
					{
						type: "*",
						text: "",
						parts: [
							{
								type: ".",
								text: "word2",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " word3",
						parts: [],
					},
				],
			});
		});

		it("'should parse edge cases (2)", function () {
			var part = parseEmphasis("word1 ***word2** word3");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "word1 *",
						parts: [],
					},
					{
						type: "**",
						text: "",
						parts: [
							{
								type: ".",
								text: "word2",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: " word3",
						parts: [],
					},
				],
			});
		});

		it("'should parse edge cases (3)", function () {
			var part = parseEmphasis("word1 *word2** word3");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "word1 ",
						parts: [],
					},
					{
						type: "*",
						text: "",
						parts: [
							{
								type: ".",
								text: "word2",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: "* word3",
						parts: [],
					},
				],
			});
		});

		it("'should parse edge cases (4)", function () {
			const part = parseEmphasis(
				"He dialed *69 and then *23, and then hung up.",
			);
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "He dialed *69 and then *23, and then hung up.",
						parts: [],
					},
				],
			});
		});

		it("'should parse edge cases (5)", function () {
			const part = parseEmphasis(
				"He dialed *69 and then 23*, and then hung up.",
			);
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "He dialed ",
						parts: [],
					},
					{
						type: "*",
						text: "",
						parts: [
							{
								type: ".",
								text: "69 and then 23",
								parts: [],
							},
						],
					},
					{
						type: ".",
						text: ", and then hung up.",
						parts: [],
					},
				],
			});
		});

		it("'should parse edge cases (6)", function () {
			const part = parseEmphasis("He dialed *69 and then");
			expect(part).toEqual({
				type: ".",
				text: "",
				parts: [
					{
						type: ".",
						text: "He dialed *69 and then",
						parts: [],
					},
				],
			});
		});
	});
});
