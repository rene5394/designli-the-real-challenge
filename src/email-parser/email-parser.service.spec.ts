import { Test, TestingModule } from '@nestjs/testing';
import { EmailParserService } from './email-parser.service';
import { simpleParser } from 'mailparser';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  jsonAttachmentParser,
  jsonLinkFileParser,
} from './helpers/email-parser.helper';

jest.mock('fs');
jest.mock('mailparser');
jest.mock('./helpers/email-parser.helper');

describe('EmailParserService', () => {
  let service: EmailParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailParserService],
    }).compile();

    service = module.get<EmailParserService>(EmailParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw Not Found error when file does not exist', async () => {
    const emailFilePath = '/path/to/email/file.eml';

    (existsSync as jest.Mock).mockReturnValue(false);

    try {
      await service.parseEmail(emailFilePath);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      expect(error.message).toEqual('File not found');
    }
  });

  it('should parse email with attachments and call jsonAttachmentParser', async () => {
    const emailFilePath = '/path/to/email/file.eml';
    const mockParsedEmail = {
      attachments: [{ filename: 'attachment.json' }],
      html: null,
    };

    (existsSync as jest.Mock).mockReturnValue(true);
    (createReadStream as jest.Mock).mockReturnValue('stream');
    (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);
    (jsonAttachmentParser as jest.Mock).mockReturnValue({
      parsed: 'attachments',
    });

    const result = await service.parseEmail(emailFilePath);

    expect(createReadStream).toHaveBeenCalledWith(
      join(process.cwd(), ...emailFilePath.split('/')),
    );
    expect(simpleParser).toHaveBeenCalledWith('stream');
    expect(jsonAttachmentParser).toHaveBeenCalledWith(
      mockParsedEmail.attachments,
    );
    expect(result).toEqual({ parsed: 'attachments' });
  });

  it('should parse email with HTML and call jsonLinkFileParser', async () => {
    const emailFilePath = '/path/to/email/file.eml';
    const mockParsedEmail = {
      attachments: [],
      html: '<html><a href="link/to/json/file">File</a></html>',
    };

    (existsSync as jest.Mock).mockReturnValue(true);
    (createReadStream as jest.Mock).mockReturnValue('stream');
    (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);
    (jsonLinkFileParser as jest.Mock).mockResolvedValue({ parsed: 'html' });

    const result = await service.parseEmail(emailFilePath);

    expect(createReadStream).toHaveBeenCalledWith(
      join(process.cwd(), ...emailFilePath.split('/')),
    );
    expect(simpleParser).toHaveBeenCalledWith('stream');
    expect(jsonLinkFileParser).toHaveBeenCalledWith(mockParsedEmail.html);
    expect(result).toEqual({ parsed: 'html' });
  });

  it('should return undefined when no attachments or HTML are present', async () => {
    const emailFilePath = '/path/to/email/file.eml';
    const mockParsedEmail = {
      attachments: [],
      html: null,
    };

    (existsSync as jest.Mock).mockReturnValue(true);
    (createReadStream as jest.Mock).mockReturnValue('stream');
    (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);

    const result = await service.parseEmail(emailFilePath);

    expect(createReadStream).toHaveBeenCalledWith(
      join(process.cwd(), ...emailFilePath.split('/')),
    );
    expect(simpleParser).toHaveBeenCalledWith('stream');
    expect(result).toBeUndefined();
  });

  it('should throw Internal Server Error on unexpected errors', async () => {
    const emailFilePath = '/path/to/email/file.eml';

    (existsSync as jest.Mock).mockReturnValue(true);
    (createReadStream as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    try {
      await service.parseEmail(emailFilePath);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.message).toEqual('Internal Server Error');
    }
  });
});
