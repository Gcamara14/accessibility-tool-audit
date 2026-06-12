# Understanding WCAG 2.2 AA

This document contains the full Understanding WCAG guidance and is intended to be used by a custom GPT to explain intent, edge cases, and rationale behind WCAG 2.2 AA success criteria.

## Table of Contents

- [1.1.1 Non-text Content (A)](#111-non-text-content-a)
- [1.2.1 Audio-only and Video-only (Prerecorded) (A)](#121-audio-only-and-video-only-prerecorded-a)
- [1.2.2 Captions (Prerecorded) (A)](#122-captions-prerecorded-a)
- [1.2.3 Audio Description or Media Alternative (Prerecorded) (A)](#123-audio-description-or-media-alternative-prerecorded-a)
- [1.2.4 Captions (Live) (AA)](#124-captions-live-aa)
- [1.2.5 Audio Description (Prerecorded) (AA)](#125-audio-description-prerecorded-aa)
- [1.3.1 Info and Relationships (A)](#131-info-and-relationships-a)
- [1.3.2 Meaningful Sequence (A)](#132-meaningful-sequence-a)
- [1.3.3 Sensory Characteristics (A)](#133-sensory-characteristics-a)
- [1.3.4 Orientation (AA)](#134-orientation-aa)
- [1.3.5 Identify Input Purpose (AA)](#135-identify-input-purpose-aa)
- [1.4.1 Use of Color (A)](#141-use-of-color-a)
- [1.4.2 Audio Control (A)](#142-audio-control-a)
- [1.4.3 Contrast (Minimum) (AA)](#143-contrast-minimum-aa)
- [1.4.4 Resize Text (AA)](#144-resize-text-aa)
- [1.4.5 Images of Text (AA)](#145-images-of-text-aa)
- [1.4.10 Reflow (AA)](#1410-reflow-aa)
- [1.4.11 Non-text Contrast (AA)](#1411-non-text-contrast-aa)
- [1.4.12 Text Spacing (AA)](#1412-text-spacing-aa)
- [1.4.13 Content on Hover or Focus (AA)](#1413-content-on-hover-or-focus-aa)
- [2.1.1 Keyboard (A)](#211-keyboard-a)
- [2.1.2 No Keyboard Trap (A)](#212-no-keyboard-trap-a)
- [2.1.4 Character Key Shortcuts (A)](#214-character-key-shortcuts-a)
- [2.2.1 Timing Adjustable (A)](#221-timing-adjustable-a)
- [2.2.2 Pause, Stop, Hide (A)](#222-pause-stop-hide-a)
- [2.3.1 Three Flashes or Below Threshold (A)](#231-three-flashes-or-below-threshold-a)
- [2.4.1 Bypass Blocks (A)](#241-bypass-blocks-a)
- [2.4.2 Page Titled (A)](#242-page-titled-a)
- [2.4.3 Focus Order (A)](#243-focus-order-a)
- [2.4.4 Link Purpose (In Context) (A)](#244-link-purpose-in-context-a)
- [2.4.5 Multiple Ways (AA)](#245-multiple-ways-aa)
- [2.4.6 Headings and Labels (AA)](#246-headings-and-labels-aa)
- [2.4.7 Focus Visible (AA)](#247-focus-visible-aa)
- [2.4.11 Focus Not Obscured (Minimum) (AA)](#2411-focus-not-obscured-minimum-aa)
- [2.5.1 Pointer Gestures (A)](#251-pointer-gestures-a)
- [2.5.2 Pointer Cancellation (A)](#252-pointer-cancellation-a)
- [2.5.3 Label in Name (A)](#253-label-in-name-a)
- [2.5.4 Motion Actuation (A)](#254-motion-actuation-a)
- [2.5.7 Dragging Movements (AA)](#257-dragging-movements-aa)
- [2.5.8 Target Size (Minimum) (AA)](#258-target-size-minimum-aa)
- [3.1.1 Language of Page (A)](#311-language-of-page-a)
- [3.1.2 Language of Parts (AA)](#312-language-of-parts-aa)
- [3.2.1 On Focus (A)](#321-on-focus-a)
- [3.2.2 On Input (A)](#322-on-input-a)
- [3.2.3 Consistent Navigation (AA)](#323-consistent-navigation-aa)
- [3.2.4 Consistent Identification (AA)](#324-consistent-identification-aa)
- [3.2.6 Consistent Help (A)](#326-consistent-help-a)
- [3.3.1 Error Identification (A)](#331-error-identification-a)
- [3.3.2 Labels or Instructions (A)](#332-labels-or-instructions-a)
- [3.3.3 Error Suggestion (AA)](#333-error-suggestion-aa)
- [3.3.4 Error Prevention (Legal, Financial, Data) (AA)](#334-error-prevention-legal-financial-data-aa)
- [3.3.7 Redundant Entry (A)](#337-redundant-entry-a)
- [3.3.8 Accessible Authentication (Minimum) (AA)](#338-accessible-authentication-minimum-aa)
- [4.1.2 Name, Role, Value (A)](#412-name-role-value-a)
- [4.1.3 Status Messages (AA)](#413-status-messages-aa)

## 1.1.1 Non-text Content (A)

### In brief
**Goal**
: Non-text information is available to more people.

**What to do**
: Create a text alternative for visual and auditory content.

**Why it's important**
: People who can’t fully see or hear content can understand it.

### Intent
The intent of this success criterion is to make information conveyed by non-text content
         accessible through the use of a text alternative.  Text alternatives are a primary
         way for making information accessible because they can be rendered through any sensory
         modality (for example, visual, auditory or tactile) to match the needs of the user.
         Providing text alternatives allows the information to be rendered in a variety of
         ways by a variety of user agents. For example, people who cannot see a picture can
         have the text alternative read aloud using synthesized speech. People who cannot
         hear an audio file can have the text alternative displayed so that they can read
         it. In the future, text alternatives will also allow information to be more easily
         translated into sign language or into a simpler form of the same language.

      
      

         
         

##### Note on CAPTCHA

         
         

CAPTCHAs are a controversial topic in the accessibility community. As is described in the
            paper 
            [Inaccessibility of CAPTCHA](https://www.w3.org/TR/turingtest/), CAPTCHAs intrinsically push the edges of human abilities in an attempt to defeat
            automated processes. Every type of CAPTCHA will be unsolvable by users with certain
            disabilities. However, they are widely used, and the Web Content Accessibility Guidelines
            Working Group believes that if CAPTCHAs were forbidden outright, websites would choose
            not to conform to WCAG rather than abandon CAPTCHA. This would create barriers for
            a great many more users with disabilities. For this reason the Working Group has chosen
            to structure the requirement about CAPTCHA in a way that meets the needs of most people
            with disabilities, yet is also considered adoptable by sites. Requiring two different
            forms of CAPTCHA on a given site ensures that most people with disabilities will find
            a form they can use.

         
         

Because some users with disabilities will still not be able to access sites that meet
            the minimum requirements, the Working Group provides recommendations for additional
            steps. Organizations motivated to conform to WCAG should be aware of the importance
            of this topic and should go as far beyond the minimum requirements of the guidelines
            as possible. Additional recommended steps include:

         
         

- Providing more than two modalities of CAPTCHAs
- Providing access to a human customer service representative who can bypass CAPTCHA
- Not requiring CAPTCHAs for authorized users

         
      

      

         

##### Note on alternatives matching the language of content

         

Text alternatives and equivalents should match the human language of the original content (normally the default human language of the page). The [5.2 Conformance Requirements](https://www.w3.org/TR/WCAG22/#conformance-reqs) section, through the defined terms used there, states that success criteria be met through accessibility-supported ways (5.2.4), where the technology is used “in the human language of the content.” Where an alternative version is used (5.2.1), it is defined as something that “provides all of the same information and functionality in the same human language.”

      

      
      

         
         

##### Additional information

         
         

Non-text content can take a number of forms, and this success criterion specifies
            how each is to be handled.

         
         

**
               For non-text content that is not covered by one of the other situations listed below,
            **
            such as charts, diagrams, audio recordings, pictures, and animations, text alternatives
            can make the same information available in a form that can be rendered through any
            modality (for example, visual, auditory or tactile).  Short and long text alternatives
            can be used as needed to convey the information in the non-text content.  Note that
            
            **
               prerecorded
               audio-only
            ** and 
            
            ** prerecorded
               video-only
            ** files are covered here.  
            **
               Live-audio-only
            ** and 
            **
               Live-video-only
            ** files are covered below (see 3rd paragraph following this one).

         
         

**
               For non-text content that is a control or accepts user input
            **, such as images used as submit buttons, image maps or complex animations, a name
            is provided to describe the purpose of the non-text content so that the person at
            least knows what the non-text content is and why it is there.

         
         

**
               Non-text content that is time-based media
            **
            is made accessible through 
            [1.2: Time-Based Media](time-based-media).  However, it is important that users know what it is when they encounter it on a
            page so they can decide what action if any they want to take with it.  A text alternative
            that describes the time-based media and/or gives its title is therefore provided.

         
         

**
               For Live Audio-only and live video-only content
            **, it can be much more difficult to provide text alternatives that provide equivalent
            information as live audio-only and live video-only content. For these types of non-text
            content, text alternatives provide a descriptive label.

         
         

**
               Sometimes a test or exercise must be partially or completely presented in non-text
               format.
            **  Audio or visual information is provided that cannot be changed to text because the
            test or exercise must be conducted using that sense.  For example, a hearing test
            would be invalid if a text alternative were provided.  A visual skill development
            exercise would similarly make no sense in text form.  And a spelling test with text
            alternatives would not be very effective.  For these cases, text alternatives should
            be provided to describe the purpose of the non-text content; of course, the text alternatives
            would not provide the same information needed to pass the test.

         
         

**
               Sometimes content is primarily intended to create a specific sensory experience
            ** that words cannot fully capture. Examples include a symphony performance, works of
            visual art etc. For such content, text alternatives at least identify the non-text
            content with a descriptive label and where possible, additional descriptive text.
            If the reason for including the content in the page is known and can be described
            it is helpful to include that information.

         
         

**Sometimes there are non-text exercises that are used to prove you are human.** To avoid spam robots and other software from gaining access to a site a device called
            a CAPTCHA is used. These usually involve visual or auditory tasks that are beyond
            the current capabilities of web robots. Providing a text alternative to them would
            however make them operable by Robots, thus defeating their purpose. In this case a
            text alternative would describe the purpose of the CAPTCHA, and alternate forms using
            different modalities would be provided to address the needs of people with different
            disabilities.

         
         

**
               Sometimes there is non-text content that really is not meant to be seen or understood
               by the user.
            ** Transparent images used to move text over on a page; an invisible image that is used
            to track usage statistics; and a swirl in the corner that conveys no information but
            just fills up a blank space to create an aesthetic effect are all examples of this.
            Putting alternative text on such items just distracts people using screen readers
            from the content on the page. Not marking the content in any way, though, leaves users
            guessing what the non-text content is and what information they may have missed (even
            though they have not missed anything in reality). This type of non-text content, therefore,
            is marked or implemented in a way that assistive technologies (AT) will ignore it
            and not present anything to the user.

### Benefits
- This success criterion helps people who have difficulty perceiving visual content.
            Assistive technology can read text aloud, present it visually, or convert it to braille.
- Text alternatives may help some people who have difficulty understanding the meaning
            of photographs, drawings, and other images  (e.g., line drawings, graphic designs,
            paintings, three-dimensional representations), graphs, charts, animations, etc.
- People who are deaf, are hard of hearing, or who are having trouble understanding
            audio information for any reason can read the text presentation. Research is ongoing
            regarding automatic translation of text into sign language.
- People who are deaf-blind can read the text in braille.
- Additionally, text alternatives support the ability to search for non-text content
            and to repurpose content in a variety of ways.

### Examples
**A data chart**
: A bar chart compares how many widgets were sold in June, July, and August. The short
               label says, "Figure one - Sales in June, July and August." The longer description
               identifies the type of chart, provides a high-level summary of the data, trends and
               implications comparable to those available from the chart. Where possible and practical,
               the actual data is provided in a table.

**An audio recording of a speech**
: The link to an audio clip says, "Chairman's speech to the assembly." A link to a text
               transcript is provided immediately after the link to the audio clip.

**An animation that illustrates how a car engine works**
: An animation shows how a car engine works. There is no audio and the animation is
               part of a tutorial that describes how an engine works. Since the text of the tutorial
               already provides a full explanation, the image is an alternative for text and the
               text alternative includes only a brief description of the animation and refers to
               the tutorial text for more information.

**A traffic web camera**
: A website allows users to select from a variety of web cameras positioned throughout
               a major city. After a camera is selected, the image updates every two minutes. A short
               text alternative identifies the web camera as "traffic web camera." The site also
               provides a table of travel times for each of the routes covered by the web cameras.
               The table is also updated every two minutes.

**A photograph of an historic event in a news story**
: A photograph of two world leaders shaking hands accompanies a news story about an
               international summit meeting. The text alternative says, "President X of Country X
               shakes hands with Prime Minister Y of country Y."

**A photograph of a historic event in content discussing diplomatic relationships**
: The same image is used in a different context intended to explain nuances in diplomatic
               encounters. The image of the president shaking hands with the prime minister appears
               on a website discussing intricate diplomatic relationships. The first text alternative
               reads, "President X of country X shakes hands with Prime Minister Y of country Y on
               January 2, 2009." An additional text alternative describes the room where the leaders
               are standing as well as the expressions on the leaders' faces, and identifies the
               other people in the room. The additional description might be included on the same
               page as the photograph or in a separate file associated with the image through a link
               or other standard programmatic mechanism.

**An audio recording of a press conference**
: A web page includes a link to an audio recording of a press conference. The link text
               identifies the audio recording. The page also links to a text transcript of the press
               conference. The transcript includes a verbatim record of everything the speakers say.
               It identifies who is speaking as well as noting other significant sounds that are
               part of the recording, such as applause, laughter, questions from the audience, and
               so on.

**An e-learning application**
: An e-learning application uses sound effects to indicate whether or not the answers
               are correct. The chime sound indicates that the answer is correct and the beep sound
               indicates that the answer is incorrect. A text description is also included so that
               people who can't hear or understand the sound understand whether the answer is correct
               or incorrect.

**A linked thumbnail image**
: A thumbnail image of the front page of a newspaper links to the home page of the "Smallville
               Times". The text alternative says "Smallville Times".

**The same image used on different sites**
: Different alternatives for an image of the world: An image of the world that is used
               on a travel site as a link to the International Travel section has the text alternative
               "International Travel". The same image is used as a link on a university website
               with the text alternative "International Campuses".

**An image map**
: An image of a building floor plan is interactive, allowing the user to select a
               particular room and navigate to a page containing information about that room.
               The short text alternative describes the image and its interactive purpose:
               "Building floor plan. Select a room for more information."

### Resources
- [Excerpts from the NBA Tape Recording Manual, Third Edition](https://www.w3.org/2000/08/nba-manual/Overview.html)
- [Inaccessibility of CAPTCHA](https://www.w3.org/TR/turingtest/)
- [All That Malarkey: Accessible Alternatives](https://stuffandnonsense.co.uk/archives/accessible_alternatives.html)
- [456 Berea Street: The Alt and Title Attributes](http://www.456bereastreet.com/archive/200412/the_alt_and_title_attributes/)
- [The Alt and Accessibility](http://green-beast.com/blog/?p=81)
- [Better Connected, Better Results: Alt Text](http://www.accessibilitynews.ca/cwdo/resources/resources.php?resources=187)

### Techniques

#### Sufficient Techniques

- **Situation A: If a short description can serve the same purpose and present the same information as the non-text content:**
  - G94
- **Situation B: If a short description can <strong>not</strong> serve the same purpose and present the same information as the non-text content (e.g., a chart or diagram):**
  - G95
- **Situation C: If non-text content is a control or accepts user input:**
  - G82
- **Situation D: If non-text content is time-based media (including live video-only and live audio-only); a test or exercise that would be invalid if presented in text; or primarily intended to create a specific sensory experience:**
  - Providing a descriptive label
  - G68
  - G100
- **Situation E: If non-text content is a CAPTCHA:**
  - {"and":["G143","G144"]}
- **Situation F: If the non-text content should be ignored by assistive technology:**
  - Implementing or marking the non-text content so that it will be ignored by assistive technology

#### Advisory Techniques

- C18

#### Failures

- F3
- F13
- F20
- F30
- F38
- F39
- F65
- F67
- F71
- F72


---

## 1.2.1 Audio-only and Video-only (Prerecorded) (A)

### In brief
**Goal**
: Audio and video-only content can be understood by more people.

**What to do**
: Provide an alternative when content is perceivable with only one sense.

**Why it's important**
: People who can’t fully see or hear content can understand it.

### Intent
The intent of this success criterion is to make information conveyed by prerecorded
         audio-only and prerecorded video-only content available to all users. Alternatives
         for time-based media that are text based make information accessible because text
         can be rendered through any sensory modality (for example, visual, auditory or tactile)
         to match the needs of the user. In the future, text could also be translated into
         symbols, sign language or simpler forms of the language (future).

      
      

An example of pre-recorded video with no audio information or user interaction is
         a silent movie. The purpose of the transcript is to provide an equivalent to what
         is presented visually. For prerecorded video content, authors have the option to provide
         an audio track. The purpose of the audio alternative is to be an equivalent to the
         video. This makes it possible for users with and without vision impairment to review
         content simultaneously. The approach can also make it easier for those with cognitive,
         language and learning disabilities to understand the content because it would provide
         parallel presentation.

      
      

> **Note:**
> >          
>          
> 
> A text equivalent is not required for audio that is provided as an equivalent for
>             video with no audio information.  For example, it is not required to caption audio
>             description that is provided as an alternative to a silent movie.
> 
> 
>          
>

      
      

See also 
         [1.2.9: Audio-only (Live)](audio-only-live)

### Benefits
- This success criterion helps people who have difficulty perceiving visual content.
            Assistive technology can read text alternatives aloud, present them visually, or convert
            them to braille.
- Alternatives for timed-based media that are text based may help some people who have
            difficulty understanding the meaning of prerecorded video content.
- People who are deaf, are hard of hearing, or who are having trouble understanding
            audio information for any reason can read the text presentation. Research is ongoing
            regarding automatic translation of text into sign language.
- People who are deaf-blind can read the text in braille.
- Additionally, text supports the ability to search for non-text content and to repurpose
            content in a variety of ways.

### Examples
**An audio recording of a speech**
: The link to an audio clip says, "Chairman's speech to the assembly." A link to a text
               transcript is provided immediately after the link to the audio clip.

**An audio recording of a press conference**
: A web page includes a link to an audio recording of a press conference that identifies
               the audio recording. The page also links to a text transcript of the press conference.
               The transcript includes a verbatim record of everything the speakers say. It identifies
               who is speaking as well as noting other significant sounds that are part of the recording,
               such as applause, laughter, questions from the audience, and so on.

**An animation that illustrates how a car engine works**
: An animation shows how a car engine works. There is no audio and the animation is
               part of a tutorial that describes how an engine works. Since the text of the tutorial
               already provides a full explanation, the media is an alternative for text and the
               text alternative includes only a brief description of the animation and refers to
               the tutorial text for more information.

**A video-only file with an audio track**
: A silent movie includes an audio track which includes a description of the action in the video.

### Resources
- [Making Audio and Video Media Accessible, W3C Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/media/av/)
- [Overcoming the challenge of podcast transcription](http://www.rnib.org.uk/travel-downloads-podcasts-and-apps?List=be9c76d3-7ad0-4e03-a1a0-e6f6953b8178&ID=16)
- [uiAccess list of transcription services](http://www.uiaccess.com/transcripts/transcript_services.html)
- [Transcripts on the Web: Getting people to your podcasts and videos](http://www.uiaccess.com/transcripts/transcripts_on_the_web.html)

### Techniques

#### Sufficient Techniques

- **Situation A: If the content is prerecorded audio-only:**
  - G158
- **Situation B: If the content is prerecorded video-only:**
  - G159
  - G166

#### Advisory Techniques

- H96

#### Failures

- F30
- F67


---

## 1.2.2 Captions (Prerecorded) (A)

### In brief
**Goal**
: Videos can be played with captions.

**What to do**
: Provide synchronized text for audio content in existing videos.

**Why it's important**
: People who are deaf or hard of hearing can understand audio in videos.

### Intent
The intent of this success criterion is to enable people who are deaf or hard of hearing
         to watch synchronized media presentations. Captions provide the part of the content
         available via the audio track. Captions not only include dialogue, but identify who
         is speaking and include non-speech information conveyed through sound, including meaningful
         sound effects.

      
      

It is acknowledged that at the present time there may be difficulty in creating captions
         for time-sensitive material and this may result in the author being faced with the
         choice of delaying the information until captions are available, or publishing time-sensitive
         content that is inaccessible to the deaf, at least for the interval until captions
         are available. Over time, the tools for captioning as well as building the captioning
         into the delivery process can shorten or eliminate such delays.

      
      

Captions are not needed when the synchronized media is, itself, an alternate presentation
         of information that is also presented via text on the web page. For example, if information
         on a page is accompanied by a synchronized media presentation that presents no more
         information than is already presented in text, but is easier for people with cognitive,
         language, or learning disabilities to understand, then it would not need to be captioned
         since the information is already presented on the page in text or in text alternatives
         (e.g., for images).

      
      

See also 
         [1.2.4: Captions (Live)](captions-live).

### Benefits
- People who are deaf or have a hearing loss can access the auditory information in
            the synchronized media content through captions.

### Examples
- **A captioned tutorial**

            

A video clip shows how to tie a knot. The captions read,

            

"(music)

            

Using rope to tie knots was an important skill

            

for the likes of sailors, soldiers and woodsmen.."

            

From Sample Transcript Formatting by Whit Anderson.
- A complex legal document contains synchronized media clips for different paragraphs
            that show a person speaking the contents of the paragraph. Each clip is associated
            with its corresponding paragraph. No captions are provided for the synchronized media.
- An instruction manual containing a description of a part and its necessary orientation
            is accompanied by a synchronized media clip showing the part in its correct orientation.
            No captions are provided for the synchronized media clip.
- An orchestra provides captions for videos of performances. In addition to capturing
               dialog and lyrics verbatim, captions identify non-vocal music by title, movement,
               composer, and any information that will help the user comprehend the nature of the
               audio. For instance captions read,

            

"[Orchestral Suite No. 3.2 in D major, BWV 1068, Air]

            

[Johann Sebastian Bach, Composer]

            

♪ Calm melody with a slow tempo ♪"

            

> **Note:**
> >                
> 
> Style guides for captions may differ among different languages.
> 
> 
>

### Resources
##### Guides to Captioning

         
         

- [Captions/Subtitles](https://www.w3.org/WAI/media/av/captions/), in [Making Audio and Video Media Accessible](https://www.w3.org/WAI/media/av/), W3C Web Accessibility Initiative (WAI)
- [BBC: Subtitle Guidelines](https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/)
- [Captioning Key: Guidelines and Preferred Techniques](https://dcmp.org/learn/captioningkey)
- [Best Practices in Online Captioning](https://joeclark.org/access/captioning/bpoc/)

         
      

      
      

         
         

##### SMIL Resources

         
         

- [Synchronized Multimedia Integration Language (SMIL) 3.0](https://www.w3.org/TR/SMIL/)
- [Accessibility Features of SMIL](https://www.w3.org/TR/SMIL-access/)

         
      

      
      

         
         

##### Other Captioning Resources

         
         

- [National Center for Accessible Media](https://www.wgbh.org/foundation/what-we-do/ncam)
- [WebAIM: Captioning Resource List](https://webaim.org/techniques/captions/)

### Techniques

#### Sufficient Techniques

- G93
- G87

#### Failures

- F8
- F75
- F74


---

## 1.2.3 Audio Description or Media Alternative (Prerecorded) (A)

### In brief
**Goal**
: Prerecorded videos can be understood by more people.

**What to do**
: Provide a description of the visual content in videos.

**Why it's important**
: People who are blind or who cannot understand the visual content can have it described.

### Intent
The intent of this success criterion is to provide people who are blind or visually
         impaired access to the visual information in a synchronized media presentation in the same [human language]() as the video or page on which it appears. This
         success criterion describes two approaches, either of which can be used.

      
      

One approach is to provide audio description of the video content. The audio description
         augments the audio portion of the presentation with the information needed when the
         video portion is not available. During existing pauses in dialogue, audio description
         provides information about actions, characters, scene changes, and on-screen text
         that  are important and are not described or spoken in the main sound track.

      
      

The second approach involves providing all of the information in the synchronized
         media (both visual and auditory) in text form. An alternative for time-based media
         provides a running description of all that is going on in the synchronized media content.
         The alternative for time-based media reads something like a screenplay or book. Unlike
         audio description, the description of the video portion is not constrained to just
         the pauses in the existing dialogue. Full descriptions are provided of all visual
         information, including visual context, actions and expressions of actors, and any
         other visual material. In addition, non-speech sounds (laughter, off-screen voices,
         etc.) are described, and transcripts of all dialogue are included. The sequence of
         description and dialogue transcripts are the same as the sequence in the synchronized
         media itself. As a result, the alternative for time-based media can provide a much
         more complete representation of the synchronized media content than audio description
         alone.

      
      

If there is any interaction as part of the synchronized media presentation (e.g.,
         "press now to answer the question") then the alternative for time-based media would
         provide hyperlinks or whatever is needed to provide the same functionality.

      
      

> **Note:**
> >          
>          
> 
> For 1.2.3, 1.2.5, and 1.2.7, if all of the important information in the video track is already
>             conveyed in the audio track, no additional audio description is necessary.
> 
> 
>          
>          
> 
> 1.2.3, 1.2.5, and 1.2.8 overlap somewhat with each other. This is to give the author
>             some choice at the minimum conformance level, and to provide additional requirements
>             at higher levels. At Level A in Success Criterion 1.2.3, authors do have the choice
>             of providing either an audio description or a full text alternative. If they wish
>             to conform at Level AA, under Success Criterion 1.2.5 authors must provide an audio
>             description - a requirement already met if they chose that alternative for 1.2.3,
>             otherwise an additional requirement. At Level AAA under Success Criterion 1.2.8 they
>             must provide an extended text description. This is an additional requirement if both
>             1.2.3 and 1.2.5 were met by providing an audio description only. If 1.2.3 was met,
>             however, by providing a text description, and the 1.2.5 requirement for an audio description
>             was met, then 1.2.8 does not add new requirements.
> 
> 
>          
>

      
      

See also
         [1.2.5 Audio Description (Prerecorded)](audio-description-prerecorded),
         [1.2.7 Extended Audio Description (Prerecorded)](extended-audio-description-prerecorded) and
         [1.2.8 Media Alternative (Prerecorded)](media-alternative-prerecorded).

### Benefits
- This success criterion may help some people who have difficulty watching video or
            other synchronized media content, including people who have difficulty perceiving
            or understanding moving images.

### Examples
**A movie with audio description**
: **Describer: **A title, "Teaching Evolution Case Studies. Bonnie Chen." A teacher shows photographs
               of birds with long, thin beaks.

            
            

**Bonnie Chen: **"These photos were all taken at the Everglades."

            
            

**Describer: **The teacher hands each student two flat, thin wooden sticks.

            
            

**Bonnie Chen: **"Today you will pretend to be a species of wading bird that has a beak like this."

            
            

**Describer: **The teacher holds two of the sticks to her mouth making the shape of a beak.

            
            

Transcript of audio based on the first few minutes of "[Teaching Evolution Case Studies, Bonnie Chen](https://www.pbs.org/wgbh/evolution/educators/teachstuds/tvideos.html)" (copyright WGBH and Clear Blue Sky Productions, Inc.)

**An alternative for time-based media for a training video**
: A company purchases a Training video for use by its employees and puts it on the companies
               intranet. The video involves explaining use of a new technology and has a person talking
               and showing things at the same time. Since there is no place to insert audio description
               of the visual demonstrations during gaps in dialogue, the company provides an alternative
               for time-based media that all employees, including those who cannot see the demonstrations,
               can use to better understand what is being presented.

### Resources
- [Making Audio and Video Media Accessible, W3C Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/media/av/)
- [GBH - Integrate audio descriptions into multimedia presentations using SMIL](https://www.wgbh.org/foundation/services/ncam/tools-resources/accessible-digital-media-guidelines-guideline-h-multimedia)
- [Standard Techniques in Audio Description](http://joeclark.org/access/description/ad-principles.html)
- [Synchronized Multimedia Integration Language (SMIL) 1.0](https://www.w3.org/TR/REC-smil/)
- [Synchronized Multimedia Integration Language (SMIL 2.0)](https://www.w3.org/TR/SMIL/)
- [Accessibility Features of SMIL](https://www.w3.org/TR/SMIL-access/)

### Techniques

#### Sufficient Techniques

- G69
- **Linking to the alternative for time-based media**
- G78
- G173
- G8
- G203

#### Advisory Techniques

- H96


---

## 1.2.4 Captions (Live) (AA)

### In brief
**Goal**
: Live videos have captions.

**What to do**
: Provide synchronized text for audio content in real-time videos.

**Why it's important**
: People who are deaf or hard of hearing can understand audio in real-time video content.

### Intent
The intent of this success criterion is to enable people who are deaf or hard of hearing
         to watch 
         *real-time* presentations. Captions provide the part of the content available via the audio track.
         Captions not only include dialogue, but also identify who is speaking and notate sound
         effects and other significant audio.

      
      

This success criterion was intended to apply to broadcast of synchronized media and
         is not intended to require that two-way multimedia calls between two or more individuals
         through web apps must be captioned regardless of the needs of users. Responsibility
         for providing captions would fall to the content providers (the callers) or the “host”
         caller, and not the application.

### Benefits
- People who are deaf or have a hearing loss can access the auditory information in
            the synchronized media content through captions.

### Examples
**A web cast**
: A news organization provides a live, captioned web cast.

**A music web cast**
: An orchestra provides Communication Access Realtime Translation (CART) captioning
               of each real-time web performance. The CART service captures lyrics and dialog as
               well as identifies non-vocal music by title, movement, composer, and any information
               that will help the user comprehend the nature of the audio.

### Resources
- See 
            [1.2.2: Captions (Prerecorded)](captions-prerecorded).

### Techniques

#### Sufficient Techniques

- {"and":["G9","G93"]}
- {"and":["G9","G87"],"using":["SM11","SM12","Using any readily available media format that has a video player that supports closed captioning"]}


---

## 1.2.5 Audio Description (Prerecorded) (AA)

### In brief
**Goal**
: Videos can be played with audio descriptions.

**What to do**
: Provide a synchronized spoken description of the visual content in videos.

**Why it's important**
: People who cannot see or understand the visual content can hear about it while playing videos.

### Intent
The intent of this success criterion is to provide people who are blind or visually
         impaired access to the visual information in a synchronized media presentation in the same [human language]() as the video or page on which it appears. The
         audio description augments the audio portion of the presentation with the information
         needed when the video portion is not available. During existing pauses in dialogue,
         audio description provides information about actions, characters, scene changes, and
         on-screen text that are important and are not described or spoken in the main sound
         track.

      
      

> **Note:**
> >          
>          
> 
> For 1.2.3, 1.2.5, and 1.2.7, if all of the important information in the video track is already
>             conveyed in the audio track, no additional audio description is necessary.
> 
> 
>          
>          
> 
> 1.2.3, 1.2.5, and 1.2.8 overlap somewhat with each other. This is to give the author
>             some choice at the minimum conformance level, and to provide additional requirements
>             at higher levels. At Level A in Success Criterion 1.2.3, authors do have the choice
>             of providing either an audio description or a full text alternative. If they wish
>             to conform at Level AA, under Success Criterion 1.2.5 authors must provide an audio
>             description - a requirement already met if they chose that alternative for 1.2.3,
>             otherwise an additional requirement. At Level AAA under Success Criterion 1.2.8 they
>             must provide an extended text description. This is an additional requirement if both
>             1.2.3 and 1.2.5 were met by providing an audio description only. If 1.2.3 was met,
>             however, by providing a text description, and the 1.2.5 requirement for an audio description
>             was met, then 1.2.8 does not add new requirements.
> 
> 
>          
>

### Benefits
- People who are blind or have low vision as well as those with cognitive limitations
            who have difficulty interpreting visually what is happening benefit from audio description
            of visual information.

### Examples
**A movie with audio description**
: **Describer: **A title, "Teaching Evolution Case Studies. Bonnie Chen." A teacher shows photographs
               of birds with long, thin beaks.

            
            

**Bonnie Chen: **"These photos were all taken at the Everglades."

            
            

**Describer: **The teacher hands each student two flat, thin wooden sticks.

            
            

**Bonnie Chen: **"Today you will pretend to be a species of wading bird that has a beak like this."

            
            

**Describer: **The teacher holds two of the sticks to her mouth making the shape of a beak.

            
            

Transcript of audio based on the first few minutes of "[Teaching Evolution Case Studies, Bonnie Chen](http://www.pbs.org/wgbh/evolution/educators/teachstuds/tvideos.html)" (copyright WGBH and Clear Blue Sky Productions, Inc.)

### Resources
- [Description of Visual Information](https://www.w3.org/WAI/media/av/description/), in [Making Audio and Video Media Accessible](https://www.w3.org/WAI/media/av/), W3C Web Accessibility Initiative (WAI)
- [GBH - Integrate audio descriptions into multimedia presentations using SMIL](https://www.wgbh.org/foundation/services/ncam/tools-resources/accessible-digital-media-guidelines-guideline-h-multimedia)
- [Standard Techniques in Audio Description](http://joeclark.org/access/description/ad-principles.html)
- [Synchronized Multimedia Integration Language (SMIL) 1.0](https://www.w3.org/TR/REC-smil/)
- [Synchronized Multimedia Integration Language (SMIL 2.0)](https://www.w3.org/TR/SMIL/)
- [Accessibility Features of SMIL](https://www.w3.org/TR/SMIL-access/)

### Techniques

#### Sufficient Techniques

- G78
- G173
- G8
- G203

#### Advisory Techniques

- H96

#### Failures

- F113


---

## 1.3.1 Info and Relationships (A)

### In brief
**Goal**
: Information about content structure is available to more people.

**What to do**
: Use code to reinforce relationships and information conveyed through presentation.

**Why it's important**
: People can adapt the presentation to suit their needs while preserving the original meaning.

### Intent
The intent of this success criterion is to ensure that information and relationships
         that are implied by visual or auditory formatting are preserved when the presentation
         format changes. For example, the presentation format changes when the content is read
         by a screen reader or when a user style sheet is substituted for the style sheet provided
         by the author.

      
      

Sighted users perceive structure and relationships through various visual cues
         — headings are often in a larger, bold font separated from paragraphs by blank lines;
         list items are preceded by a bullet and perhaps indented; paragraphs are separated
         by a blank line; items that share a common characteristic are organized into tabular
         rows and columns; form fields may be positioned as groups that share text labels;
         a different background color may be used to indicate that several items are related
         to each other; words that have special status are indicated by changing the font family
         and /or bolding, italicizing, or underlining them; items that share a common characteristic
         are organized into a table where the relationship of cells sharing the same row or
         column and the relationship of each cell to its row and/or column header are necessary
         for understanding; and so on. Having these structures and these relationships programmatically
         determined or available in text ensures that information important for comprehension
         will be perceivable to all.

      
      

Auditory cues may be used as well. For example, a chime might indicate the beginning
         of a new section; a change in voice pitch or speech rate may be used to emphasize
         important information or to indicate quoted text; etc.

      
      

When such relationships are perceivable to one set of users, those relationships can
         be made to be perceivable to all. One method of determining whether or not information
         has been properly provided to all users is to access the information serially in different
         modalities.

      
      

If links to glossary items are implemented using anchor elements (or the proper link
         element for the technology in use) and identified using a different font face, a screen
         reader user will hear that the item is a link when the glossary term is encountered
         even though they may not receive information about the change in font face. An on-line
         catalog may indicate prices using a larger font colored red. A screen reader or person
         who cannot perceive red, still has the information about the price as long as it is
         preceded by the currency symbol.

      
      

Some technologies do not provide a means to programmatically determine some types
         of information and relationships. In that case then there should be a text description
         of the information and relationships. For instance, "all required fields are marked
         with an asterisk (*)". The text description should be near the information it is describing
         (when the page is linearized), such as in the parent element or in the adjacent element.

      
      

There may also be cases where it may be a judgment call as to whether the relationships
         should be programmatically determined or be presented in text. However, when technologies
         support programmatic relationships, it is strongly encouraged that information and
         relationships be programmatically determined rather than described in text.

      
      

> **Note:**
> >          
>          
> 
> It is not required that color values be programmatically determined. The information
>             conveyed by color cannot be adequately presented simply by exposing the value. Therefore,
>             
>             [Success Criterion 1.4.1
>                
>             ](use-of-color) addresses the specific case of color, rather than Success Criterion 1.3.1.
> 
> 
>          
>

### Benefits
- This success criterion helps people with different disabilities by allowing user agents
            to adapt content according to the needs of individual users.
- Users who are blind (using a screen reader) benefit when information conveyed through
            color is also available in text (including text alternatives for images that use color
            to convey information).
- Users who are deaf-blind using braille (text) refreshable displays may be unable to
            access color-dependent information.

### Examples
**A form with required fields**
: A form contains several required fields. The labels for the required fields are displayed
               in red. In addition, at the end of each label is an asterisk character, *. The instructions
               for completing the form indicate that "all required fields are displayed in red and
               marked with an asterisk *", followed by an example.

**A form that uses color and text to indicate required fields**
: A form contains both required and optional fields. Instructions at the top of the
               form explain that required fields are labeled with red text and also with an icon
               whose text alternative says, "Required." Both the red text and the icon are programmatically
               associated with the appropriate form fields so that assistive technology users can
               determine the required fields.

**A bus schedule table where the headers for each cell can be programmatically determined**
: A bus schedule consists of a table with the bus stops listed vertically in the first
               column and the different buses listed horizontally across the first row. Each cell
               contains the time when the bus will be at that bus stop. The bus stop and bus cells
               are identified as headers for their corresponding row or column so that assistive
               technology can programmatically determine which bus and which bus stop are associated
               with the time in each cell.

**A form where the labels for the checkboxes can be programmatically determined**
: In a form, the labels for each checkbox can be programmatically determined by assistive
               technology.

**A text document**
: A simple text document is formatted with double blank lines before titles, asterisks
               to indicate list items and other standard formatting conventions so that its structure
               can be programmatically determined.

### Resources
- [WebAIM: Semantic Structure](http://webaim.org/techniques/semanticstructure/)
- [Heading Tags](http://accessibility.psu.edu/headingshtml/)

### Techniques

#### Sufficient Techniques

- **Situation A: The technology provides semantic structure to make information and relationships conveyed through presentation programmatically determinable:**
  - ARIA11
  - H101
  - ARIA12
  - ARIA13
  - ARIA16
  - ARIA17
  - ARIA20
  - {"and":["G115","H49"]}
  - G117
  - G140
  - ARIA24
  - {"title":"Making information and relationships conveyed through presentation programmatically determinable","using":["G138","H51","PDF6","PDF20","H39","H63","H43","H44","H65","PDF10","PDF12","H71","H85","H48","H42","PDF9","PDF11","PDF17","PDF21","H97"],"usingQuantity":""}
- **Situation B: The technology in use does NOT provide the semantic structure to make the information and relationships conveyed through presentation programmatically determinable:**
  - G117
  - {"title":"Making information and relationships conveyed through presentation programmatically determinable or available in text","using":["T1","T2","T3"],"usingQuantity":""}

#### Advisory Techniques

- C22
- G162
- ARIA1
- ARIA2
- G141

#### Failures

- F2
- F33
- F34
- F42
- F43
- F46
- F48
- F90
- F91
- F92
- F111


---

## 1.3.2 Meaningful Sequence (A)

### In brief
**Goal**
: The order of content can be understood by more people.

**What to do**
: Use code to preserve meaningful content order.

**Why it's important**
: Assistive technology can present content to users in the proper order.

### Intent
The intent of this success criterion is to enable a user agent to provide an alternative
         presentation of content while preserving the reading order needed to understand the
         meaning. It is important that it be possible to programmatically determine at least
         one sequence of the content that makes sense. Content that does not meet this Success
         Criterion may confuse or disorient users when assistive technology reads the content
         in the wrong order, or when alternate style sheets or other formatting changes are
         applied.

      
      

A sequence is 
         *meaningful* if the order of content in the sequence cannot be changed without affecting its meaning.
         
         For example, if a page contains two independent articles, the relative order of the
         articles may not affect their meaning, as long as they are not interleaved. In such
         a situation, the articles themselves may have meaningful sequence, but the container
         that contains the articles may not have a meaningful sequence.

      
      

The semantics of some elements define whether or not their content is a meaningful
         sequence. For instance, in HTML, text is always a meaningful sequence. Tables and
         ordered lists are meaningful sequences, but unordered lists are not.

      
      

The order of content in a sequence is not always meaningful. For example, the relative
         order of the main section of a web page and a navigation section does not affect their
         meaning. They could occur in either order in the programmatically determined reading
         sequence. As another example, a magazine article contains several callout sidebars.
         The order of the article and the sidebars does not affect their meaning. In these
         cases there are a number of different reading orders for a web page that can satisfy
         the success criterion.

      
      

For clarity:

      
      

- Providing a particular linear order is only required where it affects meaning.
- There may be more than one order that is "correct" (according to the WCAG 2 definition).
- Only one correct order needs to be provided.

### Benefits
- This success criterion may help people who rely on assistive technologies that read
            content aloud. The meaning evident in the sequencing of the information in the default
            presentation will be the same when the content is presented in spoken form.

### Examples
- **Example 1:** In a multi-column document, the linear presentation of the content flows from the
            top of a column to the bottom of the column, then to the top of the next column.
- **Example 2:** CSS is used to position a navigation bar, the main story on a page, and a side story.
            The visual presentation of the sections does not match the programmatically determined
            order, but the meaning of the page does not depend on the order of the sections.

### Techniques

#### Sufficient Techniques

- G57
- G57
- C27
- PDF3

#### Failures

- F34
- F33
- F32
- F49
- F1


---

## 1.3.3 Sensory Characteristics (A)

### In brief
**Goal**
: Instructions are understandable by more people.

**What to do**
: Describe controls by name, not just by appearance or location.

**Why it's important**
: People who are blind or have low vision need non-visual instructions.

### Intent
The intent of this success criterion is to ensure that all users can access instructions
         for using the content, even when they cannot perceive shape or size or use information
         about spatial location or orientation. 
         Some content relies on knowledge of the shape or position of objects that are not
         available from the structure of the content (for example, "round button" or "button
         to the right"). 
         Some users with disabilities are not able to perceive shape or position due to the
         nature of the assistive technologies they use. 
         This success criterion requires that additional information be provided to clarify
         instructions that are dependent on this kind of information.

      
      

Providing information using shape and/or location, however, is an effective method
         for many users including those with cognitive limitations.
         This provision should not discourage those types of cues as long as the information
         is also provided in other ways.

      
      

In some languages, it is commonly understood that "above" refers to the content previous
         to that point in the content and "below" refers to the content after that point. In
         such languages, if the content being referenced is in the appropriate place in the
         reading order and the references are unambiguous, statements such as "choose one of
         the links below" or "all of the above" would conform to this success criterion.

      
      

WCAG was designed to apply only to controls that were displayed on a web page. The
         intent was to avoid describing controls solely via references to visual or auditory
         cues. When applying this to instructions for operating physical hardware controls
         (e.g. a web kiosk with dedicated content), tactile cues on the hardware might be described
         (e.g. the arrow shaped key, the round key on the right side). This success criterion
         is not intended to prevent the use of tactile cues in instructions.

### Benefits
- People who are blind and people who have low vision may not be able to understand
            instructions if they rely only on a description of the shape and/or location of content.
            Providing additional information in any instructions other than shape and/or location
            will allow users to understand the instructions even if they cannot perceive shape
            and/or location.

### Examples
**Example 1: Instructions for interpreting a schedule of competitive events references
               colored icons in different shapes to indicate the venue for each event**
: A table presents a list of times across the top row and a list of events in the first
               vertical column and instructions are provided under the table: "Events marked with a
               blue diamond are played on field A and events marked with a green circle are played
               on field B." The instructions rely on color and shape only and result in a failure of
               this criterion.

**Example 2: An online multi-page survey**
: An online multi-page survey uses a link implemented as a green arrow icon placed
               in the lower right hand corner of the content to move from one survey page to the
               next. The arrow is clearly labeled with "Next" and the instructions state, "To move
               to the next section of the survey, select the green arrow icon labeled 'Next' in the
               lower right corner below the last survey question." 
               The instruction uses positioning and color to help identify the icon; 
               the instruction does not rely on these sensory characteristics since it also refers to
               the label, so it passes this criterion.

### Techniques

#### Sufficient Techniques

- G96

#### Failures

- F14
- F26


---

## 1.3.4 Orientation (AA)

### In brief
**Goal**
: Devices can be used in any orientation.

**What to do**
: Don't lock content to either portrait or landscape presentation.

**Why it's important**
: Wheelchair users and others may have devices mounted in a fixed orientation.

### Intent
The intent of this success criterion is to ensure that content displays in the orientation (portrait or landscape) preferred by the user. Some websites and applications automatically set and restrict the screen to a particular display orientation and expect
			that users will respond by rotating their device to match, but this can create problems. Some users have their devices mounted
			in a fixed orientation (e.g. on the arm of a power wheelchair). Therefore, websites and applications need to support both orientations
			by not restricting the orientation. Changes in content or functionality due to the size of display are not covered by this criterion which is focused on restrictions of orientation.

			

Historically, devices tended to have a fixed-orientation display, and all content was created to match that display orientation. Today, most handhelds and many other devices (e.g., monitors) have a hardware-level ability to dynamically adjust default display orientation based on sensor information. The goal of this success criterion is that authors should never restrict content's orientation, thus ensuring that it always match the device display orientation.

			

##### Locking a device to an orientation

			

It is important to distinguish between an author's responsibility not to restrict content to a specific orientation, and device-specific settings governing the locking of display orientation.

			

Many handheld devices offer a mechanical switch or a system setting (or both) to allow the user to lock the device display to a specific orientation. Where a user decides to lock their entire device to an orientation, all applications are expected to pick up that setting and to display content accordingly.

			

This success criterion complements device "lock orientation" settings. A web page that does not restrict its display orientation will always support the system-level orientation setting, since the system setting is picked up by the user agent. Alternatively, where a device-level orientation lock is not in place, the user agent should display the page according to the orientation of the device (either its default, or the current orientation determined by any device sensors).

			

The exception for things considered essential is aimed at situations where the content would only be understood in a particular orientation, or where the technology restricts the possible orientations. If content is aimed at a specific environment which is only available in one orientation (such as a television) then the content can restrict the orientation. Technologies such as virtual reality use screens within goggles that cannot change orientation relative to the user's eyes.

### Benefits
- Users with dexterity impairments, who have a mounted device will be able to use the content in their fixed orientation.
- Users with low-vision will be able to view content in the orientation that works best for them, for example to increase the text size by viewing content in landscape.

### Examples
- **Example 1: Online video site**
				A video is shown in either portrait or in landscape based on the user's chosen orientation.
- **Example 2: Messaging website**
				A messaging website can display messages in both portrait and landscape orientations.
- **Example 3: eReader web app**
				An eReader web app can display the contents of a book in both portrait and landscape orientation.
- **Example 4: Check deposit in banking app**
				An example where orientation is essential could be a banking app that requires the device be in landscape mode to easily and accurately capture an image of a check for deposit. These paper forms are typically about twice as wide as they are high.
- **Example 5: Piano app**
				An example where orientation is essential could be a piano app that requires the device to be in landscape mode, allowing the piano keys to have enough room to be functionally usable. Since a piano app is emulating a physical piano keyboard that needs to retain relative physical characteristics between keys, either too few keys would be available, or the keys would be much too narrow.

### Resources
- [Managing Screen Orientation](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Managing_screen_orientation)
- [Using Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [Media Queries for Standard Devices](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/)
- [Orientation Lock](https://css-tricks.com/snippets/css/orientation-lock/)
- [Responsive Design for Landscape Orientation](https://css-tricks.com/forums/topic/responsive-design-for-landscape-orientation/)
- [The Orientation Descriptor](https://www.w3.org/TR/css-device-adapt-1/#orientation-desc)
- [The Screen Orientation API](https://www.w3.org/TR/screen-orientation/)

### Techniques

#### Sufficient Techniques

- G214

#### Failures

- F97
- F100


---

## 1.3.5 Identify Input Purpose (AA)

### In brief
**Goal**
: It is easier to fill out forms.

**What to do**
: Use code to indicate the purpose of common inputs, where technology allows.

**Why it's important**
: Some people with cognitive disabilities may not understand the input's purpose from the label alone.

### Intent
The intent of this success criterion is to ensure that the purpose of a form input collecting information about the user can be programmatically determined, so that user agents can extract and present this purpose to users using different modalities. The ability to programmatically declare the specific kind of data expected in a particular field makes filling out forms easier, especially for people with certain cognitive disabilities.

  

Appropriate visible labels and instruction can help users understand the purpose of form input fields, but users may benefit from having fields that collect specific types of information be rendered in an unambiguous, consistent, and possibly customized way for different modalities - either through defaults in their user agent, or through the aid of assistive technologies.

  

For some input fields, the `type` attribute already offers a way to broadly specify the intention of the input field, for example, `<input type="tel">`, `<input type="email">`, or `<input type="password">`. However, these are only very broad categories, describing the type of input, but not necessarily its purpose, especially as it relates to user-specific input fields. As an example, `type="email"` indicates that the field is for an email address but does not clarify if the purpose is for entering the user's email address or some other person's email.

  

This success criterion defines the types of user interface component input purposes, found in [Section 7 of the WCAG 2.1 Recommendation](https://www.w3.org/TR/WCAG21/#input-purposes), that must be programmatically identifiable. When these user input purposes are present, and if the technology supports doing so, the field purpose must be programmatically identifiable.

  

The HTML `autocomplete` attribute only accepts a certain number of specific well-defined fixed values. This allows a more fine-grained definition or identification of purpose than the type attribute, for example, by allowing the author to specify a specific type of name: Name (`autocomplete="name"`), Given Name (`autocomplete="given-name"`), Family Name (`autocomplete="family-name"`), as well as Username (`autocomplete="username"`), and Nickname (`autocomplete="nickname"`).

  

By adopting and repurposing this predefined taxonomy of definitions, user agents and assistive technologies can now present the purpose of the inputs to users in different modalities. For example, assistive technologies may display familiar icons next to input fields to help users who have difficulties reading. An icon of a birthday cake may be shown in front of an input field with `autocomplete="bday"`, or the icon of a telephone in front of an input field with `autocomplete="tel"`.

  

In addition to repurposing this taxonomy, when the autocomplete attribute technique is used to meet this Success Criterion, browsers and other user-agents can suggest and 'autofill' the right content by autocompleting these fields based on past user input stored in the browser. By defining more granular definitions of common input purposes, for example “Birthday” (`autocomplete="bday"`), browsers can store personalized values for each of these fields (the user's birthday date). The user is relieved of having to type the information and can instead confirm or, if needed, change the value of the field, a significant benefit for users with memory issues, dyslexia, and other disabilities. Because the `autocomplete` values are independent of language, users that may not be familiar with the text used to visually identify user input fields (the label) can still have that purpose consistently identified to them due to the fixed taxonomy of terms.

  

If an input field accepts two different types of input purpose (as in combined user name/user email fields) and the technology used does not allow multiple purpose values to be defined, it is valid to provide either one or the other value or leave out the designation of input purpose altogether.

  

When the user agent and assistive technology support for other metadata formats matures, metadata schemes like the [WAI-Adapt: Symbols Module](https://www.w3.org/TR/adapt-symbols/) may be used in addition or instead of the HTML autocomplete attribute to identify the purpose of input fields. They can also support automated adaptations that identify and match author-provided input labels to defined vocabularies or symbols that are used instead for labelling inputs.

  

The term "input" is used here as a generic way to refer to form controls that accept user input. For instance, in HTML, it is not limited to the `<input>` element, but also covers other controls such as `<select>`.

### Benefits
##### Specific Benefits of Success Criterion 1.3.5:

  

- People with language and memory related disabilities or disabilities that affects executive function and decision-making benefit from the browser auto-filling personal information (such as name or address) when the autocomplete attribute is used to meet this Success Criterion, which means information does not need to be remembered by the user.
- People with cerebral palsy, stroke, head injury, motor neuron disease or learning disability sometimes prefer images for communication. They can employ assistive technology which adds icons to input fields to communicate the purpose of the fields visually.
- People with motor impairments also benefit from reducing the need for manual input when filling out forms.

### Examples
**A contact form using autofill**
: A contact form auto-fills in the fields for name, street, post code, city, telephone number and email address from autofill values stored in the user's browser. Assistive technology can offer a customized way of identifying particular input fields, for example drawing on a set of symbols / icons that is familiar to the user, to communicate the purpose of the fields visually.

**An order form with separate billing and shipping address**
: A product order form fills in the address fields for billing address and a separate set of address fields for the shipping address, using the autofill detail tokens 'billing' and 'shipping'

**A contact form using icons**
: A browser plugin to add icons inserts icons representing the person's name, home address, telephone number and email address to  identify the input purpose visually.

### Resources
- [COGA Gap Analysis Table 3: Entering Data, Error Prevention, & Recovery](https://www.w3.org/TR/coga-gap-analysis/#table3)

### Techniques

#### Sufficient Techniques

- H98

#### Failures

- F107


---

## 1.4.1 Use of Color (A)

### In brief
**Goal**
: Color is not the only way of distinguishing information.

**What to do**
: Use information in addition to color, such as shape or text, to convey meaning.

**Why it's important**
: Not everyone sees colors or sees them the same way.

### Intent
The intent of this success criterion is to ensure that all sighted users can access information
         that is conveyed by color differences, that is, by the use of color where each color
         has a meaning assigned to it. If the information is conveyed through color differences
         in an image (or other non-text format), the color may not be seen by users with color
         deficiencies. In this case, providing the information conveyed with color through
         another visual means ensures users who cannot see color can still perceive the information.

      

Color is an important asset in the design of web content, enhancing its aesthetic appeal,
         its usability, and its accessibility. However, some users have difficulty perceiving
         color. People with partial sight often experience limited color vision, and many older
         users do not see color well. In addition, people using limited-color or
         monochrome displays and browsers will be unable to access information that is presented
         only in color.

      

Examples of information conveyed by color differences: “required fields are red",
         “error is shown in red", and “Mary's sales are in red, Tom's are in blue". Examples
         of indications of an action include: using color to indicate that a link will open
         in a new window or that a database entry has been updated successfully. An example
         of prompting a response would be: using highlighting on form fields to indicate that
         a required field had been left blank.

      

> **Note:**
> >          
> 
> This should not in any way discourage the use of color on a page, or even color coding if it is complemented by other visual indication.
> 
> 
>

      

> **Note:**
> >          
> 
> If content is conveyed through the use of colors that differ not only in their hue,
>             but that also have a significant difference in lightness, then this counts as an additional
>             visual distinction, as long as the difference in relative luminance between the colors leads
>             to a contrast ratio of 3:1 or greater.
>             For example, a light green and a dark red differ **both** by color (hue)
>             **and** by lightness, so they would pass if the contrast ratio is at least 3:1.
>             Similarly, if content is distinguished by inverting an element's foreground and background colors,
>             this would pass (again, assuming that the foreground and background colors have a sufficient contrast).
> 
> 
>          
> 
> However, if content relies on the user's ability to accurately perceive or differentiate a particular color
>             an additional visual indicator will be required regardless of the contrast ratio between those colors. For example,
>             knowing whether an outline is green for valid or red for invalid.
> 
> 
>

      

> **Note:**
> >          
> 
> This criterion does not apply to situations where color has *not* been used to convey information, indicate an action,
>          prompt a response or distinguish a visual element. For instance, a hyperlink which has been styled to appear no different than neighboring
>          static text would not fail this success criterion, as there would be no color differentiation between the actionable hyperlink text
>          and the adjacent static text. Such lack of styling differentiation could result in poor usability for anyone looking at the interface, regardless of disability.
> 
> 
>

      

> **Note:**
> >          
> 
> This criterion does not directly address the needs of users with assistive technologies.
>             It aims to ensure that sighted users who cannot distinguish between some colors can still
>             understand content.
>             How information is conveyed to assistive technology users is covered separately in other
>             criteria, including (but not limited to)
>             [1.1.1 Non-text Content](non-text-content),
>             [1.3.1 Info and Relationships](info-and-relationships), and
>             [4.1.2 Name, Role, Value](name-role-value).
> 
> 
>          
> 
> Conversely, even if information that is conveyed by color differences is appropriately conveyed
>             to assistive technologies, it does not necessarily pass this criterion, as sighted users who cannot
>             distinguish between certain color may not necessarily be using any assistive technologies. This
>             criterion requires a visible alternative to color.
> 
> 
>

      

> **Note:**
> >          
> 
> Most user agents provide users with a color-only cue that a link has been previously activated by them ("visited"). However, several technical constraints result in authors having very limited control over these color-only indications of visited links.  The technical constraints are as follows:
> 
> 
>          
> 
> - User agents constrain the exposure of a link's visited state due to [privacy concerns](https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector). Author queries to user agents will indicate all links have not been visited.
> - Any available information on the visited state of a link would be inaccurate since it is both user and browser-dependent. Even if an author could accurately get information on previously activated links by a certain user, the author would be constrained to the current browser's preserved history, and would be unable to determine if the user had visited the page using a different browser (or if the history was not preserved, either from cache clearing or use of private sessions).
> - Authors can *only* use color to modify the `:visited` CSS pseudoclass style. The technology constrains any non-color styling. Due to palette limitations, an author cannot use color alone to achieve 3:1 contrast between link and non-link text as well as between visited and unvisited links while also achieving 4.5:1 contrast for all link and non-link text.
> - Authors also cannot set the visited state of links. The anchor element does not include a "visited" attribute; therefore the author has no ability to alter the state through an attribute setting. As such, authors cannot achieve [1.3.1 Info and Relationships](info-and-relationships) or
>                [4.1.2 Name, Role, Value](name-role-value) in regard to visited links.
> 
> 
> 
>          
> 
> For these reasons, setting or conveying a link's visited status is not an author responsibility. Where color alone distinguishes between visited and unvisited links, it does not result in a failure of this Success Criterion, even where the contrast between the two link colors is below 3:1. Note that authors must continue to ensure that all text links meet contrast minimums against the page background (SC 1.4.3).
> 
> 
>

### Benefits
- Users with partial sight often experience limited color vision.
- Some older users may not be able to see color well.
- Users with color vision deficiency who cannot distinguish between certain colors
            benefit when information conveyed by color is available in other visual ways.
- People using limited color monochrome displays may be unable to access
            color-dependent information.
- Users who have problems distinguishing between colors can look or listen for text
            cues.

### Examples
**A form that uses color and text to indicate required fields**
: A form contains both required and optional fields. Instructions at the top of the
               form explain that required fields are labeled with red text and also with an icon.
               Users who cannot perceive the difference between the optional field labels and the
               red labels for the required fields will still be able to see the icon next to the
               red labels.

**An examination**
: Students view an SVG image of a chemical compound and identify the chemical elements
               present based **both** on the colors used, as well as numbers next to each
               element. A legend shows the color and number for each type of element. Sighted users who
               cannot perceive all the color differences can still understand the image by relying on
               the numbers.

### Resources
- [Vischeck](https://www.vischeck.com/)
- [AWARE Color Laboratory](http://colorlab.wickline.org/colorblind/colorlab/)
- [Wikipedia: Color vision deficiency](https://en.wikipedia.org/wiki/Color_vision_deficiency)
- [Microsoft: Verify that a page is usable by people with color blindness](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/accessibility/test-color-blindness)
- [Causes and Incidence of Colorblindness](http://www.webexhibits.org/causesofcolor/2C.html)
- [How to make figures and presentations that are friendly to Colorblind people](https://jfly.uni-koeln.de/color/)
- [The Color Tutor application](https://colortutorial.design/tutor.html)

### Techniques

#### Sufficient Techniques

- **Situation A: If the color of particular words, backgrounds, or other content is used to indicate information:**
  - G14
  - G205
  - G182
  - G183
- **Situation B: If color is used within an image to convey information:**
  - G111
  - G14

#### Advisory Techniques

- C15

#### Failures

- F13
- F73
- F81


---

## 1.4.2 Audio Control (A)

### In brief
**Goal**
: A page that plays music or sounds doesn't disrupt people.

**What to do**
: If you play audio content automatically, let people turn it down or off.

**Why it's important**
: Sound distracts some people, and also interferes with screen readers.

### Intent
Individuals who use screen reading software can find it hard to hear the speech output
         if there is other audio playing at the same time. This difficulty is exacerbated when
         the screen reader's speech output is software based (as most are today) and is controlled
         via the same volume control as the sound. Therefore, it is important that the user
         be able to turn off the background sound.

      

Having control of the volume includes
         being able to reduce its volume to zero. Muting the system volume is not "pausing or stopping" the autoplay audio. Both the "pause or stop" and control of audio volume need to be independent of the overall system volume.

      

> **Note:**
> >          
> 
> Playing audio automatically when landing on a page may affect a screen reader user's
>             ability to find the mechanism to stop it because they navigate by listening and automatically
>             started sounds might interfere with that navigation. Therefore, we discourage the
>             practice of automatically starting sounds (especially if they last more than 3 seconds),
>             and encourage that the sound be
>             *started* by an action initiated by the user after they reach the page, rather than requiring
>             that the sound be
>             *stopped* by an action of the user after they land on the page.
> 
> 
>

      

See also [1.4.7 Low or No Background Audio](low-or-no-background-audio).

      

In the context of this success criterion, "plays automatically" broadly refers to audio that is not started/played as a direct result of a user's intentional activation. For example, selecting a link or button with clear labelling or context that it will start an experience where audio will play is an example of starting in response to a user's intended action. This criterion is also not intended to apply to a conference call or other interaction where two-way voice communication may take place; the potential for any participant to speak during a conference call is not equivalent to audio that "plays automatically for more than 3 seconds." However, a mechanism to control the volume of conference call output independently from the overall system volume would be a best practice.

### Benefits
- Individuals who use screen reading technologies can hear the screen reader without
            other sounds playing. This is especially important for those who are hard of hearing
            and for those whose screen readers use the system volume (so they cannot turn sound
            down and screen reader up).
- This success criterion also benefits people who have difficulty focusing on visual
            content (including text) when audio is playing.

### Examples
- An audio file begins playing automatically when a page is opened. However, the audio
            can be stopped by the user by selecting a "silent" link at the top of the page.

### Techniques

#### Sufficient Techniques

- G60
- G170
- G171

#### Failures

- F23
- F93


---

## 1.4.3 Contrast (Minimum) (AA)

### In brief
**Goal**
: Text can be seen by more people.

**What to do**
: Provide sufficient contrast between text and its background.

**Why it's important**
: Some people cannot read faint text.

### Intent
The intent of this success criterion is to provide enough contrast between text and its background, so that it can be read by people with moderately low vision or impaired contrast perception, without the use of contrast-enhancing assistive technology.

      

For all consumers of visual content, adequate light-dark contrast is needed between the relative luminance of text and its background for good readability.
         Many different visual impairments can substantially impact contrast sensitivity, requiring more light-dark contrast, regardless of color (hue).
         For people with color vision deficiency who are not able to distinguish certain shades of color, hue and saturation have minimal or no effect on legibility as assessed by reading performance.
         Further, the inability to distinguish certain shades of color does not negatively affect light-dark contrast perception.
         Therefore, in the recommendation, contrast is calculated in such a way that color (hue) is not a key factor.

      

Text that is decorative and conveys no information is excluded. For example, if random
         words are used to create a background and the words could be rearranged or substituted
         without changing meaning, then it would be decorative and would not need to meet this
         criterion.

      

Text that is larger and has wider character strokes is easier to read at lower contrast.
         The contrast requirement for larger text is therefore lower. This allows authors to
         use a wider range of color choices for large text, which is helpful for design of
         pages, particularly titles. 18 point text or 14 point bold text is judged to be large
         enough to require a lower contrast ratio. (See The American Printing House for the
         Blind Guidelines for Large Printing and The Library of Congress Guidelines for Large
         Print under
         [Resources](#resources)). "18 point" and "bold" can both have different meanings in
         different fonts but, except for very thin or unusual fonts, they should be sufficient. Since there
         are so many different fonts, the general measures are used and a note regarding thin or unusual
         fonts is included in the definition for [large-scale]() text.

      

> **Note:**
> >          
> 
> When evaluating this Success Criterion, the font size in points should be obtained
>             from the user agent or calculated on font metrics in the way that user agents do.
>             Point sizes are based on the CSS `pt` size as defined in
>             [CSS3 Values](https://www.w3.org/TR/css-values-3/#reference-pixel). The ratio between
>             sizes in points and CSS pixels is `1pt = 1.333px`, therefore `14pt`
>             and `18pt` are equivalent to approximately `18.5px` and `24px`.
> 
> 
>          
> 
> Because different image editing applications default to different pixel densities
>             (e.g., `72ppi` or `96ppi`), specifying point sizes for fonts from within an
>             image editing application can be unreliable when it comes to presenting text at a specific size.
>             When creating images of large-scale text, authors should ensure that the text in the
>             resulting image is roughly equivalent to 1.2 and 1.5 em or to 120% or 150% of the
>             default size for body text. For example, for a `72ppi` image, an author would need
>             to use approximately 19pt and 24pt font sizes in order to successfully present images
>             of large-scale text to a user.
> 
> 
>          
> 
> The 3:1 and 4.5:1 contrast ratios referenced in this success criterion are intended to be
>             treated as threshold values. When comparing the computed contrast ratio to the Success Criterion
>             ratio, the computed values should not be rounded (e.g., 4.499:1 would not meet the 4.5:1 threshold).
> 
> 
>

      

> **Note:**
> >          
> 
> Because authors do not have control over user settings for font smoothing/anti-aliasing, when evaluating this
>             Success Criterion, refer to the foreground and background colors obtained from the user agent, or the underlying
>             markup and stylesheets, rather than the text as presented on screen.
> 
> 
>          
> 
> Due to anti-aliasing, particularly thin or unusual fonts may be rendered by user agents with a much fainter
>             color than the actual text color defined in the underlying CSS. This can lead to situations where text has
>             a contrast ratio that nominally passes the Success Criterion, but has a much lower contrast in practice.
>             In these cases, best practice would be for authors to choose a font with stronger/thicker lines,
>             or to aim for a foreground/background color combination that exceeds the normative requirements
>             of this success criterion.
> 
> 
>

      

The contrast requirements for text also apply to images of text
         (text that has been rendered into pixels and then stored in an image format) - see
         [Success Criterion 1.4.5: Images of Text](images-of-text).

      

This requirement applies to situations in which images of text were intended to be
         understood as text. Incidental text, such as in photographs that happen to include
         a street sign, are not included. Nor is text that for some reason is designed to be
         invisible to all viewers. Stylized text, such as in corporate logos, should be treated
         in terms of its function on the page, which may or may not warrant including the content
         in the text alternative. Corporate visual guidelines beyond logo and logotype are
         not included in the exception.

      

In this provision there is an exception that reads "that are part of a picture that
         contains significant other visual content,". This exception is intended to separate
         pictures that have text in them from images of text that are done to replace text
         in order to get a particular look.

      

> **Note:**
> >          
> 
> Images of text do not scale as well as text because they tend to pixelate. It is also
>             harder to change foreground and background contrast and color combinations for images
>             of text, which is necessary for some users. Therefore, we suggest using text wherever
>             possible, and when not, consider supplying an image of higher resolution.
> 
> 
>

      

This success criterion applies to text in the page, including
         placeholder text and text that is shown when a pointer is hovering over an object
         or when an object has keyboard focus. If any of these are used in a page, the text
         needs to provide sufficient contrast.

      

Although this success criterion only applies to text, similar issues occur for content presented
         in charts, graphs, diagrams, and other non-text-based information, which is covered by
         [Success Criterion 1.4.11 Non-Text Contrast](non-text-contrast).

      

See also
         [1.4.6: Contrast (Enhanced)](contrast-enhanced).

      

         

##### Rationale for the Ratios Chosen

         

A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]]
            for standard text and vision. The 4.5:1 ratio is used in this success criterion to account
            for the loss in contrast that results from moderately low visual acuity, congenital
            or acquired color deficiencies, or the loss of contrast sensitivity that typically
            accompanies aging.

         

The rationale is based on a) adoption of the 3:1 contrast ratio for minimum acceptable
            contrast for normal observers, in the ANSI standard, and b) the empirical finding
            that in the population, visual acuity of 20/40 is associated with a contrast sensitivity
            loss of roughly 1.5 [[ARDITI-FAYE]]. A user with 20/40 would thus require a contrast ratio of
            `3 * 1.5 = 4.5 to 1`. Following analogous empirical findings and the same logic,
            the user with 20/80 visual acuity would require contrast of about 7:1. This ratio is used in
            Success Criterion 1.4.6.

         

Hues are perceived differently by users with color vision deficiencies (both congenital
            and acquired) resulting in different colors and relative luminance contrasts than
            for normally sighted users. Because of this, effective contrast and readability are
            different for this population. However, color deficiencies are so diverse that prescribing
            effective general use color pairs (for contrast) based on quantitative data is not
            feasible. Requiring good luminance contrast accommodates this by requiring contrast
            that is independent of color perception. Fortunately, most of the luminance contribution
            is from the mid and long wave receptors which largely overlap in their spectral responses.
            The result is that effective luminance contrast can generally be computed without
            regard to specific color deficiency, except for the use of predominantly long wavelength
            colors against darker colors (generally appearing black) for those who have protanopia.
            (We provide an advisory technique on avoiding red on black for that reason). For more
            information see [[ARDITI-KNOBLAUCH-1994]]
            [[ARDITI-KNOBLAUCH-1996]]
            [[ARDITI]].

         

> **Note:**
> >             
> 
> Some people with cognitive disabilities require color combinations or hues that have
>                low contrast, and therefore we allow and encourage authors to provide mechanisms to
>                adjust the foreground and background colors of the content. Some of the combinations
>                that could be chosen may have contrast levels that will be lower than those those
>                specified here. This is not a violation of this Success Criterion, provided
>                there is a mechanism that will return to the required values set out here.
> 
> 
>

         

The contrast ratio of 4.5:1 was chosen for level AA because it compensated for the
            loss in contrast sensitivity usually experienced by users with vision loss equivalent
            to approximately 20/40 vision. (20/40 calculates to approximately 4.5:1.) 20/40 is
            commonly reported as typical visual acuity of elders at roughly age 80. [[GITTINGS-FOZARD]]

         

The contrast ratio of 7:1 was chosen for level AAA because it compensated for the
            loss in contrast sensitivity usually experienced by users with vision loss equivalent
            to approximately 20/80 vision. People with more than this degree of vision loss usually
            use assistive technologies to access their content (and the assistive technologies
            usually have contrast enhancing, as well as magnification capability built into them).
            The 7:1 level therefore generally provides compensation for the loss in contrast sensitivity
            experienced by users with low vision who do not use assistive technology and provides
            contrast enhancement for color deficiency as well.

         

> **Note:**
> >             
> 
> Calculations in [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] are for body text. A relaxed contrast
>                ratio is provided for text that is much larger.
> 
> 
>

      

      

         

##### Notes on formula

         

Conversion from nonlinear to linear RGB values is based on IEC/4WD 61966-2-1 [[IEC-4WD]].

         

The formula (`L1/L2`) for contrast is based on [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] standards.

         

The ANSI/HFS 100-1988 standard calls for the contribution from ambient light to be
            included in the calculation of L1 and L2. The `.05` value used is based on Typical Viewing
            Flare from [[IEC-4WD]].

         

This success criterion and its definitions use the terms "contrast ratio" and "relative
            luminance" rather than "luminance" to reflect the fact that web content does not emit
            light itself. The contrast ratio gives a measure of the relative luminance that would
            result when displayed. (Because it is a ratio, it is dimensionless.)

         

> **Note:**
> >             
> 
> Refer to
>                [related resources](#resources) for a list of tools that utilize the contrast ratio
>                to analyze the contrast of web content.
> 
> 
>             
> 
> See also
>                [2.4.7: Focus Visible](focus-visible) for techniques for indicating keyboard focus.
> 
> 
>

      

      

         

##### Inactive User Interface Components

         

User Interface Components that are not available for user interaction (e.g., a disabled control in HTML) are not required to meet contrast requirements. An inactive user interface component is visible but not currently operable. An example would be a submit button at the bottom of a form that is visible but cannot be activated until all the required fields in the form are completed.

         
            {% include "../21/img/1.4.11-ntc-button-inactive.svg" %}
             An inactive button using default browser styles

### Benefits
- People with low vision often have difficulty reading text that does not contrast with
            its background. This can be exacerbated if the person has a color vision deficiency
            that lowers the contrast even further. Providing a minimum luminance contrast ratio
            between the text and its background can make the text more readable even if the person
            does not see the full range of colors. It also works for the rare individuals who
            see no color.

### Resources
- [Colour Contrast Analyser application](https://www.tpgi.com/color-contrast-checker/)
- [Luminosity Colour Contrast Ratio Analyser](https://juicystudio.com/services/luminositycontrastratio.php)
- [Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html)
- [Contrast Ratio Calculator](https://www.msfw.com/Services/ContrastRatioCalculator)
- [Adobe Color - Color Contrast Analyzer Tool](https://color.adobe.com/create/color-contrast-analyzer)
- [Atypical colour response](https://www.w3.org/Graphics/atypical-color-response)
- [Colors On the Web Color Contrast Analyzer](http://www.colorsontheweb.com/colorcontrast.asp)
- [Tool to convert images based on color loss](https://www.vischeck.com/daltonize/runDaltonize.php) so that contrast is restored as luminance contrast when there was only color contrast (that was lost due to color deficiency)
- [List of color contrast tools](https://www.456bereastreet.com/archive/200709/10_colour_contrast_checking_tools_to_improve_the_accessibility_of_your_design/)
- [The American Printing House for the Blind Guidelines for Large Printing](https://www.aph.org/resources/large-print-guidelines/)
- [National Library Service for the Blind and Physically Handicapped (NLS), The Library of Congress reference guide on large print materials](https://www.loc.gov/nls/resources/general-resources-on-disabilities/large-print-materials/)
- [Types of Color Vision Deficiency, National Eye Institute (NEI), National Institutes of Health (NIH), U.S. Department of Health and Human Services (HHS)](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness/types-color-vision-deficiency)
- [Effects of chromatic and luminance contrast on reading, Knoblauch et al., 1991](https://doi.org/10.1364/JOSAA.8.000428)
- [Achromatic luminance contrast sensitivity in X-linked color-deficient observers: an addition to the debate, Márta Janáky et al., 2013](https://pubmed.ncbi.nlm.nih.gov/24103453/)
- [Contrast sensitivity of patients with congenital color vision deficiency, Cagri Ilhan et al., 2018](https://link.springer.com/article/10.1007/s10792-018-0881-7)

### Techniques

#### Sufficient Techniques

- **Situation A: text is less than 18 point if not bold and less than 14 point if bold**
  - G18
  - G148
  - G174
- **Situation B: text is at least 18 point if not bold and at least 14 point if bold**
  - G145
  - G148
  - G174

#### Advisory Techniques

- G156

#### Failures

- F24
- F83


---

## 1.4.4 Resize Text (AA)

### In brief
**Goal**
: Text can be enlarged.

**What to do**
: Ensure text can be doubled in size.

**Why it's important**
: Some people can only read text when it is bigger.

### Intent
The intent of this success criterion is to ensure that visually rendered text, including
         controls and labels using text, can be made larger so that it can be read more easily by
         people with milder visual impairments, without requiring the use of assistive technology
         (such as a screen magnifier). Users may benefit from scaling all content on the web page,
         but text is most critical.

      
      

The scaling of content is primarily a user agent responsibility. User agents that
         satisfy 
         [UAAG 1.0 Checkpoint 4.1](https://www.w3.org/TR/WAI-USERAGENT/guidelines.html#tech-configure-text-scale)
         allow users to configure text scale through a number of mechanisms - including zoom (of the entire page's content),
         magnification, text-only resizing, and allowing the user to configure a size for rendered text.
         The author's responsibility is to create web content that does not prevent the user agent from scaling the content effectively.
         Authors may satisfy this success criterion by verifying that content does not interfere
         with user agent support for resizing text, including text-based controls, or by providing
         direct support for resizing text or changing the layout. An example of direct support
         might be via server-side script that can be used to assign different style sheets.

      

Content satisfies the success criterion if it can be scaled up to 200% using at least one text scaling
         mechanism supported by user agents.

      
      
      

If the author is using a technology whose user agents do not provide support for specific text scaling mechanisms,
         the author is responsible for providing this type of functionality directly, or providing
         content that works with the type of functionality provided by the user agent. For instance, if the
         user agent doesn't provide full-page zoom functionality, but does let the the user change the

         text size, the author is responsible for ensuring that the content remains usable
         when the text is resized.

      
      

Some user interface components that function as a label and require activation by
         the user to access content are not wide enough to accommodate the label's content.
         For example, in web mail applications the subject column may not be wide enough to
         accommodate every possible subject header, but activating the subject header takes
         the user to the full message with the full subject header. In Web-based spreadsheets,
         cell content that is too long to be displayed in a column can be truncated, and the
         full content of the cell is available to the user when the cell receives focus. The
         content of a user interface component may also become too wide in user interfaces
         where the user can resize the column width. In this type of user interface component,
         line wrapping is not required; truncation is acceptable if the component's full content
         is available on focus or after user activation and an indication that this information
         can be accessed, is provided to the user in some way besides the fact that it is truncated.

      
      

Content satisfies the success criterion if it can be scaled up to 200% - that is, up
         to twice the width and height. Authors may support scaling beyond that limit, however,
         as scaling becomes more extreme, adaptive layouts may introduce usability problems.
         For example, words may be too wide to fit into the horizontal space available to them,
         causing them to be truncated; layout constraints may cause text to overlap with other
         content when it is scaled larger; or only one word of a sentence may fit on each line,
         causing the sentence to be displayed as a vertical column of text that is difficult
         to read.

      
      

The working group feels that 200% is a reasonable accommodation that can support a
         wide range of designs and layouts, and complements older screen magnifiers that provide
         a minimum magnification of 200%. Above 200%, zoom (which resizes text, images, and
         layout regions and creates a larger canvas that may require both horizontal and vertical
         scrolling) may be more effective than text resizing. Assistive technology dedicated
         to zoom support would usually be used in such a situation, and may provide better accessibility
         than attempts by the author to support the user directly.

      
      

> **Note:**
> >          
>          
> 
> Images of text do not scale as well as text because they tend to pixelate, and therefore
>             we suggest using text wherever possible. It is also harder to change foreground and
>             background contrast and color combinations for images of text, which are necessary
>             for some users.
> 
> 
>          
>

      

> **Note:**
> >          
> 
> As with most other Success Criteria, this criterion applies to each variation of the page that is automatically presented for various screen sizes (e.g. media query variations in a responsive site). In an implementation where text does not consistently increase its size as people zoom in (such as when it is transformed based on a media query to adapt to small-screen usage), it must still be possible to get to 200% enlargement in order to satisfy the criterion.
> 
> 
>          
> 
> For example, if at the default browser setting of 100% zoom, text is set at 20px when the window is 1280 CSS pixels wide, at 200% zoom it will visually appear at twice the size. After zooming by 400% the page reflows to fit within the 320 CSS pixel viewport, the author may decide to set the page's text size to 10px. The text is now half the original size in CSS pixels, but as it has been enlarged to 400%, it is still displayed at twice the size compared to the default browser setting at 100% zoom. It is not required to achieve 200% text enlargement while remaining inside a specific breakpoint (as zooming may result in the variation for a new breakpoint becoming active), but it should still be possible to get 200% text enlargement in some way compared to the default 100% zoom.
> 
> 
>

      
      

See also 
         [1.4.8: Visual Presentation](visual-presentation).

### Benefits
- This success criterion helps people with low vision by letting them increase text
            size in content so that they can read it.

### Examples
- A user with vision impairments increases the text size on a web page in a browser
            from 1 em to 1.2 ems. While the user could not read the text at the smaller size,
            they can read the larger text. All the information on the page is still displayed when
            the larger font is used for the text.
- A web page contains a control for changing the scale of the page. Selecting different
            settings changes the layout of the page to use the best design for that scale.
- A user changes the scale of the content with the browser's full-page zoom function.
            All the content scales uniformly, and the browser provides scroll bars, if necessary.

### Resources
- [CSS 2 Box Model](https://www.w3.org/TR/CSS2/box.html)
- [CSS 2 Visual formatting Model](https://www.w3.org/TR/CSS2/visuren.html)
- [CSS 2 Visual formatting Model Details](https://www.w3.org/TR/CSS2/visudet.html)
- [About fluid and fixed width layouts](http://www.456bereastreet.com/archive/200504/about_fluid_and_fixed_width_layouts/)
- [Accessible CSS](http://cookiecrook.com/AIR/2003/train/accessiblecss.php)

### Techniques

#### Sufficient Techniques

- G142
- {"and":["Ensuring that text containers resize when the text resizes","using measurements that are relative to other measurements in the content"],"using":["C28",{"title":"Techniques for relative measurements","using":["C12","C13","C14"],"skipUsingPhrase":true},{"title":"Techniques for text container resizing","using":["SCR34","G146"],"skipUsingPhrase":true}],"usingPrefix":"by","usingQuantity":"one or more"}
- G178
- G179

#### Advisory Techniques

- C17
- C20
- C22

#### Failures

- F69
- F80
- F94


---

## 1.4.5 Images of Text (AA)

### In brief
**Goal**
: Users can adjust how text is presented.

**What to do**
: Use text instead of pictures of text.

**Why it's important**
: People cannot alter how text looks in images.

### Intent
The intent of this success criterion is to encourage authors, who are using technologies
         which are capable of achieving their desired default visual presentation, to enable
         people who require a particular visual presentation of text to be able to adjust the
         text presentation as needed. This includes people who require the text in a particular
         font size, foreground and background color, font family, line spacing or alignment.

      

If authors can use text to achieve the same visual effect, they should present
         the information as text rather than using an image. If for any reason, the author
         cannot format the text to get the same effect, the effect won't be reliably presented
         on the commonly available user agents, or using a technology to meet this criterion
         would interfere with meeting other criteria such as 1.4.4, then an image of text can
         be used. This includes instances where a particular presentation of text is essential
         to the information being conveyed, such as type samples, logotypes, branding, etc.
         Images of text may also be used in order to use a particular font that is either not
         widely deployed or which the author doesn't have the right to redistribute, or to
         ensure that the text would be anti-aliased on all user agents.

      

Images of text can also be used where it is possible for users to customize the image
         of text to match their requirements.

      

The definition of [images of text]() contains the note: This does not include text that is part of a picture that contains significant
         other visual content. Examples of such pictures include graphs, screenshots, and diagrams which visually
         convey important information through more than just text.

      

The success criterion is intended to address situations where [images of text]() are used *rather than* text. Where images of text are used *in addition to* text to convey the same information, and where both are presented to the user, this success criterion is met. This allows authors to convey content using any styling they desire, while also presenting the information in text, which can then be manipulated by users to make it more distinguishable. This is in contrast to [1.4.9 Images of Text (No Exception)](images-of-text-no-exception), which applies to all images of text, regardless of whether or not they are used *in addition to* text.

      

Techniques for satisfying this success criterion are the same as those for Success
         Criterion 1.4.9, except that they only need to apply if the visual presentation can
         be achieved with the technologies that the author is using. For Success Criterion
         1.4.9, the sufficient techniques would be applied only when the user can customize
         the output.

      

See also [1.4.9 Images of Text (No Exception)](images-of-text-no-exception).

### Benefits
- People with low vision (who may have trouble reading the text with the authored font
            family, size and/or color).
- People with visual tracking problems (who may have trouble reading the text with the
            authored line spacing and/or alignment).
- People with cognitive disabilities that affect reading.

### Examples
**Styled Headings**
: Rather than using bitmap images to present headings in a specific font and size, an
               author uses CSS to achieve the same result.

**Dynamically Generated Images**
: A web page uses server-side scripting to present text as an an image. The page includes
               controls that allow the user to adjust the font size and foreground and background
               colors of the generated image.

**A quote**
: A web page contains a quote. The quote itself is presented as italicized text, indented
               from the left margin. The name of the person to whom the quote is attributed is below
               the quote with 1.5x the line space and further indented from the left margin. CSS
               is used to position the text; set the spacing between lines; as well as display the
               text's font family, size, color and decoration.

**Navigation items**
: A web page contains a menu of navigation links that have both an icon and text to
               describe their target. CSS is used to display the text's font family, size and foreground
               and background colors; as well as the spacing between the navigation links.

**A logo containing text**
: A website contains the organization's logo in the top left corner of each web page.
               The logo contains logotype (text as part, or all, of the logo). The visual presentation
               of the text is essential to the identity of the logo and is included as a gif image
               which does not allow the text characteristics to be changed. The image has a text
               alternative.

**Representation of a font family**
: A web page contains information about a particular font family. Substituting the font
               family with another font would defeat the purpose of the representation. The representation
               is included as a jpeg image which does not allow the text characteristics to be changed.
               The image has a text alternative.

**A representation of a letter**
: A web page contains a representation of an original letter. The depiction of the letter
               in its original format is essential to information being conveyed about the time period
               in which it was written. The letter is included as a gif image which does not allow
               the text characteristics to be changed. The image has a text alternative.

**Symbolic text characters**
: A form allows users to enter blocks of text. The form provides a number of buttons,
               including functions to style the text and check spelling. Some of the buttons use
               text characters that do not form a sequence that expresses something in human language.
               For example "B" to increase font weight, "I" to italicize the text and "ABC" to check
               the spelling. The symbolic text characters are included as gif images which do not
               allow the text characteristics to be changed. The buttons have text alternatives.

**Customizable font settings in images of text**
: A website allows users to specify font settings and all images of text on the site
               are then provided based on those settings.

**The text in an image is also provided as text.**
: A user has to upload an event poster image, which includes text, to their website's events
            calendar. The site's CMS (content management system) is limited, and won't allow them to create
            a custom HTML/CSS/SVG recreation of the poster. However, in addition to the image, they can add
            regular text to the calendar entry, so they post both the poster and the text contained in the image.
            This text is shown next to the poster image on the site's calendar page.

### Resources
- [Fundamental text and font styling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Fundamentals)
- [Web fonts (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Web_fonts)

### Techniques

#### Sufficient Techniques

- C22
- C30
- G140
- PDF7

#### Advisory Techniques

- C12
- C13
- C14
- C8
- C6


---

## 1.4.10 Reflow (AA)

### In brief
**Goal**
: Content can be enlarged without increasing line length.

**What to do**
: Make lines of text reflow within the viewport.

**Why it's important**
: People who need bigger text find it difficult if they must scroll to read long lines.

### Intent
The intent of this success criterion is to let users enlarge text and other related content without having to scroll in two dimensions to read. When lines of text extend beyond the edge of a [viewport](https://www.w3.org/TR/WCAG22/#dfn-viewport), users will be forced to scroll back-and-forth to read line by line. This can cause them to lose their place and can significantly increase both physical and cognitive effort. Therefore, most sections of content are expected to reflow within the appropriate sizing requirement defined by this success criterion.

        

A [section of content](https://www.w3.org/TR/WCAG/#dfn-section) that requires two-dimensional layout for understanding or functionality, such as a table or map, has an exception to this success criterion. However, sections of content within the two-dimensional layout, such as each cell within a table, would still need to meet this success criterion. Although there is an exception for sections of content that require two-dimensional layout for understanding or functionality, authors can improve the user's experience by making efforts to reduce scrolling for that type of content.

### Examples
- **One column view in responsive design**
              

              

Note that as the zoom percentage increases, the navigation changes first to hide options behind a "More" dropdown menu. As zooming continues, most navigation options are eventually behind a "hamburger" menu button. All the information and functionality is still available from this web page. There is no horizontal scrolling.
- **PDF offering reflow**
              

In a PDF created to conform to PDF/Universal Accessibility (ISO 14289), the content can be reflowed and zoomed in to make reading possible for someone with low-vision.
- **Alternative presentations to truncating content**
              

A web page presents long strings of text which are truncated to save space. E.g., user generated content that does not fit into the space allocated for the interface's design, or authentication keys which do not wrap, etc.. The content is presented as truncated, but a link is provided to a web page where the content is fully visible without truncation, or a mechanism is provided on the web page to reveal the truncated content.
- **Preformatted text conveys meaning**
              

The presentation of text where the layout has specific meaning, such as code indentation for Python or "ascii art" as just two examples, would lose meaning if the layout were not presented correctly. This success criterion does not apply where that meaning would be lost. However, this is not the case for most other instances of text where text wrapping can be applied without loss of meaning. Additionally, for instances of indentation that convey meaning, consider reducing the size of the indentation at zoomed in levels. As the text will be bigger, the reduced indentation width can still be noticeable.

### Resources
- [Reading with Low Vision in a Digital Setting: by Wayne Dick, PhD.](https://www.google.com/url?q=https://docs.google.com/document/d/15ElCfY9VWzhPm3OSNofBe2x5Kt-nzt-TQFnZTcThV8o/edit&sa=D&source=docs&ust=1725541904107256&usg=AOvVaw0Y5vDE4bFZ6O1QbNOS094v)
- [Operational Overhead Caused by Horizontal Scrolling Text](http://web.archive.org/web/20220121073555/http://nosetothepage.org/Fitz/2dScroll.html) by Wayne Dick, 2017. The study shows the impact of horizontal scrolling on reading effort
- [Accessibility Requirements for People with Low Vision](https://www.w3.org/TR/low-vision-needs/). W3C First Public Working Draft 17 March 2016
- [Responsive design resources](https://developer.mozilla.org/en-US/Apps/Progressive/Responsive) from MDN web docs
- [Responsive web design basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive/) tutorial from Google

### Techniques

#### Sufficient Techniques

- C32
- C31
- C33
- C38
- SCR34
- G206
- G224
- G225
- Using PDF/UA when creating PDFs (Potential future technique)

#### Advisory Techniques

- C34
- C37
- CSS, Reflowing simple data tables (Potential future technique)
- CSS, Fitting data cells within the width of the viewport (Potential future technique)
- Mechanism to allow mobile view at any time (Potential future technique)
- Alternate view supporting Reflow for otherwise excepted content (Potential future technique)

#### Failures

- F102


---

## 1.4.11 Non-text Contrast (AA)

### In brief
**Goal**
: Important visual information meets the same minimum contrast required for larger text.

**What to do**
: Ensure meaningful visual cues achieve 3:1 against the background.

**Why it's important**
: Some people cannot see elements with low contrast.

### Intent
The intent of this success criterion is to ensure that user interface components (i.e., controls) and meaningful graphics are distinguishable by people with moderately low vision. The requirements and rationale are similar to those for large text in [1.4.3 Contrast (Minimum)](contrast-minimum). Note that this requirement does not apply to *inactive* user interface components.

			

Low contrast controls are more difficult to perceive, and may be completely missed by people with a visual impairment. Similarly, if a graphic is needed to understand the content or functionality of the web page then it should be perceivable by people with low vision or other impairments without the need for contrast-enhancing assistive technology.

			

> **Note:**
> > 				
> 
> The 3:1 contrast ratios referenced in this success criterion is intended to be treated as threshold values. When comparing the computed contrast ratio to the success criterion ratio, the computed values should not be rounded (e.g. 2.999:1 would not meet the 3:1 threshold).
> 
> 
>

			

> **Note:**
> > 				
> 
> Because authors do not have control over user settings for font smoothing and anti-aliasing, when evaluating this
> 					 Success Criterion, refer to the colors obtained from the user agent, or the underlying
> 					 markup and stylesheets, rather than the non-text elements as presented on screen.
> 
> 
> 				
> 
> Due to anti-aliasing, particularly thin lines and shapes of non-text elements may be rendered by user agents with
> 					 a much fainter color than the actual color defined in the underlying CSS. This can lead to situations where
> 					 non-text elements have a contrast ratio that nominally passes the Success Criterion, but have a much lower contrast
> 					 in practice. In these cases, best practice would be for authors to avoid particularly thin lines and shapes,
> 					 or to use a combination of colors that exceeds the normative requirements of this success criterion.
> 
> 
>

			

				

##### User Interface Components

				

Unless the control is *inactive*, any visual information provided that is necessary for a user to identify that a control is present and how to operate it must have a minimum 3:1 contrast ratio with the adjacent colors. Also, any visual information necessary to indicate state, such as whether a component is selected or focused must also ensure that the information used to identify the control in that state has a minimum 3:1 contrast ratio.

				

This success criterion does not require that changes in color that differentiate between states of an individual component meet the 3:1 contrast ratio when they do not appear next to each other. For example, there is not a new requirement that visited links contrast with the default color, or that mouse hover indicators contrast with the default state. However, the component must not lose contrast with the adjacent colors, and non-text indicators such as the check in a checkbox, or an arrow graphic indicating a menu is selected or open must have sufficient contrast to the adjacent colors.

				

###### Boundaries

				

This success criterion does not require that controls have a visual boundary indicating the hit area, but if the visual indicator of the control is the only way to identify the control, then that indicator must have sufficient contrast. If text (or an icon) within a button or placeholder text inside a text input is visible and there is no visual indication of the hit area then the success criterion is passed. If a button with text also has a colored border, since the border does not provide the only indication there is no contrast requirement beyond the text contrast ([1.4.3 Contrast (Minimum)](contrast-minimum)). Note that for people with cognitive disabilities it is recommended to delineate the boundary of controls to aid in the recognition of controls and therefore the completion of activities.

				
					{% include "./img/1.4.11-ntc-minimal-button.svg" %}
					
						**Pass:** A button without a visual boundary, and the same button with a focus indicator that is a defined visual boundary of grey (`#949494`) adjacent to white.
				

				

###### Adjacent colors

				

For user interface components 'adjacent colors' means the colors adjacent to the component. For example, if an input has a white internal background, dark border, and white external background the 'adjacent color' to the component would be the white external background.

				
					{% include "./img/1.4.11-ntc-text-input-default.svg" %}
					
						**Pass:** A standard text input with a grey border (`#767676`) and white adjacent color outside the component
				

				

If components use several colors, any color which does not interfere with identifying the component can be ignored for the purpose of measuring contrast ratio. For example, a 3D drop-shadow on an input, or a dark border line between contrasting backgrounds is considered to be subsumed into the color closest in brightness (perceived luminance).

				

The following example shows an input that has a light background on the inside and a dark background around it. The input also has a dark grey border which is considered to be subsumed into the dark background. The border does not interfere with identifying the component, so the contrast ratio is taken between the white background and dark blue background.

				
					{% include "./img/1.4.11-ntc-text-input-background-border.svg" %}
					
						**Pass:** The contrast of the input background (white) and color adjacent to the control (dark blue `#003366`) is sufficient. There is also a border (silver) on the component that is not required to contrast with either.
				

				

For visual information required to identify a state, such as the check in a checkbox or the thumb of a slider, that part might be within the component so the adjacent color might be another part of the component.

				
					{% include "./img/1.4.11-ntc-checkbox-purple.svg" %}
					
						**Pass:** A customized checkbox with light grey check (`#E5E5E5`), which has a contrast ratio of 5.6:1 with the purple box (`#6221EA`).
				

				

It is possible to use a flat design where the status indicator fills the component and does not contrast with the component, but does contrast with the colors adjacent to the component.

				
					{% include "./img/1.4.11-ntc-radio-custom.svg" %}
					
						**Pass:** The first radio button shows the default state with a grey (`#949494`) circle. The second and third show the radio button selected and filled with a color that contrasts with the color adjacent to the component. The last example shows the state indicator contrasting with the component colors.
				

				

###### Relationship with Use of Color

				

The [Use of Color](use-of-color) success criterion addresses changing **only the color** (hue) of an object or text without otherwise altering the object's form. The principle is that contrast ratio (the difference in brightness) can be used to distinguish text or graphics. For example, [G183](../Techniques/general/G183.html) is a technique to use a contrast ratio of 3:1 with surrounding text to distinguish links and controls. In that case the Working Group regards a link color that meets the 3:1 contrast ratio relative to the non-linked text color as satisfying the Success Criterion [1.4.1 Use of color](use-of-color) since it is relying on contrast ratio as well as color (hue) to convey that the text is a link.

				

Non-text information within controls that uses a change of hue alone to convey the value or state of an input, such as a 1-5 star indicator with a black outline for each star filled with either yellow (full) or white (empty) is likely to fail the Use of color criterion rather than this one.

				
					{% include "./img/1.4.11-ntc-star-examples-pass.svg" %}
					
						**Pass:** Two examples which pass this success criterion, using either a solid fill to indicate a checked-state that has contrast, or a thicker border as well as yellow fill.
					
				
				
					{% include "./img/1.4.11-ntc-star-examples-fail.svg" %}
					
						**Fail:** The first example fails the Use of color criterion due to relying on yellow and white hues. The second example fails the Non-text contrast criterion due to the yellow (`#FFF000`) to white contrast ratio of 1.2:1.
					
				

				

Using a change of contrast for focus and other states is a technique to differentiate the states. This is the basis for [G195: Using an author-supplied, highly visible focus indicator](../Techniques/general/G195.html), and more techniques are being added.

				

###### Relationship with Focus Visible

				

In combination with [2.4.7 Focus Visible](focus-visible), the visual focus indicator for a component *must* have sufficient contrast against the adjacent background when the component is focused, except where the appearance of the component is determined by the user agent and not modified by the author.

				

Most focus indicators appear outside the component - in that case it needs to contrast with the background that the component is on. Other cases include focus indicators which are:

				

- only inside the component and need to contrast with the adjacent color(s) within the component.
- the border of the component (inside the component and adjacent to the outside) and need to contrast with both adjacent colours.
- partly inside and partly outside, where either part of the focus indicator can contrast with the adjacent colors.

				
					{% include "./img/1.4.11-ntc-focus-inner.svg" %}
					
						**Pass:** The internal yellow indicator (`#FFFF00`) contrasts with the blue button background (`#4189B9`).
					
				

				
					{% include "./img/1.4.11-ntc-focus-outer-yellow.svg" %}
					
						**Fail:** The external yellow indicator (`#FFFF00`) does not contrast with the white background (`#FFF`) which the component is on.
					
				

				
					{% include "./img/1.4.11-ntc-focus-outer-green.svg" %}
					
						**Pass:** The external green indicator (`#008000`) does contrast with the white background (`#FFF`) which the component is on. It does not need to contrast with both the component background and the component, as visually the effect is that the button is noticeably larger, and it's not necessary for a user to be able to discern this extra border in isolation. Although this passes non-text contrast, it is not a good indicator unless it is very thick. There is a AAA criterion in WCAG 2.2 that addresses this aspect, [Focus Appearance](focus-appearance.html).
					
				

				

If an indicator is partly inside and partly outside the component, either part of the indicator could provide contrast.

				
					{% include "./img/1.4.11-ntc-focus-inner-outer.svg" %}
					
						**Pass:** The focus indicator is partially inside, partially outside the button. The internal part of the yellow indicator (`#FFFF00`) contrasts with the blue button background (`#4189B9`).
					
				

				

If the focus indicator changes the border of the component within the visible boundary it must contrast with the component. Typically an outline goes around (outside) the visible boundary of the component, in this case changing the border is just inside the visible edge of the component.

				
					{% include "./img/1.4.11-ntc-focus-border.svg" %}
					
						**Fail:** The border of the control changes from blue (`#4189B9`) to green (`#4B933A`). This is within the component and does not contrast with the inside background of the component.
					
				

				
					{% include "./img/1.4.11-ntc-focus-inner-border.svg" %}
					
						**Fail:** An inner border of dark green (`#008000`) does contrast with the black border, but does not contrast with the blue component background.
					
				

				
					{% include "./img/1.4.11-ntc-focus-inner-white.svg" %}
					
						**Pass:** An inner border of white contrasts with the black border and the blue component background.
					
				

		        

Note that this success criterion does not directly compare the focused and unfocused states of a control - if the focus state relies on a change of color (e.g., changing *only* the background color of a button), this success criterion does not define any requirement for the difference in contrast between the two states.

				
					{% include "./img/1.4.11-ntc-focus-background.svg" %}
					
						**Not in scope:** The change of background within the component is not in scope of non-text contrast. However, this would not pass [Use of color](use-of-color.html).
					
				

				

					

##### Hover states

					

The language of Non-text Contrast specifically calls out "visual information required to identify...states." When users talk about a hover state, they are normally referring to a visual effect that takes place when the pointer is positioned over a control. However, there are a number of HTML components (such as buttons, checkboxes, radio buttons, and selects) which do not by default display any additional visual effects when the user moves a pointer control over them. The pointer itself, via its location, is the indicator of whether the user is hovering on a component. Therefore, additional author-supplied visual treatments for hover are not "required to identify" the hover state. Those treatments can be considered supplemental and do not themselves need to contrast 3:1 against the background.

					

This is not to say that other hover effects are discouraged. For instance, some native components alter the shape of the pointer when it is hovering over a control; the pointer becomes an I-beam when it hovers over text inputs and text areas. There will be cases where some users may benefit from additional visual hover effects, such as bolding text or use of drop shadows. However, other users may find strong hover effects distracting. The key consideration for any hover effect is that it does not cause a component itself to lose sufficient contrast against adjacent colors, or cause the visual indicators for other states, such as focus or selection, to lose sufficient contrast.

				

				

					

##### User Interface Component Examples

					

For designing focus indicators, selection indicators and user interface components that need to be perceived clearly, the following are examples that have sufficient contrast.

					
						
							Passing User Interface Component Examples
						
						
						Type
						Description
						Examples
						
						
							Link text
							The browser's default link text color is covered by [1.4.3 Contrast (Minimum)](contrast-minimum). Since the underline is the same color as the text, which must meet at least 3:1 to pass, the default underline will always pass the requirements of Non-text Contrast.
							{% include "./img/1.4.11-ntc-default-link-text.svg" %}
						
						
							Default focus style
							Links are required to have a visible focus indicator by [2.4.7 Focus Visible](focus-visible.html). Where the focus style of the user-agent is not adjusted on interactive controls (such as links, form fields or buttons) by the website (author), the default focus style is exempt from contrast requirements (but must still be visible).
							{% include "./img/1.4.11-ntc-default-link-focus.svg" %}
						
						
							Buttons
							A button which has a distinguishing indicator such as position, text style, or context does not need a *contrasting* visual indicator to show that it is a button, although some users are likely to identify a button with an outline that meets contrast requirements more easily.
							{% include "./img/1.4.11-ntc-button-background.svg" %}
						
						
							Text input (minimal)
							Where a text-input has a visual indicator to show it is an input, such as a bottom border (`#767676`), that indicator must meet 3:1 contrast ratio.
							{% include "./img/1.4.11-ntc-text-input-minimal.svg" %}
						
						
							Text input
							Where a text-input has an indicator such as a complete border (`#767676`), that indicator must meet 3:1 contrast ratio.
							{% include "./img/1.4.11-ntc-text-input-default.svg" %}
						
						
							Text input focus style
							A focus indicator is required. While in this case the additional gray (`#CCC`) outline has an insufficient contrast of 1.6:1 against the white (`#FFF`) background, the cursor/caret which is displayed when the input receives focus *does* provide a sufficiently strong visual indication.
							{% include "./img/1.4.11-ntc-text-input-focus.svg" %}
						
						
							Text input using background color
							Text inputs that have no border and are differentiated only by a background color must have a 3:1 contrast ratio to the adjacent background (`#043464`).
							{% include "./img/1.4.11-ntc-text-input-background.svg" %}
						
						
							Toggle button
							The toggle button's internal background (`#070CD5`) has a good contrast with the external white background. Also, the round toggle within (`#7AC2FF`) contrasts with the internal background.
							{% include "./img/1.4.11-ntc-toggle.svg" %}
						
						
							Dropdown indicator
							The down-arrow is required to understand that there is drop-down functionality, it has a contrast of 4.7:1 for the white icon on dark gray (`#6E747B`).
							{% include "./img/1.4.11-ntc-dropdown.svg" %}
						
						
							Dropdown indicator
							The down-arrow is required to understand that there is drop-down functionality, it has a contrast of 21:1 for the black icon on white.
							{% include "./img/1.4.11-ntc-dropdown2.svg" %}
						
						
							Checkbox - empty
							A black border on a white background indicates the checkbox.
							{% include "./img/1.4.11-ntc-checkbox-example1.svg" %}
						
						
							Checkbox - checked
							A black border on a white background indicates the checkbox, the black tick shape indicates the state of checked.
							{% include "./img/1.4.11-ntc-checkbox-example2.svg" %}
						
						
							Checkbox - Subtle hover style
							A checkbox is visually identified by its black border against a white background, but when the mouse pointer hovers on the checkbox, a subtle grey background is added (`#DEDEDE`). The black border has a 15:1 contrast ratio with the grey background, so the checkbox continues to have good contrast. Note that the grey hover effect does not itself need to contrast 3:1 with the page background, since the pointer position is the primary indicator of the hover state.
							{% include "./img/1.4.11-ntc-checkbox-example4.svg" %}
						
					

					

The following are examples that have insufficient contrast.

					
						
							Failing User Interface Component Examples
						
						
						Type
						Description
						Examples
						
						
						Colored underline is the only indicator of a link
						Link and non-link text are both white on an almost-black (`#0D0F13`) background. The link's custom underline (`#B1262B`) is the only way to identify the link. The red underline contrasts less than 3:1 with the background color.
						{% include "./img/1.4.11-ntc-link-underline-only.svg" %}
					
						
							Checkbox - border color
							The grey border color of the checkbox (`#9D9D9D`) has a contrast ratio of 2.7:1 with the white background, which is not sufficient for the visual information required to identify the checkbox.
							{% include "./img/1.4.11-ntc-checkbox-example3.svg" %}
						
						
							Checkbox - subtle focus style
							A focus indicator is required. If the focus indicator is styled by the author, it must meet the 3:1 contrast ratio with adjacent colors. In this case, the gray (`#AAA`) indicator has an insufficient ratio of 2.3:1 with the white (`#FFF`) adjacent background.
							{% include "./img/1.4.11-ntc-checkbox-example5.svg" %}
						
						
							Text input - subtle border and customized caret
							The text input's border color (`#CCC`) has contrast lower than 3:1 against its adjacent white background. Additionally, the caret / cursor has been given a customized light-blue color (`#00C7FD`) which has a contrast lower than 3:1 against the interior white background color of the input.
							
								
							
						
					

				

				

					

###### Inactive User Interface Components

					

User Interface Components that are not available for user interaction (e.g., a disabled control in HTML) are not required to meet contrast requirements. An inactive user interface component is visible but not currently operable. An example would be a submit button at the bottom of a form that is visible but cannot be activated until all the required fields in the form are completed.

					
						{% include "./img/1.4.11-ntc-button-inactive.svg" %}
						 An inactive button using default browser styles
					
					

Inactive components, such as disabled controls in HTML, are not available for user interaction. The decision to exempt inactive controls from the contrast requirements was based on a number of considerations. Although it would be beneficial to some people to discern inactive controls, a one-size-fits-all solution has been very difficult to establish. A method of varying the presentation of disabled controls, such as adding an icon for disabled controls, based on user preferences is anticipated as an advancement in the future.

				

			

			

				

##### Graphical Objects

				

The term "graphical object" applies to stand-alone icons such as a print icon (with no text), and the important parts of a more complex diagram such as each line in a graph. For simple graphics such as single-color icons the entire image is a graphical object. Images made up of multiple lines, colors and shapes will be made of multiple graphical objects, some of which are required for understanding.

				

Not every graphical object needs to contrast with its surroundings - only those that are required for a user to understand what the graphic is conveying. [Gestalt principles](https://en.wikipedia.org/wiki/Gestalt_psychology#Pr.C3.A4gnanz) such as the "law of continuity" can be used to ignore minor overlaps with other graphical objects or colors.

				
					
						
							Image
							Notes
						
					
					
						
							
							

The phone icon is a simple shape within the orange (`#E3660E`) circle. The meaning can be understood from that icon alone, the background behind the circle is irrelevant. The orange background and the white icon have a contrast ratio greater than 3:1, which passes.

							

The graphical object is the white phone icon.

							
						
						
							
							

A magnet can be understood by the "U" shape with lighter colored tips. Therefore to understand this graphic you should be able to discern the overall shape (against the background) and the lighter colored tips (against the rest of the U shape and the background).

							

The graphical objects are the "U" shape (by outline or by the solid red color #D0021B), and each tip of the magnet.

							
						
						
							
							

The symbol to show a currency (the £) going down can be understood with recognition of the shape (down arrow) and the currency symbol (pound icon with the shape which is part of the graphic). To understand this graphic you need to discern the arrow shape against the white background, and the pound icon against the yellow background (`#F5A623`).

							

The graphical objects are the shape and the currency symbol.

							
						
						
							
								[](img/simple-line-graph.png)

							

In order to understand the graph you need to discern the lines and shapes for each condition. To perceive the values of each line along the chart you need to discern the grey lines marking the graduated 100 value increments.

							

The graphical objects are the lines in the graph, including the background lines for the values, and the colored lines with shapes.

							

The lines should have 3:1 contrast against their background, but as there is little overlap with other lines they do not need to contrast with each other or the graduated lines. (See the testing principles below.)

						

						
						
							[](img/graphics-contrast_pie-chart_pass.png)
							

To understand the pie chart you have to discern each slice of the pie chart from the others.

							

The graphical objects are the slices of the pie (chart).

							

Note: If the values of the pie chart slices were also presented in a conforming manner (see the Pie Charts example for details), the slices would not be required for understanding.

						
						
					
				

				

Taking the magnet image above as an example, the process for establishing the graphical object(s) is to:

				

- Assess what part of each image is needed to understand what it represents.
						The magnet's "U" shape can be conveyed by the outline or by the red background (either is acceptable). The white tips are also important (otherwise it would be a horseshoe), which needs to contrast with the red background.
- Assume that the user could only see those aspects. Do they contrast with the adjacent colors?
						The outline of the magnet contrasts with the surrounding text (black/white), and the red and white between the tips also has sufficient contrast.

				

Due to the strong contrast of the red and white, it would also be possible to only put the outline around the white tips of the magnet and it would still conform.

				

				

###### Required for Understanding

				

The term "required for understanding" is used in the success criterion as many graphics do not need to meet the contrast requirements. If a person needs to perceive a graphic, or part of a graphic (a graphical object) in order to understand the content it should have sufficient contrast. However, that is not a requirement when:

				

- A graphic with text embedded or overlaid conveys the same information, such as labels *and* values on a chart.

						

Text within a graphic must meet [1.4.3 Contrast (Minimum)](contrast-minimum).
- The graphic is for aesthetic purposes that does not require the user to see or understand it to understand the content or use the functionality.
- The information is available in another form, such as in a table that follows the graph, which becomes visible when a "Long Description" button is pressed.
- The graphic is part of a logo or brand name (which is considered "essential" to its presentation).

				

				

				

###### Gradients

				

Gradients can reduce the apparent contrast between areas, and make it more difficult to test. The general principles is to identify the graphical object(s) required for understanding, and take the central color of that area. If you remove the adjacent color which does not have sufficient contrast, can you still identify and understand the graphical object?

				
          
				Removing the background which does not have sufficient contrast highlights that the graphical object (the "i") is not then understandable.
				

				

				

###### Dynamic Examples

				

Some graphics may have interactions that either vary the contrast, or display the information as text when you mouseover/tap/focus each graphical object. In order for someone to discern the graphics exist at all, the unfocused default version must already have sufficiently contrasting colors or text. For the area that receives focus, information can then be made available dynamically as pop-up text, or be foregrounded dynamically by increasing the contrast.

				
				
					
					A dynamic chart where the current 'slice' is hovered or focused, which activates the associated text display of the values and highlights the series
				
				

				

				

###### Infographics

				

Infographics can mean any graphic conveying data, such as a chart or diagram. On the web it is often used to indicate a large graphic with lots of statements, pictures, charts or other ways of conveying data. In the context of graphics contrast, each item within such an infographic should be treated as a set of graphical objects, regardless of whether it is in one file or separate files.

				

Infographics often fail to meet several WCAG level AA criteria including:

				

- [1.1.1 Non-text Content](non-text-content)
- [1.4.1 Use of Color](use-of-color)
- [1.4.3 Contrast (Minimum)](contrast-minimum)
- [1.4.5 Images of Text](images-of-text)

				

An infographic can use text which meets the other criteria to minimise the number of graphical objects required for understanding. For example, using text with sufficient contrast to provide the values in a chart. A long description would also be sufficient because then the infographic is not relied upon for understanding.

				

				

					

###### Symbolic text characters

					

When text characters are used as symbols – used for their visual appearance, rather than "expressing something in human language" – they fall under the definition of [non-text content]().

					
						{% include "./img/1.4.11-ntc-buttons-text-symbols.svg" %}
						Even though the two buttons use text characters — an uppercase "X", often used for "Close" buttons, and a ">" character, to act as a right-pointing arrow — they count as non-text characters/symbols. Their contrast ratio of just above 3:1 passes this success criterion.
					
				

				

					

###### Essential Exception

					

Graphical objects do not have to meet the contrast requirements when "a particular presentation of graphics is essential to the information being conveyed". The Essential exception is intended to apply when there is no way of presenting the graphic with sufficient contrast without undermining the meaning. For example:

					

- **Logotypes and flags**: The brand logo of an organization or product is the representation of that organization and therefore exempt. Flags may not be identifiable if the colors are changed to have sufficient contrast.
- **Sensory**: There is no requirement to change pictures of real life scenes such as photos of people or scenery.
- **Representing other things**: If you cannot represent the graphic in any other way, it is essential. Examples include:
							

- Screenshots to demonstrate how a website appeared.
- Diagrams of medical information that use the colors found in biology ([example medical schematic from Wikipedia](https://commons.wikimedia.org/wiki/File:Schematic_diagram_of_the_human_eye_it.svg)).
- color gradients that represent a measurement, such as heat maps ([example heatmap from Wikipedia](https://commons.wikimedia.org/wiki/File:Eyetracking_heat_map_Wikipedia.jpg)).

				

			

					

##### Testing Principles

					

A summary of the high-level process for finding and assessing non-text content on a web page:

					

- Identify each user-interface component (link, button, form control) on the page and:
							

- Identify the visual (non-text) indicators of the component that are required to identify that a control exists, and indicate the current state. In the default (on page load) state, test the contrast ratio against the adjacent colors.
- Test those contrast indicators in each state.
- Identify each graphic on the page that includes information required for understanding the content (i.e., excluding graphics which have visible text for the same information, or are decorative) and:
							

- Check the contrast of the graphical object against its adjacent colors;
- If there are multiple colors and/or a gradient, choose the least contrasting area to test;
- If it passes, move to the next graphical object;
- If the least-contrasting area is less than 3:1, assume that area is invisible, is the graphical object still understandable?
- If there is enough of the graphical object to understand, it passes, else fail.

					

The techniques below each have testing criteria, and the related criteria for [Focus visible (2.4.7)](focus-visible), [Use of color (1.4.1)](use-of-color), and [Contrast minimum](contrast-minimum) also have techniques.

### Benefits
People with low vision often have difficulty perceiving graphics that have insufficient contrast. This can be exacerbated if the person has a color vision deficiency that lowers the contrast even further. Providing a [relative luminance](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef) (lightness difference) of 3:1 or greater can make these items more distinguishable when the person does not see a full range of colors.

### Examples
- Status icons on an application's dashboard (without associated text) have a 3:1 minimum contrast ratio.
- A text input has a dark border around the white editable area.
- A graph uses a light background and ensures that the colors for each line have a 3:1 contrast ratio against the background.

			

				

##### Pie Charts

				

Pie charts make a good case study for the graphical objects part of this success criterion, the following pie charts are intended to convey the proportion of market share each browser has. Please Note: The actual figures are made up, these are not actual market shares.

				
					
					
						

**Fail:** The pie chart has labels for each slice (so passes 1.4.1 Use of Color), but in order to understand the proportions of the slices you must discern the edges of the slices (the graphical objects conveying essential information), and the contrast between the slices is not  3:1 or greater.

					
				
				
					
					
						

**Not applicable:** The pie chart has visible labels *and* values that convey equivalent information to the graphical objects (the pie slices).

					
				
				
					
					
						

**Pass:** The pie chart has visible labels, and sufficient contrast around and between the slices of the pie chart (the graphical objects). A darker border has been added around the yellow slice in order to achieve the contrast level.

					
				
			

			

				

##### Infographics

				
					
					
						

**Fail:** Discerning the circles is required to understand the size of network and discerning the icons in each circle is required to identify which network it shows.

					
				
				

The graphical objects are the circles (measured against the background) and the icons in each circle (measured against the circle's background).

				
					
					
						

**Pass:** The circles have contrasting borders and the icons are a contrasting dark color against the light circle backgrounds.

					
				
				

There are many possible solutions to ensuring contrast, the example shows the use of borders. Other techniques are to use darker colors for the circle backgrounds, or to add text labels & values for each item.

### Resources
- [Accessibility Requirements for People with Low Vision](http://w3c.github.io/low-vision-a11y-tf/requirements.html).
- [Smith Kettlewell Eye Research Institute](https://lists.w3.org/Archives/Public/public-low-vision-a11y-tf/2017May/0007.html) -  "If the text is better understood with the graphics, they should be equally visible as the text".
- [Gordon Legge](https://lists.w3.org/Archives/Public/public-low-vision-a11y-tf/2017Jun/0054.html) - "Contrast requirements for form controls should be equivalent to contrast requirements for text".

### Techniques

#### Sufficient Techniques

- **Situation A: Color is used to identify user interface components or used to identify user interface component states**
  - G195
  - G174
- **Situation B: Color is required to understand graphical content**
  - G207
  - G209

#### Failures

- F78


---

## 1.4.12 Text Spacing (AA)

### In brief
**Goal**
: Users can adjust text spacing to make it easier to read.

**Author task**
: Ensure content adapts to user-defined text settings.

**Why it's important**
: Some people need text with different spacing or font characteristics.

### Intent
The intent of this success criterion (SC) is to ensure that when people override author-specified text spacing to improve their reading experience, content is still readable and operable. Each of the requirements stipulated in the SC's four bullets helps ensure text styling can be adapted by the user to suit their needs.

    

The metrics set a target for a minimum for text spacing that must be met. Starting from the author's presentation, changing these four style properties to the specified values should not result in a loss of content or functionality.

    

This SC focuses on the adaptability of content to a change in spacing between lines, words, letters, and paragraphs. Any combination of these may assist a user with effectively reading text. As well, ensuring that content correctly adapts when users override author settings for spacing also significantly increases the likelihood other style preferences can be set by the user. For example, a user may need to change to a wider font family than the author has set in order to effectively read text.

    

      

##### Author Responsibility

      

This SC does not dictate that authors must set all their content to the specified metrics, or provide a mechanism to do so. Rather, it specifies that an author's content has the ability to be set to those metrics without loss of content or functionality. The author requirement is both to not interfere with a user's ability to override the author settings, and to ensure that content thus modified does not break content in the manners shown in figures 1 through 3 in [Effects of Not Allowing for Spacing Override](#effects-not-allowing). The values in the SC are a baseline. Authors are encouraged to allow spacing to surpass the values specified, not see them as a ceiling.

      

It is beneficial for users if authors use any locally available guidance for improving readability in the local language or writing system. Conversely, in some human languages and scripts, some of the metrics specified by the SC are inapplicable. For example, languages such as Japanese do not use spacing following paragraphs, meaning that users are unlikely to make any paragraph spacing changes in practice. The exception in this SC allows authors to ignore text style properties which are inapplicable to the combination of language and script being used.

      

      

        

##### User Responsibility

        

The user may choose to exceed the spacing adjustments in the SC. The ability to read and derive meaning from the overridden spacing rests with the user. If large changes in spacing reduce readability, or cause loss of content or functionality, the user can adjust or return to spacing within the bounds of the SC. How such changes are achieved is up to the user, who may choose a user stylesheet, bookmarklet, extension, or application. Regardless, the user needs the flexibility to adjust spacing – and within the bounds set in the SC, without loss of content or functionality.

        

Further, this SC does not require that content implement its own mechanisms to allow users to do this. It is not a failure of the content if a user agent or platform does not provide a way for users to do this. Content does not fail this SC if the method chosen by the user - for instance, the use of an extension or bookmarklet - fails to correctly set the line height and spacing text properties on the content (provided that the content is not actively and purposely preventing the properties from being added).

      

      

        

##### Applicability

        

If the markup-based technologies being used are capable of overriding text to the Success Criterion's metrics, then this SC is applicable. For instance Cascading Style Sheet/HTML technologies are quite able to allow for the specified spacing metrics. Plugin technologies would need to have a built-in ability to modify styles to the specified metrics. Currently, this SC does not apply to PDF, as the portable document format is not implemented using markup.

        

Examples of text typically not affected by [style properties]() and not expected to adapt are:

        

- Video captions embedded directly into the video frames and not provided as an associated caption file
- [Images of text]()

        

For this SC, [canvas](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element) implementations of text are considered to be [images of text]().

      

      

        

###### Use of ellipses

        

There may be regions of a page where text containers cannot expand due to design constraints (such as a maximum width for the left navigation or table column headers). A common convention if text exceeds its space is to replace truncated text with an ellipsis. Where ellipses appear as a result of modifying text style properties, the page can still meet the Text Spacing requirements, so long as the content is still available. For example:

        

- a mechanism is provided to reveal the truncated text on the page (for instance, the text appears on focus or on activation)
- where the ellipsis is part of a section of content which includes a link, the truncated text is revealed on the linked page

        

Where text is not truncated but it is when text is spaced, if there is no mechanism to show the truncated text, it fails this success criterion.

### Benefits
- People with low vision who require increased space between lines, words, and letters are able to read text.
- People with dyslexia may increase space between lines, words, and letters to increase reading speed.
- Although not required by this SC, white space between blocks of text can help people with cognitive disabilities discern sections and call-out boxes.

### Examples
When spacing is being overridden to the SC's metrics:

    

- Text fits within the bounds of its containing box without being cut off.
- Text fits within the bounds of its containing box without overlapping other boxes.

### Resources
##### Research

      

The  grounds for this SC are [based on research](#resources). The metrics chosen as measures are based on the [McLeish](http://journals.sagepub.com/doi/pdf/10.1177/0264619607075995) study. She ran from .04 to .25 em tests. McLeish found an increasing curve in reading speed of actual materials up to .25, but it  started to flatten at .20. Previous studies that reported no improvement started at .5em. Right at the flat point.  [Wayne E. Dick, Ph.D. analyzed the McLeish study](https://lists.w3.org/Archives/Public/public-low-vision-a11y-tf/2017Jun/0047.html) and translated from points. Dr. Dick recommended the metrics that the Working Group adopted.

      

        

###### Languages and Scripts

        

Roughly 480 different languages and scripts [have been tested](https://lists.w3.org/Archives/Public/public-low-vision-a11y-tf/2018Feb/0001.html).  Maximum spacing adjustments allowed by the SC were set on the following 3 pages:

        

- [Languages in their own writing systems](http://www.geonames.de/languages.html)
- [Online Encyclopedia of writing systems and languages – language names](https://www.omniglot.com/language/names.htm)
- [Universal Declaration of Human Rights](https://www.un.org/en/about-us/universal-declaration-of-human-rights)

      

      

        

###### Results

        

No adverse effects occurred. The following are the specific findings:

        

**Character Spacing**
: Individual characters in words remained intact though they were spaced a bit further apart.

**Word Spacing**
: Words were spaced further apart. In languages that typically do not include spaces between words (e.g., Japanese), applying word spacing had no effect. This is expected.

**Line Height**
: Changing line height did not separate diacritics from characters, nor did it adversely impact ascenders or descenders.

        

As previously discussed, the ability to read text with adjusted spacing is a user responsibility. This is true no matter the language.

        

The SC's exception addresses cases where a text style property is not used in a language or script. In such cases, authors are only required to ensure relevant properties do not break the layout.

      

    

    

      

##### Other references

      

- Allan, Kirkpatrick, Lawton Henry, Editors. (2017). [Accessibility Requirements for People with Low Vision (3.4 Spacing for Reading)](https://www.w3.org/TR/low-vision-needs/#spacing).  World Wide Web Consortium.
- [Stylus Team](https://github.com/openstyles/stylus/graphs/contributors) (2012). [Stylus browser extension](https://github.com/openstyles/stylus/blob/master/README.md) (Firefox, Chrome, and Opera) (compatible with Userstyles.org material).
- Campbell, Alastair.  (2017). [Text Adaptation Bookmarklet](https://github.com/alastc/adaptation-scripts/blob/master/scripts/text-adaptation.js). GitHub.
- Chung, Susana T. L. (2012). [Dependence of Reading Speed on Letter Spacing in Central Vision Loss](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3429790/). Optom Vis Sci.
- Chung, Susana T. L. (2002). [The Effect of Letter Spacing on Reading Speed in Central and Peripheral Vision (PDF)](http://journals.sagepub.com/doi/pdf/10.1177/0264619607075995). IOVS ARVO Journals.
- Mcleish, Eve. (2007).  [A study of the effect of letter spacing on the reading speed of young readers with low vision (PDF)](http://journals.sagepub.com/doi/pdf/10.1177/0264619607075995). The British Journal of Visual Impairment 25.2: 133-43.
- Rello, L., & Baeza-Yates, R. A. (2017). [ How to present more readable text for people with dyslexia](https://link.springer.com/article/10.1007/s10209-015-0438-8). Universal Access in the Information Society, 16(1), 29-49.
- Sjoblom, A.M., Eaton, E. and Stagg, S.D., (2016). [The effects of letter spacing and coloured overlays on reading speed and accuracy in adult dyslexia](http://onlinelibrary.wiley.com/doi/10.1111/bjep.12127/full). British Journal of Educational Psychology, 86(4), pp. 630-639).
- Zorzi,  Marco et, al. (2012). [Extra-large letter spacing improves reading in dyslexia](http://www.pnas.org/content/109/28/11455.full). Proceedings of the National Academy of Sciences.

### Techniques

#### Sufficient Techniques

- C36
- C35

#### Advisory Techniques

- C8
- C21
- C28

#### Failures

- F104


---

## 1.4.13 Content on Hover or Focus (AA)

### In brief
**Goal**
: More users can perceive and dismiss non-persistent content.

**What to do**
: If hover or focus causes content changes, ensure interaction is predictable.

**Why it's important**
: Unpredictable temporary content can be hard for some to consume and may disrupt others.

### Intent
Additional content that appears and disappears in coordination with keyboard focus or pointer hover often leads to accessibility issues. Reasons for such issues include:

			

- the user may not have intended to trigger the interaction
- the user may not know new content has appeared
- the new content may interfere with a user's ability to do a task

			

Examples of such interactions can include custom tooltips, sub-menus and other nonmodal popups which display on hover and focus. The intent of this success criterion is to ensure that authors who cause additional content to appear and disappear in this manner must design the interaction in such a way that users can:

				

- perceive the additional content AND
- dismiss it without disrupting their page experience.

			

There are usually more predictable and accessible means of adding content to the page, which authors are recommended to employ. If an author *does* choose to make additional content appear and disappear in coordination with hover and keyboard focus, this success criterion specifies three conditions that must be met:

				

- dismissible
- hoverable
- persistent

				

Each of these is discussed in a separate section.

			

			

##### Dismissible

			

The intent of this condition is to ensure that the additional content does not interfere with viewing or operating the page's original content. When magnified, the portion of the page visible in the viewport can be significantly reduced. Mouse users frequently move the pointer to pan the magnified viewport and display another portion of the screen. However, almost the entire portion of the page visible in this restricted viewport may trigger the additional content, making it difficult for a user to pan without re-triggering the content. A keyboard means of dismissing the additional content provides a workaround.

			

Alternatively, low vision users who can only navigate via the keyboard do not want the small area of their magnified viewport cluttered with hover text. They need a keyboard method of dismissing something that is obscuring the current focal area.

			

Two methods may be used to satisfy this condition and prevent such interference:

			

1. Position the additional content so that it does not obscure any other content including the trigger, with the exception of white space and purely decorative content, such as a background graphic which provides no information.
2. Provide a mechanism to easily dismiss the additional content, such as by pressing Escape.

			

For most triggers of relatively small size, it is desirable for both methods to be implemented.  If the trigger is large, noticing the additional content may be of concern if it appears away from the trigger.  In those cases, only the second method may be appropriate.

			

The success criterion allows for input error messages to persist as there are cases that require attention, explicit confirmation or remedial action.

			

			

			

##### Hoverable

			

The intent of this condition is to ensure that additional content which may appear on hover of a target may also be hovered itself.  Content which appears on hover can be difficult or impossible to perceive if a user is required to keep their mouse pointer over the trigger. When the added content is large, magnified views may mean that the user needs to scroll or pan to completely view it, which is impossible unless the user is able to move their pointer off the trigger without the additional content disappearing.

			

Another common situation is when large pointers have been selected via platform settings or assistive technology. Here, the pointer can obscure a significant area of the additional content. A technique to view the content fully in both situations is to move the mouse pointer directly from the trigger onto the new content.  This capability also offers significant advantages for users who utilize screen reader feedback on mouse interactions.  This condition generally implies that the additional content overlaps or is positioned adjacent to the target.

			

			

			

##### Persistent

			

The intent of this condition is to ensure users have adequate time to perceive the additional content after it becomes visible.  Users with disabilities may require more time for many reasons, such as to change magnification, move the pointer, or simply to bring the new content into their visual field.  Once it appears, the content should remain visible until:

			

- The user removes hover or focus from the trigger and the additional content, consistent with the typical user experience;
- The user dismisses the additional content via the mechanism provided to satisfy the Dismissible condition; or
- The information conveyed by the additional content becomes invalid, such as a 'busy' message that is no longer valid.

			

			

			

##### Additional Notes

			

- This criterion does not attempt to solve such issues when the appearance of the additional content is completely controlled by the user agent. A prominent example is the common behavior of browsers to display the `title`  attribute in HTML as a small tooltip.
- Modal dialogs are out of scope for this criterion because they must take keyboard focus  and thus should not appear on hover or focus.  Refer to [Success Criterion 3.2.1, On Focus](https://www.w3.org/TR/WCAG21/#on-focus).
- Content which can be triggered via pointer hover should also be able to be triggered by keyboard focus.  Refer to [Success Criterion 2.1.1, Keyboard](https://www.w3.org/TR/WCAG21/#keyboard).

### Benefits
- Users with low vision who view content under magnification will be better able to view content on hover or focus without reducing their desired magnification.
- Users who increase the size of mouse cursors via platform settings or assistive technology will be able to employ a technique to view obscured content on hover.
- Users with low vision or cognitive disabilities will have adequate time to perceive additional content appearing on hover or focus and to view the trigger content with less distraction.
- users with low pointer accuracy will be able to more easily dismiss unintentionally-triggered additional content

### Examples
##### Example 1: Dismissible Tooltip

				
				
				
				A tooltip is displayed below a LVTF button on hover so as not to obscure the button itself. It does however obscure content below the button (the next red button, called ~comment-zoom-content). To meet the Dismissible requirement, a user can press the Escape key to clear the tooltip without moving the mouse, as demonstrated in the second image.
				
				
				
				The button's tooltip also appears on focus and can be removed with the Escape key. The screen shot shows the same LVTF button with focus, but the tooltip has been dismissed and is no longer visible.
				
			

			

				

##### Example 2: Hoverable Tooltip

				
				
				
				A button's tooltip is displayed directly below it on mouse hover which can easily be obscured by a large pointer.  The tooltip itself is able to be hovered so the mouse pointer can be moved down to its bottom edge in order to view the tooltip text.

### Resources
- [Tooltip design described in WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)

### Techniques

#### Sufficient Techniques

- SCR39
- ARIA: Using role="tooltip" (Potential future technique)
- CSS: Using hover and focus pseudo classes (Potential future technique)

#### Failures

- F95
- Failure to make content dismissible without moving pointer hover or keyboard focus (Potential future technique)
- Failure to meet by content on hover or focus not remaining visible until dismissed or invalid (Potential future technique)


---

## 2.1.1 Keyboard (A)

### In brief
**Goal**
: Everything can be done with a keyboard except freehand movements.

**What to do**
: Ensure pointer actions have a keyboard equivalent.

**Why it's important**
: Many people rely on the keyboard interface, including blind and some mobility impaired people.

### Intent
The intent of this success criterion is to ensure that, wherever possible, content
         can be operated through a keyboard or keyboard interface (so an alternate keyboard
         can be used). When content can be operated through a keyboard or alternate keyboard,
         it is operable by people with no vision (who cannot use devices such as mice that
         require eye-hand coordination) as well as by people who must use alternate keyboards
         or input devices that act as keyboard emulators. Keyboard emulators include speech
         input software, sip-and-puff software, on-screen keyboards, scanning software and
         a variety of assistive technologies and alternate keyboards. Individuals with low
         vision also may have trouble tracking a pointer and find the use of software much
         easier (or only possible) if they can control it from the keyboard.

      
      

Examples of "specific timings for individual keystrokes" include situations where
         a user would be required to repeat or execute multiple keystrokes within a short period
         of time or where a key must be held down for an extended period before the keystroke
         is registered.

      
      

The phrase "except where the underlying function requires input that depends on the
         path of the user's movement and not just the endpoints" is included to separate those
         things that cannot reasonably be controlled from a keyboard.

      
      

Most actions carried out by a pointing device can also be done from the keyboard (for
         example, clicking, selecting, moving, sizing). However, there is a small class of
         input that is done with a pointing device that cannot be done from the keyboard in
         any known fashion without requiring an inordinate number of keystrokes. Free hand
         drawing, or watercolor painting require path dependent input. Drawing straight lines,
         regular geometric shapes, re-sizing windows and dragging objects to a location (when
         the path to that location is not relevant) do not require path dependent input.

      
      

The use of MouseKeys would not satisfy this success criterion because it is not a
         keyboard equivalent to the application; it is a mouse equivalent (i.e., it looks like
         a mouse to the application).

      
      

It is assumed that the design of user input features takes into account that operating
         system keyboard accessibility features may be in use. For example, modifier key locking
         may be turned on. Content continues to function in such an environment, not sending
         events that would collide with the modifier key lock to produce unexpected results.

      
      

> **Note:**
> >          
> 
> Platforms and user agents usually have conventions for how web content or
>             applications are controlled with a keyboard interface. If content does not follow
>             the platform/user agent conventions it may be difficult to use, as users will need
>             to learn different interaction methods. As a *best practice*, content
>             should follow the platform/user agent conventions. However, deviating from these
>             conventions does *not* fail the normative requirement of this success criterion.
> 
> 
>          
> 
> For instance, buttons that have focus can generally be activated using both the
>             Enter key and the Space bar. If a custom button control
>             in a web application instead only reacts to Enter
>             (or even a completely custom key or key combination), this still
>             **satisfies** the requirements of this success criterion.
> 
> 
>

      

> **Note:**
> >          
> 
> This success criterion does not require that every visible control that can be activated
>             using a mouse or touch screen must also be focusable and actionable using the keyboard.
>             The normative requirement is only that there must be a way for keyboard interface users to perform
>             the same, or comparable, actions and to operate the content. Generally, the easiest way
>             to achieve this is to provide controls that can be operated with all possible input devices;
>             however, if a web application implements a separate mode of operation for keyboard interface users,
>             it will **not** fail the success criterion.
> 
> 
>

### Benefits
- People who are blind (who cannot use devices such as mice that require eye-hand coordination)
- People with low vision (who may have trouble finding or tracking a pointer indicator
            on screen)
- Some people with hand tremors find using a mouse very difficult and therefore usually
            use a keyboard

### Examples
**Example 1: A drawing Program**
: A drawing program allows users to create, size, position and rotate objects from the keyboard.

**Example 2: A drag and Drop Feature**
: An application that uses drag and drop also supports "cut" and "paste" or form controls to move objects.

**Example 3: Moving between and connecting discrete points**
: A connect-the-dots program allows the user to move between dots on a screen and use
               the spacebar to connect the current dot to the previous one.

**Example 4: Exception - Painting Program**
: A watercolor painting program passes as an exception because the brush strokes vary
               depending on the speed and duration of the movements.

**Example 5: Exception - Model helicopter flight training simulator**
: A model helicopter flight training simulator passes as an exception because the nature
               of the simulator is to teach real-time behavior of a model helicopter.

**Example 6: A PDA with an optional keyboard**
: A PDA device that is usually operated via a stylus has an optional keyboard that can
               be attached. The keyboard allows full web browsing in standard fashion. The web
               content is operable because it was designed to work with keyboard-only access.

**Example 7: Simple search form with pointer-operable submit button**
: A search form includes a text input field followed by a submit button. The submit button itself
               has been coded so that it does *not* receive focus, and can only be activated using a pointer input.
               However, since keyboard users can submit the search by pressing Enter in the text input
               after typing their search terms, the form passes this success criterion.

### Techniques

#### Sufficient Techniques

- G202
- **Ensuring keyboard control**
- G90

#### Advisory Techniques

- {"and":["Using WAI-ARIA role, state, and value attributes if repurposing static elements as interactive user interface components (future link)","SCR29"]}

#### Failures

- F54
- F55
- F42


---

## 2.1.2 No Keyboard Trap (A)

### In brief
**Goal**
: Keyboard users don't get stuck.

**What to do**
: Ensure users always know how to navigate away from components.

**Why it's important**
: People who rely on the keyboard often have no other means to navigate.

### Intent
The intent of this success criterion is to ensure that that content does not "trap"
         keyboard focus within subsections of content on a web page. This is a common problem
         when multiple formats are combined within a page and rendered using plug-ins or embedded
         applications.

      
      

There may be times when the functionality of the web page restricts the focus to a
         subsection of the content, as long as the user knows how to leave that state and "untrap"
         the focus.

### Benefits
- People who rely on a keyboard or keyboard interface to use the web including people
            who are blind and people with physical disabilities.

### Examples
**A calendar widget**
: A calendar widget allows users to add, remove or update items in their calendar using
               the keyboard. The controls in the widget are part of the tab order within the web
               page, allowing users to tab through the controls in the widget as well as to any links
               or controls that follow.

**A puzzle applet**
: Once a user tabs into an applet, further tabs and other keystrokes are handled by
               the applet. Instructions describing the keystroke used to exit the applet are provided
               prior to the applet as well as within the applet itself.

**A modal dialog box**
: A web application brings up a dialog box. At the bottom of the dialog are two buttons,
               Cancel and OK. When the dialog has been opened, all web page content outside the dialog becomes 
               inert and cannot receive focus (though, depending on implementation, the focus cycle
               might still include user agent controls).
               The dialog is dismissed by activating the Cancel button or the OK button.

### Techniques

#### Sufficient Techniques

- G21

#### Failures

- F10


---

## 2.1.4 Character Key Shortcuts (A)

### In brief
**Goal**
: Reduce accidental activation of keyboard shortcuts.

**What to do**
: Ensure character-only shortcut keys can be turned off or modified.

**Why it's important**
: Character-key shortcuts are easy to accidentally trigger, especially with speech input.

### Intent
The intent of this success criterion is to reduce accidental activation of keyboard shortcuts. Character key shortcuts work well for many keyboard users. However, they can be inappropriate and frustrating for speech input users, whose dictation is interpreted as strings of letters, and for keyboard users who are prone to accidentally hit keys. To rectify this issue, authors need to allow users to turn off or reconfigure shortcuts that are made up of only character keys.

			

> **Note:**
> > 				
> 
> Even though this success criterion refers to "character keys", note that it's not relevant whether a shortcut can be activated using a single physical key on a keyboard, or if it requires a combination of keys to be pressed. For instance, on most full-size US and UK keyboard, the ? (question mark) symbol is accessed using Shift+/ (forward slash key next to the right-hand Shift key). On a UK keyboard, in Windows, the é (lowercase "e" with an acute accent) requires the use of AltGr+e. The specific key combination required for certain characters will also vary depending on the user's keyboard layout. However, shortcuts that use these characters still fall under the requirements of this success criterion. What matters is that a shortcut relies on a printable character (letters, punctuation, numbers, symbol characters), and not the number of physical keyboard keys that users need to press to trigger it.
> 
> 
>

			

> **Note:**
> > 				
> 
> The success criterion also applies to situations where a shortcut is based on a *sequence* of character keys – for example, pressing G and then A in quick succession to trigger an action. While the individual character key presses don't immediately trigger the action, overall these types of shortcuts still rely on a series of *character keys*.
> 
> 
>

      

This success criterion doesn't affect components such as listboxes and drop-down menus. Although these components contain values (words) that may be selected by one or more character keys, the shortcuts are only active when the components have focus. Other components such as menus may be accessed or opened with a single non-character shortcut (e.g., Alt or Alt+F) before pressing a single character key to select an item. This makes the full path to invoking a menu a two-step shortcut that includes a non-printable key. [Accesskeys](https://www.w3.org/TR/html5/single-page.html#the-accesskey-attribute) are also not affected because they are generally (depending on the user agent) activated using modifier keys.

      

##### Background on the mechanics of speech input

      

Speech input users generally work in a single mode where they can use a mix of dictation and speech commands. This works well because the user knows to pause before and after commands, and commands are usually at least two words long. So, for instance, a user might say a bit of dictation, such as "the small boat", then pause, and say a command to delete that dictation, such as "Delete Line". In contrast, if the user were to say the two phrases together without a pause, the whole phrase would come out as dictation (i.e., "the small boat delete line"). Although speech input programs often include modes that listen only for dictation or only for commands, most speech users use the all-encompassing mode all the time because it is a much more efficient workflow. It could decrease command efficiency significantly if users were to change to command mode and back before and after issuing each command.

      

Speech users can also speak most keyboard commands (e.g., "press Control Foxtrot") without any problems. If the website or app is keyboard enabled, the speech user can also write a native speech macro that calls the keyboard command, such as "This Print" to carry out Ctrl+P.

      

Single-key shortcuts are the exception. While using single letter keys as controls might be appropriate and efficient for many keyboard users, single-key shortcuts are disastrous for speech users. The reason for this is that when only a single key is used to trip a command, a spoken word can become a barrage of single-key commands if the cursor focus happens to be in the wrong place.

      

For example, a speech-input user named Kim has her cursor focus in the main window of a web mail application that uses common keyboard shortcuts to navigate (k), archive (y) and mute messages (m). A coworker named Mike enters her office and says "Hey Kim" and her microphone picks that up. The Y of "hey" archives the current message. K in "Kim" moves down one conversation and M mutes a message or thread. And, if Kim looks up and says "Hey Mike" without remembering to turn off the microphone, the same three things happen in a different sequence.

      

A user interacting with a web page or web app that doesn't use single-character shortcuts doesn't have this problem. Inadvertent strings of characters from the speech application are not interpreted as shortcuts if a modifier key is required. A speech user filling in a text input form may find that a phrase that is accidentally picked up by the speech microphone results in stray text being entered into the field, but that is easily seen and undone. The Resources section of this page contains links to videos demonstrating these types of issues.

### Benefits
- Speech users will be able to turn off single-key shortcuts so they can avoid accidentally firing batches of them at once. This will allow speech users to make full use of programs that offer single-key shortcuts to keyboard users.
- Keyboard-only users who have dexterity challenges can also be prone to accidentally hitting keys. Those users would be able to avoid problematic single character shortcuts by turning them off or modifying them to include at least one non-character key.
- Allowing *all* shortcut keys to be remapped can help users with some cognitive disabilities, since the same shortcuts can be assigned to perform the same actions across different applications.

### Examples
##### Disable Shortcuts

				

A mechanism is provided to allow users to disable character-key shortcuts. The character key shortcuts are not the only way to carry out these commands. A speech user disables the shortcuts and can prevent words that are picked up by the microphone from triggering single-key shortcuts.

			

			

        

##### Alternate Control

        

Keyboard-only users are in a long issues thread. While reading the thread they accidentally hit the S key, which moves focus to the search bar at the top of the document. This causes them to lose their place and train of thought. However, a mechanism is provided to allow users to change character-key shortcuts. They change the shortcut to include another key so they can avoid future interruptions.

### Resources
Web apps that use character-key shortcuts and allow users to disable and/or change these shortcuts:

			

- Gmail
- WordPress

			

Videos of speech user trouble with single character key shortcuts:

			

- [Single character key shortcuts affecting speech input – example 1](https://www.youtube.com/watch?v=xzSyIA4OWYE)
- [Single character key shortcuts affecting speech input – example 2](https://www.youtube.com/watch?v=OPjfpDU9S08)

### Techniques

#### Sufficient Techniques

- G217

#### Failures

- F99


---

## 2.2.1 Timing Adjustable (A)

### In brief
**Goal**
: Users have adequate time to complete tasks.

**What to do**
: Let users turn off, adjust, or extend time limits.

**Why it's important**
: People with disabilities may need more time to complete activities.

### Intent
The intent of this success criterion is to ensure that users with disabilities are
         given adequate time to interact with web content whenever possible. People with disabilities
         such as blindness, low vision, dexterity impairments, and cognitive limitations may
         require more time to read content or to perform functions such as filling out on-line
         forms. If web functions are time-dependent, it will be difficult for some users to
         perform the required action before a time limit occurs. This may render the service
         inaccessible to them. Designing functions that are not time-dependent will help people
         with disabilities succeed at completing these functions. Providing options to disable
         time limits, customize the length of time limits, or request more time before a time
         limit occurs helps those users who require more time than expected to successfully
         complete tasks. These options are listed in the order that will be most helpful for
         the user. Disabling time limits is better than customizing the length of time limits,
         which is better than requesting more time before a time limit occurs.

      

Any process that happens without user initiation after a set time or on a periodic
         basis is a time limit. This includes partial or full updates of content (for example,
         page refresh), changes to content, or the expiration of a window of opportunity for
         a user to react to a request for input.

      

It also includes content that is advancing or updating at a rate beyond the user's ability to read and/or understand it. In other words, animated, moving or scrolling content introduces a time limit on a users ability to read content.

      

This success criterion is generally not applicable when the content repeats or is synchronized with other content, so long as the information and data is adjustable or otherwise under the control of the end user.  Examples of time limits for which this success criterion is not applicable include scrolling text that repeats, captioning, and [carousels](https://www.w3.org/WAI/tutorials/carousels/).  These are situations which do include time limits, but the content is still available to the user because it has controls for accessing it, as specified in [2.2.2 Pause, Stop, Hide](pause-stop-hide).

      

In some cases, however, it is not possible to change the time limit (for example, for an auction or other real-time event) and exceptions are therefore provided for those cases.

      

Content that operates on a timer does not need to be time adjustable if there is an alternative that does not rely on a timer. For example, a web application such as an email client provides notification of new email arriving with a temporary message (such as a 'toast' message) in the lower right-hand side of the interface, and the message disappears after 5 seconds. Users are able to identify the arrival of email through other means, such as viewing the Inbox, so the disappearance of the message does not set a time limit on the their ability to determine if new mail has arrived. If the user has no other means of discovering the same information (or performing the same function), then each message would need to meet this success criterion in order to provide users with sufficient time to access the information.

      

##### Notes regarding time limits

      

- Timed server redirects can be found below under Common Failures.
- Non-timed server redirects (e.g., 3xx response codes) are not applicable because there
            is no time limit: they work instantly.
- This success criterion applies only to time limits that are set by the content itself.
            For example, if a time limit is included in order to address security concerns, it
            would be considered to have been set by the content because it  is designed to be
            part of the presentation and interaction experience for that content. Time limits
            set externally to content, such as by the user agent or by factors intrinsic to the
            Internet are not under the author's control and not subject to WCAG conformance requirements.
            Time limits set by web servers should be under the author's/organization's control
            and are covered. Success Criteria
            [2.2.3 No Timing](no-timing),
            [2.2.4 Interruptions](interruptions), and
            [2.2.5 Re-Authentication](re-authenticating) may also apply.
- Certain time limits implemented for security reasons, such as time-based / time-limited
            two-factor authentication tokens, can be considered *essential*, and may be
            exempt from this criterion. However, other criteria may apply, such as
            [3.3.7 Redundant Entry](redundant-entry),
            [3.3.8 Accessible Authentication (Minimum)](accessible-authentication-minimum), and
            [3.3.9 Accessible Authentication (Enhanced)](accessible-authentication-enhanced) may also apply.
- Ten times the default was chosen based on clinical experience and other guidelines.
            For example, if 15 seconds is allowed for a user to respond and hit a switch, 150
            seconds would be sufficient to allow almost all users to hit a switch even if they
            had trouble.
- 20 seconds was also based on clinical experience and other guidelines. 20 seconds
            to hit 'any switch' is sufficient for almost all users including those with reduced motion.
            Some would fail, but some would fail all lengths of time. A reasonable period for
            requesting more time is required since an arbitrarily long time can provide security
            risks to all users, including those with disabilities, for some applications. For
            example, with kiosks or terminals that are used for financial transactions, it is
            quite common for people to walk away without signing off. This leaves them vulnerable
            to those walking up behind them. Providing a long period of inactivity before asking,
            and then providing a long period for the person to indicate that they are present
            can leave terminals open for abuse. If there is no activity the system should ask
            if the user is there. It should then ask for an indication that a person is there
            ('hit any key') and then wait long enough for almost anyone to respond. For "hit any
            key," 20 seconds would meet this. If the person indicates that they are still present,
            the device should return the user to the exact condition that existed before it asked
            the question.
- 20 hours was chosen as an upper limit because it is longer than a full waking day.

      

In cases where timing is not an intrinsic requirement but giving users control over
         timed events would invalidate the outcome, a third party can control the time limits
         for the user (for example, granting double time on a test).

      

See also [2.2.3: No Timing](no-timing).

### Benefits
- People with physical disabilities often need more time to react, to type and to complete
            activities.  People with low vision need more time to locate things on screen and
            to read.   People who are blind and using screen readers may need more time to understand
            screen layouts, to find information and to operate controls.  People who have cognitive
            or language limitations need more time to read and to understand.  People who are
            deaf and communicate in sign language may need more time to read information printed
            in text (which may be a second language for some).
- In circumstances where a sign-language interpreter may be relating audio content to
            a user who is deaf, control over time limits is also important.
- People with reading disabilities, cognitive limitations, and learning disabilities
            who may need more time to read or comprehend information can have additional time
            to read the information by pausing the content.

### Examples
- A website uses a client side time limit to help protect users who may step away from
            their computer.   After a period of inactivity the web page asks if the user needs
            more time.  If it doesn't get a response – it times out.
- A web page has a field that automatically updates with the latest headlines in a rotating
            fashion. There is an interactive control that allows the user to extend the length
            of time between each update to as much as ten times the default. The control can be
            operated with either a mouse or a keyboard.
- A web page includes an animation which includes text that appears and disappears throughout.
            In some cases, the text is scrolling across the screen and in others, it is only displayed
            for a short time before it fades into the background. The page includes a pause button
            so that users who have trouble reading the text before it disappears can read it.
- In an auction, there is a time limit on the amount of time a user has to submit a
            bid. Since the time limit applies to all users who want to bid on a particular item,
            it would be unfair to extend the time limit for any one particular user. Therefore,
            a time limit is required for this type of activity and no extension, adjustment, or
            deactivation of the time limit is required by this success criterion.
- An on-line ticket-purchasing site gives the user two minutes to confirm a purchase
            before the seats are returned to the general pool. Because tickets on such sites can
            sell out quickly, holding a ticket longer than that may invalidate the nature of the
            site, so this is a case in which the timing is essential and cannot be extended without
            invalidating the activity. However, the site does move as much of the process out
            of the time-critical period as possible, for instance allowing users to provide necessary
            information like name, payment method, etc., before entering the time-critical stage.
- A ticket-purchasing site allows the user two minutes to confirm purchase of selected
            seats, but warns the user when their time is almost out and allows the user to extend
            this time limit some number of times with a simple action such as clicking a "Extend
            time limit" button.

### Techniques

#### Sufficient Techniques

- **Situation A: If there are session time limits:**
  - G133
  - G198
- **Situation B: If a time limit is controlled by a script on the page:**
  - G198
  - G180
  - {"and":["SCR16","SCR1"]}
- **Situation C: If there are time limits on reading:**
  - G4
  - G198
  - SCR33
  - SCR36

#### Failures

- F40
- F41
- F58


---

## 2.2.2 Pause, Stop, Hide (A)

### In brief
**Goal**
: Fewer users are distracted by content that updates or moves.

**What to do**
: Let users control content changes that occur in parallel with other content.

**Why it's important**
: Some people with cognitive disabilities and attention deficits are distracted by continuous movement.

### Intent
The intent of this success criterion is to avoid distracting users during their interaction
         with a web page.

      

In the context of this Success Criterion, "starts automatically" broadly refers to animations/updates
         that are not the direct result of a user's intentional activation, for example, selecting a link or button.

      

"Moving, blinking and scrolling" refers to content in which the visible content conveys
         a sense of motion. Common examples include motion pictures, synchronized media presentations,
         animations, real-time games, and scrolling stock tickers. "Auto-updating" refers to
         content that updates or disappears based on a preset time interval. Common time-based
         content includes automatically updated weather information, news, stock price
         updates, and auto-advancing presentations and messages. The requirements for moving,
         blinking and scrolling content and for auto-updating content are the same except that:

      

- authors have the option of providing the user with a means to control the frequency of updates when content is auto-updating and
- there is no five second exception for auto-updating since it makes little sense to auto-update for a few seconds and then stop

      

Content that moves or auto-updates can be a barrier to anyone who has trouble reading
         stationary text quickly as well as anyone who has trouble tracking moving objects.
         It can also cause problems for screen readers.

      

Moving content can also be a severe distraction for some people. Certain groups, particularly
         those with attention deficit disorders, find blinking content distracting, making
         it difficult for them to concentrate on other parts of the web page. Five seconds
         was chosen because it is long enough to get a user's attention, but not so long that
         a user cannot wait out the distraction if necessary to use the page.

      

Content that is paused can either resume in real-time or continue playing from the
         point in the presentation where the user left off.

      

- Pausing and resuming where the user left off is best for users who want to pause to
               read content and works best when the content is not associated with a real-time event
               or status.

            

> **Note:**
> >                
> 
> See [2.2.1: Timing Adjustable](timing-adjustable) for additional requirements related to time-limits for reading and interactions.
> 
> 
>
- Pausing and jumping to current display (when pause is released) is better for information
               that is real-time or "status" in nature. For example, weather radar, a stock ticker,
               a traffic camera, or an auction timer, would present misleading information if a pause
               caused it to display old information when the content was restarted.

            

> **Note:**
> >                
> 
> Hiding content would have the same result as pausing and jumping to current display (when pause is released).
> 
> 
>

      

For a mechanism to be considered "a mechanism for the user to pause," it must provide
         the user with a means to pause that does not tie up the user or the focus so that
         the page cannot be used.  The word "pause" here is meant in the sense of a "pause
         button" although other mechanisms than a button can be used.   Having an animation
         stop only so long as a user has focus on it (where it restarts as soon as the user
         moves the focus away) would not be considered a "mechanism for the user to pause"
         because it makes the page unusable in the process and would not meet this SC.

      

> **Note:**
> >          
> 
> This success criterion is specifically concerned with moving, blinking, scrolling, and
>             auto-updating visual content. For audio content that starts automatically, refer to [1.4.2 Audio Control](audio-control).
> 
> 
>          
> 
> Moving, blinking, scrolling content that starts automatically because of a general user interaction (such as focusing/hovering over an element,
>             or scrolling the page), rather than as a result of an intentional *activation* (such as activating a button),
>             and which doesn't provide provide a way to Pause, Stop, or Hide, will fail this Criterion, and potentially
>             [2.3.3 Animation from Interaction](animation-from-interaction).
> 
> 
>

      

It is important to note that the terms "blinking" and "flashing" can sometimes refer to the same content.

      

- "Blinking" refers to content that causes a distraction problem. Blinking can be allowed
            for a short time as long as it stops (or can be stopped)
- "Flashing" refers to content that can trigger a seizure (if it is more than 3 per
            second and large and bright enough). This cannot be allowed even for a second or it
            could cause a seizure. And turning the flash off is also not an option since the seizure
            could occur faster than most users could turn it off.
- Blinking usually does not occur at speeds of 3 per second or more, but it can. If
            blinking occurs faster than 3 per second, it would also be considered a flash.

      

> **Note:**
> >          
> 
> "Flashing" content that starts automatically will need to be evaluated against [2.3.2 Three Flashes](three-flashes)
>             and [2.3.1 Three Flashes or Below Threshold](three-flashes-or-below-threshold).
> 
> 
>

### Benefits
- Providing content that stops blinking after five seconds or providing a mechanism
            for users to stop blinking content allows people with certain disabilities to interact
            with the web page.
- One use of content that blinks is to draw the visitor's attention to that content.
            Although this is an effective technique for all users with vision, it can be a problem
            for some users if it persists. For certain groups, including people with low literacy,
            reading and intellectual disabilities, and people with attention deficit disorders,
            content that blinks may make it difficult or even impossible to interact with the
            rest of the web page.

### Examples
**An essential animation can be paused without affecting the activity**
: A website helps users understand 'how things work' through animations that demonstrate
               processes. Animations have "pause" and "restart" buttons.

**A stock ticker**
: A stock ticker has "pause" and "restart" buttons. Pausing the ticker causes it to
               pause on the currently displayed stock. Restarting causes the ticker to resume from
               the stopped point but with a notice that the display is delayed. Since the intent
               of the stock ticker is usually to provide realtime information, there might also be
               a button that would advance the ticker to the most recently traded stock.

**A game is designed so that users take turns rather than competing in real-time**
: One party can pause the game without invalidating the competitive aspect of it.

**A web advertisement**
: An advertisement blinks to get viewers attention but stops after 5 seconds

**A form prompt**
: A form blinks an arrow near the submit button if a user finishes filling out the form
               but does not activate the submit button. The blinking stops after 5 seconds.

**An animation**
: An animation runs in the upper portion of the page but has a "freeze animation" button
               near the bottom of the animation.

**A "loading" animation**
: A preloader animation is shown on a page which requires a certain percentage of a
               large file to be downloaded before playback can begin. The animation is the only content
               on the page and instructs the user to please wait while the video loads. Because the
               moving content is not presented in parallel with other content, no mechanism to pause,
               stop or hide it needs to be provided, even though the animation may run for more than
               5 seconds for users with slower connections.

**A full-page advertisement**
: A site requires that all users view a 15 second advertisement before they can access
               free content available from their site. Because viewing the advertisement is a requirement
               for all users and because it is not presented in parallel with other content, no mechanism
               to pause, stop or hide it needs to be provided.

### Techniques

#### Sufficient Techniques

- G4
- SCR33
- G11
- G152
- SCR22
- G186
- G191

#### Failures

- F16
- F112
- F50
- F7


---

## 2.3.1 Three Flashes or Below Threshold (A)

### In brief
**Goal**
: Content does not trigger seizures.

**What to do**
: Avoid content that flashes, or keep it under thresholds.

**Why it's important**
: Flashing content can cause migraines, dizziness, nausea, and seizures.

### Intent
The intent of this success criterion is to allow users to access the full content
         of a site without inducing seizures due to photosensitivity.

      
      

Individuals who have photosensitive seizure disorders can have a seizure triggered
         by content that flashes at certain frequencies for more than a few flashes. People
         are even more sensitive to red flashing than to other colors, so a special test is
         provided for saturated red flashing. These guidelines were originally based on guidelines for
         the broadcasting industry as adapted for desktop monitors, where content is viewed
         from a closer distance (using a larger angle of vision).

      
      

Flashing can be caused by the display, the computer rendering the image or by the
         content being rendered. The author has no control of the first two. They can be addressed
         by the design and speed of the display and computer. The intent of this criterion
         is to ensure that flicker that violates the flash thresholds is not caused by the
         content itself. For example, the content could contain a video clip or animated image
         of a series of strobe flashes, or close-ups of rapid-fire explosions.

      
      

This success criterion replaces a much more restrictive criterion in WCAG 1.0 that
         did not allow any flashing (even of a single pixel) within a broad frequency range
         (3 to 50 Hz). This success criterion is based on existing specifications in use in
         the UK and by others for television broadcast and has been adapted for computer display
         viewing. In WCAG 2.0, a 1024 x 768 screen was used as the reference screen resolution for the
         evaluation. The 341 x 256 pixel block represents a 10 degree viewport at a typical
         viewing distance. (The 10 degree field is taken from the original specifications and
         represents the central vision portion of the eye, where people are most susceptible
         to photo stimuli.)

      

With the proliferation of devices of varying screen sizes (from small handhelds to large living room displays), as well as the adoption of [CSS pixels]() as a density-independent unit of measurement, the prior assessment criteria may seem outdated. However, an image of a consistent size uses up relatively the same percentage of a user's visual field on any device. On a large screen, the image takes up less size, but the large screen takes up a larger part of the visual field. On a mobile screen, the image may take up most or all of the screen; however, the mobile screen itself takes up a smaller portion of the user's visual field. So the same dimension of the flashing content, represented in CSS pixels can still provide a consistent means of assessment. Substituting CSS pixels for the original pixel block means that the combined area of flashing becomes 341 x 256 CSS pixels, or a flashing area of 87,296 CSS pixels.

      

Content should be analyzed at the largest scale at which a user may view the content, and at the standard zoom level of the user agent. For example, with a video that may play in an area of a web page and also at full screen, the video should be analyzed for risks at full screen.

      

Where video content is provided in color spaces other than sRGB, the version provided with the highest dynamic range should be tested. In such cases the industry standard definition of a general flash is a change in luminance of 20 cd/m2 or more where the darker image is below 160 cd/m2. ([ITU-R BT.1702](https://www.itu.int/rec/R-REC-BT.1702/).) This is applicable for standard dynamic range (SDR) and high dynamic range (HDR) content. For HDR content when the darker state is 160 cd/m2 or more, a general flash is one where the Michelson contrast is 1/17 or greater — where the Michelson contrast is calculated as (LHigh - LLow) / (LHigh + LLow), and where LHigh and LLow are the luminance of the high and low luminance states, respectively.

      

For short clips that might be looped (such as GIF animations), the content should be analyzed while looping.

      

The specification cannot account for the actual viewing distance that a person chooses. Users that are closer to their screens than the idealized viewing distance will be affected by flashing areas that normatively pass. The same problem applies to users who rely on zoom or screen magnification. Conversely, users who are further away from the screen than the idealized distance should be able to tolerate flashing areas that are larger than the threshold.

      
      

The combined area of flashes occurring concurrently and contiguously means the total
         area that is actually flashing at the same time. It is calculated by adding up the
         contiguous area that is flashing simultaneously within any 10 degree angle of view.

      
      

> **Note:**
> >          
>          
> 
> The terms "blinking" and "flashing" can sometimes refer to the same content.
> 
> 
>          
>          
> 
> - "Blinking" refers to content that causes a distraction problem. Blinking can be allowed
>                for a short time as long as it stops (or can be stopped)
> - "Flashing" refers to content that can trigger a seizure (if it is more than 3 per
>                second and large and bright enough). This cannot be allowed even for a second or it
>                could cause a seizure. And turning the flash off is also not an option since the seizure
>                could occur faster than most users could turn it off.
> - Blinking usually does not occur at speeds of 3 per second or more, but it can. If
>                blinking occurs faster than 3 per second, it would also be considered a flash.
> 
> 
>          
>

      

> **Note:**
> >          
> 
> The new working definition in the field for **"pair of opposing transitions involving a saturated red"** is a pair of opposing transitions where, one transition is either to or from a state with a value R/(R + G + B) that is greater than or equal to 0.8, and the difference between states is more than 0.2 (unitless) in the CIE 1976 UCS chromaticity diagram. [ISO 9241-391]
> 
> 
>          
> 
> The chromaticity difference is calculated as:
> 
> 
>          
> 
> - `SQRT( (u'1 - u'2)^2 + (v'1 - v'2)^2 )`
> 
> 
>          
> 
> where u'1 and v'1 are chromaticity coordinates of State 1 and u'2 and v'2 are chromaticity coordinates of State 2. The 1976 UCS chromaticity coordinates of u' and v' are calculated as:
> 
> 
>          
> 
> - `u' = 4 * X / (X + 15 * Y + 3 * Z)`
> - `v' = 9 * Y / (X + 15 * Y + 3 * Z)`
> 
> 
>          
> 
> where X, Y, and Z are the tristimulus values of a color in the CIE XYZ colorspace, which can be calculated as:
> 
> 
>          
> 
> - `X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B`
> - `Y = 0.2126729 * R + 0.7151522 * G + 0.0721750 * B`
> - `Z = 0.0193339 * R + 0.1191920 * G + 0.9503041 * B`
> 
> 
>          
> 
> where R, G, & B are values that range from 0-1 as specified in “relative luminance” definition.
> 
> 
>

### Benefits
- Individuals who have seizures when viewing flashing material will be able to view
            all of the material on a site without having a seizure and without having to miss
            the full experience of the content by being limited to text alternatives. This includes
            people with photosensitive epilepsy as well as other photosensitive seizure disorders.

### Examples
- A website has video of muzzle flash of machine gun fire, but limits the size of the
            flashing image to a small portion of the screen below the flash threshold size.
- A movie with a scene involving very bright lightning flashes is edited so that the
            lightning only flashes three times in any one second period.

### Resources
- [Harding FPA Web Site](https://www.hardingfpa.com/)
- [Trace Center Photosensitive Epilepsy Analysis Tool (PEAT)](https://trace.umd.edu/peat/)
- [Information about Photosensitive Seizure Disorders](https://trace.umd.edu/information-about-photosensitive-seizure-disorders/)
- [Epilepsy Action](https://www.epilepsy.org.uk/)
- [Epilepsy Foundation - Photosensitivity and Seizures](http://www.epilepsy.com/learn/triggers-seizures/photosensitivity-and-seizures)

### Techniques

#### Sufficient Techniques

- G19
- G176
- G15


---

## 2.4.1 Bypass Blocks (A)

### In brief
**Goal**
: Users can more easily navigate by keyboard.

**What to do**
: Provide a means of skipping repeating content.

**Why it's important**
: Users reliant on the keyboard interface can move around pages efficiently.

### Intent
The intent of this success criterion is to allow people who navigate sequentially
         through content more direct access to the primary content of the web page. web pages
         and applications often have content that appears on other pages or screens. Examples
         of repeated blocks of content include but are not limited to navigation links, header
         content, and advertising frames. Small repeated sections such as individual words,
         phrases or single links are not considered blocks for the purposes of this provision.

      
      

Users who navigate sequentially through content will generally have to navigate through
         repeated content on each page. This is in contrast to a sighted user's ability to ignore
         the repeated material either by focusing on the center of the screen (where main content
         usually appears) or a mouse user's ability to select a link with a single mouse click
         rather than encountering every link or form control that comes before the item they want.

      
      

It is not the intent of this success criterion to require authors to provide methods
         that are redundant to functionality provided by the user agent. Most web browsers
         provide keyboard shortcuts to move the user focus to the top of the page, so if a
         set of navigation links is provided at the bottom of a web page providing a "skip"
         link may be unnecessary.

      
      

> **Note:**
> >          
>          
> 
> Although this success criterion deals with blocks of content that are repeated on
>             multiple pages, we also strongly promote structural markup on individual pages as
>             per Success Criteria 1.3.1.
> 
> 
>          
>

      
      

Although the success criterion does not specifically use the term “within a set of
         web pages”, the concept of the pages belonging to a set is implied.  An author would
         not be expected to avoid any possible duplication of content in any two pages that
         are not in some way related to each other, and are not "web pages that share a common
         purpose and that are created by the same author, group or organization” (the definition
         of set of web pages).

      
      

> **Note:**
> >          
>          
> 
> Even for web pages that are not in a set, if a web page has blocks of text that are
>             repeated within the page it may be helpful (but not required) to provide a means to
>             skip over them.
> 
> 
>          
>

### Benefits
When this success criterion is not satisfied, it may be difficult for people with
         some disabilities to reach the main content of a web page quickly and easily:

      

- Screen reader users who visit several pages on the same site can avoid having to hear
            all header content and dozens of navigation links on every page before the main
            content is spoken.
- People who use only the keyboard or a keyboard interface can reach content with fewer
            keystrokes. Otherwise, they might have to make dozens of keystrokes before reaching
            a link in the main content area. This can take a long time and may cause severe physical
            pain for some users.
- People who use screen magnifiers do not have to search through the same header content or
            other blocks of information to find where the main content begins each time they enter
            a new page.
- People with cognitive limitations as well as people who use screen readers may benefit
            when links are grouped into lists

### Examples
- A news organization's home page contains a main story in the middle of the page, surrounded
            by many blocks and sidebars for advertising, searching, and other services. There
            is a link at the top of the page that jumps to the main story. Without using this
            link, a keyboard user needs to tab through approximately 40 links to reach the main
            story; the screen reader user has to listen to 200 words; and the screen magnifier
            user must search around for the location of the main body.
- An e-commerce website includes a long list of filters prior to the search results listing. 
            A link above the list enables users to skip the filters and get to the product results quickly.

### Resources
- [WebAIM: Semantic Structure](http://webaim.org/techniques/semanticstructure/)
- [Heading Tags](http://accessibility.psu.edu/headingshtml/)

### Techniques

#### Sufficient Techniques

- **Creating links to skip blocks of repeated material**
- **Grouping blocks of repeated material in a way that can be skipped**

#### Advisory Techniques

- C6
- H97


---

## 2.4.2 Page Titled (A)

### In brief
**Goal**
: Each web page has a meaningful title.

**What to do**
: Provide a descriptive page title using appropriate technology.

**Why it's important**
: Page titles help users identify and distinguish different pages.

### Intent
The intent of this success criterion is to help users find content and orient themselves
         within it by ensuring that each web page has a descriptive title. Titles identify
         the current location without requiring users to read or interpret page content. When
         titles appear in site maps or lists of search results, users can more quickly identify
         the content they need. User agents make the title of the page easily available to
         the user for identifying the page. For instance, a user agent may display the page
         title in the  window title bar or as the name of the tab containing the page.

      
      

In cases where the page is a document or a web application, the name of the document
         or web application would be sufficient to describe the purpose of the page. Note that
         it is not required to use the name of the document or web application; other things
         may also describe the purpose or the topic of the page.

      

In cases such as Single Page Applications (SPAs), where various distinct pages/views are
         all nominally served from the same URI and the content of the page is changed dynamically,
         the title of the page should also be changed dynamically to reflect the content or topic of
         the current view.

      
      

[Success Criteria 2.4.4](link-purpose-in-context) and 
         [2.4.9](link-purpose-link-only) deal with the purpose of links, many of which are links to web pages. Here also,
         the name of a document or web application being linked to would be sufficient to describe
         the purpose of the link. Having the link and the title agree, or be very similar,
         is good practice and provides continuity between the link 'clicked on' and the web
         page that the user lands on.

### Benefits
- This criterion benefits all users in allowing users to quickly and easily identify
            whether the information contained in the web page is relevant to their needs.
- People with visual disabilities will benefit from being able to differentiate content
            when multiple web pages are open.
- People with cognitive disabilities, limited short-term memory and reading disabilities
            also benefit from the ability to identify content by its title.
- This criterion also benefits people with severe mobility impairments whose mode of
            operation relies on audio when navigating between web pages.

### Examples
**An HTML web page**
: The descriptive title of an HTML web page is marked up with the <title> element so
               that it will be displayed in the title bar of the user agent.

**A set of web pages**
: The title of the landing page is "ARIA Authoring Practices Guide | APG | WAI | W3C"

            

- The patterns list page has the title "Patterns | APG | WAI | W3C"
                

- Specific patterns are pages titled "X Pattern | APG | WAI | W3C" (e.g., "Alert and Message Dialogs Pattern | APG | WAI | W3C")
                    

- Specific examples for each pattern are pages titled "X Example | APG | WAI | W3C" (e.g., "Alert Dialog Example | APG | WAI | W3C")
- Practices page has the title "Practices | APG | WAI | W3C"
- Index page has the title "Index | APG | WAI | W3C"

**A web application**
: A banking application lets users inspect their bank accounts, view past statements,
               and perform transactions. The web application dynamically generates titles for each
               web page, e.g., "Bank XYZ, accounts for Alex Smith" "Bank XYZ, December 2005 statement
               for Account 1234-5678".

### Resources
- [<title>: The Document Title element: Usage notes (Accessibility)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title#accessibility).
- [Guidelines for Accessible and Usable Web Sites: Observing Users Who Work With Screen
               Readers (PDF)
            ](https://redish.net/wp-content/uploads/Theorfanos_Redish_InteractionsPaperAuthorsVer.pdf). Theofanos, M.F., and Redish, J. (2003).  Interactions, Volume X, Issue 6, November-December
            2003, pages 38-51, 
            [https://dl.acm.org/doi/10.1145/947226.947227](https://dl.acm.org/doi/10.1145/947226.947227)

### Techniques

#### Sufficient Techniques

- {"and":["G88","associating a title with a web page"],"using":["H25","PDF18"]}

#### Advisory Techniques

- G127

#### Failures

- F25


---

## 2.4.3 Focus Order (A)

### In brief
**Goal**
: Keyboard users navigate content in a correct order.

**What to do**
: Elements receive focus in an order that preserves meaning.

**Why it's important**
: Navigating a site or application with only the keyboard will make sense.

### Intent
The intent of this success criterion is to ensure that when users navigate sequentially
         through content, they encounter information in an order that is consistent with the
         meaning of the content and can be operated from the keyboard. This reduces confusion
         by letting users form a consistent mental model of the content. There may be different
         orders that reflect logical relationships in the content. For example, moving through
         components in a table one row at a time or one column at a time both reflect the logical
         relationships in the content. Either order may satisfy this success criterion.

      
      

The way that sequential navigation order is determined in web content is defined by
         the technology of the content. For example, simple HTML defines sequential navigation
         via the notion of tabbing order. Dynamic HTML may modify the navigation sequence using
         scripting along with the addition of a `tabindex` attribute to allow focus to additional
         elements. If no scripting or `tabindex` attributes are used, the navigation order is
         the order that components appear in the content stream. (See [Focus in the HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html#focus)).

      
      

An example of keyboard navigation that is not the sequential navigation addressed
         by this success criterion is using arrow key navigation to traverse a tree component.
         The user can use the up and down arrow keys to move from tree node to tree node. Pressing
         the right arrow key may expand a node, then using the down arrow key, will move into
         the newly expanded nodes. This navigation sequence follows the expected sequence for
         a tree control - as additional items get expanded or collapsed, they are added or
         removed from the navigation sequence.

      
      

The focus order may not be identical to the programmatically determined reading order
         (see [Success Criterion 1.3.2](meaningful-sequence.html)) as long as the user can still understand and operate
         the web page. Since there may be several possible logical reading orders for the content,
         the focus order may match any of them. However, when the order of a particular presentation
         differs from the programmatically determined reading order, users of one of these
         presentations may find it difficult to understand or operate the web page. Authors
         should carefully consider all these users as they design their web pages.

      
      

For example, a screen reader user interacts with the programmatically determined reading
         order, while a sighted keyboard user interacts with the visual presentation of the
         web page. Care should be taken so that the focus order makes sense to both of these
         sets of users and does not appear to either of them to jump around randomly.

      
      

Focus order needs to allow the user to navigate focusable elements in a logical order,
         and that order needs to preserve any meaning or operation that the page is conveying. 
         Focus order does not necessarily need to follow the visual layout of the web page,
         as long as the order in which elements receive focus is logical, and the hierarchy and relationship
         of content implied by the visual presentation is preserved. For instance, in a two-column
         layout, the assumption in western left-to-right systems may be that focus moves through the elements in the
         left-hand column first, from the top to the bottom of the column, and then proceed to the right-hand column.
         However, if the two columns are independent of each other, and meaning/operation are not affected, it is not
         a failure if elements in the right-hand column receive focus first, followed by the elements in the left-hand column.
         As a best practice, though, make sure the focus order reinforces the reading order implied by the visual layout.

      
      

> **Note:**
> >         
> 
> This requirement does not specify what should or should not receive focus, but rather assesses the order in which elements receive focus. This success criterion does not prohibit making non-operable content (e.g., static text) focusable, or programmatically moving focus to such content. However, it is a failure of Focus Order if items receive focus in an order that impedes the meaning or operation of content, or creates confusing or illogical focus orders — for example,
>          a control appearing to receive focus multiple times due to the use of nested focusable elements.
> 
> 
>          `<div tabindex="0"><button>...</button></div>`
>          
> 
> As a best practice, avoid having focusable elements which cannot be operated
>          or actioned, as these are likely to make operation tedious for keyboard users.
> 
> 
>

      
      

For clarity:

      
      

- Focusable components need to receive focus in an order that preserves meaning and
            operability.
- Focus order does not necessarily need to follow the visual presentation or layout.
- If there is more than one order that preserves meaning and operability, only one of
            them needs to be provided.
- Static/non-interactive elements can receive focus, as long as they don't
            impede operation of the content, or result in confusing or illogical focus order.

### Benefits
These techniques benefit keyboard users who navigate documents sequentially and expect
         the focus order to be consistent with the sequential reading order.

      
      

- People with mobility impairments who must rely on keyboard access for operating a
            page benefit from a logical, usable focus order.
- People with disabilities that make reading difficult can become disoriented when tabbing
            takes focus someplace unexpected. They benefit from a logical focus order.
- People with visual impairments can become disoriented when tabbing takes focus someplace
            unexpected or when they cannot easily find the content surrounding an interactive
            element.
- Only a small portion of the page may be visible to an individual using a screen magnifier
            at a high level of magnification. Such a user may interpret a field in the wrong context
            if the focus order is not logical.

### Examples
- On a web page that contains a tree of interactive controls, the user can use the up
            and down arrow keys to move from tree node to tree node. Pressing the right arrow
            key expands a node, then using the down arrow key moves into the newly expanded nodes.
- A web page implements modeless dialogs. When the trigger button is activated,
            a dialog opens. The interactive elements in the dialog are inserted in the focus order
            immediately after the button. When the dialog is open, the focus order goes from the
            button to the elements of the dialog, then to the interactive element following the
            button. When the dialog is closed, the focus order goes from the button to the following
            element.
- A web page implements modal dialogs. When the trigger button is activated,
            a dialog opens and focus is set within the dialog. As
            long as the dialog is open, all web page content outside the dialog becomes 
            inert and cannot receive focus (though, depending on implementation, the focus cycle
            might still include user agent controls). When the
            dialog is dismissed, focus returns to the button or the element following the button.
- An HTML web page is created with the left hand navigation occurring in the HTML after
               the main body content, and styled with CSS to appear on the left hand side of the
               page. This is done to allow focus to move to the main body content first without requiring
               `tabindex` attributes or JavaScript.

            
            

> **Note:**
> >                
>                
> 
> While this example passes the Success Criterion, it is not necessarily true that all
>                   CSS positioning would. More complex positioning examples may or may not preserve meaning
>                   and operability
> 
> 
>                
>
- The following example **fails to meet the Success Criterion**:

            
            

A company's website includes a form that collects marketing data and allows users
               to subscribe to several newsletters published by the company. The section of the form
               for collecting marketing data includes fields such as name, street address, city,
               state or province, and postal code. Another section of the form includes several checkboxes
               so that users can indicate newsletters they want to receive. However, the tab order
               for the form skips between fields in different sections of the form, so that focus
               moves from the name field to a checkbox, then to the street address, then to another
               checkbox.

### Techniques

#### Sufficient Techniques

- G59
- **Giving focus to elements in an order that follows sequences and relationships within the content**
- **Changing a web page dynamically**

#### Failures

- F44
- F85


---

## 2.4.4 Link Purpose (In Context) (A)

### In brief
**Goal**
: Users understand what each link will do.

**What to do**
: Provide descriptive names or context for all links.

**Why it's important**
: People with visual and cognitive disabilities can navigate more easily.

### Intent
The intent of this success criterion is to help users understand the purpose of each
         link so they can decide whether they want to follow the link. Whenever possible, provide
         link text that identifies the purpose of the link without needing additional context.
         Assistive technology has the ability to provide users with a list of links that are
         on the web page. Link text that is as meaningful as possible will aid users who want
         to choose from this list of links. Meaningful link text also helps those who wish
         to tab from link to link. Meaningful links help users choose which links to follow
         without requiring complicated strategies to understand the page.

      
      

The text of, or associated with, the link is intended to describe the purpose of the
         link. In cases where the link takes one to a document or a web application, the name
         of the document or web application would be sufficient to describe the purpose of
         the link (which is to take you to the document or web application). Note that it is
         not required to use the name of the document or web application; other things may
         also describe the purpose of the link.

      
      

[Success Criterion 2.4.2](page-titled) deals with the titles of pages. Here also, the name of a document or web application
         being presented on the page would be sufficient to describe the purpose of the page.
         Having the link and the title agree, or be very similar, is good practice and provides
         continuity between the link 'clicked on' and the web page that the user lands on.

      
      

In some situations, authors may want to provide part of the description of the link
         in logically related text that provides the context for the link. In this case the
         user should be able to identify the purpose of the link without moving focus from
         the link. In other words, they can arrive on a link and find out more about it without
         losing their place. This can be achieved by putting the description of the link in
         the same sentence, paragraph, list item, or table cell as the link, or in the table header cell for a link in a data table, because these are directly associated with the link itself. Alternatively, authors may choose to use an ARIA technique to associate additional
         text on the page with the link.

      
      

This context will be most usable if it precedes the link. (For instance, if you must
         use ambiguous link text, it is better to put it at the end of the sentence that describes
         its destination, rather than putting the ambiguous phrase at the beginning of the
         sentence.) If the description follows the link, there can be confusion and difficulty
         for screen reader users who are reading through the page in order (top to bottom).

      
      

It is a best practice for links with the same destination to have consistent text
         (and this is a requirement per 
         [Success Criterion 3.2.4](consistent-identification) for pages in a set). It is also a best practice for links with different purposes
         and destinations to have different link text.

      
     

A best practice for links to [conforming alternate versions]() is to ensure that the link text to the conforming alternate version indicates in link text that the page it leads to represents the more accessible version. This information may also be provided in text - the goal is to ensure that the end user knows what the purpose of the link is.

     
      

The success criterion includes an exception for links for which the purpose of the
         link cannot be determined from the information on the web page. In this situation,
         the person with the disability is not at a disadvantage; there is no additional context
         available to understand the link purpose. However, whatever amount of context is available
         on the web page that can be used to interpret the purpose of the link must be made
         available in the link text or programmatically associated with the link to satisfy
         the success criterion.

      
      

> **Note:**
> >          
>          
> 
> There may be situations where the purpose of the link is is supposed to be unknown
>             or obscured. For instance, a game may have links identified only as door #1, door
>             #2, and door #3. This link text would be sufficient because the purpose of the links
>             is to create suspense for all users.
> 
> 
>          
>

      
      

See also 
         [2.4.9: Link Purpose (Link Only)](link-purpose-link-only).

### Benefits
- This success criterion helps people with motion impairment by letting them skip links
            that they are not interested in, avoiding the keystrokes needed to visit the referenced
            content and then returning to the current content.
- People with cognitive limitations will not become disoriented by multiple means of
            navigation to and from content they are not interested in.
- People with visual disabilities will be able to determine the purpose of a link by
            exploring the link's context.

### Examples
**A link contains text that gives a description of the information at that URI**
: A page contains the sentence "There was much bloodshed during the Medieval period
               of history." Where "Medieval period of history" is a link.

**A link is preceded by a text description of the information at that URI**
: A page contains the sentence "Learn more about the Government of Ireland's Commission
               on Electronic Voting at Go Vote!" where "Go Vote!" is a link.

**Both an icon and text are included in the same link**
: An icon of a voting machine and the text "Government of Ireland's Commission of Electronic
               Voting" are combined to make a single link. The alt text for the icon is null, since
               the purpose of the link is already described by the text of the link next to the icon.

**A list of book titles**
: A list of books is available in three formats: HTML, PDF, and mp3 (a recording of
               a person reading the book). To avoid hearing the title of each book three times (once
               for each format), the first link for each book is the title of the book, the second
               link says "PDF" and the third says, "mp3."

**News article summaries**
: A web page contains a collection of news articles. The main page lists the first few
               sentences of each article, followed by a "Read more" link. A screen reader command
               to read the current paragraph provides the context to interpret the purpose of the
               link.

### Resources
- [Using Link Titles to Help Users Predict Where They Are Going](https://www.nngroup.com/articles/using-link-titles-to-help-users-predict-where-they-are-going/)
- [WebAIM Techniques for Hypertext Links](http://webaim.org/techniques/hypertext/)

### Techniques

#### Sufficient Techniques

- G91
- H30
- H24
- **Allowing the user to choose short or long link text**
- G53
- **Providing a supplemental description of the purpose of a link**
- **Identifying the purpose of a link using link text combined with programmatically determined link context**
- {"and":["G91","semantically indicating links"],"using":["PDF11","PDF13"]}

#### Advisory Techniques

- H2
- H80

#### Failures

- F63
- F89


---

## 2.4.5 Multiple Ways (AA)

### In brief
**Goal**
: Users can get to content in multiple ways.

**What to do**
: Provide at least two options for reaching the same content.

**Why it's important**
: Not everyone can navigate content in the same way.

### Intent
The intent of this success criterion is to make it possible for users to locate content
         in a manner that best meets their needs. Users may find one technique easier or more
         comprehensible to use than another.

      
      

Even small sites should provide users some means of orientation. For a three or four
         page site, with all pages linked from the home page, it may be sufficient simply to
         provide links from and to the home page where the links on the home page can also
         serve as a site map.

### Benefits
- Providing an opportunity to navigate sites in more than one manner can help people
            find information faster. Users with visual impairments may find it easier to navigate
            to the correct part of the site by using a search, rather than scrolling through a
            large navigation bar using a screen magnifier or screen reader. A person with cognitive
            disabilities may prefer a table of contents or site map that provides an overview
            of the site rather than reading and traversing through several web pages. Some users
            may prefer to explore the site in a sequential manner, moving from web page to web
            page in order to best understand the concepts and layout.
- Individuals with cognitive limitations may find it easier to use search features than
            to use a hierarchical navigation scheme that may be difficult to understand.

### Examples
**A search mechanism**
: A large food processing company provides a site containing recipes created using its
               products. The site provides a search mechanism to search for recipes using a particular
               ingredient. In addition, it provides a list box that lists several categories of foods.
               A user may type "soup" in to the search engine or may select "soup" from the list
               box to go to a page with a list of recipes made from the company's soup products.

**Links between web pages**
: A local hair salon has created a website to promote its services. The site contains
               only five web pages. There are links on each web page to sequentially move forward
               or backward through the web pages. In addition, each web page contains a list of links
               to reach each of the other web pages.

**Where content is a result of a process or task - Funds transfer confirmation**
: An on-line banking site allows fund transfer between accounts via the web. There is
               no other way to locate the confirmation of fund transfer until the account owner completes
               the transfer.

**Where content is a result of a process or task - Search engine results**
: A search engine provides the search results based on user input. There is no other
               way to locate the search results except to perform the search process itself.

### Techniques

#### Sufficient Techniques

- {"using":["G125","G64","G63","G161","G126","G185"],"usingConjunction":"Using","usingQuantity":"two or more"}

#### Advisory Techniques

- PDF2


---

## 2.4.6 Headings and Labels (AA)

### In brief
**Goal**
: A page's content is described in headings and labels

**What to do**
: Provide descriptive headings and labels

**Why it's important**
: People can orient themselves, especially those with cognitive or visual disabilities.

### Intent
The intent of this success criterion is to help users understand what information
         is contained in web pages and how that information is organized. When headings are
         clear and descriptive, users can find the information they seek more easily, and they
         can understand the relationships between different parts of the content more easily.
         Descriptive labels help users identify specific components within the content.

      
      

Labels and headings do not need to be lengthy. A word, or even a single character,
         may suffice if it provides an appropriate cue to finding and navigating content.

       

Labels of form controls are usually text-based. In some cases, images can serve as descriptive labels without additional text. In these cases, authors should ensure that the image and its use as a label (in context) are widely understood.

         

Note that the same image can be interpreted differently in different contexts. However, it can still be considered descriptive if its use is commonly understood in each context. For example, when accompanying a text field, a loupe or magnifying glass icon with text alternative of "Search" is commonly interpreted as indicating the field is for entering and submitting a search query.

        

Placed on or near another image, a loupe or magnifying glass icon is commonly interpreted as a means to view a magnified version of the image (for instance, acting as a mechanism to zoom into the image, or opening a full-sized image in a new window).

      
      

This success criterion requires that if headings or labels are provided, they be descriptive. This success criterion does not require headings or labels; labels for inputs are covered separately by [3.3.2 Labels or Instructions](labels-or-instructions).  This success criterion also
         does not require that content acting as a heading or label be correctly marked up or
         identified — that aspect is covered separately by
         [1.3.1: Info and Relationships](info-and-relationships). It is possible for content
         to pass this success criterion (providing descriptive content that acts as headings or labels) while failing
         Success Criterion 1.3.1 (if the headings or labels aren't correctly marked up/identified). Conversely,
         it is also possible for content to pass Success Criterion 1.3.1 (with headings or labels correctly
         marked up or identified), while failing this success criterion (if those headings or labels are inaccurate or insufficiently clear).

      

Further, in the case of labels, this success criterion does not take into consideration whether or not
         alternative methods of providing an accessible name for form controls and inputs have been
         used — that aspect is covered separately by [4.1.2: Name, Role and Value](name-role-value). It is possible
         for controls and inputs to have an appropriate accessible name (e.g. using `aria-label="…"`)
         and therefore pass Success Criterion 4.1.2, but to still fail this success criterion (if the label is inaccurate or insufficiently clear or descriptive).

      

This success criterion does not require the use of labels; however, it does require that if labels are present, they must be accurate and sufficiently clear or descriptive. Please see [3.3.2: Labels or Instructions](labels-or-instructions) for more information on the use of labels.

### Benefits
- Descriptive headings are especially helpful for users who have disabilities that make
            reading slow and for people with limited short-term memory. These people benefit when
            section titles make it possible to predict what each section contains.
- Form input controls with labels that clearly and accurately describe the content that is expected to be
            entered helps users know how to successfully complete the form.
- When headings and labels are also correctly marked up and identified in accordance with
            [1.3.1: Info and Relationships](info-and-relationships), this success criterion
            helps people who use screen readers by ensuring that labels and headings are clearer when
            presented in a different format — for example, in an automatically generated list of
            headings, a table of contents, or when jumping from heading to heading within a page.

### Examples
**A news site**
: The home page of a news site lists the headlines for the top stories of the hour.
               Under each heading are the first 35 words of the story and a link to the full article.
               Each headline gives a clear and accurate idea of the article's subject.

**A guide on how to write well**
: A guide on writing contains the following section titles: "How To Write Well",
               "Cut Out Useless Words", "Identify Unnecessary Words", and so on.
               The section headings are clear and concise and the structure of the information is
               accurately reflected in the structure of the headings.

**Consistent headings in different articles**
: A website contains papers from a conference. Submissions to the conference are required
               to have the following organization: "Summary", "Introduction", [other sections unique
               to this article], "Conclusion", "Author Biography", "Glossary", and "Bibliography".
               The title of each web page clearly identifies the article it contains, creating a useful balance
               between the uniqueness of the articles and the consistency of the section headings.

**A form asking for the name of the user**
: A form asks for the name of the user. It consists of two input fields to ask for the first
               and last name. The first field is labeled "First name", the second is labeled "Last name".

**A search field labeled by a magnifying glass icon**
: A search text input is followed by a button containing a magnifying glass icon that activates the search function. 
               The icon has the string "search" as programmatically determinable label.

### Resources
- [How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/) A study showing that most users scan web pages rather than reading them word by word.
- [Applying Writing Guidelines to Web Pages](https://www.nngroup.com/articles/applying-writing-guidelines-web-pages/) A report on the effects of making websites concise, easy to scan, and objective.

### Techniques

#### Sufficient Techniques

- G130
- G131


---

## 2.4.7 Focus Visible (AA)

### In brief
**Goal**
: Users know which element has keyboard focus.

**What to do**
: Ensure each item receiving focus has a visible indicator.

**Why it's important**
: Without a focus indicator, sighted keyboard users cannot operate the page.

### Intent
The purpose of this success criterion is to help a person know which element has the
         keyboard focus.

      
      

“Mode of operation” accounts for user agents which may not always show a focus indicator, or only show the focus indicator when the keyboard is used. User agents may optimize when the focus indicator is shown, such as only showing it when a keyboard is used. Authors are responsible for providing at least one mode of operation where the focus is visible. In most cases there is only one mode of operation so this success criterion applies. The focus indicator must not be time limited, when the keyboard focus is shown it must remain.

      

> **Note:**
> >          
> 
> There may be situations where mouse/pointer users could also benefit from having a visible focus indicator, even though they did not set focus to an element using the keyboard. As a best practice, consider still providing an explicit focus indicator for these cases.
> 
> 
>

      
   	

Note that a keyboard focus indicator can take different forms. While Focus Visible does not specify what that form is, [2.4.13 Focus Appearance (Level AAA)](focus-appearance) provides guidance on creating a consistent, visible indicator.

### Benefits
- This success criterion helps anyone who relies on the keyboard to operate the page,
            by letting them visually determine the component on which keyboard operations will
            interact at any point in time.
- People with attention limitations, short term memory limitations, or limitations in
            executive processes benefit by being able to discover where the focus is located.

### Examples
- When text fields receive focus, a vertical bar is displayed in the field, indicating
            that the user can insert text, OR all of the text is highlighted, indicating that
            the user can type over the text.
- When a user interface control receives focus, a visible border is displayed around
            it.

### Resources
- [Styling form controls with CSS, revisited](http://www.456bereastreet.com/archive/200701/styling_form_controls_with_css_revisited/)

### Techniques

#### Sufficient Techniques

- G149
- C15
- G165
- G195
- C40
- C45
- SCR31

#### Failures

- F55
- F78


---

## 2.4.11 Focus Not Obscured (Minimum) (AA)

### In brief
**Goal**
: Keep the focused item visible.

**What to do**
: Ensure when an item gets keyboard focus, it is at least partially visible.

**Why it's important**
: People who can't use a mouse need to see what has keyboard focus.

### Intent
The intent of this success criterion is to ensure that the item receiving keyboard focus is always partially visible in the user's viewport. For sighted people who rely on a keyboard (or on a device that operates through the keyboard interface, such as a switch or voice input), knowing the current point of focus is critical. The component with focus signals the interaction point on the page. Where users cannot see the item with focus, they may not know how to proceed, or may even think the system has become unresponsive.

      

In recognition of the complex responsive designs common today, this AA criterion allows for the component receiving focus to be *partially* obscured by other author-created content. A partly obscured component can still be very visible, although the more of it that is obscured, the less easy it is to see. For that reason, authors should attempt to design interactions to reduce the degree and frequency with which the item receiving focus is partly obscured. For best visibility, *none* of the component receiving focus should be obscured. This preferred outcome is covered by the AAA criterion [Focus Not Obscured (Enhanced)](focus-not-obscured-enhanced.html).

      

Typical types of content that can overlap focused items are sticky footers, sticky headers, and non-modal dialogs. As a user tabs through the page, these layers of content can obscure the item receiving focus, along with its focus indicator.

      

A notification implemented as sticky content, such as a cookie banner, will fail this success criterion if it entirely obscures a component receiving focus. Ways of passing include making the banner modal so the user has to dismiss the banner before navigating through the page, or using [scroll padding](https://www.w3.org/TR/css-scroll-snap/#propdef-scroll-padding) so the banner does not overlap other content. Notifications that do not require user action could also meet this criterion by closing on loss of focus.

      

Another form of obscuring can occur where light boxes or other semi-opaque effects overlap the item with focus. While less than 100 percent opacity is not causing the component to be "entirely obscured", such semi-opaque overlaps may cause a failure of [1.4.11 Non-text Contrast](../understanding/non-text-contrast.html). When a focus indicator can be covered by a semi-opaque component, the ability of the focus indicator to pass 1.4.11 should be evaluated (and pass) while the focus indicator is under the semi-opaque component. The intention in both situations is that the component receiving focus should never be obscured to the point a user cannot tell which item has focus.

      

This criterion evaluates the focused *component*, rather than the focus *indicator*. The component itself does not include the focus indicator when checking that "the component is not entirely hidden" - unless the focus indicator is inside the component, or focus is indicated by a change to the component itself. Although users benefit from both the component and the focus indicator (if external to the component) not being obscured when tracking the focus, for the purposes of this criterion only checking the component provides a clearer metric. However, if the focus indicator is fully obscured, it would likely fail [2.4.7 Focus Visible](focus-visible).

      

         

##### User-movable content

         

This SC contains a note regarding content that can be repositioned. If users can move content regions, then they can potentially position the movable content such that it obscures other content that may receive focus. In such a case, the author is only responsible for ensuring that the movable content *in its initial position* does not obscure the item receiving focus.

         

This note is intended to accommodate a common interaction in complex applications such as authoring tools, where the main editing region (also called a canvas) can be enhanced by displaying toolbars or other panels, which can be repositioned around the canvas. It is possible to design such toolbars so they do *not* obscure focus. Authors are encouraged to do so, as well as pursue techniques which ensure equitable keyboard use of such toolbars. However, in recognition of the complexities involved in responsive design as well as in supporting the ability to transform the text size and spacing of content, only the starting position of such movable panels is assessed.

         
      

      

         

##### User-opened content

         

This SC contains a note regarding content that is opened or disclosed by the user. One example of such content is a menu button opened by a user that opens a list of choices over pre-existing content on the screen. Such content can obscure other information on the screen, but it does not obscure an item receiving keyboard focus, because the new content doesn't stay open through a change of focus. However, authors may create user-opened content that is intentionally designed to persist until closed by the user, such as a chat window. Such persistent content has the potential to fail Focus Not Obscured (Minimum). Various types are described in this section. All can be designed so that they pass this success criterion.

         

This section only applies to content that the user actively discloses. Content pre-positioned by the author (such as a sticky footer), or content that appears without direct user initiation, such as system warnings, must not prevent the item receiving focus from being immediately visible in the viewport. Also, this note is not intended to apply to disclosures that are by convention non-persistent. As discussed in the following sub-section, an open dropdown that does not close when no longer focused is not following this convention.

         

            

###### Non-persistent opened information

            

A number of components on the web open (or disclose) additional content (on activation or on focus) intended for immediate user interaction or information. This new content is often on top of other content, obscuring it. Examples of such components are menu items, select element items, combobox lists (and other dropdown items), date picker calendars, and tooltips. The common trait of all these components is that they are not expected to persist after being acted on or once they are no longer the primary point of user interaction. Such non-persistent disclosures do not fail this SC since they do not obscure the item with focus. However, if an author allows such components to **persist** after the user has 1) activated one of the opened items or 2) moved the focus away from the triggering item and the additional content, it is at risk of failing this criterion by obscuring the item with focus.

            
         

         

            

###### User openable, persistent disclosures

            

Some disclosure patterns provide a mechanism for the user to open additional content that remains open until intentionally closed by the user. Accordions are a simple example of such a pattern. Chatbots and expandable side navigation are more complex examples. All of these patterns can be implemented so they are not at risk of failing this SC. Some possible approaches are:

            

- **When the additional content appears, it displaces existing content.** An accordion is an example of this. When an accordion is opened, the disclosed content shifts existing content further down the page. Since the new content does not obscure existing content, it cannot obscure the item with focus.
- **When the additional content appears, existing content reflows.** The popout sidebar on the [WCAG standard](https://www.w3.org/TR/WCAG22/) is an example of this pattern. When the side menu is activated, it opens a new section of information along the left side of the page. The main content area is reduced horizontally to accommodate the new content, and the existing content reflows to fit in the thinner space. As a result, there is no overlapping content between the two sections; the item receiving focus, whether in the left navigation or in the main content, will not be obscured by the other section.
- **When the additional content is opened, it takes focus and the tab ring is constrained to the new content until it is dismissed.** This modality is somewhat like a dialog, in that a user cannot navigate beyond the opened content by keyboard without dismissing it first (typically by pressing Esc). However, unlike in a modal dialog, in some implementations a pointer user may be able to interact with content outside the opened section without dismissing it. Since this pattern potentially creates an inequitable experience between keyboard and pointer users, it should be used cautiously. That said, it does prevent the opened content from obscuring the keyboard focus in the main content, and thus should pass this SC. This is described and demonstrated in a short video in the Knowbility article in the reference section, under the section heading [Keep keyboard focus in the slide-out navigation until it's closed](https://knowbility.org/blog/2020/accessible-slide-menus#keep-keyboard-focus-in-the-slide-out-navigation-until-its-closed).
- **The disclosure expands into an area of the page containing no other content.** Many pages are designed with wide margins, providing significant white space into which new content can be opened. Many chatbots and toast notifications are designed to 'slide up' into the right unpopulated side of a page. Where authors are careful to ensure content is not obscured at each breakpoint in a responsive design, no obscuring of other operable content need occur.
- **When focus leaves the additional content, the additional content is automatically hidden or collapsed, or the content can be hidden or collapsed by use of a dedicated keyboard command (for example, the Escape key**.) This is very similar to patterns discussed previously under Non-persistent opened information. A distinguishing factor can be that the user's last point of interaction in the disclosure is preserved (it persists) even though it may be hidden until a user returns. Some trees and side navigation patterns behave this way.

            

In recognition of more complex interfaces and user needs there is a note: Content opened by the user may obscure the component receiving focus. If the user can bring the item with focus into view using a method without having to navigate back to the user-opened content to dismiss it, this criterion would be passed. For example, keyboard actions that may allow the item with focus to be revealed include:

            

- using the Escape key to dismiss the obscuring content;
- using keys to scroll the content in the viewport to reveal the item with focus;
- issuing a key to move between overlays.

   
            

For example:

   
            

- A user opens a chat interface, which is a popover non-modal dialog. This results in some content of the underlying page being fully obscured. The user navigates away from the chat interface by use of the tab key, focusing onto a link that has been fully obscured by the dialog. The user presses the Escape key to close the chat interface, which un-obscures the link.
- A user expands a fixed-position page feedback component at the bottom of a web page. They then use their keyboard to navigate to a link that's fully obscured by the expanded component and press the down arrow or space key on their keyboard to scroll the content on the page, un-obscuring the link.
- A user opens a web-based multi-user authoring application. An overlay appears displaying a list of people who have contributed to the document. The user tabs through the list of contributors and activates one of them. The application displays a new overlay, which obscures the first one, that displays that person's recent contributions. The user presses the F6 key to toggle the stacking order of the two overlays.

         

      

      

         

##### Modal dialogs

         

A properly constructed modal dialog will always pass this SC. Even if it appears directly on top of an item with focus, the dialog takes focus on appearance, and thus the item receiving focus -- the dialog or one of its components -- is visible. A properly constructed modal maintains that focus and prevents interaction outside the modal until it is dismissed.

         

A dialog-like overlay that does not take focus on appearance and does not either constrain interaction to the overlay or dismiss itself on loss of focus (thus allowing focus to exit into the content behind it) will be at risk of failing this SC, where it is positioned such that it can obscure other focusable items.

### Benefits
- Sighted users who rely on a keyboard interface to operate the page will be able to see the component which gets keyboard focus. Such users include those who rely on a keyboard or on devices which use the keyboard interface, including speech input, sip-and-puff software, onscreen keyboards, scanning software, and a variety of assistive technologies and alternate keyboards.
- People with limited or low vision, who may primarily user a pointer for screen orientation and repositioning, nonetheless benefit from a visible indication of the current point of keyboard interaction, especially where magnification reduces the overall viewing portion of the screen.
- People with attention limitations, short term memory limitations, or limitations in executive processes benefit by being able to discover where the focus is located.

### Examples
- A page has a sticky footer (attached to the bottom of the viewport). When tabbing down the page the focused item is not completely visually obscured by the footer because content in the viewport scrolls up to always display the item with keyboard focus using [scroll padding](https://www.w3.org/TR/css-scroll-snap/#propdef-scroll-padding).
- A page has a full-width cookie approval dialog. The dialog is modal, preventing access to the other controls in the page until it has been dismissed. Focus is not obscured because the major portion of the cookie approval dialog remains on screen (until selections are made and submitted),  and so the major portion of the keyboard focus indicator remains visible.
- A notification is implemented as a sticky header and the keyboard focus is moved to the notification so at least part of the focus indicator is in view. The notification disappears when it loses focus so it does not obscure any other controls, and part of the prior keyboard focus indicator is visible.

### Resources
- [Let's Focus on Slide-Out Navigation ](https://knowbility.org/blog/2020/accessible-slide-menus)

### Techniques

#### Sufficient Techniques

- C43

#### Failures

- F110


---

## 2.5.1 Pointer Gestures (A)

### In brief
**Goal**
: Let users operate touchscreens with one finger and reduced gestures.

**What to do**
: Provide single-point operation for all functions.

**Why it's important**
: Not everyone can perform complex and multi-touch gestures.

### Intent
The intent of this success criterion is to ensure that content can be controlled with a range of pointing devices, abilities, and assistive technologies. Some people  cannot perform gestures in a precise manner, or they may use a specialized or adapted input device such as a head pointer, eye-gaze system, or speech-controlled mouse emulator. Some pointing methods lack the capability or accuracy to perform multipoint or path-based gestures.

			

A **path-based gesture** involves an interaction where not just the endpoints matter, but how the pointer moves between these points.

			

Swiping is an example of a **path-based gesture**, which is only recognized when the user moves in a (mostly) straight line from the start point to the end point.

			
				
				A **path-based gesture** where pointer movement is only allowed in a straight line from the start-point to the end-point. If the user strays from the straight directional path, the gesture is not recognized, has no effect, or is aborted.
			

			

If going through an intermediate point (usually near the start of the gesture) affects its meaning, then it is a **path-based gesture**. The user engages a pointer (starting point), carries out a movement that goes through at least one intermediate-point before disengaging the pointer (end point). The intermediate point defines the gesture as requiring a specific path, even if the complete path is not defined.

			
				
				A **path-based gesture** involves starting a pointer movement that goes through at least one intermediate point before the end-point. The end-point may be a continuation, or allow for various movements.
			

			

Examples of path-based gestures include swiping, sliders and carousels dependent on the direction of interaction, and other gestures which trace a prescribed path such as drawing a specific shape. Such paths may be drawn with a finger or stylus on a touchscreen, graphics tablet, or trackpad, or with a mouse, joystick, or similar pointer device.

     

##### The difference between Pointer Gestures and Dragging

      

Dragging is a movement where the user picks up an object with a pointer (such as mouse cursor or a finger) and moves it to some other position. This movement from start point to end point does not require the user to follow any particular path or direction. Dragging is therefore not path-based. In contrast, a path-based pointer gesture requires the traversal of an intermediate point, which is a technical way of expressing that the directionality and possibly speed of the gesture communicates a particular command to the system.
       Dragging motions are covered in [Success Criterion 2.5.7: Dragging Movements](dragging-movements).

			
				
				A **free-form gesture** does **not** require any particular path before the end-point, only the start and (optionally) the end point matter. This is **not path-based**
			

      

##### Challenges for people with disabilities

			

Any movement of a pointer could be difficult or impossible to use for someone who cannot perform precise movements, therefore alternative forms of interaction are always recommended. This success criterion is scoped to *path-based gestures* as it may be difficult or impossible to provide an alternative for *free-form gestures*.

			

Examples of **multipoint** gestures include a two-finger pinch zoom, a split tap where one finger rests on the screen and a second finger taps, or a two- or three-finger tap or swipe. Users may find it difficult or impossible to accomplish these if they type and point with a single finger or stick.

			

Authors must ensure that their content can be operated without multipoint or path-based gestures. Multipoint or path-based gestures can be used so long as the functionality can also be operated by another method, such as a tap, click, double tap, double click, long press, or click & hold.

			

This success criterion applies to gestures in the author-provided content, not gestures defined by the operating system, user agent, or assistive technology. Examples of operating system gestures would be swiping down to see system notifications and gestures for built-in assistive technologies (AT). Examples of user agent-implemented gestures would be horizontal swiping implemented by browsers for navigating within the page history, or vertical swiping to scroll page content.

			

There are times when a component requires a path-based gesture for touch screen devices but not with a mouse. Taking an example of a generic slider:

			

- **Using a mouse:** If the user clicks on the thumb control of the slider and moves vertically, the slider will respond by moving to the right or left, even if the movement is mostly upwards. There will be no page scrolling as a result of the vertical movement as long as they drag with focus on the slider. Therefore, the slider does not require a path-based gesture with mouse pointer.
- **Using a touch-screen:** If the user puts their finger on the thumb control of the slider and moves upwards more than sideways, the slider may not respond because the browser takes control of the swipe and interprets it as a scroll, and will move the page up and down. Moving left or right on the slider thumb engages the slider and then the user can vary their vertical movement. This implementation has the 3-point requirement to work with a finger on a touch screen device so is a path-based gesture.

			

As touch screen devices can apply default gestures it is important to test with them if you are unsure whether a particular component does require a path-based gesture.

			

Browsers on a touch screen device generally provide some default gestures that impact whether a path-based gesture is needed. For example, a web browser on a touch-screen devices might detect a vertical gesture and scroll the page. If a user places their finger on a slider thumb and moves up (to scroll down) that might not activate the slider (depending on implementation). If the user moves horizontally first then the slider could capture that gesture and ignore vertical movement, resulting in a path-based gesture. If you include touch-screen devices as accessibility supported then these types of interaction need testing with a touch screen as using a mouse in a similar way would not trigger the same browser behavior.

			

This success criterion does not require all functionality to be available through pointing devices, but if it is available to pointer devices then it should not require path-based gestures. While content authors generally need to provide keyboard commands or other non-pointer mechanisms that perform actions equivalent to complex gestures (see Success Criterion 2.1.1 Keyboard), this is not sufficient to conform to this success criterion. That is because some users rely entirely on pointing devices, or find simple pointer inputs much easier to perform and understand than alternatives. For example, a user relying on a head-pointer would find clicking a control to be much more convenient than activating an on-screen keyboard to emulate a keyboard shortcut, and a person who has difficulty memorizing a series of keys (or gestures) may find it much easier to simply click on a labeled control. Therefore, if one or more pointer-based mechanisms are supported, then their benefits should be afforded to users through simple, single-point actions alone.

			

Single pointer operations include taps and clicks, double-taps and double-clicks, long presses, swiping, dragging, and path-based gestures. Gestures such as "pinch to zoom" or two-finger swipes are *multipoint* gestures, as they require two or more pointer inputs - in this case, two fingers on a touchscreen.

			

An exception is made for functionality that is inherently and necessarily based on complex paths or multipoint gestures. For example, entering your signature may be inherently path-based (although acknowledging something or confirming your identity need not be).

			

This success criterion *does not apply* to gestures that involve dragging in any direction because only the start and end points matter in a dragging operation. However, such gestures do require fine motor control. Authors are encouraged to provide non-dragging methods, for instance, a drag and drop operation could also be achieved by selecting an item (with a tap or keyboard interaction) and then selecting its destination as a second step.

### Benefits
- Users who cannot (accurately) perform path-based pointer gestures - on a touchscreen, or with a mouse - will have alternative means for operating the content.
- Users who cannot perform multi-pointer gestures on a touchscreen (for instance, because they are operating the touchscreen with an alternative input such as a head pointer) will have a single-pointer alternative for operating the content.
- Users who may not understand the custom gesture interaction intended by the author will be able to rely on simple, frequently used gestures to interact. This can be especially beneficial for users with cognitive or learning disabilities.

### Examples
- A website includes a map view that supports the pinch gesture to zoom into the map content. User interface controls offer the operation using plus and minus buttons to zoom in and out.
- A website includes a map view that supports the pinch gesture to zoom into the map content. As an single-pointer alternative, the map also allows users to double-tap, hold, and then move the pointer up or down to zoom in or out.
- A news site has a horizontal content slider with hidden news teasers that can moved into the viewport via a fast horizontal swipe/flicking motion. It also offers forward and backward arrow buttons for single-point activation to navigate to adjacent slider content.
- A kanban widget with several vertical areas representing states in a defined process allows the user to right- or left-swipe elements to move them to an adjacent silo. The user can also accomplish this by selecting the element with a single tap or click, and then activating an arrow button to move the selected element.
- A custom slider requires movement in a strict left/right direction when operated by dragging the thumb control. Buttons on both sides of the slider increment and decrement the selected value and update the thumb position.

### Techniques

#### Sufficient Techniques

- G215
- G216

#### Failures

- F105


---

## 2.5.2 Pointer Cancellation (A)

### In brief
**Goal**
: Reduce accidental activation of controls by mouse or touch.

**What to do**
: Make pointer cancellation predictable and consistent.

**Why it's important**
: Make it easier for anyone to recover from something they didn’t mean to do.

### Intent
The intent of this success criterion is to make it easier for users to prevent accidental or erroneous pointer input. People with various disabilities can inadvertently initiate touch or mouse events with unwanted results. Each of the following subsections roughly aligns with the bullets of this Success Criterion, and outlines a means of allowing users to cancel pointer operations.

			

			

##### Up-Event activation or completion

			

The most accessible way to incorporate pointer cancellation is to make activation occur on the up-event.

      
        

Up-event activation refers to the activation of a target when the pointer is released. In a touchscreen interaction, when the finger touches a target, the up-event activation only occurs when the finger is lifted while still being within the target boundary. Similarly in mouse interaction, the up-event occurs when the mouse button is released while the cursor is still within the boundary of the initial target set when the mouse button was pressed.

      

Authors can reduce the problem of users inadvertently triggering an action by using generic platform activation/click events that activate functionality on the up-event. For example, the `click` event in JavaScript triggers on release of the primary mouse button, and is an example of an implicit up-event. Despite its name, the `click` event is device-independent and also works for touch and keyboard interaction.

         

The preference for up-events is implicit in the success criterion wording of the first bullet: "The down-event of the pointer is not used to execute any part of the function." Authors meet the first bullet by using only the up-event.

 
			

			

      

##### Up-Event Abort or Undo

       

Where the interaction is equivalent to a simple "click", up-event activation has a built-in ability to cancel. There is a distinction between when someone touches a screen and when they remove their finger. Similarly, in mouse interaction, there is a difference between pressing and releasing the mouse button. When activation occurs only as the pointer is released, users have the opportunity to Abort (cancel) the activation. Users who have difficulty accurately using a mouse or touchscreen benefit greatly from this basic behavior. They normally receive visual feedback when an item is pressed. If they discover they have selected the wrong item, they can cancel the action by moving their pointer or finger away from the target before releasing.

			
      

For more complex interactions, such as drag and drop, the down- and up-events may initiate and end a series of actions to complete a process. For example, with drag and drop, the item may be:

  

1. selected with a press (down-event),
2. moved to a new location, while still being depressed, and
3. released (up-event) to conclude the drop action.

In such a complex action, the need for an Abort or Undo function increases. Designers may elect to confirm the move through something like a confirmation dialog or an undo button, giving the user the ability to Undo the process just completed. Alternatively, the ability to Abort the action can be achieved if, before completing step 3, the user returns the selected item to its original location and concludes the process there. If other parts of the screen disallow a move, the user can conclude the drag and drop there, effectively nullifying the operation.

 
			

			

##### Up Reversal

In other interactions, the down-event may trigger a behavior which can be reversed when the up-event concludes. Examples of this include press-and-hold actions such as where a transient popup appears (or a video plays) when the user presses on an object (down-event), but the popup (or video) disappears as soon as the user releases the pointer (up-event). Since the up-event reverses the preceding down event, the user is returned to their prior point, and has effectively cancelled the operation.

			

			

##### Down-Event

Completing the function on the down-event is only permitted when it is essential that the up-event not be used.

The most prevalent essential down-event activation occurs in keyboard emulation. On a physical keyboard, keys by default activate on the down-event -- a letter appears when the key is pressed. If a software keyboard emulator tried to override this expected behavior by making letters appear when the key is released, the behavior would be unexpected and would adversely affect expected interaction.

Note that a keyboard has a built-in Backspace or Delete button, which effectively provides an Undo option. Undo is not a requirement of the down-event Essential exception; however, providing an easy way for users to undo any action is a recommended practice (and may be a functional necessity), even where it is not a requirement of this success criterion.

			

Other examples where the timing of an activation is essential and requires the down-event would be:

			

- An activity that emulates a physical on-press trigger, such as when playing an on-screen piano keyboard. Activation on the up-event would significantly alter the desired behavior.
- A program for shooting skeets where waiting for the "up" event would invalidate the precise timing necessary for the activation.

### Benefits
- Makes it easier for all users to recover from hitting the wrong target.
- Helps people with visual disabilities, cognitive limitations, and motor impairments by reducing the chance that a control will be accidentally activated or an action will occur unexpectedly, and also ensures that where complex controls are activated, a means of Undoing or Aborting the action is available.
- Individuals who are unable to detect changes of context are less likely to become disoriented while navigating a site.

### Examples
- For interface elements that have a single tap or long press as input, the corresponding event is triggered when the finger is lifted inside that element.
- A drag-and-drop interface allows users to sort vertically stacked cards by picking up one card with the pointer (down-event), move it to a new position, and insert it at the new location when the pointer is released (up-event). Releasing the pointer outside the drop target area reverts the action, i.e., it moves the card back to the old position before the interaction started.

### Techniques

#### Sufficient Techniques

- G210
- G212
- Touch events are only triggered when touch is removed from a control (Potential future technique)

#### Failures

- F101


---

## 2.5.3 Label in Name (A)

### In brief
**Goal**
: The visual label for controls is a trigger for speech activation.

**What to do**
: Where practical, make the control’s text label and name match.

**Why it's important**
: People who operate with voice interaction use the visible labels in their commands.

### Intent
The intent of this success criterion is to ensure that the words which visually label a component are also the words associated with the component programmatically. This helps ensure that people with disabilities can rely on visible labels as a means to interact with the components.

			

Most controls are accompanied by a visible text **label**. Those same controls have a programmatic **name**, also known as the [accessible name](https://www.w3.org/TR/accname/#dfn-accessible-name). Users typically have a much better experience if the words and characters in the visible label of a control match or are contained within the accessible name. When these match, speech-input users (i.e., users of speech recognition applications) can navigate by speaking the visible text labels of components, such as menus, links, and buttons, that appear on the screen. Sighted users who use text-to-speech (e.g., screen readers) will also have a better experience if the text they hear matches the text they see on the screen.

			

Note that where a visible text label does not exist for a component, this success criterion does not apply to that component.

			

Where text labels exist and are properly linked to the user interface components through established authoring practices, the label and name will normally match. When they don't match, speech-input users who attempt to use the visible text label as a means of navigation or selection (e.g., "move to Password") will be unsuccessful.  The speech-based navigation fails because the visible label spoken by the users does not match (or is not part of) the accessible name that is enabled as a speech-input command. In addition, when the accessible name is different from the visible label, it may function as a hidden command that can be accidentally activated by speech-input users.

			

Mismatches between visible labels and programmatic names for controls are even more of an issue for speech-input and text-to-speech users who also have cognitive challenges. Mismatches create an extra cognitive load for speech-input users, who must remember to say a speech command that is different from the visible label they see on a control. It also creates extra cognitive load for a text-to-speech user to absorb and understand speech output that does not match the visible label.

			

Note that when a [user interface component]() lacks an [accessible name](https://www.w3.org/TR/accname/#dfn-accessible-name) — a failure of [4.1.2 Name, Role, Value](name-role-value) — and has a visible text label, then it also fails this success criterion.

			

##### Identifying label text for components

			

In order for the label text and accessible name to be matched, it is first necessary to determine which text on the screen should be considered a label for any given control. There are often multiple text strings in a user interface that may be relevant to a control. However, there are reasons why it is best to conservatively interpret the label as being only the text in close proximity.

			

Conventionally the label for user interface components is the adjacent text string. The typical positioning for left to right languages is:

			

- immediately to the left of comboboxes, dropdown lists, text inputs, and other widgets (or in the absence of left-side labels, immediately above and aligned with the left edge of each input)
- immediately to the right of checkboxes and radio buttons
- inside buttons and tabs or immediately below icons serving as buttons

			

The rationale for some of these conventions is explained in [G162: Positioning labels to maximize predictability of relationships](../../Techniques/general/G162).

			

It is important to bias towards treating only the adjacent text as a label because liberal interpretations of what constitutes a text label can jeopardize the value of this success criterion (SC) by lessening predictability. Isolating the label to the single string in close proximity to the component makes it easier for developers, testers, and end users to identify the label targeted for evaluation in this SC. Predictable interpretation of labeling allows users of speech recognition technologies to interact with the element via its conventionally positioned label, and allows users of screen reading technologies to enjoy consistency between the nearby visible label and the announced name of the component.

			

Note that placeholder text within an input field is not considered an appropriate means of providing a label. The [HTML Standard](https://html.spec.whatwg.org/multipage/input.html#the-placeholder-attribute) states "The placeholder attribute should not be used as an alternative to a `label`." However, it is worth noting that "label" in that statement is in code brackets and links to the `label` element. For the purposes of this Label in Name Success Criterion, "label" is not used in such a programmatic sense but is simply referring to a text string in close visual proximity to a component. As such, in the absence of any other nearby text string (as described in the preceding list), if an input contains placeholder text, such text may be a candidate for Label in Name. This is supported both through the accessible name calculation (discussed later) and from the practical sense that where a visible label is not otherwise provided, it is likely that a speech-input user may attempt to use the placeholder text value as a means of interacting with the input.

			

				

##### Text labels "express something in human language"

				

###### Symbolic text characters

For the purposes of this SC, text should not be considered a visible label if it is used in a symbolic manner, rather than directly "expressing something in human language" as per the definition of [text]() in WCAG. For example, [1.4.5 Images of Text](images-of-text) describes considerations for "symbolic text characters." In the images of text example "B", "I", and "ABC" appear on icons in a text editor, where they are meant to symbolize the functions for Bold, Italics, and Spelling, respectively. In such a case, the accessible name should be the function the button serves (e.g., "Spell check" or "Check spelling"), not the visible symbolic characters. A similar text editor is shown in the figure below.

	
	A detail of the rich text editor in Github, showing a variety of unlabeled icons, including icons resembling text characters.

Likewise, where an author has used a greater-than symbol (">") to mimic the appearance of the right-facing arrow, the text does not convey something in human language. It is a symbol, in this scenario likely meant to mimic the icons used for a "Play" button or a "Next" arrow.

				
				

          

###### Punctuation and capitalization

          

The use of punctuation and capitalization in labels *may* also be considered optional for the same reason. For example, the colon conventionally added at the end of input labels does not express something in human language, and capitals on the first letter of each word in a label do not normally alter the words' meaning. This is particularly relevant in the context of this SC, since it is primarily aimed at users of speech recognition; capitals and most punctuation are frequently ignored when a user speaks a label as a means of interacting with a control.

          

While it is certainly not an error to include the colon and capitalization in the accessible name, a computed name of "First name" should not be considered a failure of "First Name:".
          First Name: 
          Likewise, "Next…" visibly shown on a button could have "Next" as the accessible name.
          . When in doubt, where a meaningful visible label exists, match the string exactly for the accessible name.

				

				
      

        

###### Mathematical expressions and formulae

        

Mathematical expressions are an exception to the previous subsection about symbolic characters. Math symbols can be used as labels; for example "11×3=33" and "A>B" convey meaning.

            A>B
            11×3=33

        	

The label should not be overwritten in the accessible name, and substitutions of words where a formula is used should be avoided since there are multiple ways to express the same equation. For example, making the name "eleven multiplied by three is equivalent to thirty-three" might mean a user who said "eleven times three equals thirty-three" may not match. It is best to leave the formulas as used in the label and count on the user's familiarity with their speech software to achieve a match. Further, converting a mathematical formula label into an accessible name that is a spelled-out equivalent may create issues for translation. The name should match the label's formula text. Note that a consideration for authors is to use the proper symbol in the formula. For instance 11x3 (with a lower or upper case letter X), 11*3 (with the asterisk symbol), and 11×3 (with the `&`times`;` symbol) are all easy for sighted users to interpret as meaning the same formula, but may not all be matched to "11 times 3" by the speech recognition software. The proper operator symbol (in this case the times symbol) should be used.

				

			

			

 

##### Accessible Name and Description Computation specification

 

It is important to understand how the accessible name is derived. The [Accessible Name and Description Computation 1.1](https://www.w3.org/TR/accname-1.1/) and the [HTML Accessibility API Mappings 1.0](https://w3c.github.io/html-aam/#accessible-name-and-description-computation) describe how the accessible name is computed, including which attributes are considered in its calculation, and in what order of preference. If a component has multiple possible attribute values that could be used for its accessible name, only the most preferred of those values will be computed. None of the other, less preferred values will be part of the name. For the most part, existing established programmatic relationships between labels and controls are reinforced by the specification.

 

Other text displayed on the screen that is correctly coded to meet [1.3.1 Info and Relationships](info-and-relationships) is **not** normally factored into the calculation for the accessible name of a UI component without author intervention (via ARIA labeling techniques). The most common of these are:

	

- headings and instructions
- group labels for sets of components (i.e., used with `legend`/`fieldset` or with role of `group` or `radiogroup`)

Such textual information may constitute part of the component's *description*. So from both a programmatic viewpoint, and from the conservative tactic of only considering a label to be "adjacent text," neither headings, instructions, nor group 'labels' should normally be considered **labels** for the purpose of this success criterion.

 

It is important to note that the specification allows authors to override the name calculated through native semantics. Both `aria-label` and `aria-labelledby` take precedence in the name calculation, overriding the visible text as the accessible name even when the visible text label is programmatically associated with the control. For this reason, when a visible label already exists, `aria-label` should be avoided or used carefully, and `aria-labelledby` should be used as a supplement with care.

Finally, `aria-describedby` is not included in the Accessible Name computation (instead it is part of the Accessible Description computation). By convention, text associated with a control through `aria-describedby` is announced immediately after the accessible name by screen readers. Therefore, the context of headings, instructions, and group labels can be provided through the accessible description to assist users of screen readers without affecting the experience of those who navigate using speech recognition software.

###### Text in parentheses

	

		

Note: The term "parenthetical" in this section is describing text that literally appears within a set of round brackets (). It is not used in the more abstract sense of "information related to".

	

It is important to mention parenthetical text in labels in the context of accessible name versus description. In common usage, text in parentheses is considered secondary but relevant to meaning. Users of speech recognition would not typically announce text in parentheses as part of the input name. For that reason, parenthetical text may be optionally considered a description and left out of the accessible name.

	

However, where parenthetical information provides important context, such as indication of a required field or limitations on what is allowed for input, this information must be provided programmatically in some other way to the user if that information is not included as part of the accessible name. For example, "Name (required)" and "Date (YYYY-MM-DD)" could accept "Name" and "Date" as the accessible names. However, in order to pass [1.3.1 Info and Relationships](info-and-relationships), authors would need to programmatically surface both the required state and the limit on the allowed data formatting (in this example, eight integers fitting the YYYY-MM-DD pattern). The "required" state could be surfaced through the HTML `required` attribute or by using `aria-required="true"`. The allowed data formatting could be surfaced by being referenced using the `aria-describedby` attribute.

### Benefits
- Speech-input users can directly activate controls on a page with fewer surprising changes of focus.
- Text-to-speech users will have a better experience because the labels that they hear match the visible text labels that
				they see on the screen.

### Examples
- **Accessible name matches visible label:** The accessible name and visible label of a control match.
- **Accessible name starts with visible label:** The accessible name "Search for a value" begins with the text of the visible label, "Search".

### Resources
- [Accessible Name and Description Computation](https://www.w3.org/TR/accname-aam-1.1/)
- [Accessible Name and Description Computation in HTML Accessibility API Mappings 1.0](https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation)

### Techniques

#### Sufficient Techniques

- G208
- G211

#### Advisory Techniques

- G162
- If an icon has no accompanying text, consider using its hover text as its accessible name (Potential future technique)

#### Failures

- F96
- F111
- Accessible name contains the visible label text, but the words of the visible label are not in the same order as they are in the visible label text (Potential future technique)
- Accessible name contains the visible label text, but one or more other words are interspersed in the label (Potential future technique)


---

## 2.5.4 Motion Actuation (A)

### In brief
**Goal**
: Content is not dependent on a user's ability to move a device.

**What to do**
: Don't rely solely on device motion to control page content.

**Why it's important**
: Some people cannot hold or move a device steadily.

### Intent
The intent of this success criterion is to ensure that functions triggered by moving a device (for example, shaking or tilting) or by gesturing towards the device (so that sensors like a camera can pick up and interpret the gesturing), can also be operated by more conventional user interface components.

This criterion concerns input through sensors which respond directly to motions such as gesturing towards, tilting or shaking a device. It does not cover the movement of users through space as registered by geolocation sensors or beacons, or events observed by the device other than intentional gesturing by the user. It also does not cover incidental motion associated with operating a keyboard, pointer, or assistive technology.

Devices often have sensors that can act as inputs, such as accelerometer and gyroscope sensors on a phone or tablet device. These sensors can allow the user to control something by simply changing the orientation or moving the device in particular ways. In other situations, web content can interpret user gestures via the camera or other sensors to actuate functions. For example, shaking the device might issue an "Undo" command, or a gentle hand wave might be used to move forward or backward in a sequence of pages. Some users with disabilities are not able to operate these device sensors (either not at all, or not precisely enough) because the device is on a fixed mount (perhaps a wheelchair) or due to motor impairments. Therefore, functionality offered through motion must also be available by another mechanism.

In addition, some users may accidentally activate sensors due to tremors or other motor impairments. The user must have the ability to turn off motion actuation to prevent such accidental triggering of functions. Applications may be able to meet this requirement by supporting operating system settings which allow the user to disable motion detection at the system level.

There is an exception where motion is essential for the function or not using motions or gestures would invalidate the activity. Some applications are specifically created to use device sensor data. Examples of content that are exempt from this requirement include a pedometer that relies on device motion to count steps.

### Benefits
- This success criterion helps people who may be unable to perform particular motions (such as tilting, shaking, or gesturing) because the device may be mounted or users may be physically unable to perform the necessary movement. This success criterion ensures that users can still operate all functionality by other means such as touch or via assistive technologies.
- Other users will benefit in situations where they are unable to move their devices.

### Examples
- A user can choose an application setting which turns off Shake to Undo and other motion-activated features.
- After text is input in a field, shaking a device shows a dialog offering users to undo the input. A cancel button next to the text field offers the same functionality.
- A user can tilt a device to advance to the next or a previous page. Buttons are also provided to perform the same function.
- A user can move or pan a device to change the view in an interactive photo. A control is also available to perform these same functions.
- A user can gesture towards the device to navigate content. Controls are also available to navigate.

### Resources
- [Detecting device orientation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation)
- [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)

### Techniques

#### Sufficient Techniques

- G213
- GXXX: Supporting system level features which allow the user to disable motion actuation

#### Failures

- F106
- FXXX: Failure of Success Criterion 2.5.4 due to disrupting or disabling system level features which allow the user to disable motion actuation


---

## 2.5.7 Dragging Movements (AA)

### In brief
**Goal**
: Don’t rely on dragging for user actions.

**What to do**
: For any action that involves dragging, provide a simple pointer alternative.

**Why it's important**
: Some people cannot use a mouse to drag items.

### Intent
The intent of this success criterion is to ensure functionality that uses a dragging movement has another [single pointer]() mode of operation without the need for the dexterity required to drag elements.

      

Some people cannot perform dragging movements in a precise manner. Others use a specialized or adapted input device, such as a trackball, head pointer, eye-gaze system, or speech-controlled mouse emulator, which may make dragging cumbersome and error-prone.

      

When an interface implements functionality that uses dragging movements, users perform four discrete actions:

        
           

1. tap or click to establish a starting point, then
2. press and hold that contact while...
3. performing a repositioning of the pointer, before...
4. releasing the pointer at the end point.

       
      

Not all users can accurately press and hold that contact while also repositioning the pointer. An alternative method must be provided so that users with mobility impairments who use a pointer (mouse, pen, or touch contact) can use the functionality.

      

This requirement is separate from keyboard accessibility because people using a touch screen device may not use a physical keyboard. Keyboard specific interactions such as tabbing or arrow keys may not be possible when encountering a drag and drop control. Note, however, that providing a text input can be an acceptable single-pointer alternative to dragging. For example, an input beside a slider could allow any user to enter a precise value for the slider. In such a situation, the on-screen keyboard that appears for touch users offers a single-pointer means of entering an alphanumeric value.

      

This criterion does not apply to scrolling enabled by the user-agent. Scrolling a page is not in scope, nor is using a technique such as CSS `overflow` to make a section of content scrollable.

      
		

        
         

##### Relationship to other requirements

        
         

Success Criteria 2.1.1 Keyboard and 2.1.3 Keyboard (No Exception) require dragging features to be keyboard accessible. However, achieving keyboard equivalence for a dragging operation does not automatically meet this success criterion. It is possible to create an interface that works with dragging and keyboard controls that does not work using only clicks or taps. While many designs can be created for a dragging alternative which address both keyboard accessibility and operability by single pointer operation, the two requirements should be assessed independently.

         

This success criterion applies to dragging movements as opposed to pointer gestures, which are covered in [Success Criterion 2.5.1 Pointer Gestures](pointer-gestures). Pointer gestures include directional path-based as well as multi-point gestures. In contrast, for dragging movements, only the start and end point of the movement matters, not the actual path.

         

Additional examples are selection rectangles that set the first x/y rectangle coordinate at the pointer position via a pointer down-event, and the second x/y coordinate, after a dragging movement, at the next up-event. A similar example is a connecting line drawn between two different items on the screen, as in an allocation test where users are required to draw a line between questions and corresponding answers. In these cases, the dragging movement requires an alternative way to accomplish the same action that does not rely on the dragging movement. For example, two separate single tap or click actions may define the rectangle coordinates or the start and end points of a connecting line.

      

      
      

         

##### Alternatives for dragging movements on the same page

   
         

Where functionality can be executed via dragging movements and an equivalent option exists that allows for single-pointer access without dragging, this success criterion is passed. It does not have to be the same component, so long as the functionality is equivalent. An example is a color wheel where a color can be changed by dragging an indicator. In addition, text fields for the numerical input of color values allow the definition of a color without requiring dragging movements. (Note that a text input is considered device agnostic; although the purpose is to enter characters, text entry can take place through voice, pointer or keyboard.)

 

      

      
      

         

##### Distinguishing dragging movements from path-based pointer gestures

      

         

Dragging movements covered in this success criterion are pointer interactions where only the start- and endpoints matter. Once the pointer engages with a target, the direction of the dragging movement does not factor into the interaction until the pointer disengages the target. Since the dragging movement does not have an intermediate point, the dragging movement can go in any direction. Path-based gestures are covered in [Success Criterion 2.5.1 Pointer Gestures](pointer-gestures.html).

### Benefits
- Users who struggle with performing dragging movements can still operate an interface with a pointer interface.

### Examples
- A map allows users to drag the view of the map around, and the map has up/down/left/right buttons to move the view as well.
- A sortable list of elements may, after tapping or clicking on a list element, provide adjacent controls for moving the element up or down in the list by simply tapping or clicking on those controls.
- A taskboard that allows users to drag and drop items between columns also provides an additional pop-up menu after tapping or clicking on items for moving the selected element to another column by tapping or clicking on pop-up menu entries.
- A radial control widget (color wheel) where the value can be set by dragging the marker for the currently selected color to another position, also allows picking another color value by tapping or clicking on another place in the color wheel.
- A linear slider control widget, where the value can be set by dragging the visual indicator (thumb) showing the current value, allows tapping or clicking on any point of the slider track to change the value and set the thumb to that position.
- A widget where you can drag a gift to one person in a photo of a group of people also has a menu alternative where users can select the person that should receive the gift from the menu.

### Techniques

#### Sufficient Techniques

- G219

#### Failures

- F108


---

## 2.5.8 Target Size (Minimum) (AA)

### In brief
**Goal**
: Make controls easier to activate.

**What to do**
: Ensure targets meet a minimum size or have sufficient spacing around them.

**Why it's important**
: Some people with physical impairments cannot click small buttons that are close together.

### Intent
The intent of this success criterion is to help ensure targets can be easily activated without accidentally activating an adjacent target.  Users with dexterity limitations and those who have difficulty with fine motor movement find it difficult to accurately activate small targets when there are other targets that are too close.  Providing sufficient size, or sufficient spacing between targets, will reduce the likelihood of accidentally activating the wrong control.

        

Disabilities addressed by this requirement include hand tremors, spasticity, and quadriplegia.  Some people with disabilities use specialized input devices instead of a computer mouse or trackpad.  Typically these types of input device do not provide as much accuracy as mainstream pointing devices.  Meeting this requirement also ensures that touchscreen interfaces are easier to use.

        

This success criterion defines a *minimum size* and, if this can't be met, a *minimum spacing*. It is still possible to have very small, and difficult to activate, targets and meet the requirements of this Success Criterion, provided that the targets don't have any adjacent targets that are too close. However, using larger target sizes will help many people use targets more easily. *As a best practice* it is recommended to at least meet the *minimum size* requirement of the Success Criterion, regardless of spacing. For important links/controls, consider aiming for the stricter [2.5.5 Target Size (Enhanced)](target-size-enhanced.html).

        

            

##### Exceptions

            

The requirement is for targets to be at least 24 by 24 CSS pixels in size. There are five exceptions:

            

- **Spacing:** Undersized targets (those less than 24 by 24 CSS pixels) are positioned so that if a 24 CSS pixel diameter circle is centered on the [bounding box]() of each, the circles do not intersect another target or the circle for another undersized target.
- **Equivalent:** In cases where a target does not have a size equivalent to 24 by 24 CSS pixels, but there is another control that can achieve the underlying function that *does* meet the requirements of this success criterion, the target can be excepted based on the "Equivalent" exception.
- **Inline:** The success criterion does not apply to inline targets in sentences, or where the size of the target is constrained by the line-height of non-target text. This exception is allowed because text reflow based on viewport size makes it impossible for authors to anticipate where links may be positioned relative to one another. Applying this success criterion when multiple links are embedded in blocks of smaller text often results in an undesirable design. It is more important to set the line height to a value that improves readability.
- **User agent control:** Browsers have default renderings of some controls, such as the days of the month calendar in an `<input type="date">`. As long as the author has not modified the user agent default size, the target size for a "User agent control" is excepted.
- **Essential:** If the size and spacing of the targets is fundamental to the information being conveyed, the "Essential" exception applies. For example, in digital maps, the position of pins is analogous to the position of places shown on the map. If there are many pins close together, the spacing between pins and neighboring pins will often be below 24 CSS pixels. It is essential to show the pins at the correct map location, therefore the Essential exception applies. A similar example is an interactive data visualization where targets are necessarily dense. Another example is where jurisdictions legally require online forms to replicate paper forms, which can impose constraints on the size of targets. In such jurisdictions, any legal requirement to replicate small targets can be considered essential. When the "Essential" exception is applicable, authors are strongly encouraged to provide equivalent functionality through alternative means to the extent practical.

        

        

            

##### Size requirement

            

For a target to be "at least 24 by 24 CSS pixels", it must be conceptually possible to draw a solid 24 by 24 CSS pixel square, aligned to the horizontal and vertical axis such that the square is completely within the target (does not extend outside the target's area).

            
                
                Where targets are at least a 24 by 24 CSS pixel square, they meet the size requirement of the criterion and pass (image shown to scale - [see the scalable original version](img/target-size-basic.svg))
            

            

The 24 by 24px square has to be aligned with the page, although the target itself could be skewed.

            
                
                So long as there is a solid 24 by 24px square within the target, it meets the size requirement of the criterion and passes (image shown to scale - [see the scalable original version](img/target-size-skewed.svg))
            

            

If a target is not large enough to allow for a 24 by 24px square to be drawn inside it, it is considered *undersized*, and does not pass the size requirement of the success criterion. However, if it has sufficient space around it without adjacent targets, it may still pass the criterion thanks to the spacing exception (below).

            
                
                The rounded corners do not leave sufficient space to draw a 24 by 24px square inside the target, making the target *undersized*. Depending on the spacing to other targets, it may still pass if it has sufficient clearance (image shown at 1:1 and 2:1 scale - [see the scalable original version](img/target-size-undersized-rounded.svg))
            

            

The requirement is independent of the zoom factor of the page; when users zoom in, the CSS pixel size of elements does not change. This means that authors cannot meet it by claiming that the target will have enough spacing or sufficient size if the user zooms into the page.

        
            

The requirement does not apply to targets while they are obscured by content displayed as a result of a user interaction or scripted behavior of content, for example:

            

- interacting with a combobox shows a dropdown list of suggestions
- activating a button displays a modal dialog
- content displays a cookie banner after page load
- content displays a "Take a survey" dialog after some period of user inactivity

    
            

The requirement does however apply to targets in any new content that appears on top of other content.

            

While the success criterion primarily helps touch users by providing target sizing to prevent accidental triggering of adjacent targets, it is also useful for mouse or pen users. It reduces the chances of erroneous activation due to either a tremor or reduced precision, whether because of reduced fine motor control or input imprecision.

        

        

            

##### Spacing

            

When the minimum size for a target is not met, spacing can at least improve the user experience. There is less chance of accidentally activating a neighboring target if a target is not immediately adjacent to another. Touchscreen devices and user agents generally have internal heuristics to identify which link or control is closest to a user's touch interaction - this means that sufficient spacing between targets can work as effectively as a larger target size itself.

            

When a target is smaller than 24 by 24 CSS pixels, it is *undersized*. In this case, we check if it at least has sufficient *spacing* by drawing an imaginary 24 CSS pixel diameter circle over the undersized target, centered on the target's [bounding box](). For rectangular targets, the bounding box coincides with the target itself – thus, the circle is placed on the center of the target. If the target is *not* rectangular – for instance, if the target is clipped, has rounded corners, or if it's a more complex clickable SVG shape – we need to first determine the bounding box, and then find the box's center. Note that for concave shapes, the center of the bounding box may be outside of the target itself. Now, we center the circle on the center of the bounding box.

            
                
                For a square/rectangular target, the 24 CSS pixel diameter circle is centered on the target itself. For convex and concave targets, it is centered on the bounding box of the shape. Note the concave target, where in this case the center of the bounding box is outside of the actual target (image shown to scale - [see the scalable original version](img/target-size-bounding-boxes.svg))
            

            

We repeat this process for all adjacent undersized targets. To determine if an undersized target has sufficient spacing (to pass this Success Criterion's spacing exception), we check that the 24 CSS pixel diameter circle of the target does not intersect another target or the circle of any other adjacent undersized targets.

            

The following example shows three versions of a horizontal row of six icon-based buttons:

            

- In the top row, the dimensions of each target are 24 by 24 CSS pixels, passing this success criterion.
- In the second row, the same targets are only 20 by 20 CSS pixels, but have a 4 CSS pixel space between them – as the target size is below 24 by 24 CSS pixels, these need to be evaluated against the Success Criterion's spacing exception, and they pass.
- In the last row, the targets are again 20 by 20 CSS pixels, but have no space between them – these fail the spacing exception. This is because the imaginary 24 CSS pixel diameter circles over the targets would intersect.

            
                
                Three rows of targets, illustrating two ways of meeting this success criterion and one way of failing it (image shown to scale - [see the scalable original version](img/target-spacing-toolbar.svg))
            
            

The next two illustrations show sets of buttons which are only 16 CSS pixels tall. In the first set, there are no targets immediately above or below the buttons, so they pass. In the second illustration, there are further buttons, and they have been stacked on top of one another, resulting in a fail.

            
                
                While the height of the targets is only 16 CSS pixels, the lack of adjacent targets above and below means that the targets pass this success criterion (image shown to scale - [see the scalable original version](img/target-text-buttons-single-row.svg))
            

            
                
                Two rows of buttons, both with a height of only 16 CSS pixels. The rows are close, with only a 1 CSS pixel gap between them. This means that the 24 CSS pixel spacing circles of the targets in one row will *intersect* the targets (and their circles, depending on their respective widths) in the other line, thus failing the success criterion. Image shown to scale - [see the scalable original version](img/target-text-buttons-two-rows.svg).
            
            

The following two illustrations show how menu items can be adjusted to properly meet this requirement. In the first illustration, the "About us" menu has been activated, showing that each of the menu item targets has a 24 CSS pixel height (text and padding), and so passes. In the second illustration, the same menu is expanded, but the menu items only achieve 18 CSS pixels in height, and so fail.

            
                
                The menu items with a height of 24 CSS pixels pass. For the menu items that are only 18 CSS pixels high, the 24 CSS pixel spacing circles of the targets in one row will intersect the adjacent menu item targets and circles, and fail (image shown to scale - [see the scalable original version](img/target-dropdown.svg))
            

            

The following example has one large target (an image that links to a new page related to that image) and a very small second target (a control with a magnifier icon to open a zoomed-in preview, possibly in a modal, of the image).

            

In the top row, the small target overlaps - or, to be more technically accurate, *clips* - the large target. The small target itself has a size of 24 by 24 CSS pixels, so passes. In the second row, we see that if the second target is any smaller – in this case 16 by 16 CSS pixels – it fails the criterion, as the imaginary circle with a 24 CSS pixel diameter we draw over the small target will intersect the large target itself.

            
                
                The 24 by 24 CSS pixel small target passes, while the 16 by 16 CSS pixel small target fails, since the 24 CSS pixel diameter circle used for undersized targets intersect the large target (image shown to scale - [see the scalable original version](img/target-large-small-clipping.svg))
            

            

In the following example, we have the same two targets – a large target and a small target. This time, the small target touches/abuts the large target. If the small target is smaller than 24 by 24 CSS pixels, the imaginary circle with a 24 CSS pixel diameter we draw over the small target will intersect the large target itself, failing the requirement. The undersized target must be spaced further away from the large target until its circle doesn't intersect the large target.

            
                
                In the first row, the 16 by 16 CSS pixel target touching/abutting the large target fails, as its 24 CSS pixel diameter circle used for undersized targets intersects the large target. In the second row we see that the only way the undersized target can pass is by adding a 4 CSS pixel spacing gap between the targets (image shown to scale - [see the scalable original version](img/target-large-small-touching.svg))
            

            

Users with different disabilities have different needs for control sizes. It can be beneficial to provide an option to increase the active target area without increasing the visible target size. Another option is to provide a mechanism to control the density of layout and thereby change target size or spacing, or both. This can be beneficial for a wide range of users. For example, users with visual field loss may prefer a more condensed layout with smaller sized controls while users with other forms of low vision may prefer large controls.

        

        

            

##### User agent control

            

This success criterion has an exception for the size of targets determined by a user agent and not modified by the author. An example of this kind of target is a browser's scrollbars. If a scrollbar's dimensions have been modified by the author then there must be a passing amount of spacing between the scrollbar and the content of the page. The following example shows a passing and a failing design.

            
                
                The passing example has enough space between the link and the scrollbar for a 24 CSS pixel diameter circle, placed over the scrollbar, to not overlap the link. The failing example has no space between the link and the scrollbar, which fails the criterion because the 24 CSS pixel diameter circle overlaps the link. (Image shown to scale - [see the scalable original version](img/target-custom-scrollbar-spacing.svg))

### Benefits
Having targets with sufficient size - or at least sufficient target spacing - can help all users who may have difficulty in confidently targeting or operating small controls. Users who benefit include, but are not limited to:

        

- People who use a mobile device where the touch screen is the primary mode of interaction;
- People using mouse, stylus or touch input who have mobility impairments such as hand tremors;
- People using a device in environments where they are exposed to shaking such as public transportation;
- Mouse users who have difficulty with fine motor movements;
- People who access a device using one hand;
- People with large fingers, or who are operating the device with only a part of their finger or knuckle.

### Examples
- Three buttons are on-screen and the target size of each button is 24 by 24 CSS pixels. Since the target size itself is 24 by 24 CSS pixels, no additional spacing is required, the success criterion passes.
- A row of buttons, each of which has a horizontal width of more than 24 CSS pixels, a height of only 20 CSS pixels, and vertical margin of 4 CSS pixels above and below the row of buttons. Since there is sufficient spacing both above and below the row of buttons, the success criterion passes.
- Links within a paragraph of text have varying target dimensions. Links within paragraphs of text do not need to meet the 24 by 24 CSS pixels requirements, so the success criterion passes.

### Resources
- [Target size study for one-handed thumb use on small touchscreen devices](https://dl.acm.org/doi/10.1145/1152215.1152260)

### Techniques

#### Sufficient Techniques

- C42


---

## 3.1.1 Language of Page (A)

### In brief
**Goal**
: Assistive technology can determine the language of a page.

**What to do**
: Indicate the predominant language on a page.

**Why it's important**
: People using assistive technology get information in the correct language.

### Intent
The intent of this success criterion is to ensure that content developers provide
         information in the web page that user agents need to present text and other linguistic
         content correctly. Both assistive technologies and conventional user agents can render
         text more accurately when the language of the web page is identified. Screen readers
         can load the correct pronunciation rules. Visual browsers can display characters and
         scripts correctly. Media players can show captions correctly. As a result, users with
         disabilities will be better able to understand the content.

      

The default human language of the web page is the default text-processing language
         as discussed in
         [Internationalization Best Practices: Specifying Language in XHTML & HTML Content](https://www.w3.org/International/techniques/authoring-html#gslang). When a web page uses several languages, the default text-processing language is
         the language which is used most. (If several languages are used equally, the first
         language used should be chosen as the default human language.)

      

> **Note:**
> >          
> 
> For multilingual sites targeting Conformance Level A, the Working Group strongly encourages
>             developers to follow Success Criterion 3.1.2 as well even though that is a Level AA
>             success criterion.
> 
> 
>

### Benefits
This success criterion helps:

      

- people who use screen readers or other technologies that convert text into synthetic
            speech;
- people who find it difficult to read written material with fluency and accuracy, such
            as recognizing characters and alphabets or decoding words;
- people with certain cognitive, language and learning disabilities who use text-to-speech
            software
- people who rely on captions for synchronized media.

### Examples
**Example 1. A web page with content in two languages**
: A web page produced in Germany and written in HTML includes content in both German
               and English, but most of the content is in German. The default human language is identified
               as German (de) by the lang attribute on the html element.

### Resources
- [Internationalization Best Practices: Specifying Language in XHTML & HTML Content](https://www.w3.org/International/techniques/authoring-html#gslang)
- [Declaring language in HTML](https://www.w3.org/International/questions/qa-html-language-declarations)

### Techniques

#### Sufficient Techniques

- H57
- PDF16
- PDF19

#### Advisory Techniques

- SVR5


---

## 3.1.2 Language of Parts (AA)

### In brief
**Goal**
: Assistive technology can identify the languages used within a page.

**What to do**
: Indicate when words are in a different language.

**Why it's important**
: People using assistive technology get information in the correct language.

### Intent
The intent of this success criterion is to ensure that user agents can correctly present
         phrases, passages, and in some cases words written in multiple languages. This makes it possible for user agents and
         assistive technologies to present content according to the  presentation and pronunciation
         rules for that language. This applies to graphical browsers as well as screen readers,
         braille displays, and other voice browsers.

      

Both assistive technologies and conventional user agents can render text more accurately
         if the language of each passage of text is identified. Screen readers can use the
         pronunciation rules of the language of the text. Visual browsers can display characters
         and scripts in appropriate ways. This is especially important when switching between
         languages that read from left to right and languages that read from right to left,
         or when text is rendered in a language that uses a different alphabet. Users with
         disabilities who know all the languages used in the web page will be better able to
         understand the content when each passage is rendered appropriately.

      

When no other language has been specified for a phrase or passage of text, its human
         language is the default human language of the web page (see [Success Criterion 3.1.1](language-of-page)).
         So the human language of all content in single language documents can be programmatically
         determined.

      

Individual words or phrases in one language can become part of another language. For
         example, "rendezvous" is a French word that has been adopted in English, appears in
         English dictionaries, and is properly pronounced by English screen readers. Hence
         a passage of English text may contain the word "rendezvous" without specifying that
         its human language is French and still satisfy this success criterion. Frequently,
         when the human language of text appears to be changing for a single word, that word
         has become part of the language of the surrounding text. Because this is so common
         in some languages, single words should be considered part of the language of the surrounding
         text unless it is clear that a change in language was intended. If there is doubt
         whether a change in language is intended, consider whether the word would be pronounced
         the same (except for accent or intonation) in the language of the immediately surrounding
         text.

      

Most professions require frequent use of technical terms which may originate from
         a foreign language. Such terms are usually not translated to all languages. The universal
         nature of technical terms also facilitate communication between professionals.

      

Some common examples of technical terms include: Homo sapiens, Alpha Centauri, hertz,
         and habeas corpus.

      

Identifying changes in language is important for a number of reasons:

      

- It allows braille translation software to follow changes in language, e.g., substitute
            control codes for accented characters, and insert control codes necessary to prevent
            erroneous creation of Grade 2 braille contractions.
- Speech synthesizers that support multiple languages will be able to speak the text
            in the appropriate accent with proper pronunciation. If changes are not marked, the
            synthesizer will try its best to speak the words in the  default language it works
            in. Thus, the French word for car, "voiture" would be pronounced "voyture" by a speech
            synthesizer that uses English as its default language.
- Marking changes in language can benefit future developments in technology, for example
            users who are unable to translate between languages themselves will be able to use
            machines to translate unfamiliar languages.
- Marking changes in language can also assist user agents in providing definitions using
            a dictionary.

### Benefits
This success criterion helps:

      

- people who use screen readers or other technologies that convert text into synthetic
            speech;
- people who find it difficult to read written material with fluency and accuracy, such
            as recognizing characters and alphabets, decoding words, and understanding words and
            phrases;
- people with certain cognitive, language and learning disabilities who use text-to-speech
            software;
- people who rely on captions to recognize language changes in the soundtrack of synchronized
            media content.

### Examples
##### A German phrase in an English sentence

      

In the sentence, "He maintained that the DDR (German Democratic Republic) was just a 'Treppenwitz der Weltgeschichte'," the German phrase 'Treppenwitz der Weltgeschichte' is marked as German. Depending on the markup language, English may either be marked as the language for the entire document except where specified, or marked at the paragraph level. When a screen reader encounters the German phrase, it changes pronunciation rules from English to German to pronounce the word correctly.

      

##### Alternative language links

      

An HTML web page includes links to versions of the page in other languages (e.g.,
         Deutsch, Français, Nederlands, Catalan, etc.). The text of each link is the name of the language, in that language. The language of each link is indicated via a `lang` attribute.

`<ul>
  <li><a href="..." lang="de">Deutsch</a></li>
  <li><a href="..." lang="it">Italiano</a></li>
  <li><a href="..." lang="fr">Français</a></li>
  ...
  <li><a href="..." lang="zh-hant">繁體中文</a></li>
</ul>`

         

##### "Podcast" used in a French sentence

         

Because "podcast" is part of the vernacular of the immediately surrounding text in the following excerpt, "À l'occasion de l'exposition "Energie éternelle. 1500 ans d'art indien", le Palais des Beaux-Arts de Bruxelles a lancé son premier podcast. Vous pouvez télécharger ce podcast au format M4A et MP3", no indication of language change is required.

         

##### The element's content and attribute values are in different languages

         

This example assumes that the page's default content is in English. The link's `title` attribute is in English, but the nested `span` element that contains the word Español has a `lang="es"` attribute.

         `<a title="Spanish" href="qa-html-language-declarations-es.html"><span lang="es">Español</span></a>`

### Resources
- [HTML - The `lang` and `xml:lang` attributes](https://html.spec.whatwg.org/multipage/dom.html#attr-lang).
- [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/index.en).
- [Authoring HTML: Language declarations](https://www.w3.org/TR/i18n-html-tech-lang/).
- [Declaring language in HTML](https://www.w3.org/International/questions/qa-html-language-declarations)

### Techniques

#### Sufficient Techniques

- H58
- PDF19


---

## 3.2.1 On Focus (A)

### In brief
**Goal**
: Content can be navigated more predictably.

**What to do**
: Do not change a user's context when items get focus.

**Why it's important**
: Content that behaves predictably is especially important to people with disabilities.

### Intent
The intent of this success criterion is to ensure that functionality is predictable
         as visitors navigate their way through a document. Any component that is able to trigger
         an event when it receives focus must not change the context.          Examples of
         changing context when a component receives focus include, but are not limited to:

      
      

- forms submitted automatically when a component receives focus;
- new windows launched when a component receives focus;
- focus is changed to another component when that component receives focus;

      
      

Focus may be moved to a control either via the keyboard (e.g. tabbing to a control) or the mouse (e.g. clicking on a text field). Moving the mouse over a control does not move the focus
         unless scripting implements this behavior. Note that for some types of controls, clicking
         on a control may also activate the control (e.g. button), which may, in turn, initiate a change in context.

      
      

> **Note:**
> >          
>          
> 
> What is meant by "component" here is also sometimes called "user interface element"
>             or "user interface component".
> 
> 
>          
>

### Benefits
- This success criterion helps people with visual disabilities, cognitive limitations,
            and motor impairments by reducing the chance that a change of context will occur unexpectedly.

### Examples
**Example 1: A dropdown menu**
: A dropdown menu on a page allows users to choose between jump destinations. If the
               person uses the keyboard to move down to a choice and activates it (with a spacebar
               or enter key) it will jump to a new page.  However, if the person moves down to a
               choice and either hits the escape or the tab key to move out of the pulldown menu
               – it does not jump to a new screen as the focus shifts out of the dropdown menu.

**Example of a Failure: A help dialog**
: When a field receives focus, a help dialog window describing the field and providing
               options opens. As a keyboard user tabs through the web page, the dialog opens, moving
               the keyboard focus away from the control every time the user attempts to tab past
               the field.

### Techniques

#### Sufficient Techniques

- G107

#### Advisory Techniques

- G200
- G201

#### Failures

- F55


---

## 3.2.2 On Input (A)

### In brief
**Goal**
: Content can be operated more predictably.

**What to do**
: Forewarn users if their context will change based on their input.

**Why it's important**
: Content that behaves predictably is especially important to people with disabilities.

### Intent
The intent of this success criterion is to ensure that entering data or selecting
         a form control has predictable effects. Changing the setting of any user interface
         component is changing some aspect in the control that will persist when the user is
         no longer interacting with it. So checking a checkbox, entering text into a text field,
         or changing the selected option in a list control changes its setting, but activating
         a link or a button does not. Changes in context can confuse users who do not easily
         perceive the change or are easily distracted by changes. Changes of context are appropriate
         only when it is clear that such a change will happen in response to the user's action.

      
      

> **Note:**
> >          
>          
> 
> This success criterion covers changes in context due to changing the setting of a
>             control. Clicking on links or buttons is activating a control, not
>             changing the setting of that control.
> 
> 
>          
>

      
      

> **Note:**
> >          
>          
> 
> What is meant by "component" and "user interface component" here is also sometimes
>             called "user interface element".
> 
> 
>          
>

### Benefits
- This success criterion helps users with disabilities by making interactive content
            more predictable. Unexpected changes of context can be so disorienting for users with
            visual disabilities or cognitive limitations that they are unable to use the content.
- Individuals who are unable to detect changes of context are less likely to become
               disoriented while navigating a site. For example:

            
            

- Individuals who are blind or have low vision may have difficulty knowing when a visual
                  context change has occurred, such as a new window popping up. In this case, warning
                  users of context changes in advance minimizes confusion when the user discovers that
                  the back button no longer behaves as expected.
- Some individuals with low vision, with reading and intellectual disabilities, and
            others who have difficulty interpreting visual cues may benefit from additional cues
            in order to detect changes of context.

### Examples
- A form is provided for creating calendar entries in a web-based calendaring and scheduling
            application. Along with the standard fields for subject, time and location, 
            a select dropdown allows the user to choose the type of calendar entry to create. The calendar
            entry type can be meeting, appointment or reminder.  If the user selects the
            meeting option, additional fields are displayed on the page for entering the meeting
            participants. Different fields appear if the reminder option is chosen. Because only
            parts of the entry change and the overall structure remains the same, the basic context
            remains for the user.
- A form contains fields representing US phone numbers. All of the numbers have a three
            digit area code followed by a three digit prefix and finally a four digit number,
            and each part of the phone number is entered into a separate field. When the user
            completes the entry of one field the focus automatically moves to the next field of
            the phone number. This behavior of phone fields is described for the user at the beginning
            of the form.

### Techniques

#### Sufficient Techniques

- G80
- G13
- SCR19

#### Advisory Techniques

- G201

#### Failures

- F36
- F37


---

## 3.2.3 Consistent Navigation (AA)

### In brief
**Goal**
: Content can be navigated more predictably.

**What to do**
: Consistently order navigation that repeats across multiple pages.

**Why it's important**
: Content that behaves predictably is especially important to people with disabilities.

### Intent
The intent of this success criterion is to encourage the use of consistent presentation
         and layout for users who interact with repeated content within 
         a set of web pages and need to locate specific information or functionality more than
         once.
         Individuals with low vision who use screen magnification to display a small portion
         of the screen at a time often use visual cues and page boundaries to quickly locate
         repeated content.
         Presenting repeated content in the same order is also important for visual users who
         use spatial memory or visual cues within the design to locate repeated content.

      
      

It is important to note that the use of the phrase "same order" in this section is
         not meant to imply that subnavigation menus cannot be used or that blocks of secondary
         navigation or page structure cannot be used. Instead, this success criterion is intended
         to assist users who interact with repeated content across web pages to be able to
         predict the location of the content they are looking for and find it more quickly
         when they encounter it again.

      
      

Users may initiate a change in the order by using adaptive user agents or by setting
         preferences so that the information is presented in a way that is most useful to them.

### Benefits
- Ensuring that repeated components occur in the same order on each page of a site helps
            users become comfortable that they will able to predict where they can find things
            on each page. This helps users with 
            **cognitive limitations**, users with 
            **low vision**, users with 
            **intellectual disabilities**, and also those who are 
            **blind**.

### Examples
**A consistently located control**
: A search field is the last item on every web page in a site. Users can quickly locate the search function.

**An expanding navigation menu**
: A navigation menu includes a list of seven items with links to the main sections of a site.
               When a user selects one of these items, a list of sub-navigation items is inserted
               into the top-level navigation menu.

**Consistently positioned skip navigation controls**
: A "skip navigation" (or "skip to main content") link is included as the first link
               on every page in a website. The link allows users to quickly bypass heading information
               and navigational content and begin interacting with the main content of a page.

**Skip to navigation link**
: Navigational content is consistently located at the end of each page in a set of web
               pages. A "skip to navigation" link is consistently located at the beginning of each
               page so that keyboard users can easily locate it when needed.

### Resources
- Detweiler, M.C. and Omanson, R.C. (1996), Ameritech Web Page User Interface Standards
            and Design Guidelines.
- [IBM: User experience design - Navigation](https://www.ibm.com/able/toolkit/design/ux/navigation/).

### Techniques

#### Sufficient Techniques

- G61

#### Advisory Techniques

- PDF14
- PDF17

#### Failures

- F66


---

## 3.2.4 Consistent Identification (AA)

### In brief
**Goal**
: Actions are more predictable across pages.

**What to do**
: Identify repeating functions consistently.

**Why it's important**
: Consistently identified actions are especially important to people with disabilities.

### Intent
The intent of this success criterion is to ensure consistent identification of functional
         components that appear repeatedly within a set of web pages. A strategy that people
         who use screen readers use when operating a website is to rely heavily on their familiarity
         with functions that may appear on different web pages. If identical functions have
         different labels (or, more generally, a different [accessible name](https://www.w3.org/TR/accname/#dfn-accessible-name))
         on different web pages, the site will be considerably more difficult
         to use. It may also be confusing and increase the cognitive load for people with cognitive
         limitations. Therefore, consistent labeling will help.

      
      

This consistency extends to the text alternatives. If icons or other non-text items
         have the same functionality, then their text alternatives should be consistent as
         well.

      
      

If there are two components on a web page that both have the same functionality as
         a component on another page in a set of web pages, then all 3 must be consistent.
         Hence the two on the same page will be consistent.

      
      

While it is desirable and best practice always to be consistent within a single web
         page, 3.2.4 only addresses consistency within a set of web pages where something is
         repeated on more than one page in the set.

### Benefits
- People who learn functionality on one page on a site can find the desired functions
            on other pages if they are present.
- When non-text content is used in a consistent way to identify components with the
            same functionality, people with difficulty reading text or detecting text alternatives
            can interact with the web without depending on text alternatives.
- People who depend on text alternatives can have a more predictable experience. They
            can also search for the component if it has a consistent label on different pages.

### Examples
**Example 1: Document Icon**
: A document icon is used to indicate document download throughout a site. The text
               alternative for the icon always begins with the word “Download," followed by a shortened
               form of the document title. Using different text alternatives to identify document
               names for different documents is a consistent use of text alternatives.

**Example 2: Check Mark**
: A check mark icon functions as "approved", on one page but as "included" on another.
               Since they serve different functions, they have different text alternatives.

**Example 3: Consistent references to other pages**
: A website publishes articles on-line. Each article spans multiple web pages and
               each page contains a link to the first page, the next page and the previous page of
               the article. If the references to the next page read "page 2", "page 3", "page 4"
               etcetera, the labels are not the same but they are consistent. Therefore, these references
               are not failures of this success criterion.

**Example 4: Icons with similar functions**
: An e-commerce application uses a printer icon that allows the user to print receipts
               and invoices. In one part of the application, the printer icon is labeled "Print receipt"
               and is used to print receipts, while in another part it is labeled "Print invoice"
               and is used to print invoices. The labeling is consistent ("Print x"), but the labels
               are different to reflect the different functions of the icons. Therefore, this example
               does not fail the success criterion.

**Example 5: Save icon**
: A common "save" icon is used through out the site where page save function is provided
               on multiple web pages.

**Example 6: Icon and adjacent link to same destination**
: An icon with alt text and a link are next to each other and go to the same location.
               The best practice would be to group them into one link as per 
               [](../Techniques/html/H2). However if they are visually positioned one above the other but separated in the
               source, this may not be possible. To meet the Success Criterion, the link text for
               these two links need only be consistent, not identical. But best practice is to have
               identical text so that when users encounter the second one, it is clear that it goes
               to the same place as the first.

**Example 7: Example of a Failure**
: A submit "search" button on one web page and a "find" button on another web page both
               have a field to enter a term and list topics in the website related to the term submitted.
               In this case, the buttons have the same functionality but are not labeled consistently.

**Example 8: Failure primarily impacting assistive technology users**
: Two buttons with the same functionality visually have the same text, but have been given
                  different `aria-label="..."` accessible names. For users of assistive technologies,
                  these two buttons will be announced differently and inconsistently.

### Techniques

#### Sufficient Techniques

- {"and":["G197","following the <a href=\"non-text-content#techniques\">sufficient techniques for Success Criterion 1.1.1</a> and <a href=\"name-role-value#techniques\">sufficient techniques for Success Criterion 4.1.2</a> for providing labels, names, and text alternatives"]}

#### Failures

- F31


---

## 3.2.6 Consistent Help (A)

### In brief
**Goal**
: Make it easier to find help and support.

**What to do**
: Put help in the same place when it is on multiple pages.

**Why it's important**
: People who need help can find it more easily if it's in the same place.

### Intent
The intent of this success criterion is to ensure users can find help for completing tasks on a website, when it is available. When the placement of the help mechanism is kept consistent across a set of pages, users looking for help will find it easier to identify. This is distinct from interface-level help, such as contextual help, features like spell checkers, and instructional text in a form.

         

Locating the help mechanism in a consistent location across pages makes it easier for users to find it.  For example, when a mechanism or link is located in the header of one web page, it will be easier to find if it is in the header of other pages. The help mechanism, such as a contact phone number, may be provided directly on the page, or it may also be a direct link to a contact page. Regardless of which approach is used, the mechanism must be located in the same relative order on each page within the set of pages.

         

When testing this Success Criterion, it is the help item which is relative to the rest of the content. When testing a page, other content that is present across the set of web pages and is before the help item should be before the help item on this page. Items which are after the help item on other pages should be after the help item on this page.

         

If the help item is visually in a different location, but in the same serial order, that is not helpful from a user's point of view, but it would not fail this criterion.

         

When having problems completing a task on a website (or part of a website, what we call a [set of web pages]()), people with some types of disabilities may not be able to work through the issue without further help.  Issues could include difficulty:
         completing a form, or finding a document or page which provides information required to complete a task.

         

Without help, some users may abandon the task. They may also fail to correctly complete a task, or they may require assistance from people who do not necessarily keep private information secure.

         

While it is recommended to consistently implement a help mechanism across a set of web pages, this criterion specifically pertains to pages that do include such a mechanism. Therefore, the absence of a help mechanism on certain pages within a set does not constitute a violation.

         

            

##### Limitations and Exceptions

            

It is not the intent of this success criterion to require authors to provide help or access to help. The Criterion only requires that *when* one of the listed forms of help is available across multiple pages that it be in a consistent location. It does not require authors to provide help information on PDFs or other static documents that may be available for viewing/download from the web pages. PDFs and other static documents are not considered part of the "[set of web pages]()" from which they are downloaded.

            

It is also not the intent of this success criterion to require a human be available at all times. Ideally, if the human contact is not available during certain hours or certain days then information would be provided so the user can tell when it will be available.

            

This success criterion only requires help mechanisms to be consistent *within* a particular [set of web pages](). Some complex websites consist of multiple different sets of web pages with different purposes. For example, a web-based spreadsheet application might have one set of pages for editing spreadsheets and a separate set of pages for marketing the application. This success criterion would allow the different sets of web pages to use different help mechanism locations. However, it is best if help mechanisms are located as consistently as possible even among different related sets of web pages.

            

This success criterion contains an exception when "a change is initiated by the user." This exception is intended to cover cases where a user performs an action with the intent of changing the display or layout of a page, such as changing the zoom level, orientation, or viewport size. Help mechanism locations may change in response to such a user-initiated change; as the criterion's second note clarifies, "this criterion is concerned with relative order across pages displayed in the same page variation (e.g., same zoom level and orientation)."

            

This exception allows the location in a smaller viewport to be different than in a larger viewport. However, it is best if the mechanism or link is consistent across a set of web pages. A consistent location, both visually and programmatically, is the most usable.

            

This exception is *not* intended to treat every action that a user might initiate as a "change"; to qualify for the exception, the user must be initiating an action that would reasonably be expected to change the relative order of components within a page. For example, merely navigating between pages within a set of web pages is not a "change initiated by the user" for the purposes of this exception. Similarly, logging into or out of a page would not typically qualify, unless logging in would present the user with a distinct [set of web pages]().

         

         

            

##### Help Mechanisms

            

Typical help mechanisms include:

            

- Human contact details such as a phone number, email address, hours of operation.
- Human contact mechanism such as a messaging system, chat client, contact form, social media channel.
- Self-help option such as an up-to-date Frequently Asked Questions, How Do I page, Support page.
- A fully automated contact mechanism such as a chatbot.

            

The order of the types of help listed in the success criterion does not imply priority.

         

         

            

##### Support for people with cognitive and learning disabilities

            

This section is not required by the Consistent Help success criterion, but provides advice related to [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/#support-user-story).

            

The human contact details enable users to connect with the  organization or the part of the organization that can assist with the content. For example, an online jobs / recruitment portal may provide a contact method for the team that supports the recruitment portal and not a catch-all for the entire company. Each layer of contact added prolongs the time before the user will receive help.

            

The human contact mechanism enables a person to express what they are looking for using their own words. For some with cognitive disabilities, this may be the best way for them to find an answer to their problem.

            

For pages for which no human support is available it helps if a self-help option says that no human support is available. Self-help options can go beyond allowing the user to search within the site. Contextual help is still recommended (see [Success Criterion 3.3.5](help) for more information), but a self-help option provides a single location that makes it easier for people with cognitive disabilities to understand what help is available without having to hunt for it. While some people may easily be able to identify that no support would be available for a particular type of website, this may not be apparent to some users with disabilities.

            

Chatbots can work for many people, and particularly for people with cognitive disabilities if they:

            

- recognize misspelled words,
- provide human contact details if the chatbot is unable to provide a satisfactory response after 3 attempts, and
- can be dismissed with a single interaction, and recalled using a link or button.

            

This criterion does not require that a site provide a help mechanism. However, when help is available:

            

- People who may have difficulty locating help are more likely to find it and complete their task.
- Users that experience cognitive fatigue or cognitive shut down will be able to reserve their energy for the task, instead of using it to find support.
- Enabling users (especially those with cognitive disabilities) to find solutions while expressing their question using their own words (for example by interacting with a chatbot) increases their chances of success for completing a task.

            

Self help methods beyond the site, such as using internet search to find the contact information for an organization, can be too difficult. Further, the user's disability may make it more difficult to find the help available (such as a "contact us" link, phone number, or support page) if the information is not consistently present within a few interactions (e.g., displayed in the header, or via a menu). In addition, for some users with disabilities, struggling to complete a task on a site may cause additional cognitive challenges when searching for help within the site.

            

When a user is quickly able to find help, they are able to complete the task even if they encounter challenges.

### Benefits
- People who may have difficulty locating help are more likely to find it when it is consistently located.

### Examples
- On-line job application: Some of the application questions may be hard for new job seekers to understand even after reading the contextual help. For example, the form may request their identification number, but they may have several and not know which one to enter. Consistently located contact information will enable them to use phone or email so they can get an answer to their question.
- Medical appointment scheduling form: When the service a patient is trying to book is not easily findable within the interface, they may need human help. A consistently located messaging option (chat client) enables them to quickly interact with a staff person that can help, without requiring them to manage a second interface.
- Finding a specific policy or procedure: An employee who needs to complete a work task may have difficulty locating the specific policy or procedure document on their employer's website. A consistently located "How Do I" page may include the information that enables them to independently complete this task.

### Resources
- [Cognitive Accessibility Gap Analysis Topic 6: Familiar Interface](https://www.w3.org/TR/coga-gap-analysis/#table6)
- [Making Content Usable for People with Cognitive and Learning Disabilities 4.8.5 Make it Easy to Find Help and Give Feedback](https://www.w3.org/TR/coga-usable/#make-it-easy-to-find-help-and-give-feedback-pattern)

### Techniques

#### Sufficient Techniques

- G220

#### Failures

- Inconsistent Help Location


---

## 3.3.1 Error Identification (A)

### In brief
**Goal**
: Users know an error exists and what is wrong.

**What to do**
: Provide descriptive notification of errors.

**Why it's important**
: Flagging errors helps people with reduced sight and cognitive disabilities resolve them.

### Intent
The intent of this success criterion is to ensure that users are aware that an error
         has occurred and can determine what is wrong. In the case of an unsuccessful form submission,
         it is not sufficient to only re-display the form without providing any hint that the submission
         failed.
         The error must be indicated in [text]().

         

This SC requires that users be provided with information about the nature of the error, including the identity of the item in error. What the user should do to correct the item in error is covered by 
         [3.3.3 Error Suggestion](error-suggestion). Often, the error description can be phrased so that it meets both SC 3.3.1 and SC 3.3.3 at the same time. For instance, "Email is not valid" would pass SC 3.3.1, but "Please provide a valid email address in the format name@domain.com" also conveys how it can be fixed and passes both.

      

An "input error" includes:

      

- information that is required by the web page but omitted by the user, or
- information that is provided by the user but that falls outside the required data format or allowed values.

      

For example:

      

- the user fails to enter the proper abbreviation in a state, province, or region field;
- the user enters a state abbreviation that is not a valid state;
- the user enters a non existent zip or postal code;
- the user enters a birth date 2 years in the future;
- the user enters alphabetic characters or parentheses into their phone number field that only accepts numbers;
- the user enters a bid that is below the previous bid or the minimum bid increment.

      

> **Note:**
> >          
> 
> If a user enters a value that is too high or too low, and the coding on the page automatically
>             changes that value to fall within the allowed range, the user's error would still
>             need to be described to them as required by the success criterion. Such an error description
>             telling the person of the changed value would meet both this success criterion (Error
>             Identification) and [3.3.3 Error Suggestion](error-suggestion).
> 
> 
>

      

The identification and description of an error can be combined with programmatic information
         that user agents or assistive technologies can use to identify an error and provide
         error information to the user. For example, certain technologies can specify that
         the user's input must not fall outside a specific range, or that a form field is required.
         This type of programmatic information is not required for this success criterion, but may be covered
         by other criteria such as [4.1.2 Name, Role, Value](name-role-value).

      

It is perfectly acceptable to indicate the error in other ways such as through the use of an image,
         color, or other visual indicator, in addition to the text description.

      

> **Note:**
> >          
> 
> This criterion does not mandate any particular way in which errors should be displayed. Depending
>             on the situation, it may be more suitable for all errors to be listed at the start or before a form.
>             In other cases, it may be more appropriate to show errors inline, with error messages next to the specific
>             fields that are in error. Errors could also be listed in an alert, or dialog. This criterion does not
>             cover which of these methods should be used - the only requirement is for errors  to be presented to users in text or a text alternative.
> 
> 
>

      

See also [3.3.3: Error Suggestion](error-suggestion).

      

##### User agent native HTML form validation

      

When using native HTML [client-side form validation](https://html.spec.whatwg.org/multipage/forms.html#client-side-form-validation),
         user agents will automatically prevent the submission of incomplete or invalid forms, and display generic error messages to the user.
         The user agent will generally set focus back to the first form field that is in error, and as a result scroll the page
         so that the field in error and the generated error message will be visible in the viewport.

 
      

In most common user agent and screen reader combinations, the screen reader will announce the error message
         and the programmatic name of the focused field. 
         While this meets the requirements of this success criterion, it should be noted that there are several disadvantages related to this approach:

      

- Depending on the user agent, the message may not be permanent, or fail to scroll with the page.
- Depending on the user agent, even if a user has zoomed-in (magnified) the content, the error messages will not appear magnified,
            as the text in the validation message will be displayed at the same size as the user agent interface; the message may be too small for users to read.
- The default HTML validation error messages are generally quite generic, and they may not provide sufficiently helpful or specific suggestions to the user
            that would conform to [3.3.3 Error Suggestion](error-suggestion).
- If several errors are present, only the first error message is exposed; once the user has provided an input that conforms to the type of field,
            and resubmits the form, the next error (if present) will be exposed. This means that repeated resubmissions and corrections may be required.

    

As these problems relate to user agent behavior, developers will need to carefully consider if native browser validation is [accessibility supported](https://www.w3.org/TR/WCAG22/#dfn-accessibility-supported).

### Benefits
- Providing information about input errors in text allows users who are blind, have low vision, or have color vision deficiency to perceive the fact that an error occurred.
- This success criterion may help people with cognitive, language, and learning disabilities
            who have difficulty understanding the specific reason why a form submission failed (in cases
            where this is not already made obvious by the nature of the form).

### Examples
**Identifying errors in a form submission**
: An airline website offers a special promotion on discounted flights. The user is
               asked to complete a simple form that asks for personal information such as name, address,
               phone number, seating preference and email address. If any of the fields of the form
               are either not completed or completed incorrectly, an alert is displayed notifying
               the user which field or fields were missing or incorrect.

            

> **Note:**
> >                
> 
> This success criterion does not mean that color or text styles cannot be used to indicate
>                   errors. It simply requires that errors also be identified using text.
> 
> 
>

**Providing multiple cues**
: The user fails to fill in two fields on the form.  In addition to describing the error
               and providing a unique character to make it easy to search for the fields, the fields
               are highlighted in yellow to make it easier to visually search for them as well.

### Techniques

#### Sufficient Techniques

- **Situation A: If a form contains fields for which information from the user is mandatory.**
  - G83
  - ARIA21
  - SCR18
  - PDF5
- **Situation B: If information provided by the user is required to be in a specific data format or of certain values.**
  - ARIA18
  - ARIA19
  - ARIA21
  - G84
  - G85
  - SCR18
  - SCR32
  - PDF22

#### Advisory Techniques

- G139
- G199
- ARIA2


---

## 3.3.2 Labels or Instructions (A)

### In brief
**Goal**
: Users know what information to enter.

**What to do**
: Provide labels or instructions for inputs.

**Why it's important**
: Everyone, especially those with cognitive disabilities, will know how to respond.

### Intent
The intent of this success criterion is to have content authors present instructions
         or labels that identify the controls in a form so that users know what input data
         is expected. In the case of radio buttons, checkboxes, comboboxes, or similar controls
         that provide users with options, each option must have an appropriate label so that
         users know what they are actually selecting. 
         Instructions or labels may also specify data formats for data entry fields, especially
         if they are out of the customary formats or if there are specific rules for correct
         input. Content authors may also choose to make such instructions available to users
         only when the individual control has focus especially when instructions are long and
         verbose.

      
      

The intent of this success criterion is not to clutter the page with unnecessary information
         but to provide important cues and instructions that will benefit people with disabilities.
         Too much information or instruction can be just as harmful as too little.
         The goal is to make certain that enough information is provided for the user to accomplish
         the task without undue confusion or navigation.

      

Note that the majority of form control labels are text-based. 
         Using images as labels meets the requirements of the criterion, but care should be taken to ensure that the images are widely understood 
         by the intended target audience. Authors may consider providing additional hints,
         such as text-based tooltips or supplementary text, to support clarity when using image-based labels.

         
      

This success criterion does not require that labels or instructions be correctly marked up, 
         identified, or associated with their respective controls — that aspect is covered separately by
         [1.3.1: Info and Relationships](info-and-relationships). It is possible for content
         to pass this success criterion (providing relevant labels and instructions) while failing
         Success Criterion 1.3.1 (if the labels or instructions aren't correctly marked up, identified, or associated).

      

Further, this success criterion does not take into consideration whether or not alternative methods of
         providing an accessible name or description for form controls and inputs has been used — that aspect is
         covered separately by [4.1.2: Name, Role and Value](name-role-value). It is possible
         for controls and inputs to have an appropriate accessible name or description (e.g. using `aria-label="..."`)
         and therefore pass Success Criterion 4.1.2, but to still fail this success criterion (if the labels or instructions
         aren't presented to all users, not just those using assistive technologies).

      

This success criterion does not apply to links or other controls (such as an expand/collapse widget, or similar
         interactive components) that are not associated with data entry.

      

While this success criterion requires that controls and inputs have labels or instructions, whether or
         not labels (if used) are accurate, sufficiently clear, or descriptive is covered separately by
         [2.4.6: Headings and Labels](headings-and-labels).

      

The use of "requires" in this criterion's normative wording does not mean that the criterion only applies
         to *required* form fields. It is used here as a synonym for "accepts", "expects", or "allows". The criterion
         applies to all form fields, whether they're required or optional.

### Benefits
- Providing labels and instructions (including examples of expected
            data formats) helps all users — but particularly those with cognitive, language, and learning
            disabilities — to enter information correctly.
- Providing labels and instructions (including identification of required
            fields) can prevent users from making incomplete or incorrect form submissions, which prevents
            users from having to navigate once more through a page/form in order to fix submission errors.

### Examples
- A field which asks the user to enter the two character abbreviation for a US state
            has a link next to it which will pop up an alphabetized list of state names and the
            correct abbreviation.
- A field for entering a date has text instructions to indicate the correct format
            for the date.
- On one website, a field with the text label of "username" is provided for someone to create a username to login to a website.
          On another website, there are strict rules about what characters can be used to create a username. On this website additional instructions 
          would need to accompany the field to prevent users from encountering unnecessary errors.
- A website provides a global search field in the header of the site. Any term can be entered,
          so there are no instructions needed, but the field needs a cue to communicate its purpose. Commonly, such search
          field will be paired with a "loupe" or "magnify glass" search icon, serving as its visible label, if not also doubling
          as the visual identifier for the button that submits the search query.
- To enter their name, users are provided with two separate text fields. Rather than
            having a single label "Name" (which would appear to leave the second text field unlabelled),
            each field is given an explicit label — "Given Name" and "Family Name".
- A U.S. phone number separates the area code, exchange, and number into three fields.
            Parentheses surround the area code field, and a dash separates the exchange and number
            fields. While the punctuation provides visual clues to those familiar with the U.S.
            telephone number format, the punctuation is not sufficient to label the fields. The
            single "Phone number" label also cannot label all three fields. To address this, the
            three fields are grouped in a fieldset with the legend "Phone number". Visual labels for
            the fields (beyond the punctuation) cannot be provided
            in the design, so invisible labels are provided with the "title" attribute to each
            of the three fields. The value of this attribute for the three fields are, respectively,
            "Area Code", "Exchange", and "Number".

### Techniques

#### Sufficient Techniques

- G131
- H44
- PDF10
- H71
- G167

#### Advisory Techniques

- G13
- ARIA2

#### Failures

- F82


---

## 3.3.3 Error Suggestion (AA)

### In brief
**Goal**
: Users get suggestions on how to resolve errors.

**What to do**
: Where errors are detected, suggest known ways to correct them.

**Why it's important**
: People can address errors faster and with reduced effort.

### Intent
The intent of this success criterion is to ensure that users receive appropriate suggestions
         for correction of an input error if it is possible. The definition of "input error"
         says that it is "information provided by the user that is not accepted" by
         the system. Some examples of information that is not accepted include information
         that is required but omitted by the user and information that is provided by the user
         but that falls outside the required data format or allowed values.

      
      

Success Criterion 3.3.1 provides for notification of errors. However, persons with
         cognitive limitations may find it difficult to understand how to correct the errors.
         People with visual disabilities may not be able to figure out exactly how to correct
         the error. In the case of an unsuccessful form submission, users may abandon the form
         because they may be unsure of how to correct the error even though they are aware
         that it has occurred.

      
      

The content author may provide the description of the error, or the user agent may
         provide the description of the error based on technology-specific, programmatically
         determined information.

### Benefits
- Providing information about how to correct input errors allows users who have learning
            disabilities to fill in a form successfully.
- Users who are blind or have impaired vision understand more easily the nature of the
            input error and how to correct it.
- People with motion impairment can reduce the number of times they need to change an
            input value.

### Examples
**Additional Help for Correcting An Input Error**
: The result of a form that was not successfully submitted describes an
               input error in place in the page along with the correct input and offers additional
               help for the form field that caused the input error.

**Suggestions from a Limited Set of Values**
: An input field requires that a month name be entered. If the user enters "12," suggestions
               for correction may include:

            
            

- A list of the acceptable values, e.g., "Choose one of: January, February, March, April,
                  May, June, July, August, September, October, November, December."
- The conversion of the input data interpreted as a different month format, e.g., "Do
                  you mean 'December'?"

### Techniques

#### Sufficient Techniques

- **Situation A: If information for a field is required to be in a specific data format:**
  - ARIA18
  - G85
  - G177
  - PDF22
- **Situation B: Information provided by the user is required to be one of a limited set of values:**
  - ARIA18
  - G84
  - G177
  - PDF22

#### Advisory Techniques

- G139
- G199
- SCR18
- SCR32


---

## 3.3.4 Error Prevention (Legal, Financial, Data) (AA)

### In brief
**Goal**
: Users can avoid submitting incorrect important information.

**What to do**
: Provide ways for users to confirm, correct, or reverse important submissions.

**Why it's important**
: People with disabilities may be more likely to make mistakes, or not notice them.

### Intent
The intent of this success criterion is to help users with disabilities avoid serious
         consequences as the result of a mistake when performing an action that cannot be reversed.
         For example, purchasing non-refundable airline tickets or submitting an order to purchase
         stock in a brokerage account are financial transactions with serious consequences.
         If users have made a mistake on the date of air travel, they could end up with
         a ticket for the wrong day that cannot be exchanged. If users made a mistake on
         the number of stock shares to be purchased, they could end up purchasing more
         stock than intended. Both of these types of mistakes involve transactions that take
         place immediately and cannot be altered afterwards, and can be very costly. Likewise,
         it may be an unrecoverable error if users unintentionally modify or delete data stored
         in a database that they later need to access, such as their entire travel profile
         in a travel services website. When referring to modification or deletion of 'user
         controllable' data, the intent is to prevent mass loss of data such as deleting a
         file or record. It is not the intent to require a confirmation for each save command
         or the simple creation or editing of documents, records or other data.

      
      

Users with disabilities may be more likely to make mistakes. People with reading disabilities
         may transpose numbers and letters, and those with motor disabilities may hit keys
         by mistake. Providing the ability to reverse actions allows users to correct a mistake
         that could result in serious consequences. Providing the ability to review and correct
         information gives the user an opportunity to detect a mistake before taking an action
         that has serious consequences.

      
      

User-controllable data is user-viewable data that the user can change and/or delete
         through an intentional action. Examples of the user controlling such data would be
         updating the phone number and address for the user's account, or deleting a record
         of past invoices from a website. It does not refer such things as internet logs and
         search engine monitoring data that the user can't view or interact with directly.

### Benefits
- Providing safeguards to avoid serious consequences resulting from mistakes helps users
            with all disabilities who may be more likely to make mistakes.

### Examples
**Order confirmation**
: A web retailer offers on-line shopping for customers. When an order is submitted,
               the order information—including items ordered, quantity of each ordered item, shipping
               address, and payment method—are displayed so that the user can inspect the order for
               correctness. The user can either confirm the order or make changes.

**Stock sale**
: A financial services website lets users buy and sell stock online. When a user submits
               an order to buy or sell stock, the system checks to see whether or not the market
               is open. If it is after hours, the user is alerted that the transaction will be an
               after-hours transaction, is told about the risks of trading outside of regular market
               hours, and given the opportunity to cancel or confirm the order.

### Techniques

#### Sufficient Techniques

- **Situation A: If an application causes a legal transaction to occur, such as making a purchase or submitting an income tax return:**
  - G164
  - G98
  - G155
- **Situation B: If an action causes information to be deleted:**
  - G99
  - G168
  - G155
- **Situation C: If the web page includes a testing application**
  - G98
  - G168

#### Advisory Techniques

- SCR18
- G199


---

## 3.3.7 Redundant Entry (A)

### In brief
**Goal**
: Make it easier for users to complete multi-step processes.

**What to do**
: Don't ask for the same information twice in the same activity.

**Why it's important**
: Some people with cognitive disabilities have difficulty remembering what they entered before.

### Intent
The intent of this success criterion is to ensure that users can successfully complete multi-step processes. It reduces cognitive effort where information is asked for more than once during a process. It also reduces the need to recall information provided in a previous step.

        
        

Information that is required to be remembered for input can pose a significant barrier to users with cognitive or memory difficulties. All users experience a natural gradual mental fatigue as they proceed through steps in a process. This fatigue is accelerated by the stress of recalling information from short-term working memory. Users with learning, and cognitive disabilities are highly susceptible to mental fatigue.

        
        

Requiring people to recall information previously entered can cause them to give up or re-enter the same information incorrectly. The autocomplete feature of browsers is not considered sufficient because it is the content (the website) that needs to provide the stored information for a redundant entry, or avoid asking for the same information again.

        
        

This success criterion does not add a requirement to store information between sessions. A [process]() is defined on the basis of an activity and is not applicable when a user returns after closing a session or navigating away. However, a process can run across different domains, so if a check-out process includes a 3rd party payment provider, that would be in scope.

        

The term "available to select" is not prescriptive. The term allows authors to develop techniques where auto-population is not possible. It can include allowing the user to:

        

- select and populate a field, including from a drop-down;
- select text from the page and copy it into an input;
- tick a checkbox to populate inputs with the same values as previously entered (e.g., my billing address is the same as my shipping address).

        

Data which is "available to select" would need to be on the same page. Ideally, it would be visible by default and closely associated with the input where the data is required. However, it could be elsewhere on a page, including within a show/hide component.

        

This success criterion does not apply if data is provided by the user with a different method, such as uploading a resume in a document format.

        

This success criterion does not impact [Accessible Authentication (Minimum)](accessible-authentication-minimum.html), for which allowing auto-filling of passwords is a sufficient technique. In that case the filling is performed by the user's browser. Redundant Entry is asking for the website content to make the previous entry available, but not between sessions or for essential purposes such as asking for a password.

        

This criterion does not include requirements or exceptions specific to privacy or personally identifiable information (PII), but when implementing techniques such as auto-population, authors should ensure data protection when storing information even temporarily during a process. It is possible to eliminate redundant entry in ways that do not introduce additional privacy risks, but it is also possible that a poor implementation (for meeting this criterion) could leak additional PII.

        

##### Exceptions

        
        

There are exceptions for:

        

- Essential uses of input re-entry for things like memory games which would be invalidated if the previous answers were supplied.
- Security measures such as preventing a password string from being shown or copied. When creating a password, it should be a unique and complex string and therefore cannot be validated by the author. If the system requires the user to manually create a password that is not displayed, having users re-validate their new string is allowed as an exception.
- When the previously entered information is no longer valid, it can be requested that the user enter that information again.

### Benefits
- Users with cognitive disabilities experience short-term, working memory difficulty. Not having to repeatedly remember particular information reduces stress and the likelihood of mistakes.
- Users who experience difficulty forming new memories, recalling information, and other functions related to cognition can complete processes without having to unnecessarily rely on their memory.
- Users with mobility impairments, for example using switch control or voice input, benefit from a reduced need for text entry.

### Examples
- A form requests the user’s corporate identification number (ID) in the first step of a process to purchase a new computer. In the 3rd step the user is asked to confirm that the computer will belong to the user (rather than a colleague), and re-shows the ID. It allows the user to change the ID, but defaults to the previously entered one.
- A form on an e-commerce website allows the user to confirm that the billing address and delivery address are the same address.
- A user submits a checkout form with an incorrect credit card number in it. The page updates, showing an error message. Submitted information, such as credit card number, is not cleared from the form.
- A search results page pre-fills the search input with the previously entered search term in the same process.

### Resources
- [Cognitive Accessibility Gap Analysis Topic 3: Entering Data, Error Prevention, & Recovery](https://www.w3.org/TR/coga-gap-analysis/#table3)
- [Making Content Usable for People with Cognitive and Learning Disabilities 4.5.4 Design Forms to Prevent Mistakes](https://www.w3.org/TR/coga-usable/#design-forms-to-prevent-mistakes-pattern)

### Techniques

#### Sufficient Techniques

- G221
- Not requesting the same information twice (Potential future technique)


---

## 3.3.8 Accessible Authentication (Minimum) (AA)

### In brief
**Goal**
: Make logins possible with less mental effort.

**What to do**
: Don't make people solve, recall, or transcribe something to log in.

**Why it's important**
: Some people with cognitive disabilities cannot solve puzzles, memorize a username and password, or retype one-time passcodes.

### Intent
The purpose of this success criterion is to ensure there is an accessible, easy-to-use, and secure method for users to authenticate when logging into an existing account. As the most prevalent form of authentication, websites commonly rely on usernames and passwords to log in. However, memorizing a username and password places a very high or impossible burden upon people with certain cognitive disabilities, as do additional steps often added to authentication processes. For instance, the need to transcribe a one-time verification code or requiring a puzzle to be solved.

        

While websites can use the recognition of objects or of non-text content provided by the user to meet this Success Criterion, such techniques do not fully support the cognitive accessibility community and should be avoided if possible. Refer to [Accessible Authentication (Enhanced)](accessible-authentication-enhanced) for guidance to be more inclusive and accessible.

        

This success criterion is focused on authentication of existing users. It does *not* cover creation of a username or initiation of an account.  For many websites, establishing an initial username and credentials may not differ greatly from logging in with that username. The techniques used to satisfy this criterion (particularly allowing pasting into inputs and not relying on transcription) can also reduce the cognitive burden in account creation. However, the focus of the success criterion is on reducing the ongoing need for users to recall previously supplied information each time they log in or otherwise authenticate to an account.

      
        

            

##### Cognitive Function Tests

            
            

Remembering a site-specific password is a [cognitive function test](). Such tests are known to be problematic for many people with cognitive disabilities. Whether it is remembering random strings of characters, or a pattern gesture to perform on a touch screen, cognitive function tests will exclude some people. When a cognitive function test is used, at least one other authentication method must be available which is not a cognitive function test.

            

Some CAPTCHA systems have an audio alternative of the visible text. If the user needs to transcribe this audio, it cannot be used to meet the Alternative exception.

            

            

If there is more than one step in the authentication process, such as with multi-factor authentication, all steps need to comply with this success criterion to pass. There needs to be a path through authentication that does not rely on cognitive function tests.

            

Being able to recover or change the email and password is an important part of authentication. If the user is authenticating with alternative information in order to recover their account, there needs to be a method that is not a cognitive function test.

            

Many organizations are required to use 2-factor authentication that combines independent sources to confirm a user's identity. These sources can consist of combining authentication through:

            

- knowledge (e.g., password, letters in a passphrase or memorized swipe path);
- possession (e.g., a verification code generated or received on a device, or scanning of a QR code on an external device);
- biometrics (e.g., fingerprint scanning, facial recognition or keystroke dynamics).

            

Most knowledge-based authentication methods rely on a cognitive function test, so mechanisms to assist users must be available. When authentication relies on performing an action on a separate device, it should be possible to complete the action without the need to transcribe information. It may not be possible to know what device-based authentication methods are available to a user; offering a choice of methods can allow them to choose the path that most suits them.

        

        

            

##### Authentication Approaches

            

Websites can employ username (or email) and password inputs as an authentication method if the author enables the user agent (browsers and third-party password managers) to fill in the fields automatically. Generally, if the login form meets [Success Criterion 1.3.5 Input Purpose](identify-input-purpose), and the form controls have an appropriate accessible name in accordance with [Success Criterion 4.1.2 Name, Role, Value](name-role-value), the user agent should be able to reliably recognize the fields and automatically fill them in. However, if the user agent is actively blocked from filling in the fields (for instance, by a script), then the page would not pass this criterion because it prevents the mechanism from working.

        

        

            

##### Copy and paste

            

Copy and paste can be relied on to avoid transcription. Users can copy their login credentials from a local source (such as a standalone third-party password manager) and paste it into the username and password fields on a login form, or into a web-based command line interfaces asking for a password. Blocking people from pasting into authentication fields, or using a different format between the copied text and the input field (for example, "Enter the 3rd, 4th, and 6th character of your password"), would force the user to transcribe information and therefore fail this criterion, unless another method is available.

        

        

            

##### Two-factor authentication systems (verification codes)

            

Beyond usernames and passwords, some sites may use two-factor authentication, asking the user to enter a verification code (also called a passcode or one-time password). A service that requires *manual* transcription of a verification code is not compliant. As with usernames and passwords, it must be possible for a user to at least paste the code (such as from a standalone third-party password manager, text message application, or software-based security key), or to allow user agents to fill in the fields automatically.

            

There are scenarios where a verification code must be received or generated on a secondary device. For example, authenticating in a web browser on a laptop requires a verification code that is sent as an SMS text message to a mobile phone. However, in most cases, it is possible for the code to then be sent directly to the primary device, where it can then be copied and pasted (for example, by copying the code on the secondary device and emailing it to the primary device, or through the use of a shared cross-device clipboard where copying content on the secondary device makes it available to paste on the primary device). Evaluating whether or not the code can be seamlessly transferred from the secondary device to the primary device is *outside of the scope* for this success criterion. For the purpose of evaluating web content that relies on authentication using these types of secondary device systems, it is assumed that provisions are in place that make the code available in the user's clipboard. Evaluating this criterion therefore only requires verification that the web content does allow pasting the clipboard content in the related authentication challenge field.

            

Note that two-factor systems that do not rely on codes — including hardware authentication devices (such as YubiKey), secondary applications (either on the same primary device, or on a secondary device) that expect the user to confirm that it is indeed them trying to log in, and authentication methods provided by the user's operating system (such as Windows Hello, or Touch ID/Face ID on macOS and iOS) — are *not* a [cognitive function test]().

        

        

            

##### Object Recognition

            

If a [CAPTCHA](https://www.w3.org/TR/turingtest/) is used as part of an authentication process, there must be a method that does not include a cognitive function test, unless it meets the exception. If the test is based on something the website has set such as remembering or transcribing a word, or recognizing a picture the website provided, that would be a cognitive functional test. Recognizing objects, or a picture the user has provided is a cognitive function test; however, it is excepted at the AA level.

            

An object in this context means the general English definition ("a material thing that can be seen and touched") and can include vehicles and animals. If the test goes beyond recognition (e.g. multiply the number cats by the number of dogs), that does not meet the exception.

            

Some forms of object recognition may require an understanding of a particular culture. For example, taxis can appear differently in different locales. This is an issue for many people, including people with disabilities, but it is not considered an accessibility-specific issue.

        

Some CAPTCHAs and cognitive function tests used for authentication may only appear in certain situations, such as when ad blockers are present, or after repeated incorrect password entry. This criterion applies when these tests are used regardless of whether they are used every time or only triggered by specific scenarios.

        

There are a number of technologies that can be employed to prevent scripted abuse of the authentication process.

            

- [1.1.1. Rate-limited Access](https://www.ietf.org/archive/id/draft-private-access-tokens-01.html#name-rate-limited-access)
- [1.1.2. Client Geo-Location](https://www.ietf.org/archive/id/draft-private-access-tokens-01.html#name-client-geo-location)
- [1.1.3. Private Client Authentication](https://www.ietf.org/archive/id/draft-private-access-tokens-01.html#name-private-client-authenticati)

            

None of these systems are 100% effective. However, they may reduce the likelihood of a CAPTCHA being displayed.

        

        
        

            

##### Personal Content

            

Personal content is sometimes used as a second factor for authentication. For example, as part of account creation the user would upload a picture, and when logging in they would be asked to select that picture from several possible alternatives. Care must be taken to provide adequate security in this case, since non-legitimate users might be able to guess the correct personal content when presented with a choice.

            

Text-based personal content does not qualify for this exception as it relies on recall (rather than recognition), and transcription (rather than selecting an item). Whilst picture-based personal content will still be a barrier for some people, text based versions tend to be a much larger barrier.

        

        

            

##### Hiding characters

            

Another factor that can contribute to cognitive load is hiding characters when typing. Although this criterion requires that users do not have to type in (transcribe) a password, there are scenarios where that is necessary such as creating a password to be saved by a password manager. Providing a feature to optionally show a password can improve the chance of success for some people with cognitive disabilities or those who have difficulties with accurately typing.

### Benefits
People with cognitive issues relating to memory, reading (for example, dyslexia), numbers (for example, dyscalculia), or perception-processing limitations will be able to authenticate irrespective of the level of their cognitive abilities.

### Examples
The examples of this success criterion are the same as the [Accessible Authentication (Enhanced)](accessible-authentication-enhanced.html#examples) examples.

      

- A website uses a properly marked up username (or email) and password fields as the login authentication (meeting [Success Criterion 1.3.5 Input Purpose](identify-input-purpose) and [Success Criterion 4.1.2: Name, Role, Value](name-role-value)). The user's browser or integrated third-party password manager extension can identify the purpose of the inputs and automatically fill in the username and password.
- A website does not block paste functionality. The user is able to use a third-party password manager to store credentials, copy them, and paste them directly into a login form.
- A website uses WebAuthn so the user can authenticate with their device instead of username/password. The user's device could use any available modality. Common methods on laptops and phones are facial-scan, fingerprint, and PIN (Personal Identification Number). The website is not enforcing any particular use; it is assumed a user will set up a method that suits them.
- A website offers the ability to login with a third-party provider using the OAuth method.
- A website that requires two-factor authentication allows for multiple options for the 2nd factor, including a USB-based method where the user simply presses a button to enter a time-based token.
- A website that requires two-factor authentication displays a QR code which can be scanned by an app on a user's device to confirm identity.
- A website that requires two-factor authentication sends a notification to a user's device. The user must use their device's authentication mechanism (for example, user-defined PIN, fingerprint, facial recognition) to confirm identity.

### Resources
- [Cognitive Accessibility Gap Analysis Topic 1: Authentication and Safety](https://www.w3.org/TR/coga-gap-analysis/#table1)
- [Cognitive Accessibility Issue Papers 4. Web Security and Privacy Technologies](https://w3c.github.io/coga/issue-papers/#web-security-and-privacy-technologies) and [Web Security and Privacy Technologies](https://w3c.github.io/coga/issue-papers/privacy-security.html)
- [Making Content Usable for People with Cognitive and Learning Disabilities 4.7.1 Provide a Login that Does Not Rely on Memory or Other Cognitive Skills](https://www.w3.org/TR/coga-usable/#provide-a-login-that-does-not-rely-on-memory-or-other-cognitive-skills-pattern)
- [WebAuthN specification](https://www.w3.org/TR/webauthn/)
- [WebAuthN Demo site](https://webauthn.io/)
- [Web Authentication API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [OAuth on Wikipedia](https://en.wikipedia.org/wiki/OAuth)
- ["Let them paste passwords", from the UK's National Cyber Security Centre (archived)](https://webarchive.nationalarchives.gov.uk/ukgwa/20240306114738/https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords)
- [NIST SP 800-63 Digital Identity Guidelines (Second Public Draft of Revision 4) / SP 800-63B Authentication & Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html)

### Techniques

#### Sufficient Techniques

- G218
- H100
- Providing WebAuthn as an alternative to username/password (Potential future technique)
- Providing a third-party login using OAuth (Potential future technique)
- Using two techniques to provide two-factor authentication (Potential future technique)

#### Failures

- F109


---

## 4.1.2 Name, Role, Value (A)

### In brief
**Goal**
: People using assistive technology understand all components.

**What to do**
: Give components correct names, roles, states, and values.

**Why it's important**
: Assistive technology only works well when code is done properly.

### Intent
The intent of this success criterion is to ensure that Assistive Technologies (AT)
         can gather appropriate information about, activate (or set) and keep up to date on the status of
         user interface controls in the content.

      

When standard controls from accessible technologies are used, this process is straightforward.
         If the user interface elements are used according to specification the conditions
         of this provision will be met. (See examples of Success Criterion 4.1.2 below)

      

If custom controls are created, however, or interface elements are programmed (in
         code or script) to have a different role and/or function than usual, then additional
         measures need to be taken to ensure that the controls provide important and appropriate information
         to assistive technologies and allow themselves to be controlled by assistive technologies.

      

What roles and states are appropriate to convey to assistive technology will depend
         on what the control represents. Specifics about such information are defined by other
         specifications, such as [WAI-ARIA](https://www.w3.org/TR/wai-aria/), or the
         relevant platform standards. Another factor to consider is whether there is sufficient
         [accessibility support]() with assistive technologies to convey the information as specified.

      

A particularly important state of a user interface control is whether or not it has
         focus. The focus state of a control can be programmatically determined, and notifications
         about change of focus are sent to user agents and assistive technology. Other examples
         of user interface control states are whether or not a checkbox or radio button has
         been selected, or whether a collapsible tree view or accordion is expanded or collapsed.

      

> **Note:**
> >          
> 
> Success Criterion 4.1.2 requires a programmatically determinable name for all user
>             interface components. Names may be visible or invisible. Occasionally, the name needs
>             to be visible, in which case it is identified as a label. Refer to the definition of
>             name and label in the glossary for more information.
> 
> 
>

### Benefits
- Providing role, state, and value information on all user interface components enables
            compatibility with assistive technology, such as screen readers, screen magnifiers,
            and speech recognition software, used by people with disabilities.

### Examples
**Accessible APIs**
: A Java applet uses the accessibility API defined by the language.

### Resources
- [Web Accessibility Initiative - Accessible Rich Internet Applications (ARIA)](https://www.w3.org/TR/wai-aria/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [Accessible Name and Description Computation 1.2](https://www.w3.org/TR/accname-1.2/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Techniques

#### Sufficient Techniques

- **Situation A: If using a standard user interface component in a markup language (e.g., HTML):**
  - ARIA14
  - ARIA16
  - G108
- **Situation B: If using script or code to re-purpose a standard user interface component in a markup language:**
  - {"title":"Exposing the names and roles, allowing user-settable properties to be directly set, and providing notification of changes","using":["ARIA16"]}
- **Situation C: If using a standard user interface component in a programming technology:**
  - G135
- **Situation D: If creating your own user interface component in a programming language:**
  - G10

#### Failures

- F59
- F15
- F20
- F42
- F68
- F79
- F86
- F89
- F111


---

## 4.1.3 Status Messages (AA)

### In brief
**Goal**
: Make users aware of important changes in content.

**What to do**
: Let assistive technology notify users about status changes that don't take focus.

**Why it's important**
: People who do not see messages need to be informed about them.

### Intent
The intent of this success criterion is to make users aware of important changes in content that are not given focus, and to do so in a way that doesn't unnecessarily interrupt their work.

			

The intended beneficiaries are blind and low vision users of assistive technologies with screen reader capabilities. An additional benefit is that assistive technologies for users with cognitive disabilities may achieve an alternative means of indicating (or even delaying or suppressing) status messages, as preferred by the user.

The scope of this success criterion is specific to changes in content that involve status messages. A [status message]() is a defined term in WCAG. There are two main criteria that determine whether something meets the definition of a status message:

	

- the message "provides information to the user on the success or results of an action, on the waiting state of an application, on the progress of a process, or on the existence of errors;"
- the message is not delivered via a change in context.

Information can be added to pages which does not meet the definition of a status message. For example, the list of results obtained from a search are not considered a status update and thus are not covered by this success criterion. However, brief text messages displayed *about* the completion or status of the search, such as "Searching...", "18 results returned" or "No results returned" would be status updates if they do not take focus. Examples of status messages are given in the section titled [Status Message Examples](#status-examples) below.

This success criterion specifically addresses scenarios where new content is added to the page without changing the user's context. [Changes of context](), by their nature, interrupt the user by taking focus. They are already surfaced by assistive technologies, and so have already met the goal to alert the user to new content. As such, messages that involve changes of context do not need to be considered and are not within the scope of this success criterion. Examples of scenarios that add new content by changing the context are given in the section titled [Examples of Changes That Are Not Status Messages](#excepted-examples) below.

### Benefits
- When appropriate roles or properties are assigned to status messages, the new content is spoken by screen readers in such a way as to assist blind and low vision users. Most sighted users can observe text peripherally added to the viewport. Such content provides additional information without affecting the user's current point of regard. The ability of an assistive technology to announce such new important text content allows more users to benefit from an awareness of the information in an equivalent manner.
- Assigning proper roles or properties to status messages provides possible future uses and personalization opportunities, such as the potential to be exploited by assistive technologies created for users with some cognitive disabilities. Where page authors elect to design additions to the screen which do *not* change the user's context (i.e., take focus), the information is arguably of less importance than something presented using a modal dialog, which must be acknowledged by the user. As such, depending on the user's preferences, an assistive technology may choose to delay, suppress, or transform such messages so a user is not unnecessarily interrupted; or conversely the assistive technology may highlight such messages where the user finds it optimal to do so.

### Examples
##### Status Message Examples

				

- After a user presses a Search button, the page content is updated to include the results of the search, which are displayed in a section below the Search button. The change to content also includes the message "5 results returned" near the top of this new content. This text is given an appropriate role for a status message. A screen reader announces, "Five results returned".
- After a user presses an Add to Shopping Cart button, a section of content near the Shopping Cart icon adds the text "5 items". A screen reader announces "Five items" or "Shopping cart, five items".
- After a user enters incorrect text in an input called Postal Code, a message appears above the input reading "Invalid entry".  The screen reader announces, "Invalid entry" or "Postal code, invalid entry".
- After a user activates a process, an icon symbolizing 'busy'  appears on the screen. The screen reader announces "application busy".
- An application displays a progressbar to indicate the status of an upgrade. The element is assigned a suitable role. The screen reader provides intermittent announcements of the progress.
- After a user submits a form, text is added to the existing form which reads, "Your form was successfully submitted." The screen reader announces the same message.
- After a user unsuccessfully fills in a form because some of the data is in the incorrect format, text is added to the existing form which reads "5 errors on page". The screen reader announces the same message.
- After a user puts a photo in an album in an online photo app, a [snackbar ](https://material.io/design/components/snackbars.html#) displays the message "Saved in 'Wedding' album", which is also read by a screen reader.

			

			

				

##### Examples of Status Messages that Do Not Add New Text to the Screen

			

This success criterion was intentionally worded to apply primarily when visible text is added to (or becomes visible on) the page. The reason for this is that where new text is displayed, it is intended to be visible to all users. By providing a programmatic means of ensuring the text is also surfaced through assistive technologies, the success criterion provides the same information to users who cannot or may not see it. However, not all changes to content involve the addition of text to the screen. The following are all considerations relevant to this Success Criterion:

				

- Non-displayed text specific to AT users;
- Modification of status text;
- Removal of status text; and
- Non-textual status content, such as images.

				

		

###### Non-displayed text specific to AT users

		
		

There may be cases where the addition of visible text does not by itself convey sufficient information to the user of assistive technology. For example, the proximity of new content to other pieces of information on the screen may provide a visual context that is lacking in the text alone.

		

In such cases, authors may wish to designate additional content for inclusion in the status message, including non-displayed text which can be provided to the assistive technologies, for added context. Important considerations regarding the appropriate use of such techniques are further discussed in the Sufficient Techniques.

				

				

		

###### Modification of status text

		

If a status message persists on the page, modifications to this text are usually equivalent to a new status message. An example would be a shopping cart which updates text from reading "0 items" to "3 items". Typical methods of writing such changes in the page content result in the entire modified text string being considered a new change, and thus read by assistive technologies. However, where only the number in this string was coded as an updated chunk of content, the resulting experience for screen reader users could be to only hear "three", which may not be sufficient information to provide context for the user. In such situations, marking the entire "3 items" string as the status text would normally be a better solution. See Sufficient Techniques for more discussion, including the use of `aria-atomic`. In this case it would also be a courtesy to add offscreen text such as "in shopping cart" to the message.

				

				

		

###### Removal of status text

		

In situations where status text is entirely removed, its absence may itself convey information about the status. The most obvious example of this is where a message is displayed that the system is "busy" or "waiting". For a sighted user, when this text disappears, it is normally an indication that the state is now available. However non-sighted users would be unaware of this change, unless the end of the waiting state results in a change of context for the user. Where updating the visible message (e.g., to "system available") is not feasible, the use of a non-visible status message, such as "system available", ensures equivalent status information is provided. See Sufficient Techniques for more discussion.

				

				

		

###### Non-textual status content

		

Changes in content are not restricted to text changes. Where an icon or sound indicates a status message, this information will be surfaced by the screen reader through a combination of two things: 1) existing WCAG requirements governing text alternatives (under SC 1.1.1 Non-Text Content), and 2) the requirement of this current success criterion to supply an appropriate role.

				

			

		
			

				

##### Examples of Changes That Are Not Status Messages

			

The following examples identify situations where no additional author action is necessary. All cases are excepted from this success criterion since they do not meet the definition of "status messages."

			

- An author displays an error message in a dialog.

				

Since the dialog takes focus, it is defined as a change of context and does not meet the definition of a status message. As a result of taking focus, the new change of context is already announced by the screen reader, and thus does not need to be included in the scope of this success criterion.
- Content is exposed or hidden when a user interacts with a user interface component, for example expanding components such as a menu, select, accordion or tree, or selecting a different tab item in a tablist.

				

None of the resulting changes to content meet the definition of status messages. Further, all components that meet the definition of a user interface component already have requirements specified under [4.1.2 Name, Role, Value](name-role-value), including the need to make notifications of changes to values and states available to user agents, including assistive technologies. As a result, changes in state, such as "expanded" or "collapsed," would be announced by the screen reader, and thus the user would be alerted to the 'addition' or 'removal' of content. As such, such content does not need to be addressed by this success criterion.
- After a user completes a survey question which indicates they are unhappy, a series of new questions are added to the page about customer satisfaction.

				

The new inputs do not meet the definition of status message. They do not "provide information to the user on the success or results of an action, on the waiting state of an application, on the progress of a process or on the existence of errors," and so are not required to meet this success criterion.

				

Creating a status message about these questions being added, or notifying the user in advance that content changes may take place based on the user's response, are best practices but are not requirements in this scenario.

			

		

		

##### Other uses of live regions or alerts

Live regions and alerts can be usefully applied in many situations where a change of content takes place which does not constitute a status message, as defined in this success criterion. However, there is a risk of making an application too "chatty" for a screen reader user. User testing should be carried out to ensure the appropriate level of feedback is achieved. The Advisory Techniques provide examples of how alerts or live regions can enhance the user experience.

The purpose of this success criterion is not to force authors to generate new status messages. Its intent is to ensure that when status messages *are* displayed, they are programmatically identified in a way that allows assistive technologies to present them to the user.

### Techniques

#### Sufficient Techniques

- **Situation A: If a status message advises on the success or results of an action, or the state of an application:**
  - ARIA22
- **Situation B: If a status message conveys a suggestion, or a warning on the existence of an error:**
  - ARIA19
- **Situation C: If a status message conveys information on the progress of a process:**
  - ARIA23
  - Using <code>role="progressbar"</code> (future link)
  - {"and":["ARIA22","G193"],"andConjunction":"in combination with"}

#### Advisory Techniques

- Using aria-live regions with chat clients (future link)
- Using aria-live regions to support <a href="content-on-hover-or-focus">1.4.13 Content on Hover or Focus</a> (future link)
- Using <code>role="marquee"</code> (future link)
- Using <code>role="timer"</code> (future link)
- ARIA18
- SCR14

#### Failures

- F103
- Using <code>role="alert"</code> or <code>aria-live="assertive"</code> on content which is not important and time-sensitive (future link)


---
