import { Duration } from '../duration';

describe('Duration', () => {
  it('should create duration from milliseconds', () => {
    const duration = Duration.from(1000, 'milliseconds');
    expect(duration.milliseconds()).toBe(1000);
  });

  it('should create duration from seconds', () => {
    const duration = Duration.from(1, 'second');
    expect(duration.seconds()).toBe(1);
  });

  it('should create duration from minutes', () => {
    const duration = Duration.from(1, 'minute');
    expect(duration.minutes()).toBe(1);
  });

  it('should create duration from hours', () => {
    const duration = Duration.from(1, 'hour');
    expect(duration.hours()).toBe(1);
  });

  it('should create duration from days', () => {
    const duration = Duration.from(1, 'day');
    expect(duration.days()).toBe(1);
  });

  it('should create duration from weeks', () => {
    const duration = Duration.from(1, 'week');
    expect(duration.weeks()).toBe(1);
  });

  it('should create duration from singular units', () => {
    expect(Duration.millisecond().milliseconds()).toBe(1);
  });

  it('should add two durations', () => {
    const duration1 = Duration.from(1, 'hour');
    const duration2 = Duration.from(30, 'minutes');
    const result = duration1.add(duration2);
    expect(result.minutes()).toBe(90);
  });

  it('should subtract two durations', () => {
    const duration1 = Duration.from(1, 'hour');
    const duration2 = Duration.from(30, 'minutes');
    const result = duration1.subtract(duration2);
    expect(result.minutes()).toBe(30);
  });

  it('should multiply a duration', () => {
    const duration = Duration.from(1, 'hour');
    const result = duration.multiply(2);
    expect(result.hours()).toBe(2);
  });

  it('should divide a duration', () => {
    const duration = Duration.from(1, 'hour');
    const result = duration.divide(2);
    expect(result.minutes()).toBe(30);
  });
});
