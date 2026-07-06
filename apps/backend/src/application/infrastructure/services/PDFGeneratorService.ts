import { IPDFGeneratorService } from '@/application/application/bounds/IPDFGeneratorService';
import { Injectable } from '@nestjs/common';
import { Readable } from 'node:stream';
import puppeteer from 'puppeteer';

interface ParsedDocument {
  headerBlock: string;
  bodyHtml: string;
  requests: string[];
  signature: string;
  date: string;
}
@Injectable()
export class PDFGeneratorService implements IPDFGeneratorService {
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
      /ЗАЯВА\s*([\s\S]*?)(?=На підставі викладеного|ПРОШУ:)/i,
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

    const requestsBlockMatch = cleanText.match(/ПРОШУ:([\s\S]*?)(?=Підпис:)/i);
    const requests: string[] = [];
    if (requestsBlockMatch) {
      const lines = requestsBlockMatch[1].split('\n');
      for (const line of lines) {
        const itemMatch = line.match(/^\s*\d+[.)]\s*(.*)/);
        if (itemMatch) {
          requests.push(itemMatch[1].trim());
        } else if (line.trim().length > 0) {
          requests.push(line.trim());
        }
      }
    }

    const signatureMatch = cleanText.match(/Підпис:\s*([\s\S]*?)(?=Дата:|$)/i);
    const signature = signatureMatch ? signatureMatch[1].trim() : '';

    const dateMatch = cleanText.match(/Дата:\s*(.*)/i);
    const date = dateMatch ? dateMatch[1].trim() : '';

    return {
      headerBlock,
      bodyHtml,
      requests,
      signature,
      date,
    };
  }

  private async generateWithP(parsed: ParsedDocument) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

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
                grid-template-columns: 2fr 1fr;
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

       
            ${parsed.bodyHtml}
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

      return Readable.fromWeb(stream);
    } catch {
      throw new Error('Failed to start');
    } finally {
      await page.close();
      await browser.close();
    }
  }
}
