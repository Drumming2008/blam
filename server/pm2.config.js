module.exports = {
  apps: [
    {
      name: "server",
      script: "server.ts",
      interpreter: "bun",
      env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
        SECRET: "cheese",
      },
    },
  ],
};
