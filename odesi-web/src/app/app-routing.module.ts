import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TopicClassificationsComponent} from "./topic-classifications/topic-classifications.component";


const routes: Routes = [
  {path: 'classifications' , component: TopicClassificationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
