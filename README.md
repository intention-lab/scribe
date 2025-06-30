# Scribe UI

This repo provides a very simple **static** (web) UI for Scribe with the following main features:

- Authentication with Auth0
- CSS styling with Tailwind

It does **not** contain any server mechanism. The simplest might be to use:

```
python3 -m http.server 8000
```

## Tailwind CSS

Install Tailwind CSS and the [the Tailwind CLI tool](https://tailwindcss.com/docs/installation/tailwind-cli) with

```
npm install tailwindcss @tailwindcss/cli
```

Re-generate the static `public/css/main.css` file with:

```
./update_css.sh
```

See [the documentation](https://tailwindcss.com) for more details.

## Static content

The required content to serve as a static website is:

- `public/*`
- `auth_config.json`
- `index.html`
