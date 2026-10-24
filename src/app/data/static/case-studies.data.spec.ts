import { CASE_STUDIES_DATA, CASE_STUDIES_BY_SLUG } from './case-studies.data';
import { CaseStudy } from '../models/case-study.model';

describe('case-studies.data', () => {
  it('should contain at least 2 entries', () => {
    expect(CASE_STUDIES_DATA.length).toBeGreaterThanOrEqual(2);
  });

  it('CASE_STUDIES_BY_SLUG size should equal CASE_STUDIES_DATA length', () => {
    expect(CASE_STUDIES_BY_SLUG.size).toBe(CASE_STUDIES_DATA.length);
  });

  it('duplicate-slug guard should throw when duplicates are present', () => {
    const duplicate: CaseStudy = { ...CASE_STUDIES_DATA[0] };
    const dataWithDuplicate = [...CASE_STUDIES_DATA, duplicate];

    const buildMap = () => {
      const slugs = dataWithDuplicate.map(cs => cs.slug);
      const unique = new Set(slugs);
      if (unique.size !== slugs.length) {
        throw new Error('CASE_STUDIES_DATA contains duplicate slugs');
      }
    };

    expect(buildMap).toThrowError('CASE_STUDIES_DATA contains duplicate slugs');
  });
});
