import { Component } from '@angular/core';
import { PomodoroService } from '../pomodoro.service';
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent {
  time: number;
  timerActive: boolean;
  subscription: Subscription | undefined;
  timerStarted: boolean;

  // Two way data binding for getting timer minutes and seconds
  newTimerMinutes?: number | undefined;
  newTimerSeconds?: number | undefined;

  // statistic values
  cycleNumber : number;
  totalStudyTime: number;
  totalTime: number;
  stepNumber: number;
  hideStats: boolean;

  // enum for current label
  stepLabel: string[];
  
  constructor(private pomodoroTimer: PomodoroService){
    this.time = this.pomodoroTimer.getTime();
    this.timerActive = false;
    this.timerStarted = this.pomodoroTimer.getTimerStarted();
    this.cycleNumber = 0;
    this.totalStudyTime = 0;
    this.totalTime = 0;
    this.stepNumber = 1;
    this.newTimerMinutes = 25;
    this.newTimerSeconds = 0;
    this.stepLabel = [
      "Pomodoro 1",
      "Break",
      "Pomodoro 2",
      "Break",
      "Pomodoro 3",
      "Break",
      "Pomodoro 4",
      "Long Break",
    ]
    this.hideStats = false;
  }
  
  timerClick(): void {
    // Click the timer
    this.pomodoroTimer.clickTimer();
    // Fetch if the timer has been started (which should be true after the previous call)
    this.timerStarted = this.pomodoroTimer.getTimerStarted();
    // Fetch if the timer is active (depends on whether it was resumed or paused)
    this.timerActive = this.pomodoroTimer.getTimerActive()
    // If the timer is active then that means an observable was made and that we can fetch an observable using the getObservable method in the pomodoro service
    if(this.timerActive){
      const observable = this.pomodoroTimer.getObservable();
      // Update the time whenever the observable passes its decrement value to next()
      this.subscription = observable?.subscribe({
        next: (time: number) => {
          this.time = time;
          if (this.stepNumber % 2 === 1){
            this.pomodoroTimer.incrementStudyTime();
          }
          this.pomodoroTimer.incrementTotalTime();
          this.totalStudyTime = this.pomodoroTimer.getTotalStudyTime();
          this.totalTime = this.pomodoroTimer.getTotalTime();
        }
      })
    }
    else {
      // Unsubscribe to the observable since we no longer need it to count down since we are pausing it
      this.subscription?.unsubscribe();
    }
  }

  // For formatting the timer
  formatDoubleDigits(input: any): void{
    if(input.value.length === 1){
      input.value = '0' + input.value
    }
  }

  // For clicking the start button
  clickSetBtn(): void {
    // If the timer is currently active
    // Stop the timer
    // unsubscribe from the observable
    
    // Grab total amount of seconds
    // Convert minutes to seconds and then add the other seconds
    // Make sure the time is properly set first
    if (this.newTimerMinutes != undefined && this.newTimerSeconds != undefined){
      console.log("hello");
      this.subscription?.unsubscribe();
      const totalSeconds: number = (this.newTimerMinutes * 60) + this.newTimerSeconds;
      
      // Set new timer values in service
      this.pomodoroTimer.setTimer(totalSeconds);
      // Get the new timer values
      this.time = this.pomodoroTimer.getTime();
      this.timerActive = false;
      this.timerStarted = this.pomodoroTimer.getTimerStarted();
    }
  }

  resetToPomodoro(): void {
    this.newTimerMinutes = 25;
    this.newTimerSeconds = 0;
    this.clickSetBtn();
  }

  clickNext(): void {
    // Add one to step
    this.pomodoroTimer.nextStep();
    // Get the new statistic values
    this.stepNumber = this.pomodoroTimer.getStepNumber();
    this.cycleNumber = this.pomodoroTimer.getCycleNumber();
    this.totalStudyTime = this.pomodoroTimer.getTotalStudyTime();
    this.totalTime = this.pomodoroTimer.getTotalTime();
    // reset the time
    this.newTimerMinutes = this.pomodoroTimer.getTimeMinutes();
    this.newTimerSeconds = this.pomodoroTimer.getTimeSeconds();
    this.time = this.pomodoroTimer.getTime();
    console.log(this.time);
    this.timerActive = this.pomodoroTimer.getTimerActive();
    this.timerStarted = this.pomodoroTimer.getTimerStarted();
  }

}
