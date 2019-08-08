import { Injectable } from '@angular/core';
import { SentimentThresholdVote } from '../models/sentiment-threshold-vote';
import { AngularFirestore } from '@angular/fire/firestore';
import { GraphData } from '../models/graph-data';

@Injectable({
  providedIn: 'root'
})
export class SentimentVoteService {

  numberOfVotes = 5;
  graphData: GraphData;

  constructor(private firestore: AngularFirestore) { 
    this.graphData = new GraphData();
  }

  setGraphData(votes: SentimentThresholdVote[]) {
    this.graphData.data = [];
    this.graphData.xAxis = [];
    this.graphData.label = "Recent Threshold Votes";
    if (votes.length > this.numberOfVotes) {
      let i = 0;
      let counter = 0;
      votes.forEach(vote => {
        if (i >= (votes.length - this.numberOfVotes)) {
          counter++;
          this.graphData.data.push(vote.threshold);
          this.graphData.xAxis.push(counter.toString());
        }
        i++;
      });
    }
    else {
      let counter = 0;
      votes.forEach(vote => {
        counter++;
        this.graphData.data.push(vote.threshold);
        this.graphData.xAxis.push(counter.toString());
      });
    }
    return this.graphData;
  }

  getThreshold(callback) {
    this.getVotes().subscribe(data => {
      let votes = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as SentimentThresholdVote;
      });
      console.log({votes: votes});      
      callback(this.calculateThreshold(votes));
    });
  }

  calculateThreshold(votes) {
    let threshold = 0;
    let i = 0;
    if (votes.length > this.numberOfVotes) {
      votes.forEach(vote => {
        if (i >= (votes.length - this.numberOfVotes)) {
          threshold = threshold + (vote.threshold / this.numberOfVotes);
        }
        i++;
      });
    }
    else {
      votes.forEach(vote => {
          threshold = threshold + (vote.threshold / votes.length);
      });
    }
    return threshold;
  }

  getVotes() {
    return this.firestore.collection('sentiment-vote').snapshotChanges();
  }

  createVote(vote: SentimentThresholdVote) {
    return this.firestore.collection('sentiment-vote').add({...vote});
  }

}
