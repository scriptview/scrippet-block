import { mkBlockContext, mkContext } from "../src/jouvence/context";
import { parseBlock, extractBlocks } from "../src/jouvence/parse.block";

describe("parse.block", function () {
	describe("process regular lines", function () {
		it("should parse a regular line", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo");
			expect(context.blocks).toHaveLength(0);
			done();
		});
		it("should parse a line with special characters (1)", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo / how are you?", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo / how are you?");
			expect(context.blocks).toHaveLength(0);
			done();
		});
		it("should parse a line with special characters (2)", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo */ how are you?", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo */ how are you?");
			expect(context.blocks).toHaveLength(0);
			done();
		});
		it("should parse a line with special characters (3)", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo \\/* how are you?", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo \\/* how are you?");
			expect(context.blocks).toHaveLength(0);
			done();
		});
		it("should parse a line with special characters (4)", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo [how] are you?", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo [how] are you?");
			expect(context.blocks).toHaveLength(0);
			done();
		});
		it("should parse a line with special characters (5)", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo ]] are you?", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo ]] are you?");
			expect(context.blocks).toHaveLength(0);
			done();
		});
		it("should parse a line with special characters (6)", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo \\[[ are you?", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo \\[[ are you?");
			expect(context.blocks).toHaveLength(0);
			done();
		});
	});
	describe("process single lines with comments", function () {
		it("should parse a line with a comment at the end", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo /* this is a comment */", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "allo ",
				start: {
					lineno: 1,
					column: 5,
				},
				content: ["this is a comment"],
				end: {
					lineno: 1,
					column: 27,
				},
			});
			done();
		});
		it("should parse a line with a comment at the beginning", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "/* this is a comment */ allo ", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "",
				start: {
					lineno: 1,
					column: 0,
				},
				content: ["this is a comment"],
				end: {
					lineno: 1,
					column: 22,
				},
			});

			done();
		});
		it("should parse a line with a comment in the middle", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(
				context,
				"I am /* this is a comment */ very happy  ",
				1,
			);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("I am  very happy");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "I am ",
				start: {
					lineno: 1,
					column: 5,
				},
				content: ["this is a comment"],
				end: {
					lineno: 1,
					column: 27,
				},
			});

			done();
		});
		it("should parse a line containing only a comment", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "/* this is a comment */", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "",
				start: {
					lineno: 1,
					column: 0,
				},
				content: ["this is a comment"],
				end: {
					lineno: 1,
					column: 22,
				},
			});

			// console.log(util.inspect(context, {
			//     showHidden: false,
			//     depth: null
			// }));
			done();
		});
		it("should parse a line containing only a comment with a nested comment", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "/* this is /* a */ comment */", 1);
			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "",
				start: {
					lineno: 1,
					column: 0,
				},
				content: ["this is /* a */ comment"],
				end: {
					lineno: 1,
					column: 28,
				},
			});

			done();
		});
	});

	describe("process single lines with non ending comments", function () {
		it("should parse a line with a non ending comment at the end", function (done) {
			const context = mkBlockContext();

			var state = parseBlock(context, "well /* this is a", 1);
			expect(state).toBe(100);
			expect(context.state).toBe(100);
			expect(context.line).toHaveLength(0);
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "well ",
				start: {
					lineno: 1,
					column: 5,
				},
				content: ["this is a"],
			});

			done();
		});
	});

	describe("multi-line comments", function () {
		it("should parse multi-lines comment (1)", function (done) {
			const context = mkBlockContext();

			var state;

			state = parseBlock(context, "allo /* this is a ", 1);
			state = parseBlock(context, "comment */ ", 2);

			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "allo ",
				start: {
					lineno: 1,
					column: 5,
				},
				content: ["this is a", "comment"],
				end: {
					lineno: 2,
					column: 9,
				},
			});

			done();
		});
		it("should parse multi-lines comment (2)", function (done) {
			const context = mkBlockContext();

			var state;

			state = parseBlock(context, "allo [[ this is a ", 1);
			state = parseBlock(context, "note ]] end", 2);

			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo  end");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "note",
				before: "allo ",
				start: {
					lineno: 1,
					column: 5,
				},
				content: ["this is a", "note"],
				end: {
					lineno: 2,
					column: 6,
				},
			});

			done();
		});
		it("should parse multi-lines comment (3)", function (done) {
			const context = mkBlockContext();

			var state;

			state = parseBlock(context, "allo [[ this is a ", 1);
			state = parseBlock(context, " very long ", 2);
			state = parseBlock(context, "note ]] end", 3);

			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("allo  end");
			expect(context.blocks).toHaveLength(1);
			expect(context.blocks[0]).toEqual({
				nature: "note",
				before: "allo ",
				start: {
					lineno: 1,
					column: 5,
				},
				content: ["this is a", "very long", "note"],
				end: {
					lineno: 3,
					column: 6,
				},
			});

			done();
		});
	});

	describe("multi blocks in one line", function () {
		it("should parse 2 blocks in one line", function (done) {
			const context = mkBlockContext();

			var state;

			state = parseBlock(context, "hello, /* one */ how /* two */ are you?", 1);

			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("hello,  how  are you?");
			expect(context.blocks).toHaveLength(2);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "hello, ",
				start: {
					lineno: 1,
					column: 7,
				},
				content: ["one"],
				end: {
					lineno: 1,
					column: 15,
				},
			});
			expect(context.blocks[1]).toEqual({
				nature: "comment",
				before: " how ",
				start: {
					lineno: 1,
					column: 21,
				},
				content: ["two"],
				end: {
					lineno: 1,
					column: 29,
				},
			});

			done();
		});
		it("should parse 2 blocks across multiple lines", function (done) {
			const context = mkBlockContext();

			var state;

			state = parseBlock(context, "hello, /* one */ how [[ this is", 1);
			state = parseBlock(context, "a note]] are you?", 2);

			expect(state).toBe(0);
			expect(context.state).toBe(0);
			expect(context.line).toBe("hello,  how  are you?");
			expect(context.blocks).toHaveLength(2);
			expect(context.blocks[0]).toEqual({
				nature: "comment",
				before: "hello, ",
				start: {
					lineno: 1,
					column: 7,
				},
				content: ["one"],
				end: {
					lineno: 1,
					column: 15,
				},
			});
			expect(context.blocks[1]).toEqual({
				nature: "note",
				before: " how ",
				start: {
					lineno: 1,
					column: 21,
				},
				content: ["this is", "a note"],
				end: {
					lineno: 2,
					column: 7,
				},
			});

			done();
		});
	});

	describe("extractBlocks", function () {
		it("should extract blocks (1)", function () {
			const context = mkBlockContext();

			var state = parseBlock(context, "allo", 1);
			var blocks = extractBlocks(context.blocks);
			expect(blocks).toHaveLength(0);
		});

		it("should extract blocks (2)", function () {
			const context = mkBlockContext();

			var state = parseBlock(context, "how are you /* really */doing?", 1);
			var blocks = extractBlocks(context.blocks);
			expect(blocks).toEqual([
				{
					nature: "comment",
					position: 12,
					content: ["really"],
				},
			]);
		});

		it("should extract blocks (2)", function () {
			const context = mkBlockContext();
			var state;

			state = parseBlock(context, "hello, /* one */ how [[ this is", 1);
			state = parseBlock(context, "a note]] are you?", 2);
			var blocks = extractBlocks(context.blocks);

			expect(blocks).toEqual([
				{
					nature: "comment",
					position: 7,
					content: ["one"],
				},
				{
					nature: "note",
					position: 12,
					content: ["this is", "a note"],
				},
			]);
		});

		it("should extract blocks (3)", function () {
			const context = mkBlockContext();
			var state;

			state = parseBlock(context, "hello, /* one */ how [[ this is", 1);
			state = parseBlock(context, "a very long", 2);
			state = parseBlock(context, "note]] are you?", 3);
			var blocks = extractBlocks(context.blocks);

			expect(blocks).toEqual([
				{
					nature: "comment",
					position: 7,
					content: ["one"],
				},
				{
					nature: "note",
					position: 12,
					content: ["this is", "a very long", "note"],
				},
			]);
		});

		it("should extract blocks (4)", function () {
			const context = mkBlockContext();
			var state;

			state = parseBlock(context, "hello, /* one */ how [[ this is", 1);
			state = parseBlock(context, "a very long", 2);
			state = parseBlock(context, "note]] are /* I don't really care*/you?", 3);
			var blocks = extractBlocks(context.blocks);

			expect(blocks).toEqual([
				{
					nature: "comment",
					position: 7,
					content: ["one"],
				},
				{
					nature: "note",
					position: 12,
					content: ["this is", "a very long", "note"],
				},
				{
					nature: "comment",
					position: 17,
					content: ["I don't really care"],
				},
			]);
		});
	});
});
