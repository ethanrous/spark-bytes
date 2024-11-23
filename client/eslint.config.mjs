// import reactPlugin from 'eslint-plugin-react';
// import globals from 'globals';
//
// import babelParser from "@babel/eslint-parser"
// import ts from '@typescript-eslint/eslint-plugin';
// import tsParser from '@typescript-eslint/parser';

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: [
            'dist/**/*.ts',
            'dist/**',
            '**/*.mjs',
            'eslint.config.mjs',
            '**/*.js',
            'src/api/swag/**/*.ts',
            'src/api/swag/**',
        ],
    },
    eslint.configs.recommended,
    // ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                parser: '@babel/eslint-parser',
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    }
)
