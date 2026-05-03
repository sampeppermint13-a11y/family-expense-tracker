# Netlify Deploy Notes

Signup/login requires Netlify Functions and Netlify Blobs. If the app shows
`Signup needs the Netlify API functions`, the deployed site cannot reach
`/api/bootstrap`.

Use a Git-based Netlify deploy from this folder so Netlify installs
`package.json`, reads `netlify.toml`, and deploys `netlify/functions/api.mjs`.

Required files:

- `index.html`
- `styles.css`
- `app.js`
- `package.json`
- `netlify.toml`
- `netlify/functions/api.mjs`

Netlify settings:

- Build command: leave blank, or use `npm install`
- Publish directory: `.`
- Functions directory: `netlify/functions`

After deploy, test:

- Open `https://YOUR-SITE.netlify.app/api/bootstrap`
- Expected response: `{"hasUsers":false}` or `{"hasUsers":true}`

If that URL is 404, the functions were not deployed. Redeploy from Git or make
sure `netlify.toml` and the `netlify/functions` folder are included at the site
root.
