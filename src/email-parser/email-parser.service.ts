import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { simpleParser } from 'mailparser';
import * as cheerio from 'cheerio';

@Injectable()
export class EmailParserService {
  async parseEmail(emailFilePath: string) {
    const splitFilePath = emailFilePath.split('/');
    const file = createReadStream(join(process.cwd(), ...splitFilePath));
    const parsedEmail = await simpleParser(file);
    const attachments = parsedEmail.attachments;
    const html = parsedEmail.html;
    const links: string[] = [];

    if (attachments.length > 0) {
      const jsonBuffer = attachments
        .filter((attachment) => attachment.contentType === 'application/json')
        .map((attachment) => attachment.content);

      return JSON.parse(jsonBuffer[0].toString('utf8'));
    }

    if (html) {
      const $ = cheerio.load(html);

      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          links.push(href);
        }
      });

      const urlJson = links.find((link) => link.includes('.json'));
      if (urlJson) {
        const response = await fetch(urlJson);
        const data = await response.json();
        return data;
      }
    }
  }
}
