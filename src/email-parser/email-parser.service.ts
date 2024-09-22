import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { simpleParser } from 'mailparser';

@Injectable()
export class EmailParserService {
  async parseEmail(emailFilePath: string) {
    const splitFilePath = emailFilePath.split('/');
    const file = createReadStream(join(process.cwd(), ...splitFilePath));
    const parsedEmail = await simpleParser(file);
    const attachments = parsedEmail.attachments;
    const jsonBuffer = attachments
      .filter((attachment) => attachment.contentType === 'application/json')
      .map((attachment) => attachment.content);

    return JSON.parse(jsonBuffer[0].toString('utf8'));
  }
}
