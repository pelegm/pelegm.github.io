# CV Deploy

This is the homepage-local copy of the live CV deployment workflow documented
in `../career/docs/deploy-cv.md`.

## Trigger

Publish the live CV only when explicitly requested.

Building the CV locally and publishing the live CV are separate actions.

## What Gets Published

- local source: `../career/cv/cv.tex`
- local artifact: `../career/cv/cv.pdf`
- live target on server: `awb:public_html/cv.pdf`

The homepage links to `cv.pdf` on the server, but homepage deployment is a
separate workflow. Updating the live CV does not update this homepage repo, and
deploying this homepage does not update the live CV.

## Command

From the `../career` repository root:

```bash
./scripts/publish_cv.sh
```

Equivalently, from this repository root:

```bash
cd ../career
./scripts/publish_cv.sh
```

## Prerequisites

The script expects:

- `latexmk`
- `pdftotext`
- `scp`
- `ssh`
- passwordless SSH access to the `awb` host alias

## What The Script Does

`../career/scripts/publish_cv.sh` performs the following steps:

1. rebuild `../career/cv/cv.pdf`
2. create `../career/backup/` locally if needed
3. download the current remote `cv.pdf` into `../career/backup/`
4. convert the old and new PDFs to text
5. save a text diff under `../career/backup/`
6. archive the previous remote `cv.pdf` on the server as `cv-<timestamp>.pdf`
7. upload the new `../career/cv/cv.pdf` to `awb:public_html/cv.pdf`

## Outputs

Local backup artifacts go under `../career/backup/` and are intentionally
ignored by git in the career repo.

Typical files created locally:

- `../career/backup/cv-remote-<timestamp>.pdf`
- `../career/backup/cv-remote-<timestamp>.txt`
- `../career/backup/cv-current-<timestamp>.txt`
- `../career/backup/cv-diff-<timestamp>.txt`

## Verification

After running the script:

- confirm the upload completed successfully
- inspect the textual diff if the CV changed materially
- optionally open the live `cv.pdf` through the website

## GitHub Pages Copy

This homepage repo currently also has a tracked root `cv.pdf`. That file is
published by GitHub Pages after a push, but it is not the source for the Oxford
server CV workflow. Update it only when intentionally refreshing the GitHub
Pages copy.

## Related Docs

- `README.md`
- `WORKFLOWS.md`
- `docs/deploy-website.md`
- `../career/docs/deploy-cv.md`
