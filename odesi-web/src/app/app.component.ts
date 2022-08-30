import { Component } from '@angular/core';
import {OdesiService} from "./odesi.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private odesiService: OdesiService) { }
  title = 'odesi-web';
  status = 'DOWN';

  ngOnInit() {
    this.odesiService
        .getStatus()
        .subscribe(
            data => {
              console.log('Data ');
              console.log(data);
              console.log(JSON.stringify(data));
            },
            error => {
              console.log(error);
            },
            () => {
              console.log("complete")
            });

  }
}
