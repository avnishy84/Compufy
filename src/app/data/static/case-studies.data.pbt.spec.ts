// Feature: client-case-studies, Property 1: Slug map round-trip
// Feature: client-case-studies, Property 2: Slug uniqueness invariant

import * as fc from 'fast-check';
import { CaseStudy } from '../models/case-study.model';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Generates a valid kebab-case slug string */
const slugArb = fc
  .stringMatching(/^[a-z][a-z0-9-]{2,29}$/)
  .filter(s => !s.startsWith('-') && !s.endsWith('-'));

/** Generates a minimal CaseStudy-shaped object with a given slug */
function caseStudyWithSlug(slug: string): CaseStudy {
  return {
    id: slug,
    slug,
    clientName: 'Test Client',
    projectTitle: 'Test Project',
    shortDescription: 'A short description.',
    tags: ['Tag1'],
    problemStatement: 'Problem.',
    solution: 'Solution.',
    technicalDepth: 'Depth.',
    liveDemoUrl: '',
  };
}

/** Generates an array of CaseStudy objects with guaranteed unique slugs */
const uniqueSlugArrayArb = fc
  .uniqueArray(slugArb, { minLength: 1, maxLength: 20 })
  .map(slugs => slugs.map(caseStudyWithSlug));

// ---------------------------------------------------------------------------
// Helper: build slug map (mirrors case-studies.data.ts logic)
// ---------------------------------------------------------------------------
function buildSlugMap(data: CaseStudy[]): Map<string, CaseStudy> {
  return new Map(data.map(cs => [cs.slug, cs]));
}

function runDuplicateGuard(data: CaseStudy[]): void {
  const slugs = data.map(cs => cs.slug);
  const unique = new Set(slugs);
  if (unique.size !== slugs.length) {
    throw new Error('CASE_STUDIES_DATA contains duplicate slugs');
  }
}

// ---------------------------------------------------------------------------
// Property 1: Slug map round-trip
// ---------------------------------------------------------------------------
describe('case-studies.data PBT — Property 1: Slug map round-trip', () => {
  it('every entry in a unique-slug array is retrievable by its slug', () => {
    fc.assert(
      fc.property(uniqueSlugArrayArb, (data) => {
        const map = buildSlugMap(data);
        for (const study of data) {
          const found = map.get(study.slug);
          if (found !== study) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: Slug uniqueness invariant
// ---------------------------------------------------------------------------
describe('case-studies.data PBT — Property 2: Slug uniqueness invariant', () => {
  it('guard throws when duplicates are present', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(slugArb, { minLength: 1, maxLength: 10 }).chain(slugs => {
          // Pick one slug to duplicate
          const dupSlug = slugs[0];
          const extra = caseStudyWithSlug(dupSlug);
          const data = [...slugs.map(caseStudyWithSlug), extra];
          return fc.constant(data);
        }),
        (data) => {
          expect(() => runDuplicateGuard(data)).toThrowError(
            'CASE_STUDIES_DATA contains duplicate slugs'
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('guard does not throw when all slugs are unique', () => {
    fc.assert(
      fc.property(uniqueSlugArrayArb, (data) => {
        expect(() => runDuplicateGuard(data)).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });
});
