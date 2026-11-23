
'use strict';

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        const codes = ['0', 'A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J'];

        const discountCodes = codes.map((code) => ({
            code,
            percentage: 0,
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('discount_codes', discountCodes);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('discount_codes', {
            code: ['0', 'A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J'],
        });
    },
};
