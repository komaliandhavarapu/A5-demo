# OpenWithLove — Real Scrapbook Anniversary

This is a responsive, page-by-page anniversary scrapbook based on the six main compositions visible in the supplied video, followed by a newly added seventh-page anniversary finale with an animated flower bouquet. It adds a closed-cover opening and custom interactions, but does not claim the original video showed those exact interactions.

## Preview
Open `index.html` in Chrome. Tap **Open our story** on the cover. Scroll within a page when its contents exceed the screen. Use **Turn page**, Previous, progress dots, keyboard arrow keys, or swipe left/right on a touch screen. Press Escape to return to the cover.

## Personalize everything in `config.js`
Change `personOne`, `personTwo`, `anniversaryDate`, headings, postcard message, letter, captions, closing message, every photo path, and `musicPath` there. Newlines in text values are supported.

## Photos
The supplied couple photos (`memory1.jpg` through `memory11.jpg`) are already connected to the cover, heart scene, collage, postcard, letter, and archive in `config.js`. A few photos are reused to fill all thirteen scrapbook frames. Replace any `photos` path in `config.js` with another JPG/PNG whenever you like.
The photo frames and page elements animate into view again each time you turn to a page. Visitors who prefer less motion get the reduced-motion setting respected by their device.

## Music
The supplied `assets/music/birthday.mp3` track is configured for playback. Change `musicPath` in `config.js` to use a different song. The play/pause button stays fixed on the cover and every page. Visitors cannot upload or change the song on-screen. Browsers generally require the visitor to tap Play before playback can begin.
The heart-page photo cards are connected to the illustrated heart with animated, glowing lines. Page and photo entrances replay on page turns; reduced-motion preferences are respected.

## What is reference-based vs newly added
The video visibly supports the anniversary title/photo composition, heart collage, “AMOR DE MI VIDA” typography collage, postcard, handwritten letter, and “Our Love Archive” photo collage. The closed cover, one-page navigation, physical-style page-turn animations, and persistent music button are additions requested for this version. The recording does not prove the original uses those exact transitions.

## Hosting
Upload the entire extracted folder to your hosting provider. Keep `index.html`, `style.css`, `config.js`, `script.js`, and the `assets` folder together. Use only customer photos and music you have permission to publish.
