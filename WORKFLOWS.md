# Homepage Workflows

## Related Docs

- `README.md`: repository overview and live targets
- `docs/deploy-website.md`: homepage deployment
- `docs/deploy-cv.md`: live CV publishing
- `../career/WORKFLOWS.md`: career-side publication, talks, and CV workflows

## Operating Rules

Deployment is always manual. Do not deploy the homepage or publish the CV unless
explicitly asked.

The homepage and the live CV are separate deployments:

- homepage files deploy to `awb:public_html/`
- the live CV deploys to `awb:public_html/cv.pdf`

Updating one does not update the other.

## Updating Homepage Facts

Use this when a publication, talk, or other public profile fact changes.

1. Update the relevant source material in `../career`.
2. If the public homepage should reflect the change, update this repo manually.
3. Preview or inspect the homepage change locally.
4. Commit and push this repo if requested.
5. Deploy the homepage if requested.
6. If the live CV should also change, publish the CV separately.

There is no automatic sync between `../career` and this homepage repo.

## Deploying The Homepage

From this repository root:

```bash
scp -r index.html style images awb:public_html/
```

This deploys the Oxford server homepage only. It intentionally does not upload
`cv.pdf`; use `docs/deploy-cv.md` for the live CV.

GitHub Pages is separate: pushing `master` publishes the repository through
GitHub Pages.

## Publishing The CV

The CV source and publish script live in `../career`.

From `../career`:

```bash
./scripts/publish_cv.sh
```

The script rebuilds `cv/cv.pdf`, backs up the previous remote CV, generates a
text diff, archives the old remote file, uploads the new PDF to
`awb:public_html/cv.pdf`, and verifies the upload.

## Publication Year Convention

For journal papers and preprints, the homepage and the CV should normally use
the same bibliographic year.

For conference papers, the homepage may display the conference event year even
when the proceedings volume appeared later.

Current documented example:

- `Discrepancies of subtrees` is 2024 in the CV bibliography.
- The homepage may show CTW 2023.

This is intentional and should not be corrected unless the convention itself
changes.
