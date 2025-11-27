# Feature Specification: Dev Bot Management Page (CRUD)

**Feature Branch**: `002-dev-bot-crud`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "dev bot manage page(CRUD)"

## Clarifications

### Session 2025-01-27

- Q: Should bot name be editable after creation, or immutable? → A: Bot name is editable - users can change it anytime
- Q: How do users select channel bridges - from existing list, create inline, or both? → A: Users can create new channel bridges inline when creating bots, but when editing bots they can only select/update from existing channel bridges
- Q: How do users specify bot capabilities - predefined list, free-form, or both? → A: Users enter free-form text/values for capabilities (no predefined list)
- Q: How should the system handle concurrent edits to the same bot? → A: Last-write-wins - accept latest save, show warning if changes detected since load
- Q: How should the system handle large bot lists (50+) - pagination, search, or both? → A: Both search and pagination - users can search/filter and paginate results
- Q: How should loading states be displayed while data is being fetched? → A: Show previous content with loading overlay
- Q: Which fields should be searchable and filterable in the bot list? → A: Search by name and display name; filter by status, realm, and channel bridge
- Q: How should the system handle retry behavior for failed operations? → A: Show retry button for failed operations (user-initiated retry)
- Q: How should users edit the metadata field (JSONB)? → A: No UI for metadata (read-only display only)
- Q: How should the system detect if a bot was modified since the user loaded it for editing? → A: Compare updated_at timestamp from initial load with current value before save

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Bot List (Priority: P1)

As a developer/admin, I want to view a list of all bots in my realm so that I can see what bots are configured and their current status.

**Why this priority**: Viewing existing bots is the foundation for all other operations. Without the ability to see what exists, users cannot effectively manage bots.

**Independent Test**: Can be tested by navigating to the bot management page and verifying that all bots in the current realm are displayed in a list format with key information (name, status, capabilities).

**Acceptance Scenarios**:

1. **Given** an authenticated user with bot management permissions, **When** they navigate to the bot management page, **Then** they see a list of all bots in their realm with display name, status (active/inactive), and creation date.
5. **Given** a user viewing the bot list, **When** data is being fetched or refreshed, **Then** previous content remains visible with a loading overlay indicating the refresh is in progress.
2. **Given** a user viewing the bot list, **When** there are no bots in the realm, **Then** they see an empty state message indicating no bots exist.
3. **Given** a user viewing the bot list, **When** there are many bots (50+), **Then** the list supports both search/filtering and pagination to help find and navigate bots.
6. **Given** a user viewing the bot list, **When** they use the search function, **Then** they can search by bot name and display name.
7. **Given** a user viewing the bot list, **When** they use the filter function, **Then** they can filter by status (active/inactive), realm, and channel bridge.
4. **Given** a user viewing the bot list, **When** they view the list, **Then** active bots are visually distinguished from inactive bots.

---

### User Story 2 - Create New Bot (Priority: P1)

As a developer/admin, I want to create a new bot with required configuration so that I can set up new bot instances for my realm.

**Why this priority**: Creating bots is essential for setting up new bot functionality. This is a core CRUD operation that enables the feature's primary value.

**Independent Test**: Can be tested by clicking a "Create Bot" button, filling in required fields (name, display name, at least one channel bridge), submitting the form, and verifying the bot appears in the list.

**Acceptance Scenarios**:

1. **Given** a user on the bot management page, **When** they click "Create Bot" or "Add Bot", **Then** a form appears with fields for bot configuration.
2. **Given** a user filling the create bot form, **When** they enter a name, display name, and select or create at least one channel bridge (API or OAuth), **Then** they can submit the form to create the bot.
3. **Given** a user creating a bot, **When** they choose to create a new channel bridge inline, **Then** they can configure the channel bridge and it is created along with the bot.
4. **Given** a user submitting a valid bot creation form, **When** they submit, **Then** the bot is created, they see a success message, and are redirected to view the bot list or bot details.
5. **Given** a user submitting an invalid form (missing required fields or no channel bridge selected/created), **When** they submit, **Then** validation errors are displayed indicating what needs to be fixed.
6. **Given** a user creating a bot, **When** they provide optional fields (description, capabilities), **Then** these values are saved with the bot.
6a. **Given** a user creating a bot, **When** they view the metadata field, **Then** it is not available for input (metadata is managed outside the UI).

---

### User Story 3 - View Bot Details (Priority: P2)

