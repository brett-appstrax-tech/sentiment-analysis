import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../models/message';
import { GraphData } from '../models/graph-data';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  barGraph: GraphData;

  constructor(private firestore: AngularFirestore) { 
    this.barGraph = new GraphData();
  }

  setbarGraph(messages: Message[], delimeter) {
    this.barGraph.label = "Message Scores"
    this.barGraph.xAxis = [];
    this.barGraph.data = [];
    for (let i = 0; i < delimeter; i++) {
      let lowerBound = -5 + i * (10 / delimeter);
      let upperBound = -5 + (i + 1) * (10 / delimeter);
      let midPoint = (upperBound + lowerBound) / 2;
      this.barGraph.xAxis.push(midPoint.toString());
      this.barGraph.data.push(0);
      messages.forEach(message => { 
        if (message.score > lowerBound && message.score <= upperBound) {
          this.barGraph.data[i]++;
        }
      });
    }
    return this.barGraph;
  }

  getMessages() {
    return this.firestore.collection('messages').snapshotChanges();
  }

  createMessage(message: Message) {
    return this.firestore.collection('messages').add({...message});
  }

  updateMessage(message: Message): void {
    this.firestore.doc('messages/' + message.id).update(message);
  }

  deleteMessage(message: Message): void {
    this.firestore.doc('messages/' + message.id).delete();
  }

}
