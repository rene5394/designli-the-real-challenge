import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  HttpCode,
} from '@nestjs/common';
import { EmailParserService } from './email-parser.service';

@Controller('email-parser')
export class EmailParserController {
  constructor(private readonly emailParserService: EmailParserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  parseEmail(@Body('path') emailFilePath: string): Promise<JSON> {
    if (!emailFilePath) {
      throw new HttpException(
        'emailFilePath is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.emailParserService.parseEmail(emailFilePath);
  }
}
