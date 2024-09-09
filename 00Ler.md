
# Criaçom inicial

```
ng new OsMeusLivrosW
ng add @angular/material
```

# Remove Karma and Jasmine

```
npm remove @types/jasmine jasmine-core karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
```
# Replace the test script:
```
C:\Trabalho\Programacom\Angular\OsMeusLivros\OsMeusLivrosW\package.json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage",
```

# Install Jest

```
npm install --save-dev @types/jest jest-preset-angular
```

# jest.config.js
```
engadir C:\Trabalho\Programacom\Angular\OsMeusLivros\OsMeusLivrosW\jest.config.js
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup.jest.ts'],
};
```

# tsconfig.spec.json
```
C:\Trabalho\Programacom\Angular\OsMeusLivros\OsMeusLivrosW\tsconfig.spec.json
    "types": [
      "jest",
      "node"
    ]
  },
  "files": [
    "src/setup.jest.ts"
  ],
```

# setup.jest.ts

```
C:\Trabalho\Programacom\Angular\OsMeusLivros\OsMeusLivrosW\src\setup.jest.ts
import 'jest-preset-angular/setup-jest';
```