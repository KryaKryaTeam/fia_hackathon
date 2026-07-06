import { IPDFGeneratorService } from '@/application/application/bounds/IPDFGeneratorService';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Readable } from 'node:stream';
import puppeteer, { Browser } from 'puppeteer';

interface ParsedDocument {
  headerBlock: string;
  bodyHtml: string;
  requests: string[];
  signature: string;
  date: string;
}
@Injectable()
export class PDFGeneratorService
  implements IPDFGeneratorService, OnModuleInit, OnModuleDestroy
{
  private browser: Browser;
  async onModuleInit() {
    this.browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  }
  async onModuleDestroy() {
    await this.browser.close();
  }
  async generate(text: string): Promise<Readable> {
    const parsed = this.parseAiResponse(text);
    return await this.generateWithP(parsed);
  }

  private parseAiResponse(rawText: string): ParsedDocument {
    const cleanText = rawText.replace(/\*\*/g, '').trim();

    const headerMatch = cleanText.match(/^([\s\S]*?)(?=ЗАЯВА)/i);
    const headerBlock = headerMatch
      ? headerMatch[1].trim().replace(/\n/g, '<br />')
      : '';

    const bodyMatch = cleanText.match(
      /ЗАЯВА\s*([\s\S]*?)(?=На підставі викладеного|ПРОШУ:|З повагою:?)/i,
    );
    let bodyHtml = '';
    if (bodyMatch) {
      bodyHtml = bodyMatch[1]
        .trim()
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0)
        .map((paragraph) => `<p class="bodyPart">${paragraph.trim()}</p>`)
        .join('\n');
    }
    const introMatch = cleanText.match(
      /(На підставі викладеного[\s\S]*?)(?=ПРОШУ:|З повагою:?)/i,
    );
    if (introMatch && !bodyHtml.includes(introMatch[1].trim())) {
      bodyHtml += `\n<p class="bodyPart">${introMatch[1].trim()}</p>`;
    }

    const requestsBlockMatch = cleanText.match(
      /ПРОШУ:([\s\S]*?)(?=Підпис:|З повагою:|06 липня|$)/i,
    );
    const requests: string[] = [];
    if (requestsBlockMatch) {
      const lines = requestsBlockMatch[1].split('\n');
      for (const line of lines) {
        // Витягуємо текст без цифр (наприклад, "1.  Розглянути..." -> "Розглянути...")
        const itemMatch = line.match(/^\s*\d+[.)]\s*(.*)/);
        if (itemMatch) {
          requests.push(itemMatch[1].trim());
        } else if (line.trim().length > 0) {
          requests.push(line.trim());
        }
      }
    }

    const signatureMatch = cleanText.match(
      /(?:Підпис:|З повагою:?)\s*([\s\S]*?)(?=\d{2}\s[а-яА-ЯёЁіІїЇєЄґҐ]+\s\d{4}|Дата:|$)/i,
    );
    const signature = signatureMatch
      ? signatureMatch[1].trim().split('\n')[0]
      : ''; // беремо лише перший рядок ім'я

    const dateMatch = cleanText.match(
      /(?:Дата:\s*(.*)|(\d{2}\s[а-яА-ЯёЁіІїЇєЄґҐ]+\s\d{4}(?:\sроку)?))$/i,
    );
    let date = '';
    if (dateMatch) {
      date = (dateMatch[1] || dateMatch[2] || '').trim();
    }

    return {
      headerBlock,
      bodyHtml,
      requests,
      signature,
      date,
    };
  }
  private async generateWithP(parsed: ParsedDocument) {
    const page = await this.browser.newPage();

    try {
      page.setContent(`
    <!doctype html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <style>
            @page {
                size: A4;
                margin: 20mm 15mm 20mm 25mm;
            }
            @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
            body {
                font-family: 'Roboto Condensed', sans-serif;
                line-height: 1.5;
                color: #000;
                margin: 0;
                padding: 0;
                font-size: 14pt;
            }
            .container {
                padding-top: 2em;
                width: 100%;
                margin: 0 auto;
                position: relative;
                padding-bottom: 5em;
            }
            .grid_head {
                display: grid;
                grid-template-columns: 3fr 2fr;
                gap: 1em;
                font-size: 0.9rem;
            }
            .reportT {
                width: 100%;
                text-align: center;
                padding-top: 1em;
                padding-bottom: 1em;
            }
            .bodyPart {
                text-align: justify;
                text-indent: 2em;
                padding-bottom: 1em;
                font-size: 1.1em;
            }
            .ending {
                font-weight: bold;
            }
            .requestTitle {
                font-size: 1.2em;
                font-weight: bold;
                padding-bottom: 0.5em;
            }
            .list {
                padding-left: 2em;
                font-size: 1.1em;
            }
            .footer {
                padding-top: 2em;
                display: flex;
                justify-content: space-between;
                font-size: 1.1em;
            }
            .serviceSign {
                position: absolute;
                bottom: 0;
                left: 0;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-around;
                height: 50px;
                gap: 0;
            }
            .logo {
                font-family: 'Oswald', sans-serif;
                font-weight: 700;
                font-size: 1.2rem;
                line-height: 1;
            }
            .serviceSign-mainText {
                padding: 0;
                margin: 0%;
                font-size: 0.8em;
                font-weight: 600;
            }
            .serviceSign-site {
                padding: 0;
                margin: 0%;
                font-size: 0.6em;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="serviceSign">
                <p class="serviceSign-mainText">
                <span class="logo">ТіЗ</span> - Тут і Зараз
                </p>
                <p class="serviceSign-site">tiz.swedka121.com</p>
            </div>
            <div class="grid_head">
                <div class="placeSign"></div>
                <div class="head">
                ${parsed.headerBlock.replaceAll('\n', '<br/>')}
                </div>
            </div>
            <h1 class="reportT">Заява</h1>

       
            ${parsed.bodyHtml.replaceAll('На підставі викладеного та керуючись чинним законодавством України,', '')}
            <br />
            <span class="ending">
            На підставі викладеного та керуючись чинним законодавством України,
            </span>
      
            <h2 class="requestTitle">ПРОШУ:</h2>
            <div class="list">
                ${parsed.requests.map((req, idx) => `<p class="list-item">${idx + 1}. ${req}</p>`).join('\n')}
            </div>
            <div class="footer">
                <p class="date">${parsed.date}</p>
                <p class="signature">${parsed.signature}</p>
            </div>
            </div>
        </body>
        </html>
        `);
      const stream = await page.createPDFStream({});

      const r = Readable.fromWeb(stream);
      r.on('close', () => {
        page.close();
      });

      return r;
    } catch {
      await page.close();
      throw new Error('Failed to start');
    }
  }
}
