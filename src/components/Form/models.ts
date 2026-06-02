/**
 * Defines the contract for an option cycle selector.
 * Adheres to the Interface Segregation Principle.
 */
export interface IOptionCycleSelector<T> {
  options: T[];
  currentIndex: number;
  getCurrentValue(): T;
  cycle(): void;
  getLabel(): string;
}

/**
 * Base abstract class implementing common option cycling behavior.
 * Adheres to Open/Closed and Liskov Substitution Principles.
 */
export abstract class BaseCycleSelector<T> implements IOptionCycleSelector<T> {
  public readonly label: string;
  public readonly options: T[];
  public currentIndex: number;

  constructor(label: string, options: T[], currentIndex: number = 0) {
    this.label = label;
    this.options = options;
    this.currentIndex = currentIndex;
    if (options.length === 0) {
      throw new Error('Options list cannot be empty');
    }
  }

  getCurrentValue(): T {
    return this.options[this.currentIndex];
  }

  cycle(): void {
    this.currentIndex = (this.currentIndex + 1) % this.options.length;
  }

  getLabel(): string {
    return this.label;
  }
}

/**
 * Concrete implementation for the Selection component.
 */
export class SelectionSelector extends BaseCycleSelector<string> {
  constructor(initialIndex = 0) {
    super(
      'SELECTION-COMPONENT',
      [
        'Standard Package',
        'Premium All-Inclusive',
        'Custom Backpacker Tour',
        'Luxury Weekend Escape',
      ],
      initialIndex,
    );
  }
}

/**
 * Concrete implementation for the Dates component.
 */
export class DatesSelector extends BaseCycleSelector<string> {
  constructor(initialIndex = 0) {
    super(
      'DATES-COMPONENT',
      [
        'Thu, Jun 25 - Sun, Jun 28',
        'Mon, Jul 06 - Fri, Jul 10',
        'Fri, Aug 14 - Sun, Aug 16',
        'Sat, Sep 19 - Sat, Sep 26',
      ],
      initialIndex,
    );
  }
}

/**
 * Concrete implementation for the Travelers component.
 */
export class TravelersSelector extends BaseCycleSelector<string> {
  constructor(initialIndex = 0) {
    super(
      'TRAVELERS-COMPONENT',
      ['1 adult', '2 adults, 1 child', '3 adults, 1 room', '4 adults, 2 rooms'],
      initialIndex,
    );
  }
}
