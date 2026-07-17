import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpsertCredentialDto {
  @IsObject()
  data!: Record<string, any>;

  @IsOptional()
  @IsString()
  provider?: string;
}
