import { Test, TestingModule } from '@nestjs/testing';
import { EmailParserController } from './email-parser.controller';
import { EmailParserService } from './email-parser.service';

describe('EmailParserController', () => {
  let controller: EmailParserController;
  let emailParserService: EmailParserService;

  beforeEach(async () => {
    const mockEmailParserService = {
      parseEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailParserController],
      providers: [
        {
          provide: EmailParserService,
          useValue: mockEmailParserService,
        },
      ],
    }).compile();

    controller = module.get<EmailParserController>(EmailParserController);
    emailParserService = module.get<EmailParserService>(EmailParserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call emailParserService.parseEmail with the correct email file path', async () => {
    const emailFilePath = '/path/to/email/file.eml';
    const expectedResponse = { parsed: true };

    jest
      .spyOn(emailParserService, 'parseEmail')
      .mockResolvedValue(expectedResponse as any);

    const result = await controller.parseEmail(emailFilePath);

    expect(emailParserService.parseEmail).toHaveBeenCalledWith(emailFilePath);
    expect(result).toEqual(expectedResponse);
  });
});
