# Requirements Document

## Introduction

The Careers page is a new route (`/careers`) on the Compufy Technology marketing website. It communicates the company's culture and values to prospective candidates, highlights reasons to join the team, and provides an application form for job seekers to submit their details and resume. The page must match the existing dark-mode glassmorphism aesthetic and be lazy-loaded via the Angular router.

## Glossary

- **Careers_Page**: The Angular standalone component rendered at the `/careers` route
- **Values_Section**: The UI block displaying the company's core values and work culture
- **Why_Join_Section**: The UI block listing key reasons why candidates should choose Compufy
- **Application_Form**: The typed reactive form component through which candidates submit their application
- **Resume_Upload**: The file input control that accepts a candidate's resume in PDF format
- **Validator**: The Angular form validation logic applied to Application_Form controls
- **Firebase_Service**: The existing backend service used to persist form submissions
- **Router**: The Angular router responsible for lazy-loading page components

## Requirements

### Requirement 1: Page Route and Navigation

**User Story:** As a site visitor, I want to navigate to a dedicated Careers page, so that I can explore job opportunities at Compufy Technology.

#### Acceptance Criteria

1. THE Router SHALL expose the path `/careers` and lazy-load the Careers_Page component via `loadComponent`
2. WHEN a visitor navigates to `/careers`, THE Careers_Page SHALL render without a full page reload
3. THE Careers_Page SHALL be reachable from the site navigation alongside existing pages (Home, Services, Who We Are, Contact)

---

### Requirement 2: Company Values Section

**User Story:** As a prospective candidate, I want to read about Compufy's core values and work culture, so that I can decide whether the company aligns with my personal and professional values.

#### Acceptance Criteria

1. THE Values_Section SHALL display a minimum of three distinct company values, each with a title and a descriptive sentence
2. THE Values_Section SHALL present each value as a visually distinct card using the `surface-card` background token
3. THE Values_Section SHALL use brand accent colors (`brand-primary`, `brand-secondary`, `brand-accent`) to visually differentiate value cards
4. THE Values_Section SHALL source its content from a typed static data file located under `src/app/data/static/`

---

### Requirement 3: Why Choose Compufy Section

**User Story:** As a prospective candidate, I want to see compelling reasons to join Compufy, so that I can evaluate the company as a potential employer.

#### Acceptance Criteria

1. THE Why_Join_Section SHALL display a minimum of three distinct benefit items, each with a title and a supporting description
2. THE Why_Join_Section SHALL cover topics including growth opportunities, work environment, and learning culture
3. THE Why_Join_Section SHALL present each benefit item with an icon and descriptive text
4. THE Why_Join_Section SHALL source its content from a typed static data file located under `src/app/data/static/`

---

### Requirement 4: Application Form — Field Definitions

**User Story:** As a job applicant, I want to fill in my details and upload my resume, so that I can apply for a position at Compufy Technology.

#### Acceptance Criteria

1. THE Application_Form SHALL include a Full Name text field
2. THE Application_Form SHALL include a Designation field for the role the candidate is applying for
3. THE Application_Form SHALL include a Years of Experience numeric field
4. THE Application_Form SHALL include a Resume_Upload file input control
5. THE Application_Form SHALL be implemented as a typed `FormGroup` with `FormControl<T>` for each field

---

### Requirement 5: Application Form — Validation

**User Story:** As a job applicant, I want clear validation feedback on the application form, so that I can correct errors before submitting.

#### Acceptance Criteria

