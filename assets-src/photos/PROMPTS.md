# Kannaadi.Ai — model photography to generate

Generate each image below (any photoreal generator: Canva, Adobe Firefly, Midjourney, Imagen, …), save it in this
folder as `<slot>.jpg` (or .png/.webp), then run `npm run photos` and `npm run build`. Slots without a file keep the
placeholder art, so you can add them one at a time.

- **Image 2 (the AI layer) is created automatically** from your photo, so it is always the same woman, pose and crop.
- **Optional sidecar `<slot>.json`** — strongly recommended for anything showing a face:
  `{ "face": { "x": 0.62, "y": 0.12, "w": 0.12, "h": 0.16 }, "focal": [0.7, 0.4] }` (fractions of the final
  cropped frame). Inside the face box the AI layer stays natural (no lines across the face) and gets corner brackets.
- The four `look-*` images must be the **same woman in the same pose and framing**: generate `look-ink` first, then
  create the others from it as an image reference, changing only the saree colour.
- Use clearly adult models; no real person’s likeness; check the generator’s licence allows commercial use.

## `hero` — 2400×1300 (generate at landscape 16 9, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Wide landscape composition: a sophisticated South Indian woman stands on the RIGHT third of the frame, three-quarter length, body angled slightly toward the left of frame. She wears a contemporary deep claret-wine Kanchipuram-inspired silk saree with a fine gold zari border, pallu neatly draped over the left shoulder, a modern fitted blouse. Minimal jewellery: small gold jhumka earrings, one slim necklace, a few thin bangles. Sleek low bun with a small strand of jasmine, small bindi. The LEFT two-thirds of the frame is empty plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background (space for headline text). Modern luxury fashion campaign — not a bride, no heavy jewellery, no wedding setting.

Alt text used on the site: “A South Indian woman in a contemporary Kanchipuram-inspired silk saree, photographed for a fashion editorial. Moving the pointer over her reveals the same photograph as an AI scan.”

## `fashion-stores` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. A South Indian woman in a modern pastel cotton-silk saree with a contemporary blouse stands beside a minimal clothing rail of sarees, kurtas and fusion jackets in a bright, minimal premium fashion store with warm ivory walls and soft daylight. She holds a hanger and looks at the garment. Clean, uncluttered, editorial retail campaign.

Alt text used on the site: “A South Indian woman in a modern cotton-silk saree browsing a rail of ethnic and fusion wear in a bright fashion store”

## `saree-ethnic-stores` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Saree-focused composition: a South Indian woman, full length, centred, in a rich emerald Kanchipuram-inspired silk saree with a wide gold temple zari border and a pallu held slightly open in one hand so the pallu design is clearly visible; neat front pleats. Small jhumkas, a few bangles, jasmine in the hair. plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background. The saree drape is the hero of the image.

Alt text used on the site: “A South Indian woman in a Kanchipuram-inspired silk saree showing the drape, gold zari border and pallu”

## `bridal-stores` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Premium South Indian bridal portrait, three-quarter length, centred: a bride in a traditional red-and-gold Kanchipuram silk bridal saree, tasteful temple jewellery (one necklace set, jhumkas, maang tikka), jasmine in a braided bun, elegant bridal makeup. Refined and realistic, not overloaded. plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background.

Alt text used on the site: “A South Indian bride in a traditional Kanchipuram silk bridal saree with tasteful temple jewellery”

## `boutiques` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. High-end boutique campaign: a South Indian woman in a designer fusion ethnic outfit (pre-draped modern saree with a structured blouse, muted sage and gold) stands in an intimate boutique with a brass rail of a few curated garments and an arched mirror; warm ivory and brass tones, calm and minimal.

Alt text used on the site: “A South Indian woman in a designer fusion outfit in a curated boutique with an arched mirror”

## `shopping-malls` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. A South Indian woman in a smart contemporary salwar-kurta stands in front of a tall freestanding digital fitting-mirror kiosk in a premium, bright shopping mall concourse; the screen shows her wearing a different saree. Realistic retail environment, soft focus background, no visible brand names.

Alt text used on the site: “A South Indian shopper using a tall virtual fitting room screen in a premium mall”

## `events-exhibitions` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Premium fashion-tech brand activation at an exhibition: a South Indian woman in a modern half-saree inspired outfit interacts with a large interactive virtual try-on screen on an elegant branded stand with warm spotlights; a few softly blurred visitors in the background. Sophisticated, not a crowded trade-show stock photo, no visible brand names.

Alt text used on the site: “A South Indian woman trying a virtual try-on screen at a premium fashion-tech brand activation”

## `jewellery-stores` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Jewellery-focused close portrait from mid-chest up: a South Indian woman in a simple deep green silk blouse and saree, wearing clearly visible gold jhumka earrings, one elegant layered gold necklace and a couple of bangles with her hand gently near her collarbone. Jewellery in sharp focus and the clear visual focus. plain seamless deep charcoal studio backdrop with soft cinematic falloff, nothing else in the background.

Alt text used on the site: “Close portrait of a South Indian woman wearing gold jhumka earrings, a layered necklace and bangles”

## `eyewear-stores` — 1200×900 (generate at landscape 4 3, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Eyewear-focused head-and-shoulders portrait: a South Indian woman wearing modern tortoiseshell acetate optical glasses, correctly fitted and aligned on her face with realistic lens reflections, in a contemporary ivory cotton saree, hair in a low knot. plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background.

Alt text used on the site: “Portrait of a South Indian woman wearing modern tortoiseshell glasses”

## `look-ink` — 1100×1300 (generate at portrait 4 5, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Full-length, centred, standing straight facing the camera with a slight three-quarter turn: a South Indian woman in a deep ink-black silk saree with a fine silver zari border, pallu over the left shoulder, contemporary blouse, small jhumkas, sleek low bun. plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background. Identical framing for every colourway.

Alt text used on the site: “A South Indian woman in a deep ink-black silk saree with a fine silver zari border”

## `look-champagne` — 1100×1300 (generate at portrait 4 5, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Full-length, centred, standing straight facing the camera with a slight three-quarter turn: a South Indian woman in a champagne-ivory silk saree with a fine gold zari border, pallu over the left shoulder, contemporary blouse, small jhumkas, sleek low bun. plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background. Identical framing for every colourway.

Alt text used on the site: “A South Indian woman in a champagne-ivory silk saree with a fine gold zari border”

## `look-forest` — 1100×1300 (generate at portrait 4 5, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Full-length, centred, standing straight facing the camera with a slight three-quarter turn: a South Indian woman in a forest-green Kanchipuram-inspired silk saree with a gold border, pallu over the left shoulder, contemporary blouse, small jhumkas, sleek low bun. plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background. Identical framing for every colourway.

Alt text used on the site: “A South Indian woman in a forest-green Kanchipuram-inspired silk saree with a gold border”

## `look-claret` — 1100×1300 (generate at portrait 4 5, or larger)

> Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), modest professional presentation, no text, no logos, no watermark. Full-length, centred, standing straight facing the camera with a slight three-quarter turn: a South Indian woman in a claret-wine Kanchipuram-inspired silk saree with a gold border, pallu over the left shoulder, contemporary blouse, small jhumkas, sleek low bun. plain seamless warm ivory studio backdrop with a very gentle gradient, nothing else in the background. Identical framing for every colourway.

Alt text used on the site: “A South Indian woman in a claret-wine Kanchipuram-inspired silk saree with a gold border”
