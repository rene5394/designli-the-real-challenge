import * as cheerio from 'cheerio';

export const jsonAttachmentParser = (attachments: any[]): JSON => {
  const jsonBuffer = attachments
    .filter((attachment) => attachment.contentType === 'application/json')
    .map((attachment) => attachment.content);

  return JSON.parse(jsonBuffer[0].toString('utf8'));
};

export const jsonLinkFileParser = async (html: string): Promise<JSON> => {
  const links = emailLinkSearch(html);
  const urlJson = links.find((link) => link.includes('.json'));

  if (urlJson) {
    const response = await fetch(urlJson);
    const data = await response.json();

    return data;
  }
};

export const emailLinkSearch = (html: string): string[] => {
  const $ = cheerio.load(html);
  const links: string[] = [];

  $('a').each((_, element) => {
    const href = $(element).attr('href');
    if (href) {
      links.push(href);
    }
  });

  return links;
};
