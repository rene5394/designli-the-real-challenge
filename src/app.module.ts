import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailParserModule } from './email-parser/email-parser.module';

@Module({
  imports: [ConfigModule.forRoot(), EmailParserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
