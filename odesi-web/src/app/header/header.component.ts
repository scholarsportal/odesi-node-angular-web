import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import ConfigJson from '../../assets/config.json';
import { OdesiService } from '../odesi.service';
import {AppRoutingModule} from "../app-routing.module";

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
    // this.odesiService.getTopicClassifications('')
    //     //"(AB=test)AND(coll:cora)&options=odesi-opts2&format=json")
    //     .subscribe(
    //         data => {
    //           console.log('Data ');
    //           console.log(data);
    //         },
    //         error => {
    //           console.log(error);
    //         },
    //         () => {
    //           console.log("complete")
    //
    //         });

    //window.open('/classifications', '_blank');

    //window.open(ConfigJson.baseUrl + "/dataverse/odesi", "_blank");
  }

  goToContact() {

  }

  goToMyList() {

  }
}
