import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MessageUpdatePage } from './message-update.page';

const routes: Routes = [
  {
    path: 'message-update',
    component: MessageUpdatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MessageUpdatePage],
  entryComponents: [
    MessageUpdatePage
  ]
})
export class MessageUpdatePageModule {}