As a developer/admin, I want to view detailed information about a specific bot so that I can understand its full configuration and status.

**Why this priority**: Viewing details is necessary for understanding bot configuration before making updates. However, it's less critical than listing and creating since users can infer some details from the list.

**Independent Test**: Can be tested by clicking on a bot from the list and verifying all bot attributes are displayed in a readable format.

**Acceptance Scenarios**:

1. **Given** a user viewing the bot list, **When** they click on a bot's name or a "View Details" action, **Then** they see a detail page showing all bot information (name, display name, description, status, channel bridges, capabilities, metadata, timestamps).
4. **Given** a user viewing bot details, **When** data is being fetched or refreshed, **Then** previous content remains visible with a loading overlay indicating the refresh is in progress.
2. **Given** a user viewing bot details, **When** the bot has optional fields that are empty, **Then** those fields are shown as empty or "Not set" rather than hidden.
3. **Given** a user viewing bot details, **When** they view the details, **Then** they can see which realm the bot belongs to.

---

### User Story 4 - Update Existing Bot (Priority: P2)

As a developer/admin, I want to update bot configuration so that I can modify bot settings, change channel bridges, update capabilities, or adjust metadata without recreating the bot.

**Why this priority**: Updating bots is essential for maintaining and evolving bot configurations. However, it's less critical than creation since users can delete and recreate if needed (though less efficient).

**Independent Test**: Can be tested by opening a bot for editing, changing one or more fields, submitting, and verifying the changes are saved and reflected in the bot list/details.

**Acceptance Scenarios**:

1. **Given** a user viewing bot details or list, **When** they click "Edit" or "Update", **Then** an edit form appears pre-filled with current bot values.
2. **Given** a user editing a bot, **When** they modify any editable fields (name, display name, description, status, channel bridges, capabilities), **Then** they can save the changes.
2a. **Given** a user editing a bot, **When** they view the metadata field, **Then** it is displayed as read-only (not editable through the UI).
3. **Given** a user editing a bot, **When** they update channel bridges, **Then** they can only select from existing channel bridges (cannot create new ones inline during edit).
4. **Given** a user submitting bot updates, **When** they save valid changes, **Then** the bot is updated, they see a success message, and the updated information is reflected in the UI.
5. **Given** a user editing a bot, **When** they remove all channel bridges, **Then** validation prevents saving and shows an error that at least one channel bridge is required.
6. **Given** a user editing a bot, **When** they change the bot's active status, **Then** the change is saved and immediately reflected in the bot list.

---

### User Story 5 - Delete Bot (Priority: P3)

As a developer/admin, I want to delete bots that are no longer needed so that I can clean up unused configurations and maintain an organized bot list.

**Why this priority**: Deletion is important for maintenance but is less critical than creation and updates. Users can also deactivate bots instead of deleting them, making deletion a lower priority.

**Independent Test**: Can be tested by selecting a bot for deletion, confirming the action, and verifying the bot is removed from the list.

**Acceptance Scenarios**:

1. **Given** a user viewing bot details or list, **When** they click "Delete", **Then** a confirmation dialog appears asking them to confirm the deletion.
2. **Given** a user confirming bot deletion, **When** they confirm, **Then** the bot is deleted, they see a success message, and the bot is removed from the list.
3. **Given** a user attempting to delete a bot, **When** they cancel the confirmation dialog, **Then** no deletion occurs and they remain on the current page.
4. **Given** a user deleting a bot, **When** the deletion fails (e.g., bot is in use), **Then** an appropriate error message is displayed explaining why the deletion cannot proceed.

---

### Edge Cases

