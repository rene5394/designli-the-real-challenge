import { Body, Controller, Post } from '@nestjs/common';

@Controller('email-parser')
export class EmailParserController {
  constructor() {}

  @Post()
  parseEmail(@Body('path') emailFilePath: string) {
    return;
  }
}
