import { Injectable } from '@angular/core';
import { ChallengeProgress } from '../models/models';
import {
  INITIAL_STATE,
  MAX_LEVEL,
  MIN_LEVEL,
  STORAGE_KEY,
  VALID_CHALLENGE_IDS,
} from '../constant/constant';

@Injectable({ providedIn: 'root' })
export class StateService {
  private state: ChallengeProgress;

  constructor() {
    this.state = this.getState();
  }
  getState(): ChallengeProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return INITIAL_STATE;
      }

      const parsed = JSON.parse(raw);
      return { level: parsed.level, completedChallenges: parsed.completedChallenges };
    } catch {
      return INITIAL_STATE;
    }
  }

  completeChallenge(challengeId: number): boolean {
    if (challengeId !== this.state.level) return false;
    if (!VALID_CHALLENGE_IDS.includes(challengeId)) return false;
    if (!this.state.completedChallenges.includes(challengeId)) {
      this.state.completedChallenges.push(challengeId);
    }

    this.state.completedChallenges.sort((a, b) => a - b);

    this.state.level = challengeId + 1;
    this.saveState(this.state);
    console.log('State saved to localStorage: after saving', this.state);
    return true;
  }

  goBack(): number | null {
    if (this.state.level <= MIN_LEVEL) {
      return null;
    }

    this.state.level = this.state.level - 1;
    this.saveState(this.state);
    return this.state.level;
  }

  isChallengeCompleted(challengeId: number): boolean {
    return this.state.completedChallenges.includes(challengeId);
  }

  resetProgress(): void {
    this.state = INITIAL_STATE;
    this.saveState(this.state);
  }

  isAllCompleted(): boolean {
    return this.checkState() && this.state.level == MAX_LEVEL + 1;
  }

  public saveState(stateToSave: ChallengeProgress): void {
    this.state = stateToSave;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Failed to save state to localStorage', err);
    }
  }

  public checkState(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return false;
      }

      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) {
        return false;
      }
      if (
        !this.checkLevel(parsed.level) ||
        !this.checkCompleted(parsed.completedChallenges, parsed.level)
      ) {
        return false;
      }
      this.state = parsed as ChallengeProgress;
    } catch {
      return false;
    }
    return true;
  }
  private checkLevel(value: unknown): boolean {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      return false;
    }
    if (value < MIN_LEVEL || value > MAX_LEVEL + 1) {
      return false;
    }
    return true;
  }
  private checkCompleted(value: unknown, level: number): boolean {
    if (!Array.isArray(value)) {
      return false;
    }

    if (value.length !== level - 1) {
      return false;
    }
    value.sort((a, b) => a - b);
    for (const item of value) {
      if (!Number.isInteger(item)) {
        return false;
      }
      if (!VALID_CHALLENGE_IDS.includes(item)) return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (value[i] !== i + 1) {
        return false;
      }
    }

    return true;
  }
  removeState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to remove state from localStorage', err);
    }
  }
  getLevel(): number {
    return this.state.level;
  }
}
