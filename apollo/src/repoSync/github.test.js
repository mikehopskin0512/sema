import {
  extractTagsFromSemaComment,
  extractReactionFromSemaComment,
  removeSemaSignature,
} from './github';

describe('GitHub importer', () => {
  describe('stripping the Sema signature', () => {
    describe('current format', () => {
      let text;

      beforeAll(() => {
        text = removeSemaSignature(`so good

__
[![sema-logo](https://app.semasoftware.com/img/sema-tray-logo.gif)](https://semasoftware.com/gh) &nbsp;**Summary:** :ok_hand: This code looks good&nbsp; | &nbsp;**Tags:** Efficient `);
      });

      it('should get the text', () => {
        expect(text).toBe('so good');
      });
    });

    describe('older format', () => {
      let text;

      beforeAll(() => {
        text = removeSemaSignature(`LGTM

__
[![sema-logo](http://localhost:3000/img/sema-tray-logo.svg)](http://semasoftware.com/gh) **Summary:** :trophy: This code is awesome\r\n`);
      });

      it('should get the text', () => {
        expect(text).toBe('LGTM');
      });
    });
  });

  describe('extract reactions and tags from Sema comment', () => {
    describe('current format', () => {
      let reaction;
      let tags;
      const text = `so good

__
[![sema-logo](https://app.semasoftware.com/img/sema-tray-logo.gif)](https://semasoftware.com/gh) &nbsp;**Summary:** :ok_hand: This code looks good&nbsp; | &nbsp;**Tags:** Efficient `;

      beforeAll(async () => {
        reaction = await extractReactionFromSemaComment(text);
        tags = extractTagsFromSemaComment(text);
      });

      it('should parse reaction', () => {
        expect(reaction).toEqualID('607f0d1ed7f45b000ec2ed72');
      });

      it('should parse tags', () => {
        expect(tags).toEqual(['Efficient']);
      });
    });

    describe('older format', () => {
      let reaction;
      let tags;
      const text = `LGTM

__
[![sema-logo](http://localhost:3000/img/sema-tray-logo.svg)](http://semasoftware.com/gh) **Summary:** :trophy: This code is awesome\r\n`;

      beforeAll(async () => {
        reaction = await extractReactionFromSemaComment(text);
        tags = extractTagsFromSemaComment(text);
      });

      it('should parse reaction', () => {
        expect(reaction).toEqualID('607f0d1ed7f45b000ec2ed71');
      });

      it('should parse tags', () => {
        expect(tags).toEqual([]);
      });
    });

    describe('broken signature', () => {
      let reaction;
      let tags;
      const text = `LGTM

__
[![sema-logo](http://localhost:3000/img/sema-tray-logo.svg)](http://semasoftware.com/gh) rophy: This code is awesome\r\n`;

      beforeAll(async () => {
        reaction = await extractReactionFromSemaComment(text);
        tags = extractTagsFromSemaComment(text);
      });

      it('should not fail', () => {
        expect(reaction).toBe(null);
        expect(tags).toEqual([]);
      });
    });
  });
});
