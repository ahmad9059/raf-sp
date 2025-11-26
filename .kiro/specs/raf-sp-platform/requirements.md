# Requirements Document

## Introduction

RAF-SP (Repair & Facility - Smart Platform) is a web-based asset management system for government agriculture departments. The platform enables multiple departments to manage their equipment inventory, track maintenance, and visualize asset data through role-based dashboards. The system features a public-facing government-style landing page and secure administrative interfaces with analytics capabilities.

## Glossary

- **RAF-SP System**: The complete web platform including public interface, authentication, and dashboard components
- **User**: An authenticated individual with either ADMIN or DEPT_HEAD role
- **Department**: An organizational unit within the agriculture ministry that manages its own equipment inventory
- **Equipment**: Physical agriculture tools and machinery tracked in the system
- **Equipment Status**: The current state of equipment (AVAILABLE, IN_USE, NEEDS_REPAIR, DISCARDED)
- **Maintenance Log**: Historical record of repairs and maintenance performed on equipment
- **RBAC**: Role-Based Access Control system that restricts access based on user roles
- **Bulk Import**: Feature allowing users to upload CSV or PDF files containing multiple equipment records

## Requirements

### Requirement 1: Public Landing Page

**User Story:** As a public visitor, I want to view an official government-style landing page with information about the RAF-SP initiative, so that I can understand the platform's purpose and access login functionality.

#### Acceptance Criteria

1. THE RAF-SP System SHALL display a hero section with the primary color #134866 and official MNSUAM university branding
2. THE RAF-SP System SHALL render smooth entry animations using Framer Motion on the landing page
3. THE RAF-SP System SHALL provide a navigation bar with Login and Signup buttons
4. THE RAF-SP System SHALL display an "About Us" section explaining the agriculture asset management initiative
5. THE RAF-SP System SHALL render a large informative footer with government links

### Requirement 2: User Authentication

**User Story:** As a user, I want to securely log in with my credentials, so that I can access my department's dashboard.

#### Acceptance Criteria

1. WHEN a user submits valid credentials, THE RAF-SP System SHALL authenticate the user using NextAuth v5
2. WHEN a user submits invalid credentials, THE RAF-SP System SHALL display an error message and prevent access
3. THE RAF-SP System SHALL store user passwords in hashed format in the database
4. WHEN an unauthenticated user attempts to access dashboard routes, THE RAF-SP System SHALL redirect them to the login page
5. THE RAF-SP System SHALL maintain user session state across page navigations

### Requirement 3: Role-Based Access Control

**User Story:** As an administrator, I want different access levels for different user roles, so that department heads can only manage their own equipment while admins can view all departments.

#### Acceptance Criteria

1. WHEN a user with ADMIN role accesses the dashboard, THE RAF-SP System SHALL display global statistics across all departments
2. WHEN a user with DEPT_HEAD role accesses the dashboard, THE RAF-SP System SHALL display only their assigned department's data
3. WHEN a user with ADMIN role performs an action, THE RAF-SP System SHALL allow creation and management of departments
4. WHEN a user with DEPT_HEAD role attempts to access another department's data, THE RAF-SP System SHALL deny access and display an error message
5. THE RAF-SP System SHALL enforce role-based permissions through middleware on all protected routes

### Requirement 4: Equipment Inventory Management

**User Story:** As a department head, I want to add, edit, and delete equipment records, so that I can maintain an accurate inventory of my department's assets.

#### Acceptance Criteria

1. WHEN a user creates an equipment record, THE RAF-SP System SHALL store the name, type, status, purchase date, department ID, and image URL
2. WHEN a user updates an equipment record, THE RAF-SP System SHALL save the changes and update the last modified timestamp
3. WHEN a user deletes an equipment record, THE RAF-SP System SHALL remove it from the database and associated storage
4. THE RAF-SP System SHALL validate all equipment form inputs using Zod schema validation
5. WHEN a user uploads an equipment image, THE RAF-SP System SHALL store the file in Supabase Storage and save the URL reference

### Requirement 5: Equipment Status Tracking

