export default {
  description: "Record the start of a weather digest session.",
  async handle(event) {
    return { ...event, observed: true };
  },
};
