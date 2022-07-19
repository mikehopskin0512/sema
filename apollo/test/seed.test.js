import User from '../src/users/userModel';
import SmartComment from '../src/comments/smartComments/smartCommentModel';
import Portfolio from '../src/portfolios/portfolioModel';
import { seed } from './seed';

describe('Seed data for tests', () => {
  let users;
  let smartComments;
  let portfolios;

  beforeAll(async () => {
    await seed();
  });

  beforeAll(async () => {
    users = await User.find();
    smartComments = await SmartComment.find();
    portfolios = await Portfolio.find();
  });

  it('should have three users', () => {
    expect(users.length).toBe(3);
  });

  it('should have twenty smart comments', () => {
    expect(smartComments.length).toBe(20);
  });

  it('should have three portfolios', () => {
    expect(portfolios.length).toBe(3);
  });
});
