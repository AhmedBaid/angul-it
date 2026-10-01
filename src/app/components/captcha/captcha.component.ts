import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../../core/service/state.service';
import { INITIAL_STATE } from '../../core/constant/constant';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.html',
  imports: [FormsModule],
  styleUrl: './captcha.css',
})
export class CaptchaComponent implements OnInit {
  router = inject(Router);
  stateService = inject(StateService);

  error: string | null = null;
  challenge: number = 1;
  currentAnswer: string = '';
  challengeN1 = '(15×8)−(5²×2)+√400';
  challengeN2 = 'Which country won the 2018 FIFA World Cup ?';
  challengeN3 = 'Which card means a player is sent off ?';
  challengeN4 = [
    '../../assets/challenge4/messi1.png',
    '../../assets/challenge4/messi2.png',
    '../../assets/challenge4/messi3.png',
    '../../assets/challenge4/messi6.png',
    '../../assets/challenge4/messi5.png',
    '../../assets/challenge4/messi4.png',
    '../../assets/challenge4/messi7.png',
    '../../assets/challenge4/messi8.png',
  ];
  challengeN5 = [
    '../../assets/challenge5/cat1.png',
    '../../assets/challenge5/cat2.png',
    '../../assets/challenge5/cat3.png',
    '../../assets/challenge5/cat4.png',
    '../../assets/challenge5/cat5.png',
    '../../assets/challenge5/cat6.png',
    '../../assets/challenge5/cat7.png',
    '../../assets/challenge5/cat8.png',
  ];
  selectedImages: string[] = [];

  ngOnInit(): void {
    let check = this.stateService.checkState();
    if (check) {
      if (this.stateService.getLevel() == 6) {
        this.router.navigate(['/result']);
      }
      this.challenge = this.stateService.getLevel();
    } else {
      this.challenge = 1;
      this.stateService.saveState(INITIAL_STATE);
    }
  }

  checkAnswer(answer: string, challenge: number): void {
    switch (challenge) {
      case 1:
        let answer1: number = parseInt(answer.trim());
        if (answer1 === 90) {
          this.stateService.completeChallenge(1);
          this.challenge = 2;
          this.error = null;
          this.populateAnswer(2);
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 2:
        if (answer.trim().toLocaleLowerCase() === 'france') {
          this.stateService.completeChallenge(2);
          this.challenge = 3;
          this.error = null;
          this.populateAnswer(3);
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 3:
        if (answer.trim().toLocaleLowerCase() === 'red') {
          this.stateService.completeChallenge(3);
          this.challenge = 4;
          this.error = null;
          this.populateAnswer(4);
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 4:
        if (
          this.selectedImages.includes('../../assets/challenge4/messi7.png') &&
          this.selectedImages.length === 1
        ) {
          this.stateService.completeChallenge(4);
          this.challenge = 5;
          this.error = null;
          this.selectedImages = [];
          this.populateAnswer(5);
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 5:
        if (
          this.selectedImages.includes('../../assets/challenge5/cat3.png') &&
          this.selectedImages.includes('../../assets/challenge5/cat6.png') &&
          this.selectedImages.includes('../../assets/challenge5/cat7.png') &&
          this.selectedImages.length === 3
        ) {
          this.stateService.completeChallenge(5);
          this.router.navigate(['/result']);
          this.error = null;
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      default:
        break;
    }
  }

  goBack(): void {
    const target = this.stateService.goBack();
    if (target !== null) {
      this.challenge = target;
      this.error = null;
      this.selectedImages = [];
      this.currentAnswer = '';
      this.populateAnswer(target);
    }
  }

  populateAnswer(challengeId: number): void {
    if (!this.stateService.isChallengeCompleted(challengeId)) {
      this.currentAnswer = '';
      return;
    }

    switch (challengeId) {
      case 1:
        this.currentAnswer = '90';
        break;
      case 2:
        this.currentAnswer = 'france';
        break;
      case 3:
        this.currentAnswer = 'red';
        break;
      case 4:
        this.selectedImages = ['../../assets/challenge4/messi7.png'];
        break;
      case 5:
        this.selectedImages = [
          '../../assets/challenge5/cat3.png',
          '../../assets/challenge5/cat6.png',
          '../../assets/challenge5/cat7.png',
        ];
        break;
      default:
        break;
    }
  }

  toggleSelect(img: string): void {
    const index = this.selectedImages.indexOf(img);
    if (index === -1) {
      this.selectedImages.push(img);
    } else {
      this.selectedImages.splice(index, 1);
    }
  }
}
