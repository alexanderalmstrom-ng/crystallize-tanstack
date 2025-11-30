import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      cart: {
        loader: "./codegen/cartLoader.mjs",
      },
    },
  ],
  documents: [
    "src/lib/cart/**/*.{ts,tsx}",
    "!src/gql/**/*",
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/cart/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
      plugins: ['typescript'],
      config: {
        documentMode: "string",
        useTypeImports: true,
        maybeValue: 'T | null | undefined',
        ignoreEnumValuesFromSchema: true,
      },
    },
  },
};

export default config;
