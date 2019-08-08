import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message';
import { ModalController } from '@ionic/angular';

import { MessageUpdatePage } from '../modals/message-update/message-update.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  messages: Message[];
  message: Message;

  constructor(private messageService: MessageService, private modalController: ModalController) {
    this.message = new Message();
    this.messages = [];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getMessages();
  }

  getMessages() {
    this.messageService.getMessages().subscribe(data => {
      this.messages = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Message;
      });
    });
  }

  async update(message) {
    const modal = await this.modalController.create({
      component: MessageUpdatePage,
      componentProps: {
        'message': message,
      }
    });
    modal.onDidDismiss().then((detail: any) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
      }
      this.getMessages();
    });
    return await modal.present();
  }

}
