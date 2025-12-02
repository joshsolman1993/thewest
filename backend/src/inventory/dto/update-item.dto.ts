import { IsInt, Min, Max, IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateItemDto {
    @IsOptional()
    @IsInt()
    @Min(0, { message: 'quantity cannot be negative' })
    @Max(9999, { message: 'quantity cannot exceed 9999' })
    quantity?: number;

    @IsOptional()
    @IsBoolean()
    equipped?: boolean;

    @IsOptional()
    @IsString()
    slot?: string;
}
