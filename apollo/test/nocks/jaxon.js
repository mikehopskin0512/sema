// This provides a dumb mock of Jaxon.

import nock from 'nock';

export default function jaxon() {
  nock('https://hephaestus-summaries.semasoftware.com')
    .persist()
    .post('/summaries', () => true)
    .reply(200, (uri, payload) => {
      const reaction = payload.comments.match(/awesome/i) ? 'awesome' : null;

      return {
        classes: ['awesome', 'fix', 'good', 'none', 'question'],
        soft_labels: [[0.0169, 0.016, 0.016, 0.0178, 0.0166]],
        hard_labels: [[reaction].filter(Boolean)],
      };
    });

  nock('https://hephaestus-tags.semasoftware.com')
    .persist()
    .post('/tags', () => true)
    .reply(200, (uri, payload) => {
      const tag = payload.comments.match(/elegant/i) ? 'elegant' : null;

      return {
        classes: [
          'brittle',
          'efficient',
          'elegant',
          'faulttolerant',
          'inefficient',
          'inelegant',
          'maintainable',
          'none',
          'notmaintainable',
          'notreusable',
          'notsecure',
          'readable',
          'reusable',
          'secure',
          'unreadable',
        ],
        soft_labels: [
          [
            0.0003, 0.7971, 0.0029, 0.002, 0.0028, 0.0032, 0.0022, 0.0029,
            0.0029, 0.0015, 0.002, 0.0005, 0.0149, 0.0063, 0.0013,
          ],
        ],
        hard_labels: [[tag].filter(Boolean)],
      };
    });
}
