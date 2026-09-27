import { Injectable } from '@angular/core';

export interface ChallengeProgress {
  level: number;
  completedChallenges: number[];
}

const STORAGE_KEY = 'angul_it_challenge_progress_v1';
const MIN_LEVEL = 1;
const MAX_LEVEL = 5;
const VALID_CHALLENGE_IDS = [1, 2, 3, 4, 5];

@Injectable({ providedIn: 'root' })
export class StateService {
  private state: ChallengeProgress;

  constructor() {
    this.state = this.loadState();
  }

  getProgress(): Readonly<ChallengeProgress> {
    return { ...this.state, completedChallenges: [...this.state.completedChallenges] };
  }

  getLevel(): number {
    return this.state.level;
  }

  getCompletedChallenges(): number[] {
    return [...this.state.completedChallenges];
  }

  isCompleted(challengeId: number): boolean {
    return this.state.completedChallenges.includes(challengeId);
  }

  /**
   * Record a challenge as completed. Only allows completing the current level.
   * Returns true if the completion was valid and applied.
   */
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

  /**
   * Navigate back to a previous challenge. Only allows going back to
   * challenges that have been completed (or the current one).
   */
  goBack(): number | null {
    if (this.state.level <= MIN_LEVEL) return null;

    const targetLevel = this.state.level - 1;
    if (!this.state.completedChallenges.includes(targetLevel)) return null;

    this.state.level = targetLevel;
    this.saveState();
    return targetLevel;
  }

  /**
   * Reset all progress. Used when corrupted state is detected.
   */
  resetProgress(): void {
    this.state = { level: MIN_LEVEL, completedChallenges: [] };
    this.saveState();
  }

  /**
   * Check if all challenges are completed.
   */
  isAllCompleted(): boolean {
    return this.state.completedChallenges.length === MAX_LEVEL;
  }

  private loadState(): ChallengeProgress {
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
    const level = this.sanitizeLevel(obj.level);
    const completed = this.sanitizeCompleted(obj.completedChallenges, level);

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

    // Enforce progression: all challenges before the current level must be completed
    for (let i = MIN_LEVEL; i < level && i <= MAX_LEVEL; i++) {
      if (!seen.has(i)) {
        // Missing prerequisite — clamp level down to the first missing challenge
        return valid.filter((id) => id < i);
      }
    }

    // Remove any challenge at or above the current level
    const filtered = valid.filter((id) => id < level);

    return filtered;
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // localStorage may be unavailable (private mode, quota exceeded)
      // Progress will be kept in memory only
    }
  }
}
