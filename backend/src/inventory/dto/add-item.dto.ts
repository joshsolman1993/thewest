import { IsString, IsInt, Min, Max, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class AddItemDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'itemId must be alphanumeric with dashes or underscores only'
    })
    itemId: string;

    @IsString()
    @IsNotEmpty()
    itemName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(weapon|armor|consumable|material|quest|misc)$/, {
        message: 'itemType must be one of: weapon, armor, consumable, material, quest, misc'
    })
    itemType: string;

    @IsInt()
    @Min(1, { message: 'quantity must be at least 1' })
    @Max(9999, { message: 'quantity cannot exceed 9999' })
    quantity: number;

    @IsOptional()
    @IsString()
    slot?: string;
}
