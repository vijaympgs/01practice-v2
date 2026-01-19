module.exports = {
  models: [
    {
      name: "GPT-5.1-Primary",
      title: "GPT-5.1 (Primary)",
      provider: "openai",
      model: "gpt-5.1",
      apiKey: "${env:OPENAI_API_KEY}",
      contextLength: 200000,
      preferredUse: "generation",
    },
    {
      name: "GPT-4.1-Analysis",
      title: "GPT-4.1 (Analysis)",
      provider: "openai",
      model: "gpt-4.1",
      apiKey: "${env:OPENAI_API_KEY}",
      preferredUse: "analysis",
    },
  ],

  rateLimit: {
    model: "gpt-5.1",
    maxRequestsPerMinute: 10,
  },

  allowedDirectories: ["./", "spa/olivine-app-core/"],

  allowLargeContext: true,
  autoSearch: true,
};
