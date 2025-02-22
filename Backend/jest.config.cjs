module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testTimeout: 30000, // Timeout de 10 segundos
};