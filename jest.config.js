module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/setup.jest.ts'],
    moduleNameMapper: {
        '^@servizosApi$': '<rootDir>/src/app/core/services/api/index.ts',
        '^@servizosFlow$': '<rootDir>/src/app/core/services/flow/index.ts',
        '^@componhentesComuns$': '<rootDir>/src/app/core/components/index.ts',
        '^@interfaces$': '<rootDir>/src/app/core/models/index.ts',
    },
};