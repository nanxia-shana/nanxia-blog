---
layout: doc
---

# Frontend Project Standardization

## Why Frontend Standardization is Needed
When multiple people collaborate on development, project standardization becomes extremely important. Without proper standardization management, as the project grows, code quality and style will gradually deteriorate until it becomes unmaintainable.

## How to Implement Frontend Standardization
The project standardization we typically refer to generally includes the following aspects:

- Project structure standardization
- Branch management standardization
- Editor formatting standardization
- Code style standardization
- Code submission standardization

These standards will run through our entire development lifecycle. If we can unify these standards, it will lay a solid foundation for the long-term stable iteration of the project. Next, let's delve into each of these aspects one by one.

## Project Structure Standardization
Generally, the structure of a medium to large project mainly includes the following files:

Root directory:

- README.md: Project introduction file
- package.json: Project commands and dependency management file
- pnpm-lock (package-lock.json): Dependency version lock file
- gitignore: Configuration file for files to ignore during git submission
- editorconfig: Editor style unification file
- eslintrc.json: Code syntax unification file
- prettierrc.js: Code format style unification file
- commitlint.config.js: Code submission standardization configuration file
- cz-config.js: Code submission auxiliary tool configuration file
- public: Static resource folder
    - index.html: SPA entry page
    - static: Other static resource folders
- src: Project core resource folder
    - main.js: Project js entry file, generally used as the dependency analysis starting point for packaging tools like webpack
    - vite.config.js/webpack.config.js: Packaging tool configuration file
    - components: Project-level public component folder
    - utils: Project-level public function folder
    - router: Project routing management folder
    - store: Project state machine management folder
    - pages: Business project code folder
        - home: Example page folder
            - index.jsx: Page entry file
            - components: Page-level component folder
The above is a general directory structure for a single-repository, single-package project. Based on this, adjustments can be made according to the actual project situation.

Monorepo (single-repository, multiple-package) projects will have different structures. If you are interested in such projects, you can refer to this project: https://github.com/doggyegg/charlie-ec

## Branch Management Standardization
Generally, the complete iteration cycle of a project includes review, development, testing, pre-release, and launch. We will divide branches around these cycles.

1. dev：Development branch, used for code management during development and as the deployment branch for the development environment
    - dev-xx ：When multiple people are developing, split the dev branch. It can be split by function or by project members. After development is completed, submit an MR in git, and the project leader will CR and merge it into the dev branch.
2. test: Testing branch. After an iteration is completed and before testing, merge the dev branch into the test branch for deployment in the testing environment.
3. stage：Pre-release branch. After testing is completed, there is usually an acceptance phase before launch. This branch serves as the acceptance branch and is deployed in the pre-release environment.
4. master：The main branch of the project. After acceptance in the pre-release environment, merge the code into this branch for deployment in the formal production environment. After the launch is completed and online regression testing is finished, generate a tag from this branch as the final version.

The above is a general branch management method that can run through the entire project iteration lifecycle. In actual development, adjustments can be made based on these branches.

## Editor Formatting Standardization
Editor formatting plays a particularly important role in multi-person collaborative development. Without unification, it will have a significant impact on subsequent code conflicts, code CR, and commit record backtracking.

### Unified Editor Configuration
Generally, developers in each company should try to unify their editors. Here, taking vscode as an example, when everyone uses the same editor, unification becomes relatively easy. You only need to add a .vscode folder in the project root directory and create a settings.json file to configure the editor. This configuration will take precedence over vscode.

```json
{
  // Format code when saving
  "editor.formatOnSave": true,
  // Font size
  "editor.fontSize": 14,
  // Default to tab indentation
  "editor.detectIndentation": false,
  "editor.insertSpaces": false,
  // Reset tabsize
  "editor.tabSize": 2,
  // Exclude these folders/files when using the search function
  "search.exclude": {
    "**/dist": true
  },
  // These files will not be displayed in the workspace
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.DS_Store": true
  },
  "[vue]": {
    // Use prettier to format 【vue】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    // Use prettier to format 【javascript】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    // Use prettier to format 【typescript】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    // Use prettier to format 【json】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    // Use prettier to format 【html】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    // Use prettier to format 【markdown】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    // Use prettier to format 【css】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    // Use prettier to format 【scss】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    // Use prettier to format 【less】 files
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Using Third-Party Plugins
When members of the development team use different editors, we can use some third-party plugins for cross-editor unification, such as <strong>EditorConfig</strong>

This plugin has corresponding versions in various mainstream editors. For example, in vscode, there is <strong>​​EditorConfig for VS Code​</strong>​, and WebStorm has built-in support, so no plugin installation is needed.

After installing the corresponding plugin, add an .editorconfig file in the project root directory for configuration to achieve cross-editor format unification.

```
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

## Code Style Standardization
Individual code styles can vary greatly due to factors such as work experience, project experience, and even differences in thinking. When multiple people develop the same project, if unification is not timely, a project will contain various styles of code, which is very detrimental to subsequent project maintenance and handover. Therefore, style unification is very important.

Here, we will use the most popular code style unification solution in the industry to explain: ​​<strong>Eslint</strong> + <strong>Prettier</strong>，<strong>Prettier</strong> focuses on code formatting, while​ <strong>ESLint</strong> focuses on code quality. The two can be used together.

### Eslint
#### Introduction
ESLint is a widely used open-source JavaScript static code analysis tool for identifying and fixing problems in code. It helps developers follow coding standards, discover potential errors, and thereby improve code quality and maintainability.

#### Integration Steps
1. Install the corresponding dependencies for the project
    - npm i eslint -D

2. Add configuration file in the root directory
    - You can initialize the configuration through npx eslint --init
    - Or manually create an .eslintrc.js or json file in the root directory for configuration

3. Detailed configuration content
```js
module.exports = {
  env: {
    // Specify the environment in which this eslint configuration file operates, such as browser, node, etc.
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    // Some existing third-party eslint configuration integration packages can be configured according to the actual project. If used, remember to install third-party dependencies.
    "eslint:recommended",
    "plugin:react/recommended", // Rules for React (if using Vue, use 'plugin:vue/recommended')
    "prettier", // If using Prettier, add this item to resolve conflicts between eslint and prettier.
  ],
  parserOptions: {
    // Parsing rules for js files. If using ts, additional related configuration is needed.
    // "parser": "@typescript-eslint/parser", required for ts.
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // Custom rules. When some rules need to be enabled or disabled, they can be configured here to override the original rules.
    "no-unused-vars": "warn",
    "no-console": "off",
  },
  globals: {
    // Define some global variables to avoid undefined error reminders.
    uni: true,
    wx: true,
  },
};
```

### Prettier
#### Introduction
Prettier is an open-source code formatting tool used to maintain consistent code style among different team members and projects. It ensures consistent code style by parsing and reprinting code without manual intervention.

#### Integration Steps
1. Install dependencies
    - npm i prettier -D

2. Create configuration file
Create a .prettierrc.js file in the root directory for configuration. Specific configuration reference:
```js
module.exports = {
  printWidth: 100, // The number of characters per line. If exceeded, it will wrap.
  tabWidth: 2, // The number of spaces per tab. Default is 2.
  useTabs: true, // Whether to enable tabs instead of spaces for indentation. .editorconfig sets tab indentation, so set to true.
  semi: true, // Whether to use semicolons at the end of lines. Default is true.
  singleQuote: true, // Whether to use single quotes for strings.
  bracketSpacing: true, // Whether there is a space between object braces. Default is true. Effect: { foo: bar }
  arrowParens: "avoid", // Arrow functions with a single parameter omit parentheses.
  trailingComma: "none", // Whether to add commas at the end of objects or arrays. none| es5| all.
  // Braces on the same line as the code.
  bracketSameLine: true,
};
```

### Resolving Conflicts Between Eslint and Prettier
1. Install corresponding dependencies
    - npm install eslint-config-prettier eslint-plugin-prettier -D

2. Configure Eslint
    ```js
    module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
            ...,
        "plugin:prettier/recommended", // Add Prettier support.
    ],
    plugins: [..., "prettier"],
    };
    ```
    At this point, the basic standardization of code style is set up. If further standardization of style files is needed, you can use <strong>Stylelint</strong> to standardize scss, css, etc.

