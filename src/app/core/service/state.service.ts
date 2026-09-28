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
    this.state = this.loadState();
  }

  getProgress(): ChallengeProgress {
    return { ...this.state, completedChallenges: [...this.state.completedChallenges] };
  }

  getLevel(): number {
    return this.state.level;
  }

  getCompletedChallenges(): number[] {
    return [...this.state.completedChallenges];
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

    this.saveState();
    return true;
  }

  goBack(): number | null {
    if (this.state.level <= MIN_LEVEL) return null;

    const targetLevel = this.state.level - 1;
    if (!this.state.completedChallenges.includes(targetLevel)) return null;

    this.state.level = targetLevel;
    this.saveState();
    return targetLevel;
  }

  resetProgress(): void {
    this.state = { level: MIN_LEVEL, completedChallenges: [] };
    this.saveState();
  }

  isAllCompleted(): boolean {
    return this.state.completedChallenges.length === MAX_LEVEL;
  }

  public loadState(): ChallengeProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { level: MIN_LEVEL, completedChallenges: [] };
      }

      const parsed = JSON.parse(raw);
      return this.sanitizeState(parsed);
    } catch {
      return { level: MIN_LEVEL, completedChallenges: [] };
    }
  }

  private sanitizeState(raw: unknown): ChallengeProgress {
    if (typeof raw !== 'object' || raw === null) {
      return { level: MIN_LEVEL, completedChallenges: [] };
    }

    const obj = raw as Record<string, unknown>;
    const level = this.sanitizeLevel(obj['level']);
    const completed = this.sanitizeCompleted(obj['completedChallenges'], level);

    return { level, completedChallenges: completed };
  }

  private sanitizeLevel(value: unknown): number {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      return MIN_LEVEL;
    }
    if (value < MIN_LEVEL || value > MAX_LEVEL + 1) {
      return MIN_LEVEL;
    }
    return value;
  }

  private sanitizeCompleted(value: unknown, level: number): number[] {
    if (!Array.isArray(value)) {
      return [];
    }

    const valid: number[] = [];
    const seen = new Set<number>();

    for (const item of value) {
      if (!Number.isInteger(item)) continue;
      const id = item as number;
      if (id < MIN_LEVEL || id > MAX_LEVEL) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      valid.push(id);
    }

    valid.sort((a, b) => a - b);

    for (let i = MIN_LEVEL; i < level && i <= MAX_LEVEL; i++) {
      if (!seen.has(i)) {
        return valid.filter((id) => id < i);
      }
    }

    const filtered = valid.filter((id) => id < level);

    return filtered;
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
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
      if (!this.checkLevel) {
        return false;
      }
    } catch {
      return false;
    }
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

    if (value.length != level - 1) {
      return false;
    }
    for (const item of value) {
      if (!Number.isInteger(item)) {
        return false;
      }
      const id = item as number;
      if (id < MIN_LEVEL || id > MAX_LEVEL) return false;
    }
    for (let i:=) {
    }
    return true;
  }
}
