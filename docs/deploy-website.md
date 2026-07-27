# Website Deploy

This is the homepage-local copy of the website deployment workflow documented
in `../career/docs/deploy-website.md`, adjusted for this repository.

## Trigger

Deploy the homepage only when explicitly requested.

## What Gets Published

Oxford server homepage deploy publishes:

- `index.html`
- `style/`
- `images/`

Target:

```text
awb:public_html/
```

The Oxford deploy intentionally does not publish `cv.pdf`. The live CV is a
separate file on the same server and is published through `../career`; see
`docs/deploy-cv.md`.

GitHub Pages is a separate target. It publishes the tracked contents of the
`master` branch from the repository root after `git push`.

## Command

From this repository root:

```bash
scp -r index.html style images awb:public_html/
```

## Prerequisites

- `scp`
- passwordless SSH access to the `awb` host alias

## Sync From Career

For publication, talk, CV, and career facts, `../career` is the primary working
repo. This homepage repo is updated manually when those facts should appear on
the public website.

Checklist:

1. Update the relevant source material in `../career`.
2. Update `index.html` or other homepage assets here if the website should
   reflect the change.
3. Preview or inspect the homepage change locally.
4. Commit and push this repo if requested.
5. Deploy this homepage if requested.
6. Publish the live CV separately if requested.

## Homepage Files

- `index.html`: main page content
- `style/main.css`: active styling
- `images/peleg.jpg`: profile image
- `.nojekyll`: keeps GitHub Pages from applying Jekyll processing

## CV Link

The homepage links to `cv.pdf`.

On the Oxford server, that file is published by the CV workflow in
`../career`, not by the homepage deploy command above.

In GitHub Pages, the tracked root `cv.pdf` is published by GitHub Pages after a
push. Update it only when intentionally refreshing the GitHub Pages copy.

## Publication Year Rule

Journal papers and preprints should normally use the same bibliographic year on
the homepage and in the CV.

Conference papers on the homepage may use the conference event year even when
the proceedings volume appeared later.

Current documented example:

- `Discrepancies of subtrees` is 2024 in the CV bibliography.
- The homepage may show CTW 2023.

This is intentional and should not be corrected unless the convention itself
changes.

## Related Docs

- `README.md`
- `WORKFLOWS.md`
- `docs/deploy-cv.md`
- `../career/docs/deploy-website.md`
