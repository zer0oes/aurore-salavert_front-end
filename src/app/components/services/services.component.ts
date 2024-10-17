import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Service } from '@app/models/frontend/project';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { LocaleService } from '@app/services/locale.service';

@Component({
  selector: 'services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private localeService: LocaleService) { }

  @Input() serviceContent: Array<Service> = [];
  private url = environment.url;
  
  ngOnInit(): void {
    const locale = this.localeService.getLocale();

    this.http.get(`${this.url}/api/service?populate=*&locale=${locale}`).subscribe((response: any) => {
      const serviceData = response.data;
      const processedText = this.processText(serviceData.attributes.Text);

      const service: Service = {
        title: serviceData.attributes.Title,
        text: processedText
      };

      this.serviceContent.push(service);
    });
  }

  processText(text: string): SafeHtml {
    // Replace \n with <p>...</p>
    text = text.replace(/\n/g, '</p><p>');

    // Replace **text** with <b>text</b>
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Replace _text_ with <i>text</i>
    text = text.replace(/_(.*?)_/g, '<i>$1</i>');

    // Surround the entire text with <p>...</p>
    text = `<p>${text}</p>`;

    // Mark the processed text as safe to display
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}
