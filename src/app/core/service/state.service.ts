import { Injectable } from '@angular/core';
import { ChallengeProgress } from '../models/models';

const STORAGE_KEY = 'captchaProgress';
const MIN_LEVEL = 1;
const MAX_LEVEL = 5;
const VALID_CHALLENGE_IDS = [1, 2, 3, 4, 5];

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
        return { level: MIN_LEVEL, completedChallenges: [] };
      }

      const parsed = JSON.parse(raw);
      return { level: parsed.level, completedChallenges: parsed.completedChallenges };
    } catch {
      return { level: MIN_LEVEL, completedChallenges: [] };
    }
  }

  getLevel(): number {
    return this.state.level;
  }

  completeChallenge(challengeId: number): boolean {
    if (challengeId !== this.state.level) return false;
    if (!VALID_CHALLENGE_IDS.includes(challengeId)) return false;
    if (this.state.completedChallenges.includes(challengeId)) return false;

    this.state.completedChallenges.push(challengeId);
    this.state.completedChallenges.sort((a, b) => a - b);

    if (challengeId >= MAX_LEVEL) {
      this.state.level = MAX_LEVEL + 1;
    } else {
      this.state.level = challengeId + 1;
    }

    this.saveState(this.state);
    return true;
  }

  goBack(): number | null {
    if (this.state.level <= MIN_LEVEL) return null;

    const targetLevel = this.state.level - 1;
    if (!this.state.completedChallenges.includes(targetLevel)) return null;

    this.state.level = targetLevel;
    this.state.completedChallenges = this.state.completedChallenges.filter(
      (id) => id < targetLevel,
    );
    this.saveState(this.state);
    return targetLevel;
  }

  resetProgress(): void {
    this.state = { level: MIN_LEVEL, completedChallenges: [] };
    this.saveState(this.state);
  }

  isAllCompleted(): boolean {
    return this.checkState() && this.state.level == MAX_LEVEL + 1;
  }

  public saveState(state?: ChallengeProgress): void {
    const stateToSave = state || this.state;
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

      const id = item as number;

      if (id < MIN_LEVEL || id > MAX_LEVEL) {
        return false;
      }
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
}
