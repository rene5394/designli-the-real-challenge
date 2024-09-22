import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { simpleParser } from 'mailparser';
import {
  jsonAttachmentParser,
  jsonLinkFileParser,
} from './helpers/email-parser.helper';

@Injectable()
export class EmailParserService {
  async parseEmail(emailFilePath: string) {
    const splitFilePath = emailFilePath.split('/');
    const file = createReadStream(join(process.cwd(), ...splitFilePath));
    const parsedEmail = await simpleParser(file);
    const attachments = parsedEmail.attachments;
    const html = parsedEmail.html;

    if (attachments.length > 0) {
      return jsonAttachmentParser(attachments);
    }

    if (html) {
      return await jsonLinkFileParser(html);
    }
  }
}
