'use strict';

/**
 * Shared semantic-release configuration factory for the monorepo.
 *
 * Usage in each package:
 *   const base = require('../../release.config.base');
 *   module.exports = base('frontend');
 *
 * @param {string} name - The tag prefix to use (e.g. 'frontend', 'backend').
 */
module.exports = function makeConfig(name) {
  return {
    branches: ['main'],

    // Tag format used by semantic-release-monorepo: matches our existing tags
    tagFormat: name + '@${version}',

    plugins: [
      // 1. Determine the version bump from conventional commits
      ['@semantic-release/commit-analyzer', {
        preset: 'angular',
        // Also bump on refactor/style/build (patch)
        releaseRules: [
          { type: 'refactor', release: 'patch' },
          { type: 'style',    release: 'patch' },
          { type: 'build',    release: 'patch' },
        ],
      }],

      // 2. Generate human-readable release notes
      ['@semantic-release/release-notes-generator', {
        preset: 'angular',
      }],

      // 3. Append to the package-level CHANGELOG.md
      ['@semantic-release/changelog', {
        changelogFile: 'CHANGELOG.md',
      }],

      // 4. Update version in package.json (no npm publish — private packages)
      ['@semantic-release/npm', {
        npmPublish: false,
      }],

      // 5. Commit the bumped package.json and CHANGELOG, then push
      ['@semantic-release/git', {
        assets: ['package.json', 'CHANGELOG.md'],
        // Angular-style commit; [skip ci] prevents infinite CI loops
        message: 'chore(release): ' + name + '@${nextRelease.version} [skip ci]',
      }],
    ],
  };
};
