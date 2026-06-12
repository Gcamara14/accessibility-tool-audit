// templates-v1-03-19-2026-refactored.js
// Global Bug Templates for Chrome Extension
// Auto-refactored by Code Puppy (Platform-Aware IDs, dates, sorted)

console.log('🎫 Loading global templates configuration...');

window.A11Y_TEMPLATES = [
{
    "id": "WA11Y-ALL-UNKNOWN-001",
    "title": "Custom Template Needed",
    "platforms": [
        "Web",
        "iOS",
        "Android"
    ],
    "wcag": "Missing-WCAG",
    "priority": "Needs to be prioritized",
    "severity": "TBD",
    "thumbnail": "https://via.placeholder.com/80?text=Custom",
    "shortDescription": "",
    "expectedResult": "",
    "actualResult": "",
    "recommendation": "",
    "steps": [],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.1.1-001",
    "title": "Alt Text: Missing Alt Text (Generic)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Missing+Alt+Text",
    "shortDescription": "Image is missing contentDescription, making it inaccessible to TalkBack users.",
    "expectedResult": "All informative images should have a descriptive contentDescription attribute for TalkBack.",
    "actualResult": "The image is missing a contentDescription and is not announced by TalkBack.",
    "recommendation": "Add a meaningful contentDescription attribute to the image to describe its content for TalkBack users. Describe the image.",
    "steps": [
        "Navigate to the screen with the image.",
        "Enable TalkBack and focus on the image.",
        "Verify that TalkBack does not announce any description for the image."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.1.1-002",
    "title": "Alt Text: Informative Image Description Text Is Not Accurate (informative)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Inaccurate+Alt+Text",
    "shortDescription": "Informative image has an inaccurate or non-descriptive contentDescription.",
    "expectedResult": "contentDescription for informative images should accurately describe the content or purpose of the image.",
    "actualResult": "The contentDescription provided does not accurately reflect the image's content or purpose.",
    "recommendation": "Update the contentDescription to provide an accurate and concise description of the image.",
    "steps": [
        "Identify the informative image on the screen.",
        "Enable TalkBack and listen to the description of the image.",
        "Verify that the description provided by TalkBack accurately represents the image's content."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.1.1-003",
    "title": "Alt Text: Decorative Image Announced to TalkBack (Decorative)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Decorative+Image",
    "shortDescription": "Decorative image is announced to TalkBack users, causing unnecessary distraction.",
    "expectedResult": "Decorative images should have a null or empty contentDescription, allowing them to be ignored by TalkBack.",
    "actualResult": "The decorative image has a contentDescription, making it announced to TalkBack users.",
    "recommendation": "Remove or set contentDescription to null for decorative images to prevent TalkBack from announcing them.",
    "steps": [
        "Locate the decorative image on the screen.",
        "Enable TalkBack and focus on the image.",
        "Confirm that TalkBack announces the image despite it being decorative."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.1.1-004",
    "title": "Alt Text: Complex Image Needs Detailed Description (Complex)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Complex+Image",
    "shortDescription": "Complex image requires a detailed description through text or data structure.",
    "expectedResult": "Complex images should be accompanied by a detailed description, either in a paragraph or structured data format, for TalkBack users.",
    "actualResult": "Complex image lacks an accessible detailed description to convey its content to TalkBack users.",
    "recommendation": "Provide a detailed description for complex images, either as inline text or structured data table accessible to TalkBack.",
    "steps": [
        "Identify the complex image on the screen.",
        "Enable TalkBack and navigate to the image.",
        "Confirm the absence of a detailed description for the complex image."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.1.1-001",
    "title": "Alt Text: Missing Alt Text Attribute (Generic)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Missing+Alt+Text",
    "shortDescription": "Image is missing alt attribute, rendering it inaccessible to screen readers.",
    "expectedResult": "All informative images should have descriptive alt text attributes.",
    "actualResult": "The image is missing an alt attribute and is not labeled for screen readers.",
    "recommendation": "Add a meaningful alt text attribute to the image to describe its content.",
    "codeExample": "\n        // Best: img use alt\n        <img src=\"pepperoni.jpg\" alt=\"Pepperoni Pizza\">\n        \n        // Good: SVG\n        <svg role=\"img\" aria-label=\"XYZ\">\n        \n        // Good: Icon\n        <i role=img\" aria-label=\"XYZ Icon Font\">",
    "steps": [
        "Navigate to the page with the image.",
        "Inspect the image element in the HTML.",
        "Confirm the absence of an alt attribute or descriptive text."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.1.1-002",
    "title": "Alt Text: Informative Image Alt Text Is Not Accurate (informative)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Inaccurate+Alt+Text",
    "shortDescription": "Informative image, is not described correctly. The image description is inaccurate or non-descriptive alt text.",
    "expectedResult": "Alt text for informative images should accurately describe the content or purpose of the image.",
    "actualResult": "The alt text provided does not accurately reflect the image's content or purpose.",
    "recommendation": "Update the alt text to provide an accurate and concise description of the image.",
    "codeExample": "\n        // Best: Descriptive img use alt\n        <img src=\"pepperoni.jpg\" alt=\"Make me descriptive/describe me accurately here\">\n        \n        // Good: SVG example\n        <svg role=img\" aria-label=\"Make me descriptive/describe me accurately here\">\n        \n        // Good: Icon font example\n        <i role=img\" aria-label=\"Make me descriptive/describe me accurately here\">",
    "steps": [
        "Identify the informative image on the page.",
        "Review the alt text attribute for accuracy.",
        "Verify that the alt text provides an informative description of the image."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.1.1-003",
    "title": "Alt Text: Decorative Image Announced to Screen Readers (Decorative)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Decorative+Image",
    "shortDescription": "Decorative image is announced to screen readers, which can be distracting.",
    "expectedResult": "Decorative images should have an empty alt attribute to ensure they are ignored by screen readers.",
    "actualResult": "The decorative image is being announced to screen readers instead of being ignored.",
    "recommendation": "Add an empty alt attribute (alt=\"\") to mark the image as decorative and prevent screen reader announcement. No blank space. Just empty quotes.",
    "codeExample": "\n        // Best: empty alt, no space, just empty quotes\n        <img src=\"banner.png\" alt=\"\">\n        \n        // SVG or icon font - both role=presentation and aria-hidden\n        <svg aria-hidden=\"true\" role=\"presentation\">",
    "steps": [
        "Locate the decorative image on the page.",
        "Inspect the alt attribute of the image.",
        "Confirm that the alt attribute is either missing or incorrectly populated."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.1.1-004",
    "title": "Alt Text: Complex Image Needs Detailed Description (Complex)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Complex+Image",
    "shortDescription": "Complex images like a graph requires a detailed description via paragraph or data table.",
    "expectedResult": "Complex images should be accompanied by a detailed text description, either inline or in a data table, to convey information.",
    "actualResult": "Complex image lacks a descriptive paragraph or data table to accurately convey its content.",
    "recommendation": "Provide a detailed description of the complex image, either as inline text or in a data table adjacent to the image. Or have a dialog available so that we can provide a data table inside the dialog.",
    "codeExample": "// Best:\n        The alt text does not adequately describe it. Provide a data table for screen reader users.",
    "steps": [
        "Identify the complex image on the page.",
        "Check for a corresponding detailed description in the form of text or a data table.",
        "Confirm that the description is missing or insufficient for understanding the image."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.1.1-001",
    "title": "Alt Text: Missing Alt Text (Generic)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Missing+Alt+Text",
    "shortDescription": "Image is missing accessibility label, making it inaccessible to VoiceOver users.",
    "expectedResult": "All informative images should have a descriptive accessibility label for VoiceOver.",
    "actualResult": "The image lacks an accessibility label and is not announced by VoiceOver.",
    "recommendation": "Add a meaningful accessibility label to the image to describe its content for VoiceOver users. Describe image via accssibilityLabel",
    "codeExample": "\n// Best: Update the label. Make it describe the image correctly.\nimageView.accessibilityLabel = \"Awesome Pizza Logo\"\nimageView.accessibilityTraits = [.image]",
    "steps": [
        "Navigate to the screen with the image.",
        "Enable VoiceOver and focus on the image.",
        "Verify that VoiceOver does not announce any description for the image."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.1.1-002",
    "title": "Alt Text: Informative Image Description Text Is Not Accurate (informative)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Inaccurate+Alt+Text",
    "shortDescription": "Informative image has an inaccurate or non-descriptive accessibility label.",
    "expectedResult": "Accessibility labels for informative images should accurately describe the content or purpose of the image.",
    "actualResult": "The accessibility label provided does not accurately reflect the image's content or purpose.",
    "recommendation": "Update the accessibility label to provide an accurate and concise description of the image.",
    "codeExample": "\n// Best: Screen reader announces the image. Use label.\nimageView.accessibilityLabel = \"XYZ\"\nimageView.accessibilityTraits = [.image]",
    "steps": [
        "Identify the informative image on the screen.",
        "Enable VoiceOver and listen to the description of the image.",
        "Verify that the description provided by VoiceOver accurately represents the image's content."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.1.1-003",
    "title": "Alt Text: Decorative Image Announced to VoiceOver (Decorative)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Decorative+Image",
    "shortDescription": "Decorative image is announced to VoiceOver users, causing unnecessary distraction.",
    "expectedResult": "Decorative images should not have an accessibility label, allowing them to be ignored by VoiceOver.",
    "actualResult": "The decorative image has an accessibility label, making it announced to VoiceOver users.",
    "recommendation": "Remove the accessibility label for decorative images to prevent VoiceOver from announcing them.",
    "codeExample": "\n// Best: Make decorative/ignored - Screen reader should skip the element.\nelement.isAccessibilityElement = false",
    "steps": [
        "Locate the decorative image on the screen.",
        "Enable VoiceOver and focus on the image.",
        "Confirm that VoiceOver announces the image despite it being decorative."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.1.1-004",
    "title": "Alt Text: Complex Image Needs Detailed Description (Complex)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Complex+Image",
    "shortDescription": "Complex image requires a detailed description through text or data table.",
    "expectedResult": "Complex images should be accompanied by a detailed description, either in a paragraph or structured data format, for VoiceOver users.",
    "actualResult": "Complex image lacks an accessible detailed description to convey its content to VoiceOver users.",
    "recommendation": "Provide a detailed description for complex images, either as inline text or structured data accessible to VoiceOver.",
    "codeExample": "\n// Best: Screen reader announces the image. Use label or supply a paragraph text below the image.\nimageView.accessibilityLabel = \"XYZ\"\nimageView.accessibilityTraits = [.image]\n",
    "steps": [
        "Identify the complex image on the screen.",
        "Enable VoiceOver and navigate to the image.",
        "Confirm the absence of a detailed description for the complex image."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.3.1-001",
    "title": "Role: Heading Role is Missing (Heading)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Heading+Missing",
    "shortDescription": "A TextView intended as a heading lacks appropriate heading accessibility properties, hindering screen reader navigation.",
    "expectedResult": "Headings should use `android:accessibilityHeading` attribute set to `true.",
    "actualResult": "The heading keyword is missing in talkback",
    "recommendation": "Set the `android:accessibilityHeading` attribute to `true` on TextViews intended as headings to enhance content structure.",
    "codeExample": "\n// Best: Mark heading via (XML)\n<TextView android:accessibilityHeading=\"true\" />\n---\n// Good: Mark heading\nViewCompat.setAccessibilityHeading(textView, true)",
    "steps": [
        "Identify the TextView intended to be a heading.",
        "Check if it has the `android:accessibilityHeading` attribute set to `true`.",
        "If not, set `android:accessibilityHeading` to `true` in the TextView's XML or programmatically."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.3.1-002",
    "title": "Info: Element Grouping - Not Read as One Group (Read Together)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Grouping+Issue",
    "shortDescription": "Related elements are not grouped correctly, causing TalkBack to read them individually instead of as a cohesive group.",
    "expectedResult": "Related elements should be grouped and read together by TalkBack to convey their relationship effectively.",
    "actualResult": "Related elements are read individually, making it difficult for users to understand their relationship.",
    "recommendation": "Group related elements by using a container layout (e.g., LinearLayout) and manage their accessibility by setting `importantForAccessibility=\"false\"` on the container and `importantForAccessibility=\"true\"` on the individual elements. Additionally, use `ViewGroup.setAccessibilityTraversalAfter()` and `setAccessibilityTraversalBefore()` to define the traversal order if necessary.",
    "steps": [
        "Navigate to the screen containing the grouped elements.",
        "Use TalkBack to navigate to the grouped elements.",
        "Observe that each element is read individually instead of as a single group."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.3.1-003",
    "title": "Info: Missing List Structure - Use Semantic Grouping",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=List+Structure",
    "shortDescription": "Lists are not properly structured using semantic grouping, making them inaccessible to TalkBack users.",
    "expectedResult": "Content that is a list should be programmatically grouped and recognized as such by TalkBack, allowing efficient navigation.",
    "actualResult": "List items are not grouped semantically, causing TalkBack to read them without context, which can confuse users.",
    "recommendation": "Use `RecyclerView` or `ListView` with appropriate accessibility descriptions. Ensure that each list item has meaningful `contentDescription` and that the list is announced correctly by TalkBack. Additionally, consider using `AccessibilityDelegate` to enhance the accessibility of complex list items.",
    "steps": [
        "Navigate to the screen containing the list.",
        "Use TalkBack to navigate through the list items.",
        "Observe that the list is not announced as a list, hindering efficient navigation."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-1.3.1-004",
    "title": "Info: Strikethrough Text is Not Accessible",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Strikethrough+Text",
    "shortDescription": "Strikethrough text is not conveyed properly to TalkBack users, leading to misinterpretation of the content.",
    "expectedResult": "Strikethrough text should provide clear context indicating removed or deprecated content, accessible to screen reader users.",
    "actualResult": "Strikethrough text is visually apparent but not announced with appropriate context by TalkBack, causing confusion.",
    "recommendation": "Provide additional context for strikethrough text by setting a descriptive `contentDescription` that explains the reason for the strikethrough (e.g., 'Was: Price, Now Price').",
    "steps": [
        "Navigate to the screen containing strikethrough text.",
        "Use TalkBack to read the strikethrough text.",
        "Observe that the text is read without context, leading to misinterpretation."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.3.1-001",
    "title": "Role: Heading Role is Missing (Heading)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Heading+Missing",
    "shortDescription": "An element intended to function as a heading lacks a semantic heading tag, hindering screen reader navigation.",
    "expectedResult": "Headings should use semantic &lt;h1&gt; to &lt;h6&gt; tags to ensure proper content hierarchy.",
    "actualResult": "Headings are styled with non-semantic elements like &lt;div&gt; or &lt;span&gt; without proper heading tags.",
    "recommendation": "Use appropriate semantic heading elements (&lt;h1&gt; to &lt;h6&gt; tags) instead of generic tags to structure content correctly... &lt;br/&gt;We recommend using the Living Design Heading Component, 'As' property. ",
    "codeExample": "\n        // Best: LD heading\n        <Heading as=\"h2\">Results</Heading>\n        \n        // Good: Heading element\n        <h2>Results</h2>\n        \n        // Last Resort\n        <div role=\"heading\" aria-level=\"2\">Results</div>",
    "steps": [
        "Identify the element intended to be a heading.",
        "Check if it uses a semantic heading tag (`&lt;h1&gt;` to `&lt;h6&gt;`).",
        "If not, replace it with the appropriate heading tag."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.3.1-002",
    "title": "Info: Missing List Structure - Use UL or OL",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=List+Structure",
    "shortDescription": "Lists are not properly structured using semantic HTML tags, making them inaccessible to assistive technologies.",
    "expectedResult": "Content that is a list should be marked up with semantic HTML elements like &lt;ul&gt;, &lt;ol&gt;, and &lt;li&gt; to convey the correct relationships.",
    "actualResult": "Lists are created using non-semantic elements like &lt;div&gt; or &lt;span&gt;, causing confusion for screen reader users.",
    "recommendation": "Use semantic HTML list elements (&lt;ul&gt; for unordered lists, &lt;ol&gt; for ordered lists, and &lt;li&gt; for list items) to properly convey list relationships to assistive technologies.",
    "codeExample": "\n        // Best: Native HTML5 Semantic list.\n        <ul>\n        <li>Margherita</li>\n        <li>Pepperoni</li>\n        </ul>\n        \n        // Last Resort: Custom aria role of list element.\n        <div role=\"list\">\n        <div role=\"listitem\">Margherita</div>\n        <div role=\"listitem\">Pepperoni</div>\n        </div>",
    "steps": [
        "Navigate to the webpage containing the list.",
        "Inspect the list structure using browser developer tools.",
        "Check if the list is marked up with &lt;ul&gt;, &lt;ol&gt;, and &lt;li&gt; elements."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.3.1-003",
    "title": "Info: Data Table Structure Issues - Use Semantic HTML5 Table, TH, and TDs",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Table+Structure",
    "shortDescription": "Data tables are not properly structured using semantic HTML, making them inaccessible to assistive technologies.",
    "expectedResult": "Data should be presented in a semantic &lt;table&gt; structure with appropriate use of &lt;th&gt; for headers and &lt;td&gt; for data cells.",
    "actualResult": "Tables are created using non-semantic elements like &lt;div&gt; or lack proper header associations, causing confusion for screen reader users.",
    "recommendation": "Use semantic HTML table elements (&lt;table&gt;, &lt;thead&gt;, &lt;tbody&gt;, &lt;tr&gt;, &lt;th&gt;, &lt;td&gt;) to structure data tables correctly. Ensure that headers are properly associated with their corresponding data cells.",
    "codeExample": "\n        // Best: Use LD data table\n        <DataTable>\n        \n        // Good: Native HTML5 Table Markup\n        <table>\n        <thead><tr><th>Product</th><th>Price</th></tr></thead>\n        <tbody><tr><td>Margherita</td><td>$9.99</td></tr></tbody>\n        </table>",
    "steps": [
        "Navigate to the webpage containing the data table.",
        "Inspect the table structure using browser developer tools.",
        "Check if the table uses semantic elements like &lt;table&gt;, &lt;thead&gt;, &lt;tbody&gt;, &lt;tr&gt;, &lt;th&gt;, and &lt;td&gt;."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.3.1-004",
    "title": "Info: Form Field Grouping - Use HTML5 Fieldset and Legend",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Form+Grouping",
    "shortDescription": "Form fields are not properly grouped, making it difficult for screen reader users to understand the relationship between fields.",
    "expectedResult": "Related form fields should be grouped using &lt;fieldset&gt; with a corresponding &lt;legend&gt; to describe the group.",
    "actualResult": "Form fields are scattered or grouped using non-semantic elements like &lt;div&gt; without proper labels, causing confusion.",
    "recommendation": "Use semantic HTML elements &lt;fieldset&gt; to group related form fields and &lt;legend&gt; to provide a descriptive label for the group. This helps screen readers convey the relationship between fields to users.",
    "codeExample": "\n        // Best: Use LD Form Group\n        <FormGroup>\n        \n        // Good: Native HTML5 Fieldset\n        <fieldset><legend>Hello World</legend></fieldset>\n        \n        // Last Resort: custom aria role of group with label\n        <div role=\"group\" aria-label=\"Billing Address\">",
    "steps": [
        "Navigate to the form with multiple related input fields.",
        "Inspect the form structure using browser developer tools.",
        "Check if related fields are grouped using &lt;fieldset&gt; and &lt;legend&gt; elements."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.3.1-005",
    "title": "Info: Strikethrough Text is Not Accessible - Use Screen Reader Only Text",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Strikethrough+Text",
    "shortDescription": "Strikethrough text is not conveyed properly to screen reader users, leading to misinterpretation of content.",
    "expectedResult": "Strikethrough text should be accessible and provide context to users, indicating removed or deprecated content.",
    "actualResult": "Strikethrough text is visually apparent but not announced or lacks proper context for screen reader users.",
    "recommendation": "Provide additional context for strikethrough text by using screen reader-only text. Leverage the Living Design Utility, Visually Hidden Utility.",
    "codeExample": "\n        // Best: LD Visually Hidden Utility, then mark other text as hidden.\n        <VisuallyHidden as=\"p\">Was $20.99, Now $9.99</VisuallyHidden>\n        <div aria-hidden=\"true\"><span><s>$20.99</s></span> <span>$9.99</span></div>",
    "steps": [
        "Navigate to the webpage containing strikethrough text.",
        "Use a screen reader to read the content.",
        "Observe if the strikethrough text is announced with appropriate context."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-1.3.1-006",
    "title": "Info: Missing Programmatic Label for Form Fields",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Missing+Label",
    "shortDescription": "Form fields are missing programmatic labels, making them inaccessible to screen reader users.",
    "expectedResult": "All form fields should have associated labels to describe their purpose to assistive technologies.",
    "actualResult": "Form fields lack &lt;label&gt; elements or appropriate ARIA labels, causing screen readers to announce them ambiguously or not at all.",
    "recommendation": "Ensure that every form field has an associated &lt;label&gt; element. Use the Living Design Form components because Living Design Forms are accessible. If building a custom form, Use the `for` attribute to link the label to the corresponding input.",
    "codeExample": "\n        // Best: LD Form Fields\n        Use LD Form Fields, they all must have a visible <label> prop.",
    "steps": [
        "Navigate to the form with input fields.",
        "Inspect the form fields using browser developer tools.",
        "Check if each input field has an associated &lt;label&gt; element or appropriate ARIA labels."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.3.1-001",
    "title": "Role: Heading Role is Missing (Heading)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Heading+Missing",
    "shortDescription": "An element is intended to function a heading, but lacks appropriate accessibility traits to announce it is a heading, hindering screen reader navigation.",
    "expectedResult": "Headings should use appropriate accessibility traits to ensure proper content hierarchy.",
    "actualResult": "Bold text or element is not announcing the 'heading' keyword.",
    "recommendation": "Assign the `.header` accessibility trait to `text` elements, intended as headings to enhance content structure.",
    "codeExample": "\n// Best: Set .header Traits\nlet heading = UILabel()\nheading.accessibilityTraits = [.header]",
    "steps": [
        "Identify the label intended to be a heading.",
        "Check if it has the `.header` accessibility trait set.",
        "If not, assign `.header` to the label's `accessibilityTraits`."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.3.1-002",
    "title": "Info: Element Grouping - Not Read as One Group (Read Together)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Grouping+Issue",
    "shortDescription": "Elements that should be read as a single group by VoiceOver are read individually, disrupting the information hierarchy.",
    "expectedResult": "Related elements should be grouped and read together as a single unit to convey their relationship effectively to assistive technologies.",
    "actualResult": "Related elements are read individually, making it difficult for users to understand the relationship between them.",
    "recommendation": "Group related elements by setting their container's `isAccessibilityElement` to `false` and managing the `accessibilityElements` array to include the grouped items. Use `UIAccessibility` APIs to define the relationship and ensure VoiceOver reads them as a single group.",
    "codeExample": "\n// Best: One combined screen reader announcement with variable children. Similar to Item Tile grouping.\ncardView.isAccessibilityElement = true\ncardView.accessibilityLabel = label1 + label2 + label3",
    "steps": [
        "Navigate to the screen containing the grouped elements.",
        "Use VoiceOver to navigate to the elements.",
        "Observe that related elements are read individually instead of as a group."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.3.1-003",
    "title": "Info: Missing List Structure",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=List+Structure",
    "shortDescription": "Lists are not properly structured, making it difficult for VoiceOver users to understand the content as a list.",
    "expectedResult": "Content that is a list should be recognized as such by assistive technologies, allowing users to navigate the list efficiently.",
    "actualResult": "List items are not recognized as part of a list, causing confusion and inefficiency in navigation for screen reader users.",
    "recommendation": "Use semantic accessibility traits by setting the container view's `accessibilityTraits` to `.isList` and ensuring each list item has appropriate traits like `.button` or `.staticText`. Utilize `UIAccessibility` APIs to define the list structure, enabling VoiceOver to announce it as a list with the correct number of items. e.g., 1 of 5, 2 of 5, 3 of 5.",
    "codeExample": "\n// Best: Announce the list size to screen reader. So users know how many exist.\n--\nWe should hear 1 of x, e.g., 1 of 12, 2 of 12.\n",
    "steps": [
        "Navigate to the screen containing the list.",
        "Use VoiceOver to navigate through the list items.",
        "Observe that the list is not announced as a list, hindering efficient navigation."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-1.3.1-004",
    "title": "Info: Strikethrough Text is Not Accessible",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-1.3.1",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Strikethrough+Text",
    "shortDescription": "Strikethrough text is not conveyed properly to VoiceOver users, leading to misinterpretation of the content.",
    "expectedResult": "Strikethrough text should provide clear context indicating removed or deprecated content, accessible to screen reader users.",
    "actualResult": "Strikethrough text is read without context, causing confusion about the meaning of the text.",
    "recommendation": "Provide additional context for strikethrough text by using `accessibilityLabel` to include explanatory text. It should say Now/Was.",
    "codeExample": "\n// Best: Screen reader says Was/Now\nelement.accessibilityLabel = \"Was XXX, Now YYY\"",
    "steps": [
        "Navigate to the screen containing strikethrough text.",
        "Use VoiceOver to read the strikethrough text.",
        "Observe that the text is read without context, leading to misinterpretation."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-ALL-1.4.11-001",
    "title": "Color Contrast: Low Contrast Graphical Objects and User Interface Components (Border/Icon)",
    "platforms": [
        "Web",
        "iOS",
        "Android"
    ],
    "wcag": "WCAG-1.4.11",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Low+Contrast+Border",
    "shortDescription": "Non-text elements (e.g., icons, borders) have low contrast against the background.",
    "expectedResult": "Non-text elements like icons and borders should have a minimum contrast ratio of 3:1 against adjacent colors.",
    "actualResult": "The icon or border contrast is below 3:1, reducing visibility.",
    "recommendation": "Increase the contrast of icons and borders to at least 3:1. Use a new Living Design Approved Color.",
    "codeExample": "\n        // Best:\n        Use an LD approved color/design token. Do not use a custom hex. Design support needed to choose an accessible color.",
    "steps": [
        "Locate low contrast icons or borders on the page.",
        "Use a contrast checker tool to measure the contrast ratio for non-text elements.",
        "Ensure the contrast is at least 3:1 for all key icons and borders."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-ALL-1.4.3-001",
    "title": "Color Contrast: Low Contrast Text",
    "platforms": [
        "Web",
        "iOS",
        "Android"
    ],
    "wcag": "WCAG-1.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Low+Contrast+Text",
    "shortDescription": "Text contrast is too low, making it difficult to read.",
    "expectedResult": "Text should have a minimum contrast ratio of 4.5:1, ideally 7:1 for improved readability.",
    "actualResult": "The contrast between text and background is below 4.5:1.",
    "recommendation": "Use an Living Design approved color. We need to increase the contrast ratio to at least 4.5:1, and aim for 7:1 if possible for better accessibility. Use a new approved Living Design Compliant Color.",
    "codeExample": "// Best:\n        Use an LD approved color/design token. Do not use a custom hex. Design support needed to choose an accessible color.",
    "steps": [
        "Locate the low contrast text on the page.",
        "Use a contrast checker tool to measure the contrast ratio.",
        "Verify that the contrast meets the minimum 4.5:1 requirement."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-ALL-1.4.3-002",
    "title": "Color Contrast: Low Contrast Placeholder Text",
    "platforms": [
        "Web",
        "iOS",
        "Android"
    ],
    "wcag": "WCAG-1.4.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Placeholder+Contrast",
    "shortDescription": "Placeholder text contrast is too low, which may be hard for users to read.",
    "expectedResult": "Placeholder text should be avoided for instructional information; use helper text with sufficient contrast instead.",
    "actualResult": "Placeholder text has a low contrast ratio and may not be readable.",
    "recommendation": "Replace placeholder text with helper text. Use the LD Form field, and use the helper text prop instead. Remove Placeholder.",
    "codeExample": "// Best:\n        Use an LD approved color/design token. Do not use a custom hex. Design support needed to choose an accessible color.",
    "steps": [
        "Identify the placeholder text on the page.",
        "Measure the contrast ratio between the placeholder text and background.",
        "Recommend switching to helper text with adequate contrast if the placeholder text is hard to read."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.1.1-001",
    "title": "Keyboard: General Interactive Element Not Keyboard Operable or Focusable",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focusable+Not+Operable",
    "shortDescription": "An element is unable to be activated with a keyboard. It cannot be operated using keyboard inputs, hindering accessibility for keyboard users.",
    "expectedResult": "All focusable elements should be operable using keyboard inputs (e.g., Enter or Space keys).",
    "actualResult": "The element either does not receive keyboard focus, and it does not respond to keyboard interactions.",
    "recommendation": "Ensure that all focusable elements have appropriate keyboard event handlers. We recommend just using a standard HTML5 element or an LD component. As a last resort, if an HTML5 element is not available, you can build custom interactive elements, implement `keydown` or `keypress` listeners to handle activation via Enter or Space keys. Alternatively, use semantic HTML elements (e.g., &lt;button&gt;, &lt;a&gt;) which inherently support keyboard interactions.",
    "codeExample": "\n        // Best: Use a Native HTML5 Element\n        <button>Add to Cart</button>\n        \n        // Last Resort: tabindex but also needs a keyboard keypress/click event handler.\n        <div role=\"button\" tabindex=\"0\">Add to Cart</div>",
    "steps": [
        "Navigate to the webpage containing the problematic element.",
        "Use the Tab key to focus on the element.",
        "Attempt to activate the element using the Enter or Space keys.",
        "Observe that the element does not respond to keyboard interactions."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.1.1-002",
    "title": "Keyboard: Button Not Keyboard Operable or Focusable",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Button+Issue",
    "shortDescription": "A button element is neither focusable nor operable via keyboard, preventing keyboard users from interacting with it.",
    "expectedResult": "Button elements should be both focusable and operable using keyboard inputs.",
    "actualResult": "The button does not receive keyboard focus and cannot be activated using keyboard inputs.",
    "recommendation": "Use semantic &lt;button&gt; elements for buttons to ensure they are inherently focusable and operable via keyboard.",
    "codeExample": "\n        // Best: Use a Native HTML5 Element\n        <button>Add to Cart</button>\n        \n        // Last Resort: tabindex but also needs a keyboard keypress/click event handler.\n        <div role=\"button\" tabindex=\"0\">Add to Cart</div>",
    "steps": [
        "Navigate to the webpage containing the problematic button.",
        "Attempt to focus the button using the Tab key.",
        "Observe that the button does not receive focus.",
        "Try to activate the button using the Enter or Space keys and note that it does not respond."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.1.1-003",
    "title": "Keyboard: Link Not Keyboard Operable or Focusable",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.1.1",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Link+Issue",
    "shortDescription": "A link element is neither focusable nor operable via keyboard, preventing keyboard users from navigating to it.",
    "expectedResult": "Link elements should be both focusable and operable using keyboard inputs.",
    "actualResult": "The link does not receive keyboard focus and cannot be activated using keyboard inputs.",
    "recommendation": "Use semantic &lt;a href&gt; elements with valid `href` attributes for links to ensure they are inherently focusable and operable via keyboard.",
    "codeExample": "\n        // Best: LD Link\n        <Link href=\"https://www.walmart.com\">Default</Link>\n        \n        // Good: Semantic HTML5 link\n        <a href=\"https://www.walmart.com\">Default</a>\n        \n        // Last Resort: Must provide keyboard onclick/click event handlers too...\n        <div role=\"link\" tabindex=\"0\">Checkout</div>",
    "steps": [
        "Navigate to the webpage containing the problematic link.",
        "Attempt to focus the link using the Tab key.",
        "Observe that the link does not receive focus.",
        "Try to activate the link using the Enter key and note that it does not respond."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-2.4.3-001",
    "title": "Focus Order: Dialog Focus is Not Managed to and from the Dialog",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Dialog+Focus",
    "shortDescription": "Focus is not managed correctly when opening and closing a dialog, disrupting navigation for TalkBack users.",
    "expectedResult": "When a dialog is opened, focus should move to the dialog, and when dismissed, focus should return to the original triggering element.",
    "actualResult": "Focus does not move to the dialog upon opening and does not return to the triggering element upon dismissal.",
    "recommendation": "Use a native dialog component like `AlertDialog`, which inherently manages focus, or leverage Living Design's `Bottom Sheet`. If using a custom dialog, programmatically manage focus transitions using TalkBack APIs and ensure `importantForAccessibility=true` is set on focusable elements.",
    "steps": [
        "Navigate to the screen containing the dialog.",
        "Open the dialog by activating the triggering element (e.g., 'Add a new payment method' button).",
        "Observe that TalkBack does not move focus to the dialog.",
        "Dismiss the dialog and note that TalkBack does not return focus to the triggering element."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-2.4.3-002",
    "title": "Focus Order: Error Message Focus Not Managed: Focus Does Not Land on the Error",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Error+Focus",
    "shortDescription": "After form submission, focus does not jump to the first error message, making it difficult for screen reader users to identify and address errors.",
    "expectedResult": "Upon form submission with errors, focus should move to the first error message to guide users in correcting mistakes.",
    "actualResult": "Focus remains on the submit button or another unrelated element, leaving users unaware of the specific errors.",
    "recommendation": "When an error appears, move focus to the first error message programmatically using TalkBack APIs. Ensure error messages are marked as accessibility elements with meaningful `contentDescription` and appropriate `accessibilityLiveRegion` settings. Use methods like `View.requestFocus()` to shift focus to the first error element.",
    "steps": [
        "Navigate to the form with multiple input fields.",
        "Submit the form without filling in required fields.",
        "Observe that TalkBack focus does not move to the first error message displayed."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-2.4.3-003",
    "title": "Focus Order: General Focus Order is Not Logical or Meaningful (Not Expected Focus Location)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focus+Order",
    "shortDescription": "The focus order of interactive elements does not follow an expected sequence, causing confusion for users navigating via TalkBack.",
    "expectedResult": "Interactive elements should receive focus in an intuitive and meaningful order that aligns with the visual layout and user expectations.",
    "actualResult": "Focus moves in an illogical sequence, skipping elements or moving out of context, disrupting an efficient navigation flow.",
    "recommendation": "Review the view hierarchy to ensure that the logical order of elements matches the visual layout. If needed, manage focus programmatically using `View.requestFocus().`",
    "steps": [
        "Navigate to the page with multiple interactive elements.",
        "Use TalkBack to move through the elements.",
        "Observe that the focus order does not align with the visual layout, causing confusion."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-2.4.3-004",
    "title": "Focus Order: Focus Trapped in Specific Areas",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focus+Trapped",
    "shortDescription": "Focus becomes trapped within certain elements, preventing users from navigating away using standard TalkBack gestures.",
    "expectedResult": "Users should be able to navigate freely out of interactive elements without getting trapped.",
    "actualResult": "Focus cycles within a specific section making it impossible to exit using TalkBack gestures alone.",
    "recommendation": "Ensure users can easily navigate out of trapped areas. Developers must fix and retest with a screen reader ensuring they do not get trapped or looped.",
    "steps": [
        "Navigate to the page with a modal dialog or interactive section.",
        "Activate the dialog or interactive element.",
        "Attempt to navigate out of the dialog using TalkBack gestures.",
        "Observe that focus remains trapped within the dialog without a clear way to exit."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.4.3-001",
    "title": "Focus Order: Dialog Focus is Not Managed to and from the Dialog",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Dialog+Focus",
    "shortDescription": "Focus is not managed correctly when opening and closing a dialog, disrupting navigation for keyboard and screen reader users.",
    "expectedResult": "When a dialog is opened, focus should move to the dialog, and when dismissed, focus should return to the original triggering element.",
    "actualResult": "Focus does not move to the dialog upon opening and does not return to the triggering element upon dismissal.",
    "recommendation": "Use the Living Design Modal. Or Implement focus management by moving focus to the dialog when it opens using the JavaScript Focus() method and ensure focus returns to the original triggering element when the dialog is closed.",
    "codeExample": "\n        // Best: LD Modal\n        <Modal title=\"HelloWorld\">\n        \n        // Good: JS eventlistener on close or open.\n        TriggerButton.focus();",
    "steps": [
        "Navigate to the page containing the dialog.",
        "Open the dialog by activating the triggering element (e.g., 'Add a new payment method' button).",
        "Observe that focus does not move to the dialog.",
        "Dismiss the dialog and note that focus does not return to the triggering element."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.4.3-002",
    "title": "Focus Order: Error Message Focus Not Managed: Focus Does Not Land on the Error",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Error+Focus",
    "shortDescription": "After form submission, focus does not shift to the first error message, making it difficult for users to identify and address errors.",
    "expectedResult": "Upon form submission with errors, focus should move to the first error message to guide users in correcting mistakes.",
    "actualResult": "Focus remains on the submit button or another unrelated element, leaving users unaware of the specific errors.",
    "recommendation": "Ensure that after form validation fails, focus is programmatically moved to the first error message. Use the Javascript Focus Method, OR, In React, utilize methods like setError from React Hook Form and manage focus using refs or the useEffect hook.",
    "codeExample": "\n        // Best: Form Validation - Set Error w/ shouldFocus:true if applicable\n        import { useForm } from 'react-hook-form';\n        \n        // Good: JS eventlistener to move focus to field\n        ErrorInputField.focus();\n        \n        // Last Resort: Move focus with setting a tabindex to 0 focus non-interactive elements.\n        errorText.setAttribute('tabindex', '0'); errorText.focus();",
    "steps": [
        "Navigate to the form with multiple input fields.",
        "Submit the form without filling in required fields.",
        "Observe that focus does not move to the first error message displayed."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.4.3-003",
    "title": "Focus Order: Focus Reset Issue due to JS DOM Re-Rendering (repaint)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focus+Reset",
    "shortDescription": "Focus unexpectedly resets for the screen reader, when the code re-renders or 'repaints' - gets destroyed/rebuilt.",
    "expectedResult": "Focus should not reset or we should warn the user that it's going to happen.",
    "actualResult": "Focus resets after the DOM repaints. The DOM code/react code resets/repaints.",
    "recommendation": "Maintain a stable DOM structure during interactions to prevent focus shifts. When using dynamic content updates (e.g., with React), ensure that focus remains on the current element or moves logically to the next intended element.",
    "codeExample": "\n        // Best: Ref focus self\n        const prev = document.activeElement;\n        renderCart(); // your re-render logic\n        prev?.focus();\n        \n        // Store the focused index and restore after render",
    "steps": [
        "Navigate to the page with filter options.",
        "Select or deselect a filter option.",
        "Observe that focus resets to an unrelated element instead of remaining within the filter panel."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.4.3-004",
    "title": "Focus Order: General Focus Order is Not Logical or Meaningful",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focus+Order",
    "shortDescription": "The tab order of interactive elements does not follow a logical sequence, causing confusion for users navigating via keyboard.",
    "expectedResult": "Interactive elements should receive focus in a logical and meaningful order that aligns with the visual layout and user expectations.",
    "actualResult": "Focus moves in an illogical sequence, skipping elements or moving out of context, disrupting the navigation flow.",
    "recommendation": "Review and adjust the DOM structure to reflect the desired tab order. Focus should move from top to bottom left to right.",
    "steps": [
        "Navigate to the page with multiple interactive elements.",
        "Use the Tab key to move through the elements.",
        "Observe that the focus order does not align with the visual layout, causing confusion."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.4.3-005",
    "title": "Focus Order: Focus Trapped in Specific Areas",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focus+Trapped",
    "shortDescription": "Focus becomes trapped within certain elements preventing users from navigating away using standard keyboard shortcuts.",
    "expectedResult": "Users should be able to navigate freely out of interactive elements without getting trapped. They should always be able to escape.",
    "actualResult": "Focus cycles within a specific section, making it impossible to exit using the keyboard alone.",
    "recommendation": "Provide clear exit mechanisms so that keyboard users do not get stuck. This often happens with JS causing an issue..",
    "codeExample": "\n        // Best\n        Remove the JS that is trapping focus and keeping the keyboard stuck... JS is the culprit.",
    "steps": [
        "Navigate to the page with a modal dialog or interactive section.",
        "Activate the dialog or interactive element.",
        "Attempt to navigate out of the dialog using the Tab key.",
        "Observe that focus remains trapped within the dialog without a clear way to exit."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-2.4.3-001",
    "title": "Focus Order: Dialog Focus is Not Managed to and from the Dialog",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Dialog+Focus",
    "shortDescription": "Focus is not managed correctly when opening and closing a dialog, disrupting navigation for VoiceOver users.",
    "expectedResult": "When a dialog is opened, focus should move to the dialog, and when dismissed, focus should return to the original triggering element.",
    "actualResult": "Focus does not move to the dialog upon opening and does not return to the triggering element upon dismissal.",
    "recommendation": "Use a native dialog component like `UIAlertController`, which inherently manages focus, or leverage the LD Bottomsheet element. If using a custom dialog, programmatically manage focus transitions using VoiceOver APIs.",
    "codeExample": "\n// Best: Move focus to dialog\nUIAccessibility.post(notification: .screenChanged, argument: alert.view)\n---\n// Good: On dialog close - return focus to previous trigger button\ndismiss(animated: true)\nUIAccessibility.post(notification: .screenChanged, argument: triggerButton)",
    "steps": [
        "Navigate to the screen containing the dialog.",
        "Open the dialog by activating the triggering element (e.g., 'Add a new payment method' button).",
        "Observe that VoiceOver does not move focus to the dialog.",
        "Dismiss the dialog and note that VoiceOver does not return focus to the triggering element."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-2.4.3-002",
    "title": "Focus Order: Error Message Focus Not Managed: Focus Does Not Land on the Error",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Error+Focus",
    "shortDescription": "After form submission, focus does not jump to the first error message, making it difficult for screen reader users to identify and address errors.",
    "expectedResult": "Upon form submission with errors, focus should move to the first error message to guide users in correcting mistakes.",
    "actualResult": "Focus remains on the submit button or another unrelated element, leaving users unaware of the specific errors.",
    "recommendation": "When an error appears, move focus to the first error message, programmatically set focus to the first error message using VoiceOver APIs. Use methods like `UIAccessibility.post(notification: .layoutChanged, argument: firstErrorElement)` to shift focus.",
    "codeExample": "\n// Use layoutChanged or screenChanged\n// Best: Move screen reader focus to first input field with an error\nUIAccessibility.post(notification: .layoutChanged, argument: firstErrorInputField)\n--\n// Good: Focus LD Alert - Move focus to the top error summary - If multiple errors.\nUIAccessibility.post(notification: .screenChanged, argument: ldAlertError)",
    "steps": [
        "Navigate to the form with multiple input fields.",
        "Submit the form without filling in required fields.",
        "Observe that VoiceOver focus does not move to the first error message displayed."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-2.4.3-003",
    "title": "Focus Order: General Focus Order is Not Logical or Meaningful (Not Expected Focus Location)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focus+Order",
    "shortDescription": "The focus order of interactive elements does land on an expected element or follow an order that we expect, causing confusion for users navigating via VoiceOver.",
    "expectedResult": "Interactive elements should receive focus in an intuitive and meaningful order that aligns with the visual layout and ideally optimized user expectations/speed.",
    "actualResult": "Focus moves in an illogical sequence, skipping elements or moving out of context, disrupting an efficienct navigation flow.",
    "recommendation": "Review the view hierarchy to ensure that the logical order of elements matches the visual layout. If needed move focus on an ideal element that will help the screen reader user.",
    "codeExample": "\n// Best: Define element order\ncontainerView.isAccessibilityElement = false\ncontainerView.accessibilityElements = [titleLabel, priceLabel, addToCartButton]",
    "steps": [
        "Navigate to the page with multiple interactive elements.",
        "Use VoiceOver to move through the elements.",
        "Observe that the focus order does not align with the visual layout, causing confusion."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-2.4.3-004",
    "title": "Focus Order: Focus Trapped in Specific Areas",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-2.4.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focus+Trapped",
    "shortDescription": "Focus becomes trapped within certain elements, preventing users from navigating away using standard VoiceOver gestures.",
    "expectedResult": "Users should be able to navigate freely without getting trapped between specific section.",
    "actualResult": "Focus cycles within a specific section making it impossible to exit using VoiceOver gestures alone.",
    "recommendation": "Implement proper focus and ensure users can easily navigate out of trapped areas. Developers should fix the code and then retest with a screen reader.",
    "codeExample": "\n// Best: Remove the code causing screen reader to get stuck or looped.",
    "steps": [
        "Navigate to the page with a modal dialog or interactive section.",
        "Activate the dialog or interactive element.",
        "Attempt to navigate out of the dialog using VoiceOver gestures.",
        "Observe that focus remains trapped within the dialog without a clear way to exit."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.4.6-001",
    "title": "Info: Incorrect Heading Structure - Heading Levels Are Skipped",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.4.6",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Heading+Structure",
    "shortDescription": "Heading levels are skipped, disrupting the logical structure and navigation for screen reader users.",
    "expectedResult": "Headings follow a logical sequence without skipping levels, ensuring a coherent structure for assistive technologies.",
    "actualResult": "Heading levels are skipped (e.g., jumping from &lt;h1&gt; to &lt;h3&gt;), disrupting the document structure.",
    "recommendation": "Ensure that headings follow a logical order without skipping levels. Use appropriate heading tags (&lt;h1&gt; to &lt;h6&gt;) to represent the document structure accurately.",
    "codeExample": "\n        // Best: heading levels in ascending order\n        <h1>TV Products</h1>\n        <h2>All Brands</h2>\n        <h3>LG Brand</h3>",
    "steps": [
        "Navigate to the webpage with multiple headings.",
        "Use a screen reader or keyboard navigation to move through the headings.",
        "Observe if any heading levels are skipped, causing confusion in the document structure."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-2.5.3-001",
    "title": "Label in Name: Accessible Name Does Not Match Visible Text",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-2.5.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Name+Mismatch",
    "shortDescription": "The contentDescription provided doesn’t match the visually presented text, causing confusion for assistive technology users.",
    "expectedResult": "contentDescriptions should include the visible text content.",
    "actualResult": "contentDescription differs from the visual text displayed to users.",
    "recommendation": "Ensure that the `contentDescription` matches the visible text, or at least includes it.",
    "codeExample": "\n// Good: Include same words in contentDescription, exact text-string match\n<Button \nandroid:text=\"Read More\"\nandroid:contentDescription=\"Read more about Walmart Plus\" \n/>\n",
    "steps": [
        "Locate the UI element in question.",
        "Compare the `contentDescription` with the visible text on the element.",
        "Identify discrepancies between them."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-2.5.3-001",
    "title": "Label in Name: Accessible Name Does Not Match Visible Text",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-2.5.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Name+Mismatch",
    "shortDescription": "The accessible name provided doesn’t match the visually presented text, causing confusion for assistive technology users.",
    "expectedResult": "Accessible names should include the visible text content.",
    "actualResult": "Screen reader output differs from the visible text displayed to users.",
    "recommendation": "Ensure that the accessible name matches the visible text. The full visible text must be included in the name.",
    "codeExample": "\n        // Best: Visible Text\n        <button>Read more about Walmart Plus</button>\n        \n        // Good: aria-label\n        <button aria-label=\"Read more about Walmart Plus\">Learn More</button>",
    "steps": [
        "Locate the element in question.",
        "Compare the accessible name (e.g., `aria-label`) with the visible text.",
        "Identify discrepancies between them."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-2.5.3-001",
    "title": "Label in Name: Accessible Name Does Not Match Visible Text",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-2.5.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Name+Mismatch",
    "shortDescription": "The accessibilityLabel provided doesn’t match the visually presented text, causing confusion for assistive technology users.",
    "expectedResult": "AccessibilityLabels should also include the visible text content. What's visually seen should also be announced.",
    "actualResult": "AccessibilityLabel (screen reader output) differs from the visual text displayed to users.",
    "recommendation": "Ensure that the `accessibilityLabel` matches or includes the visible text. So that sighted/screen reader users get a similar experience.",
    "codeExample": "\n// Best: Only use setTitle\nlet readMore = UIButton(type: .system)\nreadMore.setTitle(\"Read more about Walmart Plus\", for: .normal)\n---\n// Good: accessibilityLabel must match OR include the visible text\nreadMore.isAccessibilityElement = true\nreadMore.accessibilityLabel = \"Read more about Walmart Plus\"",
    "steps": [
        "Locate the UI element in question.",
        "Compare the `accessibilityLabel` with the visible text on the element.",
        "Identify discrepancies between them."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-001",
    "title": "Name: Missing or Empty Accessible Name (Unlabelled)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Name+Missing",
    "shortDescription": "An interactive element has no contentDescription, making it confusing to assistive technologies.",
    "expectedResult": "All interactive elements should have descriptive contentDescriptions.",
    "actualResult": "The element lacks a contentDescription or has an empty contentDescription (Unlabelled).",
    "recommendation": "Provide a meaningful contentDescription using `android:contentDescription` or by using native UI components with inherent accessibility.",
    "codeExample": "\n// Best: Visible text\n<Button android:text=\"Add to cart\" />\n---\n// Good Fallback: Use contentDescription\n<Button android:contentDescription=\"XYZ\" />",
    "steps": [
        "Navigate to the screen with the interactive element.",
        "Inspect the element in the layout XML or code.",
        "Check for the presence of a contentDescription."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-002",
    "title": "Name: Generic or Non-Descriptive Accessible Name (Vague)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Generic+Name",
    "shortDescription": "The contentDescription is too generic or vague, failing to convey meaningful information about the element’s purpose.",
    "expectedResult": "contentDescriptions should be specific and descriptive, clearly indicating the element’s function.",
    "actualResult": "contentDescription use generic/vague announcement. For example, text like 'Learn More' or 'Read More' are too vague.",
    "recommendation": "Use specific and descriptive `contentDescription` values that convey the purpose or action of the element.",
    "codeExample": "\n// Best: Specific visible text\n<Button android:text=\"Learn more about Walmart Plus\" />\n---\n// Good: Specific contentDescription with more keywords/details\n<Button \nandroid:text=\"Read more\"\nandroid:contentDescription=\"Read more about Walmart Plus\" \n/>\n",
    "steps": [
        "Identify elements with generic contentDescriptions.",
        "Evaluate if the `contentDescription` provides clear context or purpose.",
        "Update the `contentDescription` to be more descriptive."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-003",
    "title": "Name: Duplicate Name for Multiple Elements (Repeated Names)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Duplicate+Names",
    "shortDescription": "Multiple elements use the same contentDescription, leading to confusion for assistive technologies.",
    "expectedResult": "Each interactive element should have a unique contentDescription to avoid confusion.",
    "actualResult": "Several elements share the same `contentDescription`, for example,  multiple 'add to cart' buttons on the same screen would fail if they all announced the same thing.",
    "recommendation": "Assign unique and descriptive `contentDescription` values to each element to differentiate their functions. Add a keyword to each element that is not unique. ",
    "codeExample": "\n// Good: Make each contentDescription Unique\n<Button \nandroid:text=\"Buy\"\nandroid:contentDescription=\"Buy - Product Name 1\" \n/>\n---\n<Button \nandroid:text=\"Buy\"\nandroid:contentDescription=\"Buy - Product Name 25\" \n/>\n\n",
    "steps": [
        "Locate all elements sharing the same `contentDescription`.",
        "Determine the unique purpose of each element.",
        "Update each element with a distinct `contentDescription` reflecting its specific function."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-004",
    "title": "Role: Button Role is Missing (Button)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Button+Missing",
    "shortDescription": "An element intended to function as a button, does not announce 'button' or the usage hint",
    "expectedResult": "Buttons should use the native `Button` class to ensure proper behavior and accessibility.",
    "actualResult": "The button keyword is missing from the screen reader. ",
    "recommendation": "Use the native Android `Button` component, or LD Button component, or add a className of (`android.widget.Button`) to ensure the element behaves and is recognized as a button with inherent accessibility features.",
    "codeExample": "// Best: Use native Button or LDButton\n<Button android:text=\"Add to cart\" />\n---\n// Good: Set class via delegate or classNames\nButton::class.java.name\n",
    "steps": [
        "Locate the element intended to act as a button.",
        "Inspect the class of the element in the layout XML or code.",
        "If not a `Button`, update the element to use the native `Button` class (`android.widget.Button`)."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-005",
    "title": "Role: Link Role is Missing (Link)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Link+Missing",
    "shortDescription": "An element when clicked leaves the app, or opens a webview without warning the user. ",
    "expectedResult": "When an element will leave the app, we should warn the user, by saying it's a link.",
    "actualResult": "The link keyword is missing.",
    "recommendation": "Use the native `TextView` with `android:autoLink='web'`, or code it as button as a last resort, or simply ensure the usageHint double tap to activate gets announced.",
    "steps": [
        "Identify the element intended to function as a link.",
        "Check if it uses `TextView` with `android:autoLink='web'` or a styled `Button`.",
        "If not, update the element to use `TextView` with appropriate properties or assign meaningful `contentDescription` and ensure it is clickable."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-006",
    "title": "Role: Generic Interactive Role is Missing (Generic No Role)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Interactive+Role",
    "shortDescription": "An interactive element lacks appropriate accessibility properties, preventing screen readers from announcing its functionality.",
    "expectedResult": "Interactive elements should have appropriate accessibility properties to convey their purpose to assistive technologies.",
    "actualResult": "Interactive elements like clickable `View` or `TextView` do not announce the role keyword like 'heading' or 'button' keyword via screen reader.",
    "recommendation": "Use native interactive classes like `Button`, `ImageButton`, or assign appropriate accessibility properties via (`contentDescription`, `android:clickable`) to custom elements.",
    "steps": [
        "Locate the interactive element.",
        "Inspect the element to check for appropriate accessibility properties.",
        "Add the necessary `contentDescription` and ensure the element is clickable, or use a native interactive class."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-007",
    "title": "State: State Information Not Announced (Generic State)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=State+Info",
    "shortDescription": "An element's state information (e.g., expanded/collapsed) is not conveyed to screen readers, impacting accessibility.",
    "expectedResult": "State changes should be programmatically available to assistive technologies.",
    "actualResult": "State information is not announced, leaving users unaware of the element's current state.",
    "recommendation": "Use `android:contentDescription` with dynamic updates or leverage `AccessibilityDelegate` to convey state information. For example, an accordion should change the description to 'expanded'/'collapsed'.",
    "steps": [
        "Interact with the element that changes state.",
        "Use TalkBack to check if the state change is announced.",
        "Identify if `contentDescription` or relevant accessibility properties are missing or incorrectly implemented."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-008",
    "title": "State: Pressed/Not Pressed State Not Announced (Toggle Button)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Pressed+State",
    "shortDescription": "Interactive elements like toggle buttons do not announce their pressed or not-pressed state to screen readers.",
    "expectedResult": "Pressed states should be communicated using `android:contentDescription` or appropriate accessibility properties.",
    "actualResult": "Screen readers do not announce whether the button is pressed or not after interaction.",
    "recommendation": "Implement dynamic `contentDescription` updates (e.g., 'Pressed'/'Not Pressed') or use `android:stateSelected` with appropriate accessibility properties to indicate the toggle state.",
    "steps": [
        "Toggle the button's state.",
        "Use TalkBack to check if the state change is announced.",
        "Ensure `contentDescription` is correctly implemented and updated, or use appropriate accessibility properties."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-009",
    "title": "State: Checked/Unchecked State Not Announced (Checkbox)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Checked+State",
    "shortDescription": "Checkboxes and radio buttons do not announce their checked or unchecked state to screen readers.",
    "expectedResult": "The checked state should be conveyed using native form elements or appropriate accessibility properties.",
    "actualResult": "Screen readers do not announce the selection status of checkboxes or radio buttons.",
    "recommendation": "Use native `CheckBox`, `RadioButton`, or `Switch` controls, which inherently provide state information, or update `contentDescription` to reflect the checked state. Use consistant keywords like 'checked' or 'not-checked' if you go the contentDescription route.",
    "steps": [
        "Interact with the checkbox or radio button.",
        "Use TalkBack to verify if the state is announced.",
        "Check the implementation for correct use of native controls or accessibility properties."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-010",
    "title": "State: Expanded/Collapsed State Not Announced (Accordion)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Expanded+State",
    "shortDescription": "Expandable elements like accordion sections do not announce their expanded or collapsed state to screen readers.",
    "expectedResult": "State changes should be communicated using `android:contentDescription` or appropriate accessibility properties.",
    "actualResult": "Screen readers do not inform users whether the content is expanded or collapsed.",
    "recommendation": "Implement dynamic `contentDescription` updates (e.g., 'Expanded'/'Collapsed') or use `AccessibilityDelegate` or `setState` to indicate the current state of expandable elements.",
    "steps": [
        "Toggle the expandable element.",
        "Use TalkBack to check if the state change is announced.",
        "Ensure `contentDescription` is correctly implemented and updated, or use appropriate accessibility properties."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-011",
    "title": "State: On/Off State Not Announced (Switch)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Toggle+State",
    "shortDescription": "Toggle switches do not announce their on or off state to screen readers, making it unclear if the setting is enabled or disabled.",
    "expectedResult": "Toggle states should be communicated using `android:contentDescription` or appropriate accessibility properties.",
    "actualResult": "Screen readers do not announce whether the toggle is on or off.",
    "recommendation": "Use native `Switch` controls, which inherently provide state information, or update `contentDescription` to reflect the on/off state.",
    "steps": [
        "Interact with the toggle switch.",
        "Use TalkBack to verify if the state change is announced.",
        "Ensure the correct accessibility properties are implemented and updated accordingly."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.2-012",
    "title": "Accessibility Not Enabled: Element Not Focusable or Recognized by TalkBack",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focusable+Missing",
    "shortDescription": "An element is not focusable or recognized by TalkBack, making it inaccessible to assistive technologies.",
    "expectedResult": "All interactive elements should be focusable and recognized by TalkBack.",
    "actualResult": "The element is not focusable or recognized by TalkBack.",
    "recommendation": "Use a native UI component that is inherently accessible or set `importantForAccessibility='true'` to make the element focusable and recognized by TalkBack.",
    "steps": [
        "Navigate to the screen with the interactive element.",
        "Attempt to focus the element using TalkBack.",
        "Observe that the element is not focused or recognized."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-001",
    "title": "Name: Missing or Empty Accessible Name (Unlabelled)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Name+Missing",
    "shortDescription": "An interactive element has no accessible name, making it confusing to assistive technologies.",
    "expectedResult": "All interactive elements should have descriptive accessible names.",
    "actualResult": "The element lacks an accessible name or has an empty name (Unlabelled).",
    "recommendation": "Provide a meaningful accessible name using `aria-label`, `aria-labelledby`, or visible text.",
    "codeExample": "\n        // Best: Visible Text\n        <button>Add to cart</button>\n        \n        // Good: aria-label\n        <button aria-label=\"Add to favorites\"> <svgHeartIcon> </button>",
    "steps": [
        "Navigate to the page with the interactive element.",
        "Inspect the element using developer tools.",
        "Check for the presence of an accessible name."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-002",
    "title": "Name: Generic or Non-Descriptive Accessible Name (Vague)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Generic+Name",
    "shortDescription": "The accessible name is too generic or vague, failing to convey meaningful information about the element’s purpose.",
    "expectedResult": "Screen reader output should be specific and descriptive, clearly indicating the element’s function.",
    "actualResult": "Elements use generic names like 'Click Here' or 'Learn More'.",
    "recommendation": "Use specific and descriptive accessible names that convey the purpose or action of the element. Add more context.",
    "codeExample": "\n        // Best: Visible Text\n        <button>Learn more about Walmart Plus</button>\n        \n        // Good: aria-label\n        <button aria-label=\"Learn more about Walmart Plus\">Learn More</button>",
    "steps": [
        "Identify elements with generic accessible names.",
        "Evaluate if the name provides clear context or purpose.",
        "Update the accessible name to be more descriptive."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-003",
    "title": "Name: Duplicate Name for Multiple Elements (Repeated Names)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Duplicate+Names",
    "shortDescription": "Multiple elements use the same accessible name, leading to ambiguity for assistive technologies.",
    "expectedResult": "Each interactive element should have a unique accessible name to avoid confusion.",
    "actualResult": "Several elements share the same accessible name, such as multiple 'add to cart' buttons on an item tile.",
    "recommendation": "Assign unique and descriptive accessible names to each element to differentiate their functions. Add a unique identifier to the name or a unique keyword to make each name unique.",
    "codeExample": "\n        // Best: Visible Identifier\n        <button>Buy Pizza Margherita – Small</button>\n        <button>Buy Pizza Margherita – Large</button>\n        \n        // Good: aria-label with unique identifier or keyword\n        <button aria-label=\"Buy Small Pizza Margherita\">Buy</button>\n        <button aria-label=\"Buy Large Pizza Margherita\">Buy</button>",
    "steps": [
        "Locate all elements sharing the same accessible name.",
        "Determine the unique purpose of each element.",
        "Update each element with a distinct accessible name reflecting its specific function."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-004",
    "title": "Role: Button Role is Missing (Button)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Button+Missing",
    "shortDescription": "An element intended to function as a button lacks the semantic &lt;button&gt; element tag announcement, affecting accessibility.",
    "expectedResult": "Developers should use the semantic &lt;button&gt; element to ensure proper behavior and accessibility. Or preferred the LD Button.",
    "actualResult": "Buttons are implemented using non-semantic elements like &lt;div&gt; or &lt;span&gt; without appropriate roles.",
    "recommendation": "Replace the code with the actual HTML5 &lt;button&gt; element, or use the LD Button, or as a last resort code a custom role=\"button\" and necessary keyboard interactions.",
    "codeExample": "\n        // Best: LD Button\n        <Button>Add to cart</Button>\n        \n        // Good: Native HTML5 button\n        <button>Results</button>\n        \n        // Last Resort: Must add JS click event handlers too for keyboard.\n        <div role=\"button\" tabindex=\"0\">Add to Cart</div>",
    "steps": [
        "Locate the element intended to act as a button.",
        "Inspect the HTML to check if it uses the &lt;button&gt; tag.",
        "If not, update the element to use &lt;button&gt; or ensure it has the correct role and accessibility features."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-005",
    "title": "Role: Link Role is Missing (Link)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Link+Missing",
    "shortDescription": "An element intended to function as a link, lacks the semantic &lt;a&gt; tag, impacting screen reader interpretation and navigation.",
    "expectedResult": "Links should use the semantic &lt;a&gt; element to ensure they are recognized correctly by assistive technologies.",
    "actualResult": "Links are implemented using non-semantic elements like &lt;div&gt; or &lt;span&gt; without appropriate roles.",
    "recommendation": "Use the &lt;a href&gt; element for links, or use the LD Link, or as a last-resort, add role=\"link\" along with necessary keyboard interactions if using non-semantic elements.",
    "codeExample": "\n        // Best: LD Link\n        <Link href=\"#\">Go Back</Link>\n        \n        // Good: Native HTML5 Link\n        <a href=\"#\">Go Back</a>\n        \n        // Last Resort: Must add JS click event handlers too for keyboard.\n        <div role=\"link\" tabindex=\"0\" onclick=\"location.href='#'\">Go Back</div>",
    "steps": [
        "Identify the element intended to function as a link.",
        "Check if it uses the &lt;a&gt; tag with an `href` attribute.",
        "If not, update the element to use &lt;a&gt; or ensure it has the correct role and accessibility features."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-006",
    "title": "Role: Generic Interactive Role is Missing (Generic No Role)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Interactive+Role",
    "shortDescription": "An interactive element lacks a semantic role, preventing screen readers from announcing its functionality.",
    "expectedResult": "Interactive elements should have appropriate semantic roles to convey their purpose to assistive technologies.",
    "actualResult": "Elements like clickable &lt;div&gt; or &lt;span&gt; do not have semantic roles assigned.",
    "recommendation": "Replace non-semantic elements with semantic HTML5 elements, or use Living Design alternative, or as a last resort, use an appropriate ARIA roles",
    "codeExample": "Use native semantic HTML5 elements such as <a>, <button>, <img>, <h1>, etc... Do NOT use <divs> those are not semantic.",
    "steps": [
        "Locate the interactive element.",
        "Inspect the element to check for semantic roles.",
        "Add the necessary role attribute or use a semantic HTML element."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-007",
    "title": "State: State Information Not Announced (Generic State)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=State+Info",
    "shortDescription": "An element's state information (e.g., active/inactive) is not conveyed to screen readers, impacting accessibility.",
    "expectedResult": "State changes should be programmatically available to assistive technologies.",
    "actualResult": "State information is not announced, leaving users unaware of the element's current state.",
    "recommendation": "If available, use a standard HTML5 component. However if a custom component needs to be built from scratch, use ARIA attributes like `aria-pressed`, `aria-checked`, or `aria-expanded` to convey state information.",
    "codeExample": "Use a native HTML element that already convey state like checkboxes, disabled, radio, etc... However, if needed use aria-expanded, aria-selected, aria-pressed, etc...",
    "steps": [
        "Interact with the element that changes state.",
        "Use a screen reader to check if the state change is announced.",
        "Identify if ARIA attributes are missing or incorrectly implemented."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-008",
    "title": "State: Pressed/Not Pressed State Not Announced (Toggle Button)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Pressed+State",
    "shortDescription": "Interactive elements like toggle buttons do not announce their pressed or not-pressed state to screen readers.",
    "expectedResult": "Pressed states should be communicated using ARIA attributes such as `aria-pressed`.",
    "actualResult": "Screen readers do not announce whether the button is pressed or not after interaction.",
    "recommendation": "Implement `aria-pressed` to indicate the toggle state of the button. It toggles as a boolean, true/false.",
    "codeExample": "\n         // Best: Use checkbox instead...\n        <input type=\"checkbox\" id=\"favorite\" name=\"favorites\" />\n        \n        // Good: aria-pressed\n        <button aria-label=\"Mark as favorite\" aria-pressed=\"false\">♡</button>",
    "steps": [
        "Toggle the button's state.",
        "Use a screen reader to check if the state change is announced.",
        "Ensure `aria-pressed` is correctly implemented and updated."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-009",
    "title": "State: Checked/Unchecked State Not Announced (Checkbox)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Checked+State",
    "shortDescription": "Checkboxes and radio buttons do not announce their checked or unchecked state to screen readers.",
    "expectedResult": "The checked state should be conveyed by using native HTML5 form elements.",
    "actualResult": "Screen readers do not announce the selection status of checkboxes or radio buttons.",
    "recommendation": "Use native `&lt;input type='checkbox'&gt;` or `&lt;input type='radio'&gt;` elements. Confirm the accessibilityTree shows the state of checked:true.",
    "codeExample": "\n        // Best: LD Checkbox\n    <Checkbox>\n    \n    // Good: Native HTMl5 checkbox\n    <input type=\"checkbox\" checked>\n    \n    // Last Resort: Add keyboard event handlers\n    <div role=\"checkbox\" tabindex=\"0\" aria-checked=\"true\"> Extra Cheese</div>",
    "steps": [
        "Interact with the checkbox or radio button.",
        "Use a screen reader to verify if the state is announced.",
        "Check the implementation for correct ARIA attributes if not using native elements."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-010",
    "title": "State: Expanded/Collapsed State Not Announced (Accordion)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Expanded+State",
    "shortDescription": "Expandable elements like accordions do not announce their expanded or collapsed state to screen readers.",
    "expectedResult": "State changes should be communicated using ARIA attributes such as `aria-expanded`.",
    "actualResult": "Screen readers do not inform users whether the content is expanded or collapsed.",
    "recommendation": "Implement `aria-expanded` to indicate the current state of expandable elements. It is an HTML5 attribute, that toggles between true/false. Search Google for 'aria-expanded' term for examples.",
    "codeExample": "\n        // Best: aria-expanded\n    <button aria-expanded=\"false\" aria-controls=\"XYZ\">Ingredients</button>\n    <div id=\"XYZ\" hidden>...I am hidden content...</div>",
    "steps": [
        "Toggle the expandable element.",
        "Use a screen reader to check if the state change is announced.",
        "Ensure `aria-expanded` is correctly implemented and updated."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.2-011",
    "title": "State: On/Off State Not Announced (Switch)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Toggle+State",
    "shortDescription": "Toggle switches do not announce their on or off state to screen readers, making it unclear if the setting is enabled or disabled.",
    "expectedResult": "Toggle states should be communicated using ARIA attributes like `aria-checked`.",
    "actualResult": "Screen readers do not announce whether the toggle is on or off.",
    "recommendation": "Use role of 'switch' with an appropriate ARIA attributes of `aria-checked` to convey the toggle state to assistive technologies. It is a boolean, that goes from true/false.",
    "codeExample": "\n        // Best: LD Switch\n    <Switch label=\"My Switch\">\n    \n    // Good: Native HTMl5 Switch but with CSS\n    <input type=\"checkbox\" role=\"switch\">\n    \n    // Last Resort: Add keyboard event handlers\n    <button role=\"switch\" tabindex=\"0\" aria-checked=\"false\">Gift Wrap</button>",
    "steps": [
        "Interact with the toggle switch.",
        "Use a screen reader to verify if the state change is announced.",
        "Ensure the correct ARIA attributes are implemented and updated accordingly."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-001",
    "title": "Name: Missing or Empty Accessible Name (Unlabelled)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Name+Missing",
    "shortDescription": "An interactive element has no accessibilityLabel, making it confusing to assistive technologies.",
    "expectedResult": "All interactive elements should have descriptive accessibilityLabels.",
    "actualResult": "The element lacks an accessibilityLabel or has an empty accessibilityLabel (Unlabelled).",
    "recommendation": "Provide a meaningful accessibilityLabel using `accessibilityLabel` or by using native UI components with inherent accessibility.",
    "codeExample": "\n// Best: Use visible title\nlet addToCart = UIButton(type: .system)\naddToCart.setTitle(\"Add to Cart\", for: .normal)\n---\n// Good: Use accessibilityLabel\nlet favorite = UIButton(type: .system)\nfavorite.accessibilityLabel = \"Add to favorites\"",
    "steps": [
        "Navigate to the screen with the interactive element.",
        "Inspect the element in Interface Builder or code.",
        "Check for the presence of an accessibilityLabel."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-002",
    "title": "Name: Generic or Non-Descriptive Accessible Name (Vague)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Generic+Name",
    "shortDescription": "The accessibilityLabel is too generic or vague, failing to convey meaningful information about the element’s purpose.",
    "expectedResult": "AccessibilityLabels should be specific and descriptive, clearly indicating the element’s function.",
    "actualResult": "The element's name is to vague. For example, generic names like 'Learn More' or 'Read More' are too vague.",
    "recommendation": "Make the `accessibilityLabel` more descriptive. Use specific and descriptive `accessibilityLabel` values that convey the purpose or action of the element.",
    "codeExample": "\n// Best: Use setTitle\nlet cta = UIButton(type: .system)\ncta.setTitle(\"Learn more about Walmart Plus\", for: .normal)\n---\n// Good: Use accessibilityLabel to add context for blind user.\ncta.isAccessibilityElement = true\ncta.setTitle(\"Learn more\", for: .normal)\ncta.accessibilityLabel = \"Learn more about XYZ\"",
    "steps": [
        "Identify elements with generic accessibilityLabels.",
        "Evaluate if the `accessibilityLabel` provides clear context or purpose.",
        "Update the `accessibilityLabel` to be more descriptive."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-003",
    "title": "Name: Duplicate Name for Multiple Elements (Repeated Names)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Duplicate+Names",
    "shortDescription": "Multiple elements use the same accessibilityLabel, leading to confusion for assistive technologies.",
    "expectedResult": "Each interactive element should have a unique accessibilityLabel to avoid confusion.",
    "actualResult": "Several elements share the same `accessibilityLabel`, For example, multiple 'add to cart' buttons, would fail. They need a unique identifier.",
    "recommendation": "Assign unique and descriptive `accessibilityLabel` values to each element to make each label unique. Add a keyword or unique Identifier the elements that are not unique..",
    "codeExample": "\n// Best: Unique visible text\nlet buySmall = UIButton(type: .system)\nbuySmall.setTitle(\"Buy – Great Value Milk\", for: .normal)\n---\n// Good: Unique accessibilityLabel with unique text e.g., ProductName\nlet buyLarge = UIButton(type: .system)\nbuyLarge.setTitle(\"Buy\", for: .normal)\nbuyLarge.accessibilityLabel = \"Buy - Great Value Milk\"",
    "steps": [
        "Locate all elements sharing the same `accessibilityLabel`.",
        "Determine the unique purpose of each element.",
        "Update each element with a distinct `accessibilityLabel` reflecting its specific function."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-004",
    "title": "Role: Button Role is Missing (Button)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Button+Missing",
    "shortDescription": "An interactive element is not announcing the keyword 'button.' It is missing the appropriate `.button` accessibility traits, affecting interaction and accessibility.",
    "expectedResult": "Buttons elements should be coded via the native `UIButton` element or have appropriate accessibility traits of `.button` to ensure proper behavior and accessibility.",
    "actualResult": "The screen reader did not announce that it is a button, or that it is interactive...",
    "recommendation": "Use a native `UIButton`, an LD button, OR assign the `.button` accessibility trait.",
    "codeExample": "\n// Best: Use UIButton\nlet button = UIButton(type: .system)\nbutton.setTitle(\"Add to Cart\", for: .normal)\n---\n// Good: Use .button trait\nlet tappable = UIView()\ntappable.isAccessibilityElement = true;\ntappable.accessibilityTraits = [.button]",
    "steps": [
        "Locate the element intended to act as a button.",
        "Inspect the class of the element in Interface Builder or code.",
        "If not a `UIButton`, update the element to use `UIButton` or ensure it has the `.button` accessibility trait and proper accessibility features."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-005",
    "title": "Role: Link Role is Missing (Link)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Link+Missing",
    "shortDescription": "An element that leaves the app, or opens a webview, does not announce the 'link' keyword, impacting screen reader interpretation and navigation.",
    "expectedResult": "Links that open a webview or leave the app, should use appropriate accessibility traits to ensure they warn screen reader users it will leave the app.",
    "actualResult": "The 'link 'keyword is missing. ",
    "recommendation": "Assign the `.link` accessibility trait, or warn the user that it will leave the app, as a last resort, announcing as a button is fine.",
    "codeExample": "\n// Best: Use .link trait ONLY IF it opens safari/exits app/web-view.\nlet link = UIButton(type: .system)\nlink.accessibilityTraits.insert(.link)",
    "steps": [
        "Identify the element intended to function as a link.",
        "Check if it uses `UIButton` styled as a link or has the `.link` accessibility trait set.",
        "If not, update the element to use `UIButton` or assign the `.link` accessibility trait and ensure it has the correct accessibility features."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-006",
    "title": "Role: Generic Interactive Role is Missing (Generic No Role)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Interactive+Role",
    "shortDescription": "An interactive element lacks appropriate accessibility traits, preventing screen readers from announcing its functionality.",
    "expectedResult": "Interactive elements should have appropriate accessibility traits to convey their purpose to assistive technologies.",
    "actualResult": "Interactive elements do not have accessibility traits assigned.",
    "recommendation": "Use native apple UI controls like `UIButton`, or use the LD Button/LD components, or assign appropriate `accessibilityTraits` (e.g., `.button`, `.link`) to custom elements.",
    "codeExample": "\n// Good: Use appropriate accessibilityTraits. Choose appropriate one only.\nelement.accessibilityTraits = .button\nelement.accessibilityTraits = .header\nelement.accessibilityTraits = .link\nelement.accessibilityTraits = .image\n---\nelement.accessibilityTraits = [.heading, .button]\nelement.accessibilityTraits = [.button, .selected]",
    "steps": [
        "Locate the interactive element.",
        "Inspect the element to check for appropriate accessibility traits.",
        "Add the necessary `accessibilityTraits` or use a native interactive class."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-007",
    "title": "State: State Information Not Announced (Generic State)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=State+Info",
    "shortDescription": "An element's state information (e.g., selected/checked/not-checked) is not conveyed to screen readers, impacting accessibility.",
    "expectedResult": "State changes should be programmatically available to assistive technologies.",
    "actualResult": "State information is not announced, leaving users unaware of the element's current state.",
    "recommendation": "Use `accessibilityValue` or appropriate `accessibilityTraits` to convey state information. For example, if an accordion expands it should say 'expanded' or 'collapse' as it changes...",
    "codeExample": "\n// Best: Set accessibilityValue. Provide a state keyword\naccordion.accessibilityValue = \"Expanded/Collapsed\"",
    "steps": [
        "Interact with the element that changes state.",
        "Use VoiceOver to check if the state change is announced.",
        "Identify if `accessibilityValue` or relevant traits are missing or incorrectly implemented."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-008",
    "title": "State: Pressed/Not Pressed State Not Announced (Toggle Button)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Pressed+State",
    "shortDescription": "Interactive elements like toggle buttons do not announce their pressed or not-pressed state to screen readers.",
    "expectedResult": "Pressed states should be communicated using `accessibilityValue` or appropriate `accessibilityTraits`.",
    "actualResult": "Screen readers do not announce whether the button is pressed or not after interaction.",
    "recommendation": "Implement `accessibilityValue` (e.g., 'Pressed'/'Not Pressed') or use the `.selected` trait to indicate the toggle state. If using value, confirm it is announcing as it switches.",
    "codeExample": "\n// Good: Use accessibilityValue - both pressed/checked are allowed. Choose 1.\nlet fakeSwitch = UIButton(type: .system)\nfakeSwitch.accessibilityValue = \"Checked/Not Checked\"\nor\nfakeSwitch.accessibilityValue = \"Pressed/Not Pressed\"\n",
    "steps": [
        "Toggle the button's state.",
        "Use VoiceOver to check if the state change is announced.",
        "Ensure `accessibilityValue` is correctly implemented and updated, or use appropriate traits."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-009",
    "title": "State: Checked/Unchecked State Not Announced (Checkbox)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Checked+State",
    "shortDescription": "Checkboxes and radio buttons do not announce their checked or unchecked state to screen readers.",
    "expectedResult": "The checked state should be conveyed using native form elements or appropriate accessibility properties.",
    "actualResult": "Screen readers do not announce the selection status of checkboxes or radio buttons.",
    "recommendation": "Use native `UISwitch`, `UIButton` with `.selected` toggle behavior, OR use an LD component, or update `accessibilityValue` to reflect the checked state.",
    "codeExample": "\n// Good: Use accessibilityValue\nlet extraCheese = UIButton(type: .system)\nextraCheese.accessibilityValue = \"Checked/Not Checked\"",
    "steps": [
        "Interact with the checkbox or radio button.",
        "Use VoiceOver to verify if the state is announced.",
        "Check the implementation for correct use of native controls or accessibility properties."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-010",
    "title": "State: Expanded/Collapsed State Not Announced (Accordion)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Expanded+State",
    "shortDescription": "Expandable elements like accordion sections do not announce their expanded or collapsed state to screen readers.",
    "expectedResult": "State changes should be communicated using `accessibilityValue` or appropriate `accessibilityTraits`.",
    "actualResult": "Screen readers do not inform users whether the content is expanded or collapsed.",
    "recommendation": "Implement `accessibilityValue` (e.g., 'Expanded'/'Collapsed') to indicate the current state of expandable elements. As a last resort, you can also use the accessibilityLabel and include 'expanded' or 'collapsed' in label.",
    "codeExample": "\nelement.accessibilityTraits = .button\nelement.accessibilityHint = \"Activate to toggle\"\n// Good: Announces Expanded\nelement.accessibilityValue = \"Expanded\"\n// Good: When pressed again switch to Collapsed\nelement.accessibilityValue = \"Collapsed\"\n",
    "steps": [
        "Toggle the expandable element.",
        "Use VoiceOver to check if the state change is announced.",
        "Ensure `accessibilityValue` is correctly implemented and updated, or use appropriate traits."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-011",
    "title": "State: On/Off State Not Announced (Switch)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Toggle+State",
    "shortDescription": "Toggle switches do not announce their on or off state to screen readers, making it unclear if the setting is enabled or disabled.",
    "expectedResult": "Toggle states should be communicated using `accessibilityValue` or appropriate `accessibilityTraits`.",
    "actualResult": "Screen readers do not announce whether the toggle is on or off.",
    "recommendation": "Use native `UISwitch` controls, or LD component, or as last resort the `accessibilityValue` to reflect the on/off state.",
    "codeExample": "\n// Best: Use LD Switch\nlet sendUpdates = LDSwitch(isOn: true)\n---\n// Fallback: Use accessibilityValue as boolean\nlet customSwitch = UIButton(type: .system)\ncustomSwitch.accessibilityValue = \"On/Off\"",
    "steps": [
        "Interact with the toggle switch.",
        "Use VoiceOver to verify if the state change is announced.",
        "Ensure the correct accessibility properties are implemented and updated accordingly."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.2-012",
    "title": "Accessibility Not Enabled: Element Not Focusable or Recognized by VoiceOver",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Focusable+Missing",
    "shortDescription": "An element is not focusable or recognized by VoiceOver, making it inaccessible to assistive technologies.",
    "expectedResult": "All interactive elements should be focusable and recognized by VoiceOver.",
    "actualResult": "The element is not focusable or recognized by VoiceOver.",
    "recommendation": "Use a native UI component that is inherently accessible or set `isAccessibilityElement='true'` to make the element focusable and recognized by VoiceOver.",
    "codeExample": "\n// Best: Rely on default OS\nSwift’s standard UI components, like text views, buttons, and labels, are accessibility-ready by default.\nWith isAccessibilityElement already defined underneath the hood.\n---\n// Good Fallback: Use isAccessibilityElement if building customView\nelement.isAccessibilityElement = true",
    "steps": [
        "Navigate to the screen with the interactive element.",
        "Attempt to focus the element using VoiceOver.",
        "Observe that the element is not focused or recognized."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.3-001",
    "title": "Status Message: Success Messages Not Announced (Success Status Message)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Success+Message",
    "shortDescription": "Success message is not announced to TalkBack users.",
    "expectedResult": "Success messages should be announced to TalkBack users by moving focus or using a status message announcement.",
    "actualResult": "The success message is not announced, and focus remains on the initial element.",
    "recommendation": "Move focus to the success message or use AccessibilityEvent.TYPE_ANNOUNCEMENT for screen reader visibility.",
    "steps": [
        "Trigger a success action (e.g., successful form submission).",
        "Enable TalkBack and observe if the success message is announced.",
        "Confirm that the message is either not announced or lacks focus movement to the success indicator."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.3-002",
    "title": "Status Message: Error Messages Not Announced (Error Status Message)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Error+Message",
    "shortDescription": "Error message is not announced to TalkBack users. Error message not receiving focus as soon as it appears.",
    "expectedResult": "Focus should automatically move to the error message to ensure TalkBack users are notified.",
    "actualResult": "The error message is not announced or does not receive focus.",
    "recommendation": "Move focus to the error message using AccessibilityEvent.TYPE_VIEW_FOCUSED.",
    "steps": [
        "Trigger an error (e.g., submit form with invalid input).",
        "Enable TalkBack and confirm focus moves to the error message.",
        "Verify that the error message is properly announced to TalkBack users."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.3-003",
    "title": "Status Message: Snackbar Messages Not Announced to Screen Reader (Snackbar)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Snackbar",
    "shortDescription": "Snackbar message is not announced to TalkBack users.",
    "expectedResult": "Snackbar messages should use a status announcement (AccessibilityEvent.TYPE_ANNOUNCEMENT) for TalkBack users.",
    "actualResult": "The snackbar message appears without being announced to TalkBack.",
    "recommendation": "Implement a status announcement for snackbar notifications using AccessibilityEvent.TYPE_ANNOUNCEMENT.",
    "steps": [
        "Trigger a snackbar notification (e.g., action confirmation).",
        "Enable TalkBack to check if the snackbar is announced.",
        "Ensure the status message is accessible for TalkBack users."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-AND-4.1.3-004",
    "title": "Status Message: General Status Messages Not Announced (Notify TalkBack about a change without moving focus)",
    "platforms": [
        "Android"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Status+Message",
    "shortDescription": "Status message is not announced to TalkBack users. Sometimes a visual change occurs that we need to notify the TalkBack user about, but without moving focus.",
    "expectedResult": "All status messages should be announced using AccessibilityEvent.TYPE_ANNOUNCEMENT.",
    "actualResult": "We need to notify the TalkBack user about something. But the notification is not announced, making it inaccessible to TalkBack users.",
    "recommendation": "Use AccessibilityEvent.TYPE_ANNOUNCEMENT to announce status messages without moving focus.",
    "steps": [
        "Trigger a status message (e.g., loading complete, data updated).",
        "Enable TalkBack to confirm the announcement of the status message.",
        "Ensure that the message is accessible and informative for TalkBack users."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.3-001",
    "title": "Status Message: Success Messages Not Announced (Success Status Message)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Success+Message",
    "shortDescription": "Success message is not announced to screen readers.",
    "expectedResult": "Success messages should be announced to users by moving focus or using a status message announcement.",
    "actualResult": "The success message is not announced, and focus remains on the initial element.",
    "recommendation": "Recommended: Move focus to the success message, if not possible, use a status message announcement for screen reader visibility.",
    "codeExample": "\n        // Best: Use LD LDA11YAnnouncement\n        <A11YAnnouncementProvider>",
    "steps": [
        "Trigger a success action (e.g., form submission).",
        "Observe the screen reader response for the success message.",
        "Confirm that the success message is either not announced or lacks focus movement."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.3-002",
    "title": "Status Message: Error Messages Not Announced (Error Status Message)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Error+Message",
    "shortDescription": "Error message is not announced to screen readers. Error message not receiving focus as soon as it appears.",
    "expectedResult": "Focus should automatically move to the error message to ensure users are aware.",
    "actualResult": "The error message is not announced or does not receive focus.",
    "recommendation": "Move focus to the error message to make it accessible to screen readers.",
    "codeExample": "\n        // Best: Use LD LDA11YAnnouncement\n        <A11YAnnouncementProvider>",
    "steps": [
        "Trigger an error (e.g., submit form with invalid input).",
        "Use a screen reader to confirm focus moves to the error message.",
        "Verify that the error message is announced to the user."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.3-003",
    "title": "Status Message: Snackbar Messages Not Announced to Screen Reader (Snackbar)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Snackbar",
    "shortDescription": "Snackbar message is not announced to screen readers.",
    "expectedResult": "Snackbar messages should be announced using a status message for assistive technology.",
    "actualResult": "The snackbar message appears without being announced to screen readers.",
    "recommendation": "Ensure the snackbar announces. Use LD Snackbar. If needed, add a 1-2 second delay. As a last resort, leverage LDA11YAnnouncement Utility.",
    "codeExample": "\n        // Best: Use LD Snackbar\n        LD addSnack\n        \n        // Good: LD A11Y Announcement\n        <A11YAnnouncementProvider>",
    "steps": [
        "Trigger a snackbar notification (e.g., action confirmation).",
        "Use a screen reader to check if the snackbar is announced.",
        "Confirm that the status message is accessible to screen reader users."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-WEB-4.1.3-004",
    "title": "Status Message: General Status Messages Not Announced (Notify screen reader about a change without moving focus)",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Status+Message",
    "shortDescription": "Status message is not announced to screen readers. Sometimes a visual change occurs that we need to notify the screen reader user about, BUT WITHOUT MOVING FOCUS.",
    "expectedResult": "All status messages should be announced to assistive technologies.",
    "actualResult": "We need to notify the screen reader user about something. But the notification is not announced, making it inaccessible to screen reader users.",
    "recommendation": "Use ARIA live regions. Leverage the LDA11YAnnouncement utility.",
    "codeExample": "\n        // Best: Use LD LDA11YAnnouncement\n        <A11YAnnouncementProvider>",
    "steps": [
        "Trigger a status message (e.g., loading complete, data updated).",
        "Use a screen reader to confirm the announcement of the status message.",
        "Ensure that the message is accessible and informative for screen reader users."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.3-001",
    "title": "Status Message: Success Messages Not Announced (Success Status Message)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Success+Message",
    "shortDescription": "Success message is not announced to VoiceOver users.",
    "expectedResult": "Success messages should be announced to VoiceOver users, either by moving focus or using a status message announcement.",
    "actualResult": "The success message is not announced, and focus remains on the initial element.",
    "recommendation": "Move focus to the success message or use UIAccessibilityPostNotification for screen reader visibility.",
    "codeExample": "\n// Best: Announce success message\nUIAccessibility.post(notification: .announcement, argument: successLabel)",
    "steps": [
        "Trigger a success action (e.g., successful form submission).",
        "Enable VoiceOver and observe if the success message is announced.",
        "Confirm that the message is either not announced or lacks focus movement to the success indicator."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.3-002",
    "title": "Status Message: Error Messages Not Announced (Error Status Message)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P1",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Error+Message",
    "shortDescription": "Error message is not announced to VoiceOver users. Error message not receiving focus as soon as it appears.",
    "expectedResult": "Focus should automatically move to the error message to ensure VoiceOver users are notified.",
    "actualResult": "The error message is not announced or does not receive focus.",
    "recommendation": "Move focus to the error message using UIAccessibilityPostNotification.",
    "codeExample": "\n// Best: Announce error message. Note we prefer focus for error.\nUIAccessibility.post(notification: .announcement, argument: errorLabel)",
    "steps": [
        "Trigger an error (e.g., submit form with invalid input).",
        "Enable VoiceOver and confirm focus moves to the error message.",
        "Verify that the error message is properly announced to VoiceOver users."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.3-003",
    "title": "Status Message: Snackbar Messages Not Announced to Screen Reader (Snackbar)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Snackbar",
    "shortDescription": "Snackbar message is not announced to VoiceOver users.",
    "expectedResult": "Snackbar messages should use a status announcement (UIAccessibilityPostNotification) for VoiceOver users.",
    "actualResult": "The snackbar message appears without being announced to VoiceOver.",
    "recommendation": "Implement a status announcement for snackbar notifications using UIAccessibilityPostNotification.",
    "codeExample": "\n// Best: Announce snackbar\nUse the LD Snackbar\nsnackbarView.isAccessibilityElement = true",
    "steps": [
        "Trigger a snackbar notification (e.g., action confirmation).",
        "Enable VoiceOver to check if the snackbar is announced.",
        "Ensure the status message is accessible for VoiceOver users."
    ],
    "dateAdded": "2026-03-19"
},
{
    "id": "WA11Y-IOS-4.1.3-004",
    "title": "Status Message: General Status Messages Not Announced (Notify VoiceOver about a change without moving focus)",
    "platforms": [
        "iOS"
    ],
    "wcag": "WCAG-4.1.3",
    "priority": "P2",
    "severity": "2 - Major Problem",
    "thumbnail": "https://via.placeholder.com/80?text=Status+Message",
    "shortDescription": "Status message is not announced to VoiceOver users. Sometimes a visual change occurs that we need to notify the VoiceOver user about, but without moving focus.",
    "expectedResult": "All status messages should be announced using UIAccessibilityPostNotification.",
    "actualResult": "We need to notify the VoiceOver user about something. But the notification is not announced, making it inaccessible to VoiceOver users.",
    "recommendation": "Use UIAccessibilityPostNotification to announce status messages without moving focus.",
    "codeExample": "\n// Best: Push a screen reader only notification via .announcement\nUIAccessibility.post(notification: .announcement, argument: \"Loading complete\")\n",
    "steps": [
        "Trigger a status message (e.g., loading complete, data updated).",
        "Enable VoiceOver to confirm the announcement of the status message.",
        "Ensure that the message is accessible and informative for VoiceOver users."
    ],
    "dateAdded": "2026-03-19"
}
,
{
    "id": "WA11Y-WEB-4.1.2-012",
    "title": "Accessibility: Dialog Missing Programmatic Title / Accessible Name",
    "platforms": [
        "Web"
    ],
    "wcag": "WCAG-4.1.2",
    "priority": "P1",
    "severity": "1 - Critical",
    "thumbnail": "https://via.placeholder.com/80?text=Dialog+Title",
    "shortDescription": "The dialog opens without a programmatic title or accessible name, so assistive technologies cannot announce what the modal is.",
    "expectedResult": "The dialog exposes a valid accessible name via aria-labelledby so screen readers can identify it.",
    "actualResult": "The dialog has no accessible name, leaving the modal unnamed for screen reader users.",
    "recommendation": "Add a visible dialog heading and connect it with aria-labelledby to provide a programmatic name.",
    "needsJiraFormattingForCode": true,
    "codeExample": "export function ExampleDialog({\n isOpen,\n onClose,\n}: {\n isOpen: boolean;\n onClose: () => void;\n}) {\n if (!isOpen) return null;\n\n return (\n <div role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"dialog-title\" className=\"bg-white pa4 br3 shadow-2\">\n <h2 id=\"dialog-title\" className=\"f4 b mv0\">\n Confirm deletion\n </h2>\n <button type=\"button\" onClick={onClose} className=\"mt4\">\n Close\n </button>\n </div>\n );\n}",
    "steps": [
        "Open the dialog with a screen reader enabled.",
        "Inspect whether the modal exposes an accessible name in the accessibility tree.",
        "Confirm the dialog announcement includes the visible title text."
    ],
    "dateAdded": "2026-03-20"
}
];
