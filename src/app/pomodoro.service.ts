import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PomodoroService {
  private time: number;
  private timerStarted: boolean;
  private timerActive: boolean;
  private observableTimer: Observable<any> | undefined;
  // For observable to keep track of and clear interval
  private timer: any;
  // Variables for tracking pomodoro stats
  private pomodoroStep: number;
  private cyclesCompleted: number;
  private totalTime: number;
  private totalStudyTime: number;

  constructor() { 
    // Set initial time equal to 25 minutes
    this.time = 1500;
    this.timerActive = false;
    this.observableTimer = undefined;
    this.timerStarted = false;
    this.pomodoroStep = 1;
    this.cyclesCompleted = 0;
    this.totalTime = 0;
    this.totalStudyTime = 0;
  }

  clickTimer(): void {
    if (!this.timerActive){
      this.timerStarted = true;
      this.observableTimer = new Observable((observer) => {
        this.timer = setInterval(() => {
          if(this.time - 1 !== -1){
            this.time -= 1;
          }
          observer.next(this.time);
        }, 1000)

        return () => {
          clearInterval(this.timer);
        }
      })
      this.timerActive = !this.timerActive;
    }
    else {
      this.timerActive = !this.timerActive;
    }
  }

  setTimer(setTime: number): void {
    this.time = setTime;
    this.reset();
  }

  private reset(): void {
    this.timerStarted = false;
    this.timerActive = false;
    this.observableTimer = undefined;
  }
  
  // Move to the next step
  nextStep(): void {
    // Add one to the step
    this.pomodoroStep = this.pomodoroStep + 1;
    if(this.pomodoroStep > 8){
      this.pomodoroStep = 1;
      this.cyclesCompleted = this.cyclesCompleted + 1;
    }

    // Clear interval of previous timer
    clearInterval(this.timer);

    // Reset the timer accordingly depending on the step number
    // Long break
    if (this.pomodoroStep === 8){
      this.time = 1800;
    }
    // Short break
    else if(this.pomodoroStep % 2 === 0){
      this.time = 300;
    }
    // Pomodoro
    else {
      this.time = 1500;
    }
    this.reset();
  }

  //Increment time
  incrementStudyTime(): void {
    this.totalStudyTime = this.totalStudyTime + 1;
  }
  incrementTotalTime(): void {
    this.totalTime = this.totalTime + 1;
  }

  // getter functions
  getTimerActive(): boolean {
    return this.timerActive;
  }

  getObservable(): Observable<any> | undefined {
    return this.observableTimer;
  }

  getTime(): number {
    return this.time;
  }

  getTimerStarted(): boolean {
    return this.timerStarted;
  }

  getStepNumber(): number {
    return this.pomodoroStep;
  }

  getCycleNumber(): number {
    return this.cyclesCompleted
  }

  getTotalStudyTime(): number {
    return this.totalStudyTime;
  }

  getTotalTime(): number {
    return this.totalTime;
  }

  getTimeMinutes(): number{
    return Math.floor(this.time / 60);
  }

  getTimeSeconds(): number {
    return this.time % 60
  }
}
