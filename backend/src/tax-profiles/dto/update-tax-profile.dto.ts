import { Prisma } from '@prisma/client';

export interface UpdateTaxProfileDto {
    taxRegimeId?: string;
    occupation?: string | null;
    profileData?: Prisma.JsonObject;
}
