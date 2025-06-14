const timeWord = require('./timeWord');

describe('#timeword', () => {
  test('it is a function', () => {
    expect(typeof timeWord).toBe('function');
  });

  test('handles midnight', () => {
    expect(timeWord('00:00')).toBe('midnight');
  });

  test('handles noon', () => {
    expect(timeWord('12:00')).toBe('noon');
  });

  test('handles times with oh minutes', () => {
    expect(timeWord('00:12')).toBe('twelve twelve am');
    expect(timeWord('06:01')).toBe('six oh one am');
    expect(timeWord('12:09')).toBe('twelve oh nine pm');
  });

  test('handles oclock', () => {
    expect(timeWord('01:00')).toBe('one oclock am');
  });

  test('handles normal minutes', () => {
    expect(timeWord('06:10')).toBe('six ten am');
    expect(timeWord('06:18')).toBe('six eighteen am');
    expect(timeWord('06:30')).toBe('six thirty am');
    expect(timeWord('10:34')).toBe('ten thirty four am');
    expect(timeWord('23:23')).toBe('eleven twenty three pm');
  });
});
