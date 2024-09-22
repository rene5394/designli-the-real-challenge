import { Body, Controller, Post } from '@nestjs/common';
import { EmailParserService } from './email-parser.service';

@Controller('email-parser')
export class EmailParserController {
  constructor(private readonly emailParserService: EmailParserService) {}

  @Post()
  parseEmail(@Body('path') emailFilePath: string) {
    return this.emailParserService.parseEmail(emailFilePath);
  }
}
