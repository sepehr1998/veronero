"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const finnishIndividualSettings = {
    progressiveTaxBrackets: [
        { upTo: 19200, rate: 0.06 },
        { upTo: 43500, rate: 0.175 },
        { upTo: 76600, rate: 0.215 },
        { upTo: 134000, rate: 0.275 },
        { upTo: null, rate: 0.31 },
    ],
    deductions: {
        basicDeduction: 3700,
        earnedIncomeDeductionRate: 0.125,
    },
    socialContributions: {
        pension: 0.0715,
        unemployment: 0.0125,
    },
};
const finnishBusinessSettings = {
    corporateTaxRate: 0.2,
    vatRates: {
        standard: 0.24,
        reduced: [0.14, 0.1],
    },
    deductions: {
        depreciation: {
            machinery: 0.25,
            intangibleAssets: 0.2,
        },
    },
};
async function seed() {
    const finland = await prisma.country.upsert({
        where: { code: 'FI' },
        update: {},
        create: {
            code: 'FI',
            name: 'Finland',
        },
    });
    const finnishIndividual = await prisma.taxRegime.upsert({
        where: { slug: 'fi_individual' },
        update: {},
        create: {
            slug: 'fi_individual',
            displayName: 'Finland Individual Taxation',
            countryCode: finland.code,
            isActive: true,
        },
    });
    const finnishBusiness = await prisma.taxRegime.upsert({
        where: { slug: 'fi_business' },
        update: {},
        create: {
            slug: 'fi_business',
            displayName: 'Finland Business Taxation',
            countryCode: finland.code,
            isActive: true,
        },
    });
    await prisma.taxRegimeSetting.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {
            settingsJson: finnishIndividualSettings,
            validFrom: new Date('2024-01-01'),
        },
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            taxRegimeId: finnishIndividual.id,
            settingsJson: finnishIndividualSettings,
            validFrom: new Date('2024-01-01'),
        },
    });
    await prisma.taxRegimeSetting.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {
            settingsJson: finnishBusinessSettings,
            validFrom: new Date('2024-01-01'),
        },
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            taxRegimeId: finnishBusiness.id,
            settingsJson: finnishBusinessSettings,
            validFrom: new Date('2024-01-01'),
        },
    });
}
seed()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error('Failed to seed database', error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map