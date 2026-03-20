import { IsString, IsNotEmpty, IsUrl } from 'class-validator'

export class DeleteImageDTO {
  @IsString({ message: 'Image URL must be a string.' })
  @IsNotEmpty({ message: 'Image URL cannot be empty.' })
  @IsUrl({}, { message: 'Image URL must be a valid URL format.' })
  imageUrl: string
}
