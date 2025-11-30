import type { CodegenConfig } from "@graphql-codegen/cli";
import codegenConfig from "./codegen.config.mts";

const config: CodegenConfig = {
  schema: `https://api.crystallize.com/${codegenConfig.tenantId}/discovery`,
  documents: [
    "src/lib/discovery/**/*.{ts,tsx}",
    "!src/gql/**/*",
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/discovery/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
      config: {
        documentMode: "string",
        useTypeImports: true,
      },
    },
  },
};

export default config;
