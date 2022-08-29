import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import ConfigJson from '../../assets/config.json';
import { OdesiService } from '../odesi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  translate: TranslateService;
  constructor(private odesiService: OdesiService,
      private translatePar: TranslateService) {
    this.translate = translatePar;
    this.translate.addLangs(['English', 'Français']);
    this.translate.setDefaultLang('English');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/English|Français/) ? browserLang : 'English');
  }

  ngOnInit(): void {
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/English|Français/) ? browserLang : 'English');





  }

  goToDataverse() {
    console.log("go to dataverse")


    //window.open(ConfigJson.baseUrl + "/dataverse/odesi", "_blank");
  }

  goToContact() {

  }

  goToMyList() {

  }
}
