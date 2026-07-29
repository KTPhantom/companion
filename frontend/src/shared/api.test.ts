import { describe, expect, it } from "vitest";

import { errorMessage } from "./api";

/**
 * Regression guard. FastAPI returns 422 `detail` as an array of objects.
 * Rendering that array straight into JSX threw and unmounted the whole app,
 * leaving a blank page — this helper must always hand back a string.
 */
describe("errorMessage", () => {
  it("returns a plain string detail unchanged", () => {
    const err = { response: { data: { detail: "Email already registered" } } };
    expect(errorMessage(err)).toBe("Email already registered");
  });

  it("flattens a FastAPI validation array into readable text", () => {
    const err = {
      response: {
        data: {
          detail: [
            {
              type: "value_error",
              loc: ["body", "email"],
              msg: "value is not a valid email address: reserved name",
            },
          ],
        },
      },
    };
    const result = errorMessage(err);
    expect(typeof result).toBe("string");
    expect(result).toBe("Email: value is not a valid email address: reserved name");
  });

  it("joins multiple validation errors", () => {
    const err = {
      response: {
        data: {
          detail: [
            { loc: ["body", "email"], msg: "invalid" },
            { loc: ["body", "password"], msg: "too short" },
          ],
        },
      },
    };
    expect(errorMessage(err)).toBe("Email: invalid Password: too short");
  });

  it("strips the pydantic value-error prefix", () => {
    const err = {
      response: { data: { detail: [{ loc: ["body", "username"], msg: "Value error, too short" }] } },
    };
    expect(errorMessage(err)).toBe("Username: too short");
  });

  it("always returns a string, never an object", () => {
    const shapes = [
      {},
      { response: {} },
      { response: { data: {} } },
      { response: { data: { detail: null } } },
      { response: { data: { detail: [] } } },
      { response: { data: { detail: [{ nonsense: true }] } } },
      { response: { data: { detail: { unexpected: "object" } } } },
    ];
    shapes.forEach((shape) => {
      expect(typeof errorMessage(shape)).toBe("string");
      expect(errorMessage(shape).length).toBeGreaterThan(0);
    });
  });

  it("explains an unreachable backend", () => {
    expect(errorMessage({ message: "Network Error" })).toMatch(/backend running/i);
  });
});
