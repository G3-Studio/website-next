// Purpuse : Parse a text with special tags for hightlighting in red or green, bold or italic
// Why : To avoid using HTML tags in the text

export class TextParser {
  private text: string;
  private parsedText: string;

  constructor(text: string) {
    this.text = text;
    this.parsedText = '';
  }

  public parse(): string {
    this.parsedText = this.text;
    this.escapeHtml();
    this.ln2br();
    this.parseBold();
    this.parseItalic();
    this.parseGreen();
    this.parseRed();
    this.parseSpan();
    this.parseCode();
    return this.parsedText;
  }

  private escapeHtml(): void {
    this.parsedText = this.parsedText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private ln2br(): void {
    this.parsedText = this.parsedText.replace(/\n/g, '<br>');
  }

  private parseBold(): void {
    this.parsedText = this.parsedText.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
  }

  private parseItalic(): void {
    this.parsedText = this.parsedText.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
  }

  private parseGreen(): void {
    this.parsedText = this.parsedText.replace(/\[hg\](.*?)\[\/hg\]/g, '<h class="green">$1</span>');
  }

  private parseRed(): void {
    this.parsedText = this.parsedText.replace(/\[hr\](.*?)\[\/hr\]/g, '<h class="red">$1</span>');
  }

  private parseSpan(): void {
    this.parsedText = this.parsedText.replace(/\[span\](.*?)\[\/span\]/g, '<span>$1</span>');
  }

  private parseCode(): void {
    this.parsedText = this.parsedText.replace(
      /\[code\](.*?)\[\/code\]/g,
      '&nbsp;<code class="language-cs">$1</code>&nbsp;',
    );
  }
}
