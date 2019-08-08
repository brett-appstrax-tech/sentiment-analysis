import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ChartsModule } from 'ng2-charts';
import { MessageUpdatePageModule } from '../modals/message-update/message-update.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChartsModule,
    MessageUpdatePageModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
