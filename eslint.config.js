// @ts-check
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import i18next from "eslint-plugin-i18next";

export default tseslint.config(
  {
    ignores: ["build/**", ".react-router/**", "node_modules/**", "public/**", "images-raw/**", "playwright-report/**", "test-results/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // No hardcoded user-facing strings in components: UI text must come from i18n.
  {
    files: ["src/components/**/*.tsx", "src/app/routes/**/*.tsx"],
    plugins: { i18next },
    rules: {
      "i18next/no-literal-string": [
        "error",
        {
          mode: "jsx-text-only",
          "jsx-attributes": { include: ["alt", "aria-label", "title", "placeholder"] },
          words: {
            // Proper names, symbols and punctuation that are the same in every language.
            exclude: [
              "Mangkunegaran",
              "mangkunegaran\\.id",
              "mangkunegaran\\.co\\.id/tiket",
              "404",
              "[·—–→:,.()\\s]+",
              "[0-9IVX]+",
            ],
          },
        },
      ],
    },
  },
  // Language-neutral entry and fallback pages are written in Indonesian and
  // English side by side on purpose (the visitor's language is unknown there).
  {
    files: ["src/app/routes/root-index.tsx", "src/app/routes/not-found.tsx", "src/app/root.tsx"],
    rules: { "i18next/no-literal-string": "off" },
  },
  {
    files: ["scripts/**/*.ts", "tests/**/*.ts", "*.ts", "*.js"],
    rules: { "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }] },
  },
);
