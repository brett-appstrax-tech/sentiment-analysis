import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message';
import { Graph } from '../models/graph';
import { ModalController } from '@ionic/angular';
import { SentimentVoteService } from '../services/sentiment-vote.service';
import { AlertController } from '@ionic/angular';
import { Color } from 'ng2-charts';

import { MessageUpdatePage } from '../modals/message-update/message-update.page';
    
declare var require: any;
const Sentiment = require('sentiment');

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('scrollBottom', {read: "scrollBottom", static: false}) private scrollBottom: ElementRef;

  graph: Graph;
  graphDelimeter = 10;

  sentiment = new Sentiment();
  messages: Message[];
  message: Message;
  filteredMessages: Message[];

  threshold: number;

  lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];

  constructor(private messageService: MessageService, private modalController: ModalController, 
    private sentimentVoteService: SentimentVoteService, private alertController: AlertController) {
    this.message = new Message();
    this.messages = [];
    this.graph = new Graph('bar');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.filteredMessages = [];
    this.getMessages();
    this.updateThreshold();
  }

  getMessages() {
    this.messageService.getMessages().subscribe(data => {
      this.messages = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Message;
      });
      this.updateGraph(this.messageService.setbarGraph(this.messages, this.graphDelimeter), 'bar', 'Message Scores');
      console.log({messages: this.messages});
    });
  }

  updateThresholdCallBack = (threshold) => {
    this.threshold = threshold;
  };

  updateThreshold() {
    this.sentimentVoteService.getThreshold(this.updateThresholdCallBack);
  }

  updateGraph(data, type, title){
    this.graph.data = [];
    this.graph.data.push(data);
    this.graph.labels = data.xAxis;
    this.graph.type = type;
    this.graph.title = title;
  }

  formatDate(newDate) {
    const date = newDate.slice(0, newDate.indexOf("T"));
    const time = newDate.slice(newDate.indexOf("T") + 1, newDate.indexOf("."));
    return date + " " + time;
  }

  create() {
    this.message.dateCreated = this.formatDate(new Date().toISOString());
    this.message.score = this.sentiment.analyze(this.message.message).comparative;
    if (this.message.score >= this.threshold) {
      this.messageService.createMessage(this.message);
      this.getMessages();
    }
    else {
      this.alertController.create({
        header: "Sorry",
        subHeader: "Please enter a message which is more positive",
        message: "The community has spoken and demands a score greater than " + this.threshold.toString(),
        buttons: ["OK"]
      }).then(alert => alert.present());
    }
  }

  chartClicked({ event, active }: { event: MouseEvent, active: any[] }): void {
    let index = (active[0]._index);
    console.log({index: index});
    this.filterMessages(index);
  }  

  filterMessages(index) {
    this.filteredMessages = [];
    let lowerBound = -5 + index * (10 / this.graphDelimeter);
    let upperBound = -5 + (index + 1) * (10 / this.graphDelimeter);
    this.messages.forEach(message => { 
      if (message.score > lowerBound && message.score <= upperBound) {
        this.filteredMessages.push(message);
      }
    });
    this.scrollToBottom();
    window.scrollTo(0,document.body.scrollHeight);
    console.log({filteredMessages: this.filteredMessages});
  }

  scrollToBottom(): void {
    try {
        this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch(err) { }
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
