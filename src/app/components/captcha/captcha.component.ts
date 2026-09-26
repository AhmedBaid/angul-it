import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.html',
  imports: [FormsModule],
  styleUrl: './captcha.css',
})
export class CaptchaComponent {
  router = inject(Router);
  error: string | null = null;
  challenge: number = 1;
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

  checkAnswer(answer: string, challenge: number) {
    switch (challenge) {
      case 1:
        let answer1: number = parseInt(answer.trim());
        if (answer1 === 100) {
          this.challenge = 2;
          this.error = null;
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 2:
        if (answer.trim().toLocaleLowerCase() === 'france') {
          this.challenge = 3;
          this.error = null;
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 3:
        if (answer.trim().toLocaleLowerCase() === 'red') {
          this.challenge = 4;
          this.error = null;
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 4:
        if (
          this.selectedImages.includes('../../assets/challenge4/messi7.png') &&
          this.selectedImages.length === 1
        ) {
          this.challenge = 5;
          this.error = null;
        } else {
          this.error = 'Incorrect answer. Please try again.';
        }
        break;
      case 5:
        if (
          this.selectedImages.includes('../../assets/challenge5/cat3.png') &&
          this.selectedImages.includes('../../assets/challenge5/cat6.png') &&
          this.selectedImages.includes('../../assets/challenge5/cat7.png')
        ) {
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
  goBack() {
    this.challenge -= 1;
  }
  toggleSelect(img: string) {
    const index = this.selectedImages.indexOf(img);
    if (index === -1) {
      this.selectedImages.push(img);
    } else {
      this.selectedImages.splice(index, 1);
    }
  }
}
