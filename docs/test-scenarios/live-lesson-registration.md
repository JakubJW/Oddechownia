## 🟢 Module 1: Live Lesson Registration

**Logic:** Users can book live classes. Subscribers get 2 free classes per _calendar month_ (based on lesson date). Others pay drop-in price.

### User Story

> As a User, I want to book a live lesson so that I can participate in the stream.
> As a Subscriber, I want to use my 2 free monthly credits before paying.

#### Scenario 1: Subscriber booking within free limit

- [ ] **Given** I am a user with an `active` subscription.
- [ ] **And** I have registered for **0** or **1** lessons scheduled in **February**.
- [ ] **When** I click "Sign Up" for a lesson scheduled on **February 15th**.
- [ ] **Then** the system should **not** ask for payment.
- [ ] **And** I should see a success toast "Registered successfully".
- [ ] **And** the "Free Entitlements Used" count for February should increment.

#### Scenario 2: Subscriber exceeding free limit

- [ ] **Given** I am a user with an `active` subscription.
- [ ] **And** I have already used **2** free credits for **February**.
- [ ] **When** I click "Sign Up" for another lesson in **February**.
- [ ] **Then** the system should redirect me to Stripe Checkout.
- [ ] **And** after payment, I should be redirected back with "Payment successful".

#### Scenario 3: Cross-Month Quota Check (The "Billing Period" Fix)

- [ ] **Given** It is currently **January 30th**.
- [ ] **And** I have used 2 credits for _January_.
- [ ] **And** I have used 0 credits for _February_.
- [ ] **When** I navigate the calendar to **February** and click "Sign Up" for a lesson on **Feb 5th**.
- [ ] **Then** the registration should be **FREE** (because Feb quota is 0).

#### Scenario 4: Non-Subscriber / Cancelled Subscription

- [ ] **Given** I am a user with a `canceled` or `past_due` subscription (or no sub).
- [ ] **When** I click "Sign Up" for any lesson.
- [ ] **Then** the system should immediately redirect to Stripe Checkout.

---

## 🗓️ Module 2: Calendar & Scheduling

**Logic:** Users view their schedule (Live + Practice). They can schedule Playlists or modify individual practice sessions.

### User Story

> As a User, I want to see my upcoming classes in a monthly grid.
> As a User, I want to schedule a playlist to build a routine.

### Test Scenarios

#### Scenario 2.1: Calendar Navigation & Loading

- **Given** I am on the Calendar page (current month).
- **When** I click "Next Month".
- **Then** the "Next" button should be disabled.
- **And** a "Loading..." overlay should appear over the grid.
- **And** new events should appear after data is fetched.
- **And** the overlay should disappear.

#### Scenario 2.2: Schedule Playlist (Automatic Mode)

- **Given** I am viewing a Playlist with 5 lessons.
- **When** I click "Schedule Playlist".
- **And** I select "Automatic", Start Date: "Monday 1st", Interval: "Every 2 days".
- **Then** the system should create 5 practice entries in the DB.
- **And** the dates should be: Mon 1st, Wed 3rd, Fri 5th, Sun 7th, Tue 9th.

#### Scenario 2.3: Schedule Playlist (Manual Mode)

- **Given** I am viewing a Playlist.
- **When** I select "Manual" mode in the dialog.
- **And** I uncheck the 2nd lesson.
- **And** I pick specific dates for the 1st and 3rd lesson.
- **Then** only the checked lessons should be added to the calendar.

#### Scenario 2.4: Editing a Scheduled Practice

- **Given** I have a practice scheduled for today at 18:00.
- **When** I click the event in the calendar (Popover opens).
- **And** I click the "Pencil" icon.
- **And** I change the time to 20:00 and click Save.
- **Then** the input fields should revert to text.
- **And** the time should display "20:00".
- **And** a toast "Schedule updated" should appear.

---

## 🛠️ Module 3: Admin Lesson Management

**Logic:** Admins create lessons. Thumbnails are mandatory. Videos are added _after_ creation to prevent orphans.

### User Story

> As an Admin, I want to upload lesson content so users can watch it.

### Test Scenarios

#### Scenario 3.1: Create Lesson (Validation)

- **Given** I am on "New Lesson" page.
- **When** I enter a Title but **no** Thumbnail.
- **And** I click "Create".
- **Then** the form should NOT submit.
- **And** I should see error: "Miniaturka jest wymagana" (Thumbnail is required).
- **And** the Video Uploader should NOT be visible yet.

#### Scenario 3.2: Create Lesson (Success Flow)

- **Given** I fill in Title, Description, and upload a Thumbnail.
- **When** I click "Create and go to video".
- **Then** the page should reload (or redirect) to the Edit view.
- **And** the Mux Video Uploader should now be visible.

#### Scenario 3.3: Update Lesson (Swap Thumbnail)

- **Given** I am editing an existing lesson.
- **When** I click "Change" on the thumbnail.
- **And** I upload a new image.
- **And** I click "Save".
- **Then** the old image should be deleted from storage.
- **And** the new image should be saved.
- **And** the Lesson record should point to the new image ID.

#### Scenario 3.4: Delete Lesson (Cascading)

- **Given** I have a lesson with a Thumbnail and Attachments.
- **When** I click "Delete Lesson".
- **Then** the Lesson record should be removed from DB.
- **And** (Verify in Storage) The thumbnail file should be deleted.
- **And** (Verify in Storage) The attachment files should be deleted.

---

### 📝 How to use this

1.  **Markdown File:** Copy this into a `docs/TEST_SCENARIOS.md` file in your repo.
2.  **Pull Request Template:** When you make a PR, copy the relevant section into the PR description and check off the boxes as you verify them manually.
3.  **Future Automation:** When you are ready to write `playwright` tests, each "Scenario" becomes one `test('should ...')` block.
