export const rules = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    maxLength: 100,
  },
  number: {
    required: true,
    type: "number",
    minLength: 1,
  },
};
