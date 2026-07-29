import { describe, expect, it } from "vitest";
import { doodleFormSchema, getDoodleFormValues, getYupFieldErrors } from "./doodle-form";
import * as yup from "yup";

describe("doodleFormSchema", () => {
  it("accepts a valid submission", async () => {
    await expect(
      doodleFormSchema.validate({
        name: "Ada",
        email: "ada@example.com",
        message: "Loved the doodle studio, saying hello!",
      }),
    ).resolves.toBeTruthy();
  });

  it.each([
    ["name too short", { name: "A", email: "ada@example.com", message: "Hello there, this is long enough." }],
    ["email missing @", { name: "Ada", email: "not-an-email", message: "Hello there, this is long enough." }],
    ["message too short", { name: "Ada", email: "ada@example.com", message: "hi" }],
    ["required fields missing", { name: "", email: "", message: "" }],
  ])("rejects %s", async (_label, values) => {
    await expect(doodleFormSchema.validate(values)).rejects.toBeInstanceOf(yup.ValidationError);
  });

  it("trims and enforces max length on name/email/message", async () => {
    await expect(
      doodleFormSchema.validate({
        name: "  Ada  ",
        email: "  ada@example.com ",
        message: "  Hello there, this is long enough.  ",
      }),
    ).resolves.toBeTruthy();

    await expect(
      doodleFormSchema.validate({
        name: "A".repeat(81),
        email: "ada@example.com",
        message: "Hello there, this is long enough.",
      }),
    ).rejects.toBeInstanceOf(yup.ValidationError);
  });
});

describe("getDoodleFormValues", () => {
  it("reads name/email/message from FormData, defaulting missing fields to empty strings", () => {
    const form = new FormData();
    form.set("name", "Ada");
    form.set("email", "ada@example.com");

    expect(getDoodleFormValues(form)).toEqual({
      name: "Ada",
      email: "ada@example.com",
      message: "",
    });
  });
});

describe("getYupFieldErrors", () => {
  it("maps a multi-field ValidationError to one message per field", async () => {
    try {
      await doodleFormSchema.validate(
        { name: "", email: "not-an-email", message: "" },
        { abortEarly: false },
      );
      throw new Error("expected validation to fail");
    } catch (error) {
      const errors = getYupFieldErrors(error as yup.ValidationError);
      expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
      expect(errors.email).toMatch(/valid email/i);
    }
  });
});
