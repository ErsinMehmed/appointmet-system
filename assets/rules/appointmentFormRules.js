export const rules = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    maxLength: 100,
  },
  personal_number: {
    required: true,
    type: "number",
    minLength: 10,
    maxLength: 10,
  },
  time: {
    required: true,
    type: "string",
  },
  description: {
    required: true,
    type: "string",
    minLength: 5,
    maxLength: 255,
  },
  room_id: {
    required: true,
    type: "number",
  },
};
