import { Component } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.html',
  styleUrl: './captcha.css',
})
export class CaptchaComponent {
  challenge: number = 4;
  challengeN1 = '(15×8)−(5²×2)+√400=100';
  challengeN2 = 'Which country won the 2018 FIFA World Cup?';
  challengeN3 = 'Which card means a player is sent off?';
  challengeN4 = [
    '../../assets/challenge4/messi1.png',
    '../../assets/challenge4/messi2.png',
    '../../assets/challenge4/messi3.png',
    '../../assets/challenge4/messi4.png',
    '../../assets/challenge4/messi5.png',
    '../../assets/challenge4/messi6.png',
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
  goBack() {}
}