**User Story:** As a department head, I want to track the status of each piece of equipment, so that I can identify which assets are available, in use, need repair, or are discarded.

#### Acceptance Criteria

1. THE RAF-SP System SHALL support four equipment status values: AVAILABLE, IN_USE, NEEDS_REPAIR, and DISCARDED
2. WHEN a user changes equipment status, THE RAF-SP System SHALL update the record immediately in the database
3. THE RAF-SP System SHALL display equipment status using distinct visual indicators in the inventory table
4. WHEN generating statistics, THE RAF-SP System SHALL calculate counts for each status category
5. THE RAF-SP System SHALL prevent deletion of equipment with status IN_USE without confirmation

### Requirement 6: Dashboard Analytics and Visualization

**User Story:** As a user, I want to see visual charts and statistics about equipment, so that I can quickly understand inventory distribution and status.

#### Acceptance Criteria

1. THE RAF-SP System SHALL display a pie chart showing equipment status distribution using Recharts
2. THE RAF-SP System SHALL display a bar chart showing equipment distribution by type using Recharts
3. THE RAF-SP System SHALL render a table showing recently added equipment with sortable columns
4. WHEN a user with ADMIN role views the dashboard, THE RAF-SP System SHALL aggregate statistics across all departments
5. WHEN a user with DEPT_HEAD role views the dashboard, THE RAF-SP System SHALL display statistics filtered to their department only

### Requirement 7: Maintenance Log Tracking

**User Story:** As a department head, I want to record maintenance activities for equipment, so that I can track repair history and costs.

#### Acceptance Criteria

1. WHEN a user creates a maintenance log entry, THE RAF-SP System SHALL store the equipment ID, date, cost, and description
2. THE RAF-SP System SHALL display maintenance history chronologically for each equipment item
3. WHEN viewing equipment details, THE RAF-SP System SHALL calculate and display total maintenance costs
4. THE RAF-SP System SHALL validate that maintenance log dates are not in the future
5. THE RAF-SP System SHALL allow users to attach maintenance cost values with two decimal precision

### Requirement 8: Bulk Equipment Import

**User Story:** As a department head, I want to upload CSV or PDF files containing multiple equipment records, so that I can quickly populate the inventory without manual entry.

#### Acceptance Criteria

1. WHEN a user uploads a CSV file, THE RAF-SP System SHALL parse the file using PapaParse and extract equipment data
2. WHEN a user uploads a PDF file, THE RAF-SP System SHALL parse the file using pdf-parse and extract equipment data
3. WHEN parsing completes successfully, THE RAF-SP System SHALL create equipment records in the database for valid entries
4. WHEN parsing encounters invalid data, THE RAF-SP System SHALL display error messages indicating which rows failed validation
5. THE RAF-SP System SHALL process file uploads using server actions to ensure secure handling

### Requirement 9: Department Management

**User Story:** As an administrator, I want to create and manage departments, so that I can organize equipment by organizational units.

#### Acceptance Criteria

1. WHEN a user with ADMIN role creates a department, THE RAF-SP System SHALL store the name, location, and logo
2. WHEN a user with ADMIN role updates a department, THE RAF-SP System SHALL save changes and update associated equipment records
3. THE RAF-SP System SHALL prevent deletion of departments that have associated equipment records
4. THE RAF-SP System SHALL display department logos in the dashboard navigation and headers
5. WHEN a department is created, THE RAF-SP System SHALL allow assignment of DEPT_HEAD users to that department

### Requirement 10: Responsive Design and Performance

**User Story:** As a user, I want the platform to work smoothly on different devices and load quickly, so that I can access it from desktop or mobile devices.

#### Acceptance Criteria

1. THE RAF-SP System SHALL render all pages responsively across desktop, tablet, and mobile screen sizes
2. THE RAF-SP System SHALL use Tailwind CSS utility classes for consistent styling
3. THE RAF-SP System SHALL implement Framer Motion animations with performance optimization to maintain 60fps
4. THE RAF-SP System SHALL lazy-load dashboard charts and tables to improve initial page load time
5. THE RAF-SP System SHALL use TanStack Query for data caching to minimize redundant database queries