- What happens when a user tries to create or update a bot with a name that already exists in the realm? (Should show validation error for duplicate name)
- How does the system handle concurrent edits to the same bot? (Last-write-wins approach - system accepts the latest save and shows a warning if the bot was modified since the user loaded it for editing)
- What happens when a channel bridge referenced by a bot is deleted? (Should show a warning or error state in the bot configuration)
- How does the system handle very long bot names or descriptions? (Should truncate in list view, show full in details)
- What happens when a user loses permissions while viewing/editing a bot? (Should show appropriate access denied message)
- How does the system handle network errors during bot operations? (Should show user-friendly error messages with a retry button for user-initiated retry)
- What happens when a user tries to delete a bot that is currently active and in use? (Should prevent deletion or show strong warning)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a list of all bots in the current user's realm on the bot management page.
- **FR-002**: System MUST show bot display name, status (active/inactive), and creation date in the bot list.
- **FR-003**: System MUST visually distinguish active bots from inactive bots in the list.
- **FR-004**: System MUST display an empty state message when no bots exist in the realm.
- **FR-005**: System MUST provide a mechanism to create new bots (e.g., "Create Bot" button or link).
- **FR-006**: System MUST require bot name, display name, and at least one channel bridge (API or OAuth) when creating a bot.
- **FR-006a**: System MUST allow users to create new channel bridges inline when creating a bot, in addition to selecting from existing channel bridges.
- **FR-007**: System MUST allow optional fields (description, capabilities) when creating a bot.
- **FR-007b**: System MUST NOT provide UI for editing metadata field (metadata is read-only and managed outside the UI).
- **FR-007a**: System MUST allow users to enter capabilities as free-form text/values (no predefined list of capabilities).
- **FR-008**: System MUST validate bot creation forms and display errors for invalid or missing required fields.
- **FR-009**: System MUST display success messages after successful bot creation.
- **FR-010**: System MUST provide a mechanism to view detailed information about a specific bot.
- **FR-011**: System MUST display all bot attributes (name, display name, description, status, channel bridges, capabilities, metadata, timestamps) on the bot details page.
- **FR-012**: System MUST provide a mechanism to edit existing bots (e.g., "Edit" button).
- **FR-013**: System MUST allow users to update bot name, display name, description, status, channel bridges, and capabilities.
- **FR-013b**: System MUST display metadata as read-only (not editable through the UI).
- **FR-013a**: System MUST only allow users to select from existing channel bridges when editing bots (inline channel bridge creation is not available during edit).
- **FR-014**: System MUST prevent saving bot updates if all channel bridges are removed (at least one must remain).
- **FR-015**: System MUST display success messages after successful bot updates.
- **FR-016**: System MUST provide a mechanism to delete bots (e.g., "Delete" button).
- **FR-017**: System MUST require user confirmation before deleting a bot.
- **FR-018**: System MUST display success messages after successful bot deletion.
- **FR-019**: System MUST prevent duplicate bot names within the same realm.
- **FR-020**: System MUST provide both search/filtering and pagination when displaying large numbers of bots (50+).
- **FR-020a**: System MUST allow users to search bots by name and display name fields.
- **FR-020b**: System MUST allow users to filter bots by status (active/inactive), realm, and channel bridge.
- **FR-021**: System MUST restrict bot management operations to users with appropriate permissions.
- **FR-022**: System MUST display appropriate error messages when operations fail (network errors, validation errors, permission errors).
- **FR-022a**: System MUST provide a retry button for failed operations, allowing users to manually retry the operation.
- **FR-025**: System MUST display loading overlays over previous content when fetching or refreshing data on list and detail pages.
- **FR-023**: System MUST handle concurrent edits using last-write-wins strategy (latest save is accepted).
- **FR-024**: System MUST warn users if a bot was modified since they loaded it for editing (before accepting their save).
- **FR-024a**: System MUST detect concurrent modifications by comparing the `updated_at` timestamp from the initial load with the current `updated_at` value before saving.

### Key Entities

- **Bot**: Represents a configured AI assistant instance. Key attributes: ID, Realm ID, Name, Display Name, Description, API Channel Bridge ID, OAuth Channel Bridge ID, Active Status, Capabilities (array of free-form text values), Metadata (JSON), Created At, Updated At. Must have at least one channel bridge configured. Belongs to a realm.

- **Realm**: Represents an isolation boundary for bots. Users can only manage bots within their assigned realms.

- **Channel Bridge**: Represents a connection mechanism for bots (API or OAuth). Bots reference channel bridges to define how they communicate.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the bot list page and see all bots in their realm within 2 seconds of page load.
- **SC-002**: Users can complete bot creation (from clicking "Create" to seeing success message) in under 3 minutes.
- **SC-003**: Users can update an existing bot's configuration in under 2 minutes.
- **SC-004**: 95% of bot creation attempts with valid data result in successful bot creation.
- **SC-005**: 100% of bot management operations (create, update, delete) display clear success or error feedback to users.
- **SC-006**: Users can locate and access any bot from a list of 100 bots within 30 seconds (via search, filter, or pagination).
- **SC-007**: The bot management page supports managing at least 1000 bots per realm without performance degradation.
