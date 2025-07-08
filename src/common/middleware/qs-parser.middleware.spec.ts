import { QsParserMiddleware } from './qs-parser.middleware';

describe('QsParserMiddleware', () => {
  it('should be defined', () => {
    expect(new QsParserMiddleware()).toBeDefined();
  });
});