### Stylelint for CSS File Standardization
1. Install dependencies
    - npm install --save-dev stylelint stylelint-config-standard stylelint-scss
2. Create a .stylelintrc file in the root directory and configure it.
```
{
    "extends": [
        "stylelint-config-standard", // Use standard rules.
        "stylelint-config-recommended-scss" // Add SCSS support.
    ],
    "plugins": ["stylelint-scss"], // Load SCSS plugin.
    "rules": {
        "indentation": 2, // Use 2 spaces for indentation.
        "string-quotes": "single", // Enforce single quotes.
        "color-hex-length": "short", // Hexadecimal colors should be as short as possible.
        "no-empty-source": null, // Ignore empty file warnings.
        "block-no-empty": true // Prohibit empty style rule blocks.
    }
}
```

## Code Submission Standardization
After completing the above code style configurations, some developers may not install the corresponding plugins as required or may comment out code standardization items locally during development. At this time, we can use git's hook functions combined with third-party tool libraries such as husky + commitlint and lint-staged to perform checks during code submission, and introduce CZ for visual code submission.

### Introducing Husky + Lint-staged + commitlint for Submission Verification
1. Install dependencies
    - npm i husky lint-staged commitlint/cli -D

2. Initialize Husky

    npx husky install This will create a .husky/ folder in the project root directory.

3. Husky adds pre-commit and commit-msg hooks

    Create commit-msg and pre-commit files in the .husky directory respectively, and add corresponding configurations

    Add the following to commit-msg:
    ```
    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    npx --no-install commitlint --edit $1
    ```
    Add the following to pre-commit:
    ```
    npx lint-staged
    ```

4. Configure lint-staged

    Add the following configuration to package.json:
    ```json
    {
        "lint-staged": {
            "*.{js,vue,ts}": ["npm run lint"]
        }
    }
    ```

5. Configure Commitlint

Create a commitlint.config.js file in the root directory and add the corresponding configuration code.
```js
module.exports = {
  // Define rule types.
  rules: {
    // Type definition. The type of git submission must be within the following types.
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature.
        "fix", // Bug fix.
        "conflict", // Conflict resolution.
        "document", // Add comments.
        "style", // Unrelated to business, style modifications.
        "config", // Document comments.
        "refactor", // Refactoring (neither adding new features nor fixing bugs).
        "revert", // Rollback.
        "build", // Packaging.
      ],
    ], // Subject case is not validated.
    "subject-case": [0],
  },
};
```
6. Introduce Commitizen for visual code submission.
    1. Install the corresponding dependencies npm i commitizen -g npm i cz-customizable -d

    2. Create a .cz-config.js file in the root directory and configure it accordingly.
    ```js
    module.exports = {
      // Optional types, corresponding one-to-one with the rules configured in commitlint.config.js above.
      types: [
          { value: "feat", name: "feat: New feature" },
          { value: "fix", name: "fix: Fix" },
          { value: "style", name: "style: Style modification" },
          { value: "document", name: "document: Add comments" },
          {
          value: "refactor",
          name: "refactor: Refactoring (neither adding features nor fixing bugs)",
          },
          { value: "conflict", name: "conflict: Conflict resolution" },
          { value: "config", name: "config: Configuration file changes" },
          { value: "build", name: "build: Packaging" },
          { value: "revert", name: "revert: Rollback" },
      ], // Message steps, normally only selection is needed.
      messages: {
          type: "Please select the submission type:",
          subject: "Please briefly describe the submission (required):",
          confirmCommit: "Confirm submission with the above information? (y/n)",
      },
      skipQuestions: ["body", "footer"], // Skip questions: detailed description, issue-related.
      subjectLimit: 100, // The maximum length of the subject description is 100.
  };
    ```
    At this point, the configuration is complete. Subsequent code submissions can use the git cz command for visual submission. The specific effect is as follows:
    <img src="/markdown/front/engi/cz.nqCw_TZy.png" alt="Loading failed" />
