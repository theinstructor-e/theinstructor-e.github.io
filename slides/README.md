# Lesson Slide Decks

The package landing page is `slides/index.html` (live at `/slides/`). It shows all decks with
topics, key takeaways, a download button, and a per-device "mark reviewed" tracker.

Current decks live here and are wired into the Slides tab on the landing page:

- tdy-for-schools.pptx — TDY for Schools (13 slides)
- army-community-service.pptx — Army Community Service (10 slides)
- education-benefits-17e.pptx — Education Benefits for 17E Soldiers (11 slides)
- promotion-board-prep.pptx — Promotion Board Preparation (23 slides)
- warrior-tasks-battle-drills.pptx — Warrior Tasks and Battle Drills (12 slides)
- career-map-17e.pptx — Professional Development: 17E Career Map (13 slides)
- tsp-briefing.pptx — Thrift Savings Plan Briefing for New Soldiers (11 slides)

To add another deck: drop the `.pptx` file in this folder, then
1. add an entry to the `SLIDES` array in the root `index.html` (powers site search and the Slides tab):
   `{nm: 'title', ds: 'description', file: 'slides/filename.pptx'}`
2. add an entry to the `DECKS` array in `slides/index.html` (powers this landing page): id, code, title,
   track, slide count, topics, key takeaways, and file name.
3. add the deck's title to the dropdown in `slides/certificate/index.html`.

To replace one of the decks above: just overwrite the file with the same filename — no
changes needed in index.html.
