import tsEslint from 'typescript-eslint';
import js from "@eslint/js";


export default tsEslint.config(
  js.configs.recommended,

  // ts eslint
  ...tsEslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ]
    },
  },

  {
    files: ["**/*.ts"]
  },
  {
    ignores: ["dist", "node_modules", "src/types/db.ts", "eslint.config.js"],
  },
  {
    rules: {
      "no-console": ["error", { allow: ["error"] }],
    },
  }
);
