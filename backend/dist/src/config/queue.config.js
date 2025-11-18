"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('queue', () => ({
    prefix: process.env.BULLMQ_PREFIX ?? 'veronero',
}));
//# sourceMappingURL=queue.config.js.map