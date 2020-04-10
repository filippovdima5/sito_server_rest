module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "import",
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/indent": [
            "error",
            2
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "comma",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "comma",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "args": "after-used",
                "argsIgnorePattern": "^_",
                "ignoreRestSiblings": true,
                "vars": "all",
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "never"
        ],
        "arrow-body-style": "error",
        "comma-dangle": [
            "error",
            {
                "arrays": "only-multiline",
                "exports": "never",
                "functions": "only-multiline",
                "imports": "never",
                "objects": "only-multiline"
            }
        ],
        "consistent-return": "off",
        "eol-last": [
            "error",
            "always"
        ],
        "eqeqeq": [
            "error",
            "smart"
        ],
        "function-paren-newline": "off",
        "import/extensions": "off",
        "import/newline-after-import": [
            "warn",
            {
                "count": 2
            }
        ],
        "import/no-default-export": "off",
        "import/no-duplicates": "error",
        "import/no-self-import": "off",
        "import/order": [
            "error",
            {
                "groups": [
                    [
                        "builtin",
                        "external"
                    ],
                    [
                        "internal",
                        "parent"
                    ],
                    [
                        "sibling",
                        "index"
                    ]
                ],
                "newlines-between": "ignore",
                "alphabetize": { "order": "ignore" }
            }
        ],
        "indent": "off",
        "linebreak-style": "off",
        "max-len": [
            "error",
            {
                "code": 150,
                "ignoreComments": true,
                "ignoreRegExpLiterals": true,
                "ignoreUrls": true,
                "tabWidth": 2
            }
        ],
        "no-console": [
            "error",
            {
                "allow": [
                    "warn",
                    "error",
                    "info"
                ]
            }
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "prefer-destructuring": [
            "error",
            {
                "AssignmentExpression": {
                    "array": false,
                    "object": true
                },
                "VariableDeclarator": {
                    "array": true,
                    "object": true
                }
            }
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": "off",
    },
};
