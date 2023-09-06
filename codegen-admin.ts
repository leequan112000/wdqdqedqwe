import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/graphql-admin/**/*.graphql',
  generates: {
    './src/graphql-admin/generated/index.ts': {
      config: {
        useIndexSignature: true,
      },
      plugins: ['typescript', 'typescript-resolvers'],
    }
  },
}
export default config
