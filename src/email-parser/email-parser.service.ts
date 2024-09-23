import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { simpleParser } from 'mailparser';
import {
  jsonAttachmentParser,
  jsonLinkFileParser,
} from './helpers/email-parser.helper';

@Injectable()
export class EmailParserService {
  async parseEmail(emailFilePath: string): Promise<JSON> {
    try {
      const splitFilePath = emailFilePath.split('/');
      const filePath = join(process.cwd(), ...splitFilePath);

      if (!existsSync(filePath)) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      const file = createReadStream(filePath);
      const parsedEmail = await simpleParser(file);
      const attachments = parsedEmail.attachments;
      const html = parsedEmail.html;

      if (attachments.length > 0) {
        return jsonAttachmentParser(attachments);
      }

      if (html) {
        return await jsonLinkFileParser(html);
      }
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
