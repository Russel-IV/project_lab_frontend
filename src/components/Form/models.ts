import { staysData } from '@/lib/staysData';

/**
 * Defines the contract for a selection strategy.
 * Adheres to the Interface Segregation Principle.
 */
export interface ISelectionStrategy {
  getLabel(): string;
  getOptions(): string[];
  getNextValue(currentValue: string): string;
}

/**
 * Base abstract class implementing common stateless option behaviors.
 * Adheres to Open/Closed and Liskov Substitution Principles.
 */
export abstract class BaseSelectionStrategy implements ISelectionStrategy {
  public readonly label: string;
  public readonly options: string[];

  constructor(label: string, options: string[]) {
    this.label = label;
    this.options = options;
    if (options.length === 0) {
      throw new Error('Options list cannot be empty');
    }
  }

  getLabel(): string {
    return this.label;
  }

  getOptions(): string[] {
    return this.options;
  }

  getNextValue(currentValue: string): string {
    const currentIndex = this.options.indexOf(currentValue);
    // If current value is not in options list or cleared, start at first option
    if (currentIndex === -1) {
      return this.options[0];
    }
    return this.options[(currentIndex + 1) % this.options.length];
  }
}

/**
 * Strategy implementation for the Selection component.
 */
export class SelectionStrategy extends BaseSelectionStrategy {
  constructor() {
    super(
      'SELECTION-COMPONENT',
      staysData.map((stay) => stay.title),
    );
  }
}

/**
 * Strategy implementation for the Dates component.
 */
export class DatesStrategy extends BaseSelectionStrategy {
  constructor() {
    super('DATES-COMPONENT', [
      'Thu, Jun 25 - Sun, Jun 28',
      'Mon, Jul 06 - Fri, Jul 10',
      'Fri, Aug 14 - Sun, Aug 16',
      'Sat, Sep 19 - Sat, Sep 26',
    ]);
  }
}

/**
 * Strategy implementation for the Travelers component.
 */
export class TravelersStrategy extends BaseSelectionStrategy {
  constructor() {
    super('TRAVELERS-COMPONENT', [
      '1 adult',
      '2 adults, 1 child',
      '3 adults, 1 room',
      '4 adults, 2 rooms',
    ]);
  }
}
