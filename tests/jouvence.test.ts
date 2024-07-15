import { mkFixtureNotification } from "./fixtures";
import { parseFountain } from "../src/jouvence/parse";

const genResults = true;

describe("Jouvence", () => {
  it("should read an empty file", async () => {
    const fixture = mkFixtureNotification("t01");
    const input = await fixture.getInput();
    const expected = await fixture.getExpected();
    parseFountain(input, fixture.getNotification());
    expect(fixture.getResult()).toEqual(expected);
  });
  test.each([
    "t01",
    "t02",
    "t10",
    "t11",
    "t12",
    "t13",
    "t15",
    "t20",
    "t25",
    "t30",
    "t40",
    "t44",
    "t45",
    "t46",
    "t50",
    "t55",
    "t56",
    "t57",
    "t58",
    "t60",
  ])("parsing fountain: %s", async (name) => {
    const fixture = mkFixtureNotification(name);
    const input = await fixture.getInput();
    const expected = await fixture.getExpected();
    parseFountain(input, fixture.getNotification());
    if (genResults) {
      await fixture.writeResult();
    }
    expect(fixture.getResult()).toEqual(expected);
  });
});
