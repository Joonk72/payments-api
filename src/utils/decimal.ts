/**
 * Utility functions for decimal calculations
 * Ensures precision in financial calculations
 */

export class Decimal {
  private value: number;

  constructor(value: number | string) {
    this.value = typeof value === 'string' ? parseFloat(value) : value;
  }

  /**
   * Add another decimal value
   */
  add(other: Decimal | number): Decimal {
    const otherValue = typeof other === 'number' ? other : other.value;
    return new Decimal(this.value + otherValue);
  }

  /**
   * Subtract another decimal value
   */
  subtract(other: Decimal | number): Decimal {
    const otherValue = typeof other === 'number' ? other : other.value;
    return new Decimal(this.value - otherValue);
  }

  /**
   * Multiply by another decimal value
   */
  multiply(other: Decimal | number): Decimal {
    const otherValue = typeof other === 'number' ? other : other.value;
    return new Decimal(this.value * otherValue);
  }

  /**
   * Divide by another decimal value
   */
  divide(other: Decimal | number): Decimal {
    const otherValue = typeof other === 'number' ? other : other.value;
    if (otherValue === 0) {
      throw new Error('Division by zero');
    }
    return new Decimal(this.value / otherValue);
  }

  /**
   * Get the numeric value
   */
  toNumber(): number {
    return this.value;
  }

  /**
   * Format to string with specified decimal places
   */
  toString(decimalPlaces: number = 2): string {
    return this.value.toFixed(decimalPlaces);
  }

  /**
   * Check if value is zero
   */
  isZero(): boolean {
    return this.value === 0;
  }

  /**
   * Check if value is positive
   */
  isPositive(): boolean {
    return this.value > 0;
  }

  /**
   * Check if value is negative
   */
  isNegative(): boolean {
    return this.value < 0;
  }
}

/**
 * Create a new Decimal instance
 */
export function decimal(value: number | string): Decimal {
  return new Decimal(value);
}

/**
 * Round a number to specified decimal places
 */
export function round(value: number, decimalPlaces: number = 2): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
} 