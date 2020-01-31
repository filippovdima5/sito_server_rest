module.exports = {
    plugins: ["react-hooks", "import", "jsx-a11y", "unicorn", "@typescript-eslint",  "react"],

    env: {
        "browser": true,
        "es6": true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:import/typescript",
    ],

    parserOptions: {
        ecmaFeatures: { "jsx": true },
        ecmaVersion: 2018,
        sourceType: "module"
    },

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
                "varsIgnorePattern": "^(React$|_)"
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
                "newlines-between": "ignore"
            }
        ],
        "indent": "off",
        "jsx-a11y/anchor-is-valid": [
            "error",
            {
                "aspects": [
                    "noHref",
                    "invalidHref",
                    "preferButton"
                ],
                "components": [],
                "specialLink": [
                    "hrefLeft",
                    "hrefRight"
                ]
            }
        ],
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
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react/default-props-match-prop-types": "off",
        "react/display-name": "off",
        "react/prop-types": "off",
        "semi": "off",
    }
};