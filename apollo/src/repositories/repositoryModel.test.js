import Repository from './repositoryModel';

describe('Repository model', () => {
  describe('new repository with SSH clone URL', () => {
    let repository;

    beforeAll(async () => {
      repository = new Repository({
        externalId: '237888452',
        cloneUrl: 'git@github.com:Semalab/phoenix.git',
      });
      await repository.validate();
    });

    it('should have type', () => {
      expect(repository.type).toBe('github');
    });

    it('should normalize to HTTPS URL', () => {
      expect(repository.cloneUrl).toBe('https://github.com/Semalab/phoenix');
    });

    it('should have full name', () => {
      expect(repository.fullName).toBe('Semalab/phoenix');
    });
  });

  describe('new repository with HTTPS clone URL', () => {
    let repository;

    beforeAll(async () => {
      repository = new Repository({
        externalId: '237888452',
        cloneUrl: 'https://github.com/Semalab/phoenix.git',
      });
      await repository.validate();
    });

    it('should have type', () => {
      expect(repository.type).toBe('github');
    });

    it('should normalize to HTTPS URL', () => {
      expect(repository.cloneUrl).toBe('https://github.com/Semalab/phoenix');
    });

    it('should have full name', () => {
      expect(repository.fullName).toBe('Semalab/phoenix');
    });
  });
});
