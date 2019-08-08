import { Component, OnInit } from '@angular/core';
import { SentimentThresholdVote } from '../models/sentiment-threshold-vote';
import { SentimentVoteService } from '../services/sentiment-vote.service';
import { AlertController } from '@ionic/angular';
import { Graph } from '../models/graph';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  threshold: number;
  sentimentThresholdVote: SentimentThresholdVote;
  sentimentThresholdVotes: SentimentThresholdVote[];
  graph: Graph;

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

  constructor(private sentimentVoteService: SentimentVoteService, private alertController: AlertController) {
    this.sentimentThresholdVote = new SentimentThresholdVote();
    this.graph = new Graph('line');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.updateThreshold();
    this.getGraphData();
  }

  updateThresholdCallBack = (threshold) => {
    this.threshold = threshold;
  };

  updateThreshold() {
    this.sentimentVoteService.getThreshold(this.updateThresholdCallBack);
  }

  getGraphData() {
    this.sentimentVoteService.getVotes().subscribe(data => {
      this.sentimentThresholdVotes = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as SentimentThresholdVote;
      });
      this.updateGraph(this.sentimentVoteService.setGraphData(this.sentimentThresholdVotes), 'line', 'Recent Threshold Votes');
      console.log({sentimentThresholdVotes: this.sentimentThresholdVotes});
    });
  }

  updateGraph(data, type, title){
    this.graph.data = [];
    this.graph.data.push(data);
    this.graph.labels = data.xAxis;
    this.graph.type = type;
    this.graph.title = title;
  }

  create() {
    if (this.sentimentThresholdVote.threshold >= -5 && this.sentimentThresholdVote.threshold <= 5) {
      this.sentimentThresholdVote.dateCreated = new Date().toISOString();
      this.sentimentVoteService.createVote(this.sentimentThresholdVote);
      this.updateThreshold();
      this.getGraphData();
    }
    else {
      this.alertController.create({
        header: "Sorry",
        subHeader: "Please ensure that threshold is with the correct values",
        message: "Threshold must be between -5 and 5",
        buttons: ["OK"]
      }).then(alert => alert.present());
    }
  }

}
