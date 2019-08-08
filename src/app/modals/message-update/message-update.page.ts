import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Message } from '../../models/message'
import { MessageService } from '../../services/message.service';
import { ModalController } from '@ionic/angular';

declare var require: any;
const Sentiment = require('sentiment');

@Component({
  selector: 'app-message-update',
  templateUrl: './message-update.page.html',
  styleUrls: ['./message-update.page.scss'],
})
export class MessageUpdatePage implements OnInit {

  @Input() message: Message;
  sentiment = new Sentiment();
  
  constructor(private navParams: NavParams, private messageService: MessageService, private modalCtrl: ModalController) { 
    this.message = this.navParams.get('message');
    console.log({message: this.message});
  }

  ngOnInit() {}

  update() {
    this.message.score = this.sentiment.analyze(this.message.message).comparative;
    this.messageService.updateMessage(this.message);
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  delete() {
    this.messageService.deleteMessage(this.message);
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
