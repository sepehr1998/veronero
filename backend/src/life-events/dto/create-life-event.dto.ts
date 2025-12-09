export class CreateLifeEventDto {
    lifeEventTypeId!: string;
    answersJson!: Record<string, unknown>;
    occurredAt!: string;
}
