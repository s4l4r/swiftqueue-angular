import {Component, ElementRef, ViewChild} from '@angular/core';
import {AppService} from '../../app/app.service';
import {Client} from '../../dtos/user/client';
import {Router} from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-auto-suggest',
  templateUrl: './autoSuggest.component.html',
  styleUrls: ['./autoSuggest.component.css']
})
export class AutoSuggestComponent {

  @ViewChild('filterInput') public userInput: ElementRef | undefined;
  resultDataList: Array<Client> = [];

  constructor(private service: AppService, private router: Router) {
  }

  searchQueryOnDataSource(): void {
    const spinner = $('.spinner-border');
    spinner.attr('style', spinner.attr('style') + ';' + 'display: flex !important');
    this.resultDataList = [];
    if (this.userInput?.nativeElement.value.length >= 2) {
      const searchPhrase = this.userInput?.nativeElement.value;
      this.service.postResource('/api/v1/clients/search/' + searchPhrase, null, false)
        .subscribe(response => {
        this.handleSearchResults(response.body);
      });
    } else {
      spinner.attr('style', spinner.attr('style') + ';' + 'display: none !important');
    }
  }

  private handleSearchResults(dataArray: Array<Client>): void {
    const spinner = $('.spinner-border');
    spinner.attr('style', spinner.attr('style') + ';' + 'display: none !important');
    if (dataArray.length === 0) {
      const feature = new Client(0, 'نتیجه ای یافت نشد', undefined, undefined, undefined,
        undefined);
      this.resultDataList.push(feature);
    } else {
      for (const element of dataArray) {
        element.avatarUrl = 'https://bootdey.com/img/Content/avatar/avatar1.png';
        if (this.resultDataList.find((test) => test.id === element.id) === undefined) {
          this.resultDataList.push(element);
        }
      }
    }
  }

  selectedResult(item: Client): void {
    this.router.navigate(['/client/' + item.id]).then(() => this.closeSearch());
  }

  closeSearch(): void {
    // @ts-ignore
    this.userInput?.nativeElement.value = '';
    this.resultDataList = [];
    // @ts-ignore
    document.getElementById('autoComplete').style.display = 'none';
    // @ts-ignore
    const container = $('.container');
    container.css('filter', '');
    container.css('-webkit-filter', '');
    $('#blur').removeClass('blury');
    // @ts-ignore
    document.getElementById('closeSearchButton').style.display = 'none';
  }

  blurBackground(): void {
    // @ts-ignore
    document.getElementById('autoComplete').style.display = 'block';
    // @ts-ignore
    const container = $('.container');
    container.css('filter', 'blur(8px)');
    container.css('-webkit-filter', 'blur(8px)');
    container.css('transition', 'filter 0.1s ease-in');
    $('#blur').addClass('blury');
    // @ts-ignore
    document.getElementById('closeSearchButton').style.display = 'block';
  }

  trackByFn(index: number, item: Client): number {
    return item.id;
  }
}