1. WHEN the Full Name field is submitted empty, THE Validator SHALL mark the field invalid and THE Application_Form SHALL display the error message "Full name is required"
2. WHEN the Full Name field value contains fewer than 2 non-whitespace characters, THE Validator SHALL mark the field invalid and THE Application_Form SHALL display the error message "Name must be at least 2 characters"
3. WHEN the Designation field is submitted empty, THE Validator SHALL mark the field invalid and THE Application_Form SHALL display the error message "Designation is required"
4. WHEN the Years of Experience field is submitted empty, THE Validator SHALL mark the field invalid and THE Application_Form SHALL display the error message "Years of experience is required"
5. WHEN the Years of Experience field value is less than 0 or greater than 50, THE Validator SHALL mark the field invalid and THE Application_Form SHALL display the error message "Please enter a valid number of years (0–50)"
6. WHEN no file is selected for Resume_Upload, THE Validator SHALL mark the field invalid and THE Application_Form SHALL display the error message "Resume is required"
7. WHEN a file with a MIME type other than `application/pdf` is selected, THE Validator SHALL mark the Resume_Upload field invalid and THE Application_Form SHALL display the error message "Only PDF files are accepted"
8. WHEN a file exceeding 2 MB is selected, THE Validator SHALL mark the Resume_Upload field invalid and THE Application_Form SHALL display the error message "File size must not exceed 2 MB"
9. WHEN the Application_Form is submitted with one or more invalid fields, THE Application_Form SHALL mark all controls as touched to reveal all validation errors simultaneously
10. WHEN all fields are valid, THE Application_Form SHALL enable form submission

---

### Requirement 6: Application Form — Submission

**User Story:** As a job applicant, I want to submit my application and receive confirmation, so that I know my application has been received.

#### Acceptance Criteria

1. WHEN the Application_Form is submitted with all fields valid, THE Careers_Page SHALL send the form data and resume file to the Firebase_Service
2. WHEN the Firebase_Service returns a success response, THE Careers_Page SHALL replace the Application_Form with a success confirmation message
3. WHEN the Firebase_Service returns an error response, THE Careers_Page SHALL display an inline error message without clearing the form fields
4. WHILE a submission is in progress, THE Application_Form SHALL disable the submit button to prevent duplicate submissions
5. THE Careers_Page SHALL reset the submission in-progress state after the Firebase_Service responds, regardless of success or failure

---

### Requirement 7: Resume Upload — File Handling

**User Story:** As a job applicant, I want to upload my resume as a PDF, so that the hiring team can review my qualifications.

#### Acceptance Criteria

1. THE Resume_Upload SHALL accept only files with the `.pdf` extension via the `accept` attribute on the file input element
2. WHEN a file is selected, THE Resume_Upload SHALL validate the file's MIME type is `application/pdf`
3. WHEN a file is selected, THE Resume_Upload SHALL validate the file size does not exceed 2,097,152 bytes (2 MB)
4. THE Resume_Upload SHALL display the selected file name after a valid file is chosen
5. IF both MIME type and size validations fail for the same file, THEN THE Validator SHALL report the MIME type error with priority over the size error

---

### Requirement 8: Visual Design and Accessibility

**User Story:** As a site visitor, I want the Careers page to look consistent with the rest of the site and be accessible, so that I have a coherent and inclusive browsing experience.

#### Acceptance Criteria

1. THE Careers_Page SHALL apply the dark-mode glassmorphism visual style consistent with existing pages
2. THE Careers_Page SHALL use the established brand color tokens (`brand-primary`, `brand-secondary`, `brand-accent`) for accents and highlights
3. THE Careers_Page SHALL use surface color tokens (`surface`, `surface-card`) for backgrounds
4. THE Careers_Page SHALL be fully responsive across mobile, tablet, and desktop viewport widths
5. THE Careers_Page SHALL be implemented as a standalone Angular component with `ChangeDetectionStrategy.OnPush` and an inline template
6. THE Application_Form SHALL associate every input with a visible `<label>` element using matching `for` and `id` attributes
7. WHEN a validation error is displayed, THE Application_Form SHALL associate the error message with its input via `aria-describedby`
8. THE Application_Form submit button SHALL have a descriptive accessible label

---

### Requirement 9: Static Careers Content Data

**User Story:** As a developer, I want careers page content stored as typed static data files, so that content updates do not require changes to component logic.

#### Acceptance Criteria

1. THE Careers_Page SHALL source Values_Section content from a typed static data file at `src/app/data/static/careers.data.ts`
2. THE Careers_Page SHALL source Why_Join_Section content from the same `careers.data.ts` static data file
3. THE careers.data.ts file SHALL export data typed against interfaces defined in `src/app/data/models/careers.model.ts`
4. WHEN the static data file is updated, THE Careers_Page SHALL reflect the updated content without changes to component logic
