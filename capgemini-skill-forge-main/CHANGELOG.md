# Changelog

All notable changes to Capgemini Skill Forge are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-16

### Added
- Initial release of Capgemini Skill Forge
- User authentication with Supabase (email/password signup and login)
- Competency matrix form for skill assessment and tracking
- Activity selection interface with organized skill categories
- User dashboard with analytics and statistics
  - Total competencies tracked
  - Completed vs In-Progress visual display
  - Competency distribution charts by priority level
- Admin dashboard for role management and oversight
- Role-based access control (User/Admin roles)
- Protected routes with auth state management
- Real-time authentication state synchronization
- Toast notifications for user feedback
- Responsive UI design with mobile support
- Dark/Light theme support via next-themes
- Form validation with React Hook Form
- Data persistence using Supabase PostgreSQL
- Comprehensive UI component library (shadcn/ui)
- Database migrations for schema management

### Features
- **Login/Signup**: User registration and authentication with email verification requirement
- **Competency Tracking**: Add, edit, and track multiple competencies across activities
- **Priority Management**: Set competency priorities (High/Medium/Low)
- **Status Tracking**: Monitor development status (Not Started/In Progress/Completed)
- **Dashboard Analytics**: Visual insights into personal skill development
- **Admin Controls**: Manage users and oversee competency submissions
- **Navigation**: Intuitive header with contextual navigation links
- **Form Handling**: React Hook Form for efficient form state management

### Technical Details
- React 18 with TypeScript
- Vite build tool with SWC compiler
- TailwindCSS for styling
- Recharts for data visualization
- React Router v6 for navigation
- Supabase for backend services
- PostgreSQL database

## [Unreleased]

### Planned Features
- [ ] PDF/Excel export functionality for competency reports
- [ ] Advanced skill recommendation engine
- [ ] HR system integrations (SAP, Workday)
- [ ] Enhanced search and filtering capabilities
- [ ] Batch user import from HR systems
- [ ] Native mobile application
- [ ] Competency benchmarking against industry standards
- [ ] Manager review and approval workflows
- [ ] API endpoints for third-party integrations
- [ ] Audit logs for compliance tracking

### Under Consideration
- Watson AI skill recommendations
- Automated skill gap analysis
- Career path recommendations
- Multi-language support
- Single Sign-On (SSO) integration
- Advanced notification system

---

## Version History Details

### Version 1.0.0 Release Notes

**Highlights:**
- Fully functional competency management platform
- Secure authentication and authorization
- Production-ready deployment
- Comprehensive documentation

**Known Limitations:**
- Email domain restricted to @capgemini.com
- Single language support (French/English in UI)
- Basic admin features (advanced controls planned)

**Breaking Changes:**
- Initial release - no previous versions

---

For detailed information about each change, please see the related commits and pull requests on GitHub.

To upgrade, follow the installation instructions in [README.md](./README.md).
