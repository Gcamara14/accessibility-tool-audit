# WCAG 2.2 Level A and AA Design System Reference

This document is intended to be uploaded into a custom GPT Knowledge section and used for generating accessibility decision reports. It summarizes each WCAG 2.2 Level A and AA success criterion in plain language, with design-system relevance and common component impacts. Entries are concise and scannable.

## 1.1.1 Non-text Content

- **Requirement:** Create a text alternative for visual and auditory content. So that: People who can't fully see or hear content can understand it.
- **Why this matters for design systems:**
  - Document alt text and icon meaning in component specs.
  - Provide default accessible names for icon-only buttons and controls.
- **Common component impacts:** Buttons, Icons, Images, Decorative images
- **Source:** [guidelines/sc/20/non-text-content.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/non-text-content.html)
- **Understanding:** [understanding/20/non-text-content.html](https://github.com/w3c/wcag/blob/main/understanding/20/non-text-content.html)

## 1.2.1 Audio-only and Video-only (Prerecorded)

- **Requirement:** Provide alternatives for prerecorded audio-only and video-only content so that the information is available in another form.
- **Why this matters for design systems:**
  - If components embed media, ensure text/transcript alternatives are supported.
- **Common component impacts:** Media players, Audio/video embeds
- **Source:** [guidelines/sc/20/audio-only-and-video-only-prerecorded.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/audio-only-and-video-only-prerecorded.html)
- **Understanding:** [understanding/20/audio-only-and-video-only-prerecorded.html](https://github.com/w3c/wcag/blob/main/understanding/20/audio-only-and-video-only-prerecorded.html)

## 1.2.2 Captions (Prerecorded)

- **Requirement:** Provide captions for all prerecorded audio in synchronized media so that people who are deaf or hard of hearing can access the content.
- **Why this matters for design systems:**
  - Media components must support captions or document caption requirements.
- **Common component impacts:** Video player, Synchronized media
- **Source:** [guidelines/sc/20/captions-prerecorded.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/captions-prerecorded.html)
- **Understanding:** [understanding/20/captions-prerecorded.html](https://github.com/w3c/wcag/blob/main/understanding/20/captions-prerecorded.html)

## 1.2.3 Audio Description or Media Alternative (Prerecorded)

- **Requirement:** Provide an alternative for time-based media or audio description for prerecorded video so that people who cannot see the video can access the information.
- **Why this matters for design systems:**
  - Document need for audio description or full-text alternative for video.
- **Common component impacts:** Video player, Synchronized media
- **Source:** [guidelines/sc/20/audio-description-or-media-alternative-prerecorded.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/audio-description-or-media-alternative-prerecorded.html)
- **Understanding:** [understanding/20/audio-description-or-media-alternative-prerecorded.html](https://github.com/w3c/wcag/blob/main/understanding/20/audio-description-or-media-alternative-prerecorded.html)

## 1.2.4 Captions (Live)

- **Requirement:** Provide captions for live audio content so that people who are deaf or hard of hearing can follow real-time content.
- **Why this matters for design systems:**
  - Live media components should support real-time captions.
- **Common component impacts:** Live stream player, Webinar/meeting UI
- **Source:** [guidelines/sc/20/captions-live.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/captions-live.html)
- **Understanding:** [understanding/20/captions-live.html](https://github.com/w3c/wcag/blob/main/understanding/20/captions-live.html)

## 1.2.5 Audio Description (Prerecorded)

- **Requirement:** Provide audio description for prerecorded video so that people who are blind or have low vision can access the visual information.
- **Why this matters for design systems:**
  - Video components should support audio description or extended description.
- **Common component impacts:** Video player
- **Source:** [guidelines/sc/20/audio-description-prerecorded.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/audio-description-prerecorded.html)
- **Understanding:** [understanding/20/audio-description-prerecorded.html](https://github.com/w3c/wcag/blob/main/understanding/20/audio-description-prerecorded.html)

## 1.3.1 Info and Relationships

- **Requirement:** Present structure and relationships so they can be programmatically determined (e.g. headings, lists, form labels) so that assistive technologies can convey structure.
- **Why this matters for design systems:**
  - Use semantic HTML and ARIA so structure is programmatic.
  - Document heading levels, list types, form associations in design tokens.
- **Common component impacts:** Forms, Headings, Tables, Lists, Labels
- **Source:** [guidelines/sc/20/info-and-relationships.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/info-and-relationships.html)
- **Understanding:** [understanding/20/info-and-relationships.html](https://github.com/w3c/wcag/blob/main/understanding/20/info-and-relationships.html)

## 1.3.2 Meaningful Sequence

- **Requirement:** Present content in an order that preserves meaning when the sequence affects interpretation so that reading order makes sense.
- **Why this matters for design systems:**
  - DOM order must match visual order; avoid order-dependent layout only.
- **Common component impacts:** Layouts, Grids, Reading order
- **Source:** [guidelines/sc/20/meaningful-sequence.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/meaningful-sequence.html)
- **Understanding:** [understanding/20/meaningful-sequence.html](https://github.com/w3c/wcag/blob/main/understanding/20/meaningful-sequence.html)

## 1.3.3 Sensory Characteristics

- **Requirement:** Do not rely on shape, size, visual location, or sound alone to convey instructions so that people who cannot perceive those cues can still understand.
- **Why this matters for design systems:**
  - Don't rely only on shape, size, position, or sound for instructions.
- **Common component impacts:** Forms, Instructions, Error messages
- **Source:** [guidelines/sc/20/sensory-characteristics.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/sensory-characteristics.html)
- **Understanding:** [understanding/20/sensory-characteristics.html](https://github.com/w3c/wcag/blob/main/understanding/20/sensory-characteristics.html)

## 1.3.4 Orientation

- **Requirement:** Content must not restrict its view to a single display orientation unless essential so that users can use the device in their preferred orientation.
- **Why this matters for design systems:**
  - Support both portrait and landscape; don't lock to one orientation.
- **Common component impacts:** Layouts, Modals, Full-screen views
- **Source:** [guidelines/sc/21/orientation.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/orientation.html)
- **Understanding:** [understanding/21/orientation.html](https://github.com/w3c/wcag/blob/main/understanding/21/orientation.html)

## 1.3.5 Identify Input Purpose

- **Requirement:** Make the purpose of input fields programmatically determinable (e.g. via autocomplete) so that users can benefit from autofill and personalization.
- **Why this matters for design systems:**
  - Document autocomplete values for form fields; use correct input types.
- **Common component impacts:** Forms, Inputs, Authentication flows
- **Source:** [guidelines/sc/21/identify-input-purpose.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/identify-input-purpose.html)
- **Understanding:** [understanding/21/identify-input-purpose.html](https://github.com/w3c/wcag/blob/main/understanding/21/identify-input-purpose.html)

## 1.4.1 Use of Color

- **Requirement:** Do not use color as the only visual means of conveying information so that people who cannot perceive color can still understand.
- **Why this matters for design systems:**
  - Color must not be the only way to convey information; add icons or text.
- **Common component impacts:** Buttons, Links, Status indicators, Charts
- **Source:** [guidelines/sc/20/use-of-color.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/use-of-color.html)
- **Understanding:** [understanding/20/use-of-color.html](https://github.com/w3c/wcag/blob/main/understanding/20/use-of-color.html)

## 1.4.2 Audio Control

- **Requirement:** Provide a way for users to pause or stop any audio that plays automatically for more than 3 seconds so that people who use screen readers or need quiet can control it.
- **Why this matters for design systems:**
  - Auto-playing audio must have a control to pause/stop; document in specs.
- **Common component impacts:** Media player, Carousel, Notifications
- **Source:** [guidelines/sc/20/audio-control.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/audio-control.html)
- **Understanding:** [understanding/20/audio-control.html](https://github.com/w3c/wcag/blob/main/understanding/20/audio-control.html)

## 1.4.3 Contrast (Minimum)

- **Requirement:** Provide sufficient contrast between text and its background (4.5:1 for normal text, 3:1 for large text) so that more people can read the content.
- **Why this matters for design systems:**
  - Define and enforce minimum contrast in design tokens (4.5:1 text, 3:1 large).
- **Common component impacts:** Typography, Buttons, Links, Form labels
- **Source:** [guidelines/sc/20/contrast-minimum.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/contrast-minimum.html)
- **Understanding:** [understanding/20/contrast-minimum.html](https://github.com/w3c/wcag/blob/main/understanding/20/contrast-minimum.html)

## 1.4.4 Resize Text

- **Requirement:** Allow text to be resized up to 200% without loss of content or functionality so that people with low vision can read it.
- **Why this matters for design systems:**
  - Use relative units and allow zoom; avoid fixed px for body text.
- **Common component impacts:** Typography, Layouts, Modals
- **Source:** [guidelines/sc/20/resize-text.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/resize-text.html)
- **Understanding:** [understanding/20/resize-text.html](https://github.com/w3c/wcag/blob/main/understanding/20/resize-text.html)

## 1.4.5 Images of Text

- **Requirement:** Prefer real text over images of text so that text can be resized and read by assistive technologies.
- **Why this matters for design systems:**
  - Prefer real text over images of text; document when image-of-text is allowed.
- **Common component impacts:** Headings, Logos, Decorative text
- **Source:** [guidelines/sc/20/images-of-text.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/images-of-text.html)
- **Understanding:** [understanding/20/images-of-text.html](https://github.com/w3c/wcag/blob/main/understanding/20/images-of-text.html)

## 1.4.10 Reflow

- **Requirement:** Content must reflow at 320px width without horizontal scrolling (and at 400% zoom) so that low-vision and mobile users can read without scrolling in two dimensions.
- **Why this matters for design systems:**
  - Layouts must reflow at 320px width without horizontal scroll; test at 400% zoom.
- **Common component impacts:** Layouts, Modals, Tables, Focus states
- **Source:** [guidelines/sc/21/reflow.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/reflow.html)
- **Understanding:** [understanding/21/reflow.html](https://github.com/w3c/wcag/blob/main/understanding/21/reflow.html)

## 1.4.11 Non-text Contrast

- **Requirement:** UI components and graphical objects must have at least 3:1 contrast against adjacent colors so that they are visible to more users.
- **Why this matters for design systems:**
  - UI components and graphics must have 3:1 contrast against adjacent colors.
- **Common component impacts:** Buttons, Form controls, Icons, Focus indicators
- **Source:** [guidelines/sc/21/non-text-contrast.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/non-text-contrast.html)
- **Understanding:** [understanding/21/non-text-contrast.html](https://github.com/w3c/wcag/blob/main/understanding/21/non-text-contrast.html)

## 1.4.12 Text Spacing

- **Requirement:** Do not restrict users from overriding text spacing (line height, paragraph spacing, letter/word spacing) so that people with low vision can read more easily.
- **Why this matters for design systems:**
  - Don't prevent users from overriding line height, paragraph spacing, letter/word spacing.
- **Common component impacts:** Typography, Cards, Blocks of text
- **Source:** [guidelines/sc/21/text-spacing.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/text-spacing.html)
- **Understanding:** [understanding/21/text-spacing.html](https://github.com/w3c/wcag/blob/main/understanding/21/text-spacing.html)

## 1.4.13 Content on Hover or Focus

- **Requirement:** Content that appears on hover or focus must be dismissible, allow the pointer to move to it, and not disappear until the user moves away or dismisses it so that keyboard and low-vision users can access it.
- **Why this matters for design systems:**
  - Dismissable on blur; don't require hover; allow pointer users to move to content.
- **Common component impacts:** Tooltips, Popovers, Dropdowns, Modals
- **Source:** [guidelines/sc/21/content-on-hover-or-focus.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/content-on-hover-or-focus.html)
- **Understanding:** [understanding/21/content-on-hover-or-focus.html](https://github.com/w3c/wcag/blob/main/understanding/21/content-on-hover-or-focus.html)

## 2.1.1 Keyboard

- **Requirement:** Ensure pointer actions have a keyboard equivalent so that people who rely on the keyboard (or keyboard-like input) can operate all functionality.
- **Why this matters for design systems:**
  - All interactive components must be keyboard operable; document key behavior.
- **Common component impacts:** Buttons, Links, Forms, Modals, Drag-and-drop
- **Source:** [guidelines/sc/20/keyboard.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/keyboard.html)
- **Understanding:** [understanding/20/keyboard.html](https://github.com/w3c/wcag/blob/main/understanding/20/keyboard.html)

## 2.1.2 No Keyboard Trap

- **Requirement:** Keyboard focus must not be trapped in a component; users must be able to move focus away (e.g. with Tab) so that keyboard users are not stuck.
- **Why this matters for design systems:**
  - Focus must be escapable (e.g. Tab) from modals, menus, and custom widgets.
- **Common component impacts:** Modals, Dialogs, Menus, Lightboxes
- **Source:** [guidelines/sc/20/no-keyboard-trap.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/no-keyboard-trap.html)
- **Understanding:** [understanding/20/no-keyboard-trap.html](https://github.com/w3c/wcag/blob/main/understanding/20/no-keyboard-trap.html)

## 2.1.4 Character Key Shortcuts

- **Requirement:** Single-character key shortcuts must be toggleable, remappable, or only active when the component is focused so that they don't conflict with assistive technology or accidental activation.
- **Why this matters for design systems:**
  - Single-key shortcuts must be toggleable, remappable, or active only when focused.
- **Common component impacts:** Editors, Data grids, Shortcut-driven UI
- **Source:** [guidelines/sc/21/character-key-shortcuts.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/character-key-shortcuts.html)
- **Understanding:** [understanding/21/character-key-shortcuts.html](https://github.com/w3c/wcag/blob/main/understanding/21/character-key-shortcuts.html)

## 2.2.1 Timing Adjustable

- **Requirement:** For any time limit, allow users to turn it off, extend it, or adjust it (with exceptions) so that people who need more time are not blocked.
- **Why this matters for design systems:**
  - Time limits must be configurable or extendable; document in component specs.
- **Common component impacts:** Forms, Session timeout, Carousel auto-advance
- **Source:** [guidelines/sc/20/timing-adjustable.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/timing-adjustable.html)
- **Understanding:** [understanding/20/timing-adjustable.html](https://github.com/w3c/wcag/blob/main/understanding/20/timing-adjustable.html)

## 2.2.2 Pause, Stop, Hide

- **Requirement:** For auto-updating content, allow users to pause, stop, or hide it so that people who are distracted or use assistive technology can control it.
- **Why this matters for design systems:**
  - Auto-updating content must be pausable, stoppable, or hideable.
- **Common component impacts:** Carousels, Marquees, Live regions, Notifications
- **Source:** [guidelines/sc/20/pause-stop-hide.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/pause-stop-hide.html)
- **Understanding:** [understanding/20/pause-stop-hide.html](https://github.com/w3c/wcag/blob/main/understanding/20/pause-stop-hide.html)

## 2.3.1 Three Flashes or Below Threshold

- **Requirement:** Content must not flash more than three times per second (or be below the general and red flash thresholds) so that people with photosensitive seizures are not put at risk.
- **Why this matters for design systems:**
  - Avoid content that flashes more than 3 times per second; document flash limits.
- **Common component impacts:** Animations, Ads, Alerts
- **Source:** [guidelines/sc/20/three-flashes-or-below-threshold.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/three-flashes-or-below-threshold.html)
- **Understanding:** [understanding/20/three-flashes-or-below-threshold.html](https://github.com/w3c/wcag/blob/main/understanding/20/three-flashes-or-below-threshold.html)

## 2.4.1 Bypass Blocks

- **Requirement:** Provide a way to skip repeated blocks (e.g. skip link or landmarks) so that keyboard users can reach main content quickly.
- **Why this matters for design systems:**
  - Provide skip links or landmarks so repeated blocks can be bypassed.
- **Common component impacts:** Navigation, Page template, Headers
- **Source:** [guidelines/sc/20/bypass-blocks.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/bypass-blocks.html)
- **Understanding:** [understanding/20/bypass-blocks.html](https://github.com/w3c/wcag/blob/main/understanding/20/bypass-blocks.html)

## 2.4.2 Page Titled

- **Requirement:** Give each page a descriptive title so that users can identify and find the page.
- **Why this matters for design systems:**
  - Document page title pattern; ensure unique, descriptive titles.
- **Common component impacts:** App shell, Page template
- **Source:** [guidelines/sc/20/page-titled.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/page-titled.html)
- **Understanding:** [understanding/20/page-titled.html](https://github.com/w3c/wcag/blob/main/understanding/20/page-titled.html)

## 2.4.3 Focus Order

- **Requirement:** Ensure the focus order follows a meaningful sequence so that keyboard users encounter content in an order that makes sense.
- **Why this matters for design systems:**
  - Focus order must match visual order; avoid positive tabindex; document order.
- **Common component impacts:** Modals, Forms, Layouts, Dynamic content
- **Source:** [guidelines/sc/20/focus-order.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/focus-order.html)
- **Understanding:** [understanding/20/focus-order.html](https://github.com/w3c/wcag/blob/main/understanding/20/focus-order.html)

## 2.4.4 Link Purpose (In Context)

- **Requirement:** Make link purpose determinable from the link text or its context so that users know where the link goes without opening it.
- **Why this matters for design systems:**
  - Link text (or accessible name) must describe purpose; avoid "click here".
- **Common component impacts:** Links, Cards, Buttons that navigate
- **Source:** [guidelines/sc/20/link-purpose-in-context.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/link-purpose-in-context.html)
- **Understanding:** [understanding/20/link-purpose-in-context.html](https://github.com/w3c/wcag/blob/main/understanding/20/link-purpose-in-context.html)

## 2.4.5 Multiple Ways

- **Requirement:** Provide more than one way to find content (e.g. nav, search, sitemap) so that users can find pages in a way that suits them.
- **Why this matters for design systems:**
  - Sites should offer multiple ways to find content (nav, search, sitemap).
- **Common component impacts:** Navigation, Search, Site structure
- **Source:** [guidelines/sc/20/multiple-ways.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/multiple-ways.html)
- **Understanding:** [understanding/20/multiple-ways.html](https://github.com/w3c/wcag/blob/main/understanding/20/multiple-ways.html)

## 2.4.6 Headings and Labels

- **Requirement:** Use descriptive headings and labels so that users can understand structure and form fields.
- **Why this matters for design systems:**
  - Use descriptive headings and labels; document in content guidelines.
- **Common component impacts:** Forms, Headings, Sections, Tables
- **Source:** [guidelines/sc/20/headings-and-labels.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/headings-and-labels.html)
- **Understanding:** [understanding/20/headings-and-labels.html](https://github.com/w3c/wcag/blob/main/understanding/20/headings-and-labels.html)

## 2.4.7 Focus Visible

- **Requirement:** Make the keyboard focus indicator visible so that keyboard users can see which element has focus.
- **Why this matters for design systems:**
  - Define visible focus indicator in design tokens; ensure 3:1 contrast and visibility.
- **Common component impacts:** Buttons, Links, Form controls, Focus states
- **Source:** [guidelines/sc/20/focus-visible.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/focus-visible.html)
- **Understanding:** [understanding/20/focus-visible.html](https://github.com/w3c/wcag/blob/main/understanding/20/focus-visible.html)

## 2.4.11 Focus Not Obscured (Minimum)

- **Requirement:** When a component receives keyboard focus, it must not be entirely hidden by author-created content so that keyboard users can see what has focus.
- **Why this matters for design systems:**
  - Sticky/fixed UI must not fully cover focused component; use scroll-padding or layout.
- **Common component impacts:** Modals, Sticky headers/footers, Focus states
- **Source:** [guidelines/sc/22/focus-not-obscured-minimum.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/focus-not-obscured-minimum.html)
- **Understanding:** [understanding/22/focus-not-obscured-minimum.html](https://github.com/w3c/wcag/blob/main/understanding/22/focus-not-obscured-minimum.html)

## 2.5.1 Pointer Gestures

- **Requirement:** All functionality that uses multipoint or path-based gestures must have a single-pointer alternative so that users who cannot perform gestures can still operate the content.
- **Why this matters for design systems:**
  - Multi-point or path-based gestures must have single-pointer alternatives.
- **Common component impacts:** Carousels, Drag-and-drop, Maps, Charts
- **Source:** [guidelines/sc/21/pointer-gestures.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/pointer-gestures.html)
- **Understanding:** [understanding/21/pointer-gestures.html](https://github.com/w3c/wcag/blob/main/understanding/21/pointer-gestures.html)

## 2.5.2 Pointer Cancellation

- **Requirement:** Do not trigger functionality on the down-event of a pointer alone; use the up-event or allow cancellation so that users don't activate by mistake.
- **Why this matters for design systems:**
  - Activation on up-event (or allow cancel before commit); avoid down-event only.
- **Common component impacts:** Buttons, Links, Drag-and-drop, Touch targets
- **Source:** [guidelines/sc/21/pointer-cancellation.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/pointer-cancellation.html)
- **Understanding:** [understanding/21/pointer-cancellation.html](https://github.com/w3c/wcag/blob/main/understanding/21/pointer-cancellation.html)

## 2.5.3 Label in Name

- **Requirement:** For UI components with a visible label, the accessible name must contain the label text so that speech-input users can activate by saying the label.
- **Why this matters for design systems:**
  - Visible label text must be included in the accessible name (e.g. aria-label, content).
- **Common component impacts:** Buttons, Links, Form controls, Icon buttons
- **Source:** [guidelines/sc/21/label-in-name.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/label-in-name.html)
- **Understanding:** [understanding/21/label-in-name.html](https://github.com/w3c/wcag/blob/main/understanding/21/label-in-name.html)

## 2.5.4 Motion Actuation

- **Requirement:** Functionality triggered by device or user motion must have a UI control alternative so that users who cannot or prefer not to use motion can still operate it.
- **Why this matters for design systems:**
  - Device motion (e.g. shake) must have a UI alternative.
- **Common component impacts:** Motion-controlled features, Alternative controls
- **Source:** [guidelines/sc/21/motion-actuation.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/motion-actuation.html)
- **Understanding:** [understanding/21/motion-actuation.html](https://github.com/w3c/wcag/blob/main/understanding/21/motion-actuation.html)

## 2.5.7 Dragging Movements

- **Requirement:** Functionality that uses dragging must have a non-drag alternative (e.g. arrow keys or single tap/click) so that users who cannot drag can still use it.
- **Why this matters for design systems:**
  - Dragging must have a non-drag alternative (e.g. arrow keys, click to move).
- **Common component impacts:** Drag-and-drop, Sliders, Reorderable lists
- **Source:** [guidelines/sc/22/dragging-movements.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/dragging-movements.html)
- **Understanding:** [understanding/22/dragging-movements.html](https://github.com/w3c/wcag/blob/main/understanding/22/dragging-movements.html)

## 2.5.8 Target Size (Minimum)

- **Requirement:** Touch targets must be at least 24×24 CSS pixels (or have sufficient spacing) so that people with limited dexterity can activate them without accidentally activating another.
- **Why this matters for design systems:**
  - Touch targets at least 24×24 CSS pixels, or spaced so 24px circle doesn't overlap another.
- **Common component impacts:** Buttons, Links, Form controls, Icon buttons
- **Source:** [guidelines/sc/22/target-size-minimum.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/target-size-minimum.html)
- **Understanding:** [understanding/22/target-size-minimum.html](https://github.com/w3c/wcag/blob/main/understanding/22/target-size-minimum.html)

## 3.1.1 Language of Page

- **Requirement:** Set the default human language of the page (e.g. lang on html) so that assistive technologies and browsers can present content correctly.
- **Why this matters for design systems:**
  - Set lang on html; document in app shell.
- **Common component impacts:** Page template, App shell
- **Source:** [guidelines/sc/20/language-of-page.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/language-of-page.html)
- **Understanding:** [understanding/20/language-of-page.html](https://github.com/w3c/wcag/blob/main/understanding/20/language-of-page.html)

## 3.1.2 Language of Parts

- **Requirement:** Identify the language of content that is in a different language from the page so that assistive technologies can switch pronunciation and display.
- **Why this matters for design systems:**
  - Use lang attribute on content in a different language.
- **Common component impacts:** Typography, Content blocks, Quotes
- **Source:** [guidelines/sc/20/language-of-parts.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/language-of-parts.html)
- **Understanding:** [understanding/20/language-of-parts.html](https://github.com/w3c/wcag/blob/main/understanding/20/language-of-parts.html)

## 3.2.1 On Focus

- **Requirement:** Do not change context (e.g. submit form, open new window) when a component receives focus so that users are not surprised by unexpected changes.
- **Why this matters for design systems:**
  - Don't change context (e.g. submit, navigate) on focus alone.
- **Common component impacts:** Forms, Links, Dropdowns
- **Source:** [guidelines/sc/20/on-focus.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/on-focus.html)
- **Understanding:** [understanding/20/on-focus.html](https://github.com/w3c/wcag/blob/main/understanding/20/on-focus.html)

## 3.2.2 On Input

- **Requirement:** Do not change context automatically when users change a setting (e.g. select, checkbox) unless they are informed; use explicit submit or confirmation so that users stay in control.
- **Why this matters for design systems:**
  - Don't auto-submit or change context on input alone; use explicit submit.
- **Common component impacts:** Forms, Selects, Search, Dropdowns
- **Source:** [guidelines/sc/20/on-input.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/on-input.html)
- **Understanding:** [understanding/20/on-input.html](https://github.com/w3c/wcag/blob/main/understanding/20/on-input.html)

## 3.2.3 Consistent Navigation

- **Requirement:** Repeated navigation mechanisms should appear in the same relative order across pages so that users can find them predictably.
- **Why this matters for design systems:**
  - Repeated nav components should appear in the same order across pages.
- **Common component impacts:** Navigation, Headers, Sidebars
- **Source:** [guidelines/sc/20/consistent-navigation.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/consistent-navigation.html)
- **Understanding:** [understanding/20/consistent-navigation.html](https://github.com/w3c/wcag/blob/main/understanding/20/consistent-navigation.html)

## 3.2.4 Consistent Identification

- **Requirement:** Components that have the same functionality should be identified consistently (same icon, label, or pattern) so that users recognize them across the site.
- **Why this matters for design systems:**
  - Same functionality should use same component/icon/label across the system.
- **Common component impacts:** Buttons, Icons, Links, Components
- **Source:** [guidelines/sc/20/consistent-identification.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/consistent-identification.html)
- **Understanding:** [understanding/20/consistent-identification.html](https://github.com/w3c/wcag/blob/main/understanding/20/consistent-identification.html)

## 3.2.6 Consistent Help

- **Requirement:** If a help mechanism (e.g. contact, FAQ) appears on multiple pages, place it in the same relative order on each page so that users can find it easily.
- **Why this matters for design systems:**
  - If help (contact, FAQ, etc.) appears on multiple pages, place it in the same relative order.
- **Common component impacts:** Help link, Contact, Footer, Navigation
- **Source:** [guidelines/sc/22/consistent-help.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/consistent-help.html)
- **Understanding:** [understanding/22/consistent-help.html](https://github.com/w3c/wcag/blob/main/understanding/22/consistent-help.html)

## 3.3.1 Error Identification

- **Requirement:** Provide descriptive notification of errors so that users know an error exists and what is wrong.
- **Why this matters for design systems:**
  - Errors must be clearly identified and described; use programmatic association.
- **Common component impacts:** Forms, Error messages, Validation
- **Source:** [guidelines/sc/20/error-identification.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/error-identification.html)
- **Understanding:** [understanding/20/error-identification.html](https://github.com/w3c/wcag/blob/main/understanding/20/error-identification.html)

## 3.3.2 Labels or Instructions

- **Requirement:** Provide labels or instructions for user input so that users know what to enter.
- **Why this matters for design systems:**
  - Provide labels or instructions for inputs; document in component docs.
- **Common component impacts:** Forms, Inputs, Buttons, Required fields
- **Source:** [guidelines/sc/20/labels-or-instructions.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/labels-or-instructions.html)
- **Understanding:** [understanding/20/labels-or-instructions.html](https://github.com/w3c/wcag/blob/main/understanding/20/labels-or-instructions.html)

## 3.3.3 Error Suggestion

- **Requirement:** When an input error is detected, suggest corrections where possible so that users can fix errors more easily.
- **Why this matters for design systems:**
  - Where possible, suggest corrections for input errors.
- **Common component impacts:** Forms, Validation, Error messages
- **Source:** [guidelines/sc/20/error-suggestion.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/error-suggestion.html)
- **Understanding:** [understanding/20/error-suggestion.html](https://github.com/w3c/wcag/blob/main/understanding/20/error-suggestion.html)

## 3.3.4 Error Prevention (Legal, Financial, Data)

- **Requirement:** For actions that submit legal/financial data or change user-controlled data, allow review, confirmation, or reversal so that users can correct mistakes.
- **Why this matters for design systems:**
  - Reversible submissions, confirmations, or review before commit for legal/financial actions.
- **Common component impacts:** Forms, Checkout, Authentication, Modals
- **Source:** [guidelines/sc/20/error-prevention-legal-financial-data.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/error-prevention-legal-financial-data.html)
- **Understanding:** [understanding/20/error-prevention-legal-financial-data.html](https://github.com/w3c/wcag/blob/main/understanding/20/error-prevention-legal-financial-data.html)

## 3.3.7 Redundant Entry

- **Requirement:** Do not require users to re-enter information they have already provided in the same process (e.g. autocomplete, reuse) so that cognitive load is reduced.
- **Why this matters for design systems:**
  - Don't require re-entry of same info in the same process; autocomplete or reuse.
- **Common component impacts:** Forms, Multi-step flows, Authentication
- **Source:** [guidelines/sc/22/redundant-entry.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/redundant-entry.html)
- **Understanding:** [understanding/22/redundant-entry.html](https://github.com/w3c/wcag/blob/main/understanding/22/redundant-entry.html)

## 3.3.8 Accessible Authentication (Minimum)

- **Requirement:** Cognitive function tests (e.g. memorizing or transcribing) used for authentication must have an alternative that does not require the test (e.g. object recognition, copy-paste from a manager) so that users with cognitive disabilities can authenticate.
- **Why this matters for design systems:**
  - Cognitive function tests (e.g. puzzle, memorization) must have an alternative (e.g. object recognition, copy-paste from manager).
- **Common component impacts:** Login, CAPTCHA, Authentication flows
- **Source:** [guidelines/sc/22/accessible-authentication-minimum.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/accessible-authentication-minimum.html)
- **Understanding:** [understanding/22/accessible-authentication-minimum.html](https://github.com/w3c/wcag/blob/main/understanding/22/accessible-authentication-minimum.html)

## 4.1.2 Name, Role, Value

- **Requirement:** Give components correct names, roles, states, and values so that assistive technology can gather and expose them correctly.
- **Why this matters for design systems:**
  - All UI components must have name and role; document in component API.
- **Common component impacts:** Buttons, Forms, Custom widgets, Modals
- **Source:** [guidelines/sc/20/name-role-value.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/20/name-role-value.html)
- **Understanding:** [understanding/20/name-role-value.html](https://github.com/w3c/wcag/blob/main/understanding/20/name-role-value.html)

## 4.1.3 Status Messages

- **Requirement:** Use a mechanism (e.g. live regions) so that status messages can be programmatically determined and announced by assistive technologies without receiving focus.
- **Why this matters for design systems:**
  - Use appropriate live regions (e.g. role=status, role=alert) for status updates.
- **Common component impacts:** Toasts, Alerts, Form validation, Loading states
- **Source:** [guidelines/sc/21/status-messages.html](https://github.com/w3c/wcag/blob/main/guidelines/sc/21/status-messages.html)
- **Understanding:** [understanding/21/status-messages.html](https://github.com/w3c/wcag/blob/main/understanding/21/status-messages.html)
