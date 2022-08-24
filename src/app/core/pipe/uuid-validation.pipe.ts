import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { uuid } from '@app/utils/uuid';

export class ValidationUUIDPipe implements PipeTransform<string> {
  transform(value: string, _metadata: ArgumentMetadata): string {
    if (!uuid.isValid(value)) {
      throw new BadRequestException('Formato do UUID inválido');
    }

    return value;
  }
}
