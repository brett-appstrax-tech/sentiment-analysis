import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  constructor(private firestore: AngularFirestore) { 
  }

  getGraphDataAndLabels(messages: Message[]) {
    let labels = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    let data = [];
    for (let i = 0; i < labels.length-1; i++) {
      data.push(messages.filter(message => (message.score > labels[i] && message.score <= labels[i+1])).length)
    }
    data.push(0);
    return {
      graphData: [{
        data: data,
        label: "Message scores"
      }],
      graphLabels: labels
    }
  }

  getMessages() {
    return this.firestore.collection('messages').snapshotChanges();
  }

  createMessage(message: Message) {
    return this.firestore.collection('messages').add({...message});
  }

  // Included for completeness, not used.
  updateMessage(message: Message): void {
    this.firestore.doc('messages/' + message.id).update(message);
  }

  // Included for completeness, not used.
  deleteMessage(message: Message): void {
    this.firestore.doc('messages/' + message.id).delete();
  }

}
