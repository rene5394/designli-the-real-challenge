import { Module } from '@nestjs/common';
import { EmailParserController } from './email-parser.controller';

@Module({
  controllers: [EmailParserController],
  providers: [],
})
export class EmailParserModule {}
