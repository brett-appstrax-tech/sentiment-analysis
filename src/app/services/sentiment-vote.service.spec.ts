import { TestBed } from '@angular/core/testing';

import { SentimentVoteService } from './sentiment-vote.service';

describe('SentimentVoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SentimentVoteService = TestBed.get(SentimentVoteService);
    expect(service).toBeTruthy();
  });
});
