export type DurationUnitPlural =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks';
export type DurationUnitSingular =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week';
export type DurationUnitAbbreviation = 'ms' | 's' | 'm' | 'h' | 'd' | 'w';

export type DurationUnit =
  | DurationUnitPlural
  | DurationUnitSingular
  | DurationUnitAbbreviation;

export class Duration {
  public static readonly MILLISECOND = 1;
  public static readonly SECOND = 1000 * Duration.MILLISECOND;
  public static readonly MINUTE = 60 * Duration.SECOND;
  public static readonly HOUR = 60 * Duration.MINUTE;
  public static readonly DAY = 24 * Duration.HOUR;
  public static readonly WEEK = 7 * Duration.DAY;

  /**
   * Translate a value and unit into a Duration object.
   *
   * If the unit is not provided, the value is assumed to be in milliseconds.
   *
   * @param value The value of the duration.
   * @param unit The unit of the duration.
   * @returns A Duration object.
   */
  public static from(value: number, unit?: DurationUnit): Duration {
    switch (unit) {
      case 'milliseconds':
      case 'millisecond':
      case 'ms':
        return Duration.milliseconds(value);
      case 'seconds':
      case 'second':
      case 's':
        return Duration.seconds(value);
      case 'minutes':
      case 'minute':
      case 'm':
        return Duration.minutes(value);
      case 'hours':
      case 'hour':
      case 'h':
        return Duration.hours(value);
      case 'days':
      case 'day':
      case 'd':
        return Duration.days(value);
      case 'weeks':
      case 'week':
      case 'w':
        return Duration.weeks(value);
      default:
        return Duration.milliseconds(value);
    }
  }

  /**
   * Create a Duration object from a value in milliseconds.
   *
   * @param value The value of the duration in milliseconds.
   * @returns A Duration object.
   */
  public static milliseconds(value: number): Duration {
    return new Duration(value * Duration.MILLISECOND);
  }

  /**
   * Create a Duration object from one millisecond.
   *
   * @returns A Duration object.
   */
  public static readonly millisecond = Duration.milliseconds.bind(Duration, 1);

  /**
   * Create a Duration object from a value in seconds.
   *
   * @param value The value of the duration in seconds.
   * @returns A Duration object.
   */
  public static seconds(value: number): Duration {
    return new Duration(value * Duration.SECOND);
  }

  /**
   * Create a Duration object from one second.
   *
   * @returns A Duration object.
   */
  public static readonly second = Duration.seconds.bind(Duration, 1);

  /**
   * Create a Duration object from a value in minutes.
   *
   * @param value The value of the duration in minutes.
   * @returns A Duration object.
   */
  public static minutes(value: number): Duration {
    return new Duration(value * Duration.MINUTE);
  }

  /**
   * Create a Duration object from one minute.
   *
   * @returns A Duration object.
   */
  public static readonly minute = Duration.minutes.bind(Duration, 1);

  /**
   * Create a Duration object from a value in hours.
   *
   * @param value The value of the duration in hours.
   * @returns A Duration object.
   */
  public static hours(value: number): Duration {
    return new Duration(value * Duration.HOUR);
  }

  /**
   * Create a Duration object from one hour.
   *
   * @returns A Duration object.
   */
  public static readonly hour = Duration.hours.bind(Duration, 1);

  /**
   * Create a Duration object from a value in days.
   *
   * @param value The value of the duration in days.
   * @returns A Duration object.
   */
  public static days(value: number): Duration {
    return new Duration(value * Duration.DAY);
  }

  /**
   * Create a Duration object from one day.
   *
   * @returns A Duration object.
   */
  public static readonly day = Duration.days.bind(Duration, 1);

  /**
   * Create a Duration object from a value in weeks.
   *
   * @param value The value of the duration in weeks.
   * @returns A Duration object.
   */
  public static weeks(value: number): Duration {
    return new Duration(value * Duration.WEEK);
  }

  /**
   * Create a Duration object from one week.
   *
   * @returns A Duration object.
   */
  public static readonly week = Duration.weeks.bind(Duration, 1);

  constructor(private readonly value: number) {}

  /**
   * Get the value of the duration in milliseconds.
   *
   * @returns The value of the duration in milliseconds.
   */
  public milliseconds(): number {
    return this.value;
  }

  /**
   * Get the value of the duration in seconds.
   *
   * @returns The value of the duration in seconds.
   */
  public seconds(): number {
    return this.value / Duration.SECOND;
  }

  /**
   * Get the value of the duration in minutes.
   *
   * @returns The value of the duration in minutes.
   */
  public minutes(): number {
    return this.value / Duration.MINUTE;
  }

  /**
   * Get the value of the duration in hours.
   *
   * @returns The value of the duration in hours.
   */
  public hours(): number {
    return this.value / Duration.HOUR;
  }

  /**
   * Get the value of the duration in days.
   *
   * @returns The value of the duration in days.
   */
  public days(): number {
    return this.value / Duration.DAY;
  }

  /**
   * Get the value of the duration in weeks.
   *
   * @returns The value of the duration in weeks.
   */
  public weeks(): number {
    return this.value / Duration.WEEK;
  }

  /**
   * Add a duration to this duration.
   *
   * @param duration The duration to add.
   * @returns A new duration that is the sum of this duration and the given duration.
   */
  public add(duration: Duration): Duration {
    return new Duration(this.value + duration.value);
  }

  /**
   * Subtract a duration from this duration.
   *
   * @param duration The duration to subtract.
   * @returns A new duration that is the difference of this duration and the given duration
   */
  public subtract(duration: Duration): Duration {
    return new Duration(this.value - duration.value);
  }

  /**
   * Multiply the duration by a factor.
   *
   * @param factor The factor to multiply the duration by.
   * @returns A new duration that is the product of this duration and the factor
   */
  public multiply(factor: number): Duration {
    return new Duration(this.value * factor);
  }

  /**
   * Divide the duration by a divisor.
   *
   * @param divisor The divisor to divide the duration by.
   * @returns A new duration that is the quotient of this duration and the divisor
   */
  public divide(divisor: number): Duration {
    return new Duration(this.value / divisor);
  }
}
