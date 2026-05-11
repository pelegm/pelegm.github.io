# pelegm.github.io

This is the source repository for Peleg Michaeli's public homepage.

The canonical checkout is:

```text
/home/peleg/dev/uni/pelegm.github.io
```

`/home/peleg/dev/uni/homepage` is a symlink to this same directory.

## Start Here

- `WORKFLOWS.md`: homepage update, deploy, and CV-publishing overview
- `docs/deploy-website.md`: deploy the homepage to the Oxford server
- `docs/deploy-cv.md`: publish the live CV through `../career`

## Live Targets

- GitHub Pages: https://pelegm.github.io/
- Oxford server target: `awb:public_html/`

## Editing

Edit the static homepage files directly:

- `index.html`
- `style/main.css`
- `images/peleg.jpg`
- `cv.pdf` only if intentionally updating the GitHub Pages copy

For CV facts, publication facts, talks, and other career material, edit
`../career` first and then sync the homepage manually if needed.

## Deploying

Deployment is always manual. Do not deploy the homepage or publish the CV unless
explicitly asked.

GitHub Pages publishes the `master` branch automatically after a push:

```bash
git add -A
git commit -m "Update homepage"
git push
```

Oxford server homepage deploy:

```bash
scp -r index.html style images awb:public_html/
```

Live CV deploy is separate and runs from `../career`:

```bash
cd ../career
./scripts/publish_cv.sh
```
