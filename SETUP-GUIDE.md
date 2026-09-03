# Setting up your website — a total beginner's walkthrough

This guide assumes you've never done anything like this before. It explains
every click, and explains any technical word the first time it comes up.

**What you're building:** a real website, on the internet, at your own
domain, that costs nothing to run — and that you and Emma can log into and
edit yourselves (change text, swap photos) without ever touching code.

**How it works, in plain terms:** your website is just a folder of files
(already built, sitting in this folder on your computer). Those files need
to live somewhere online. You'll use three free services, each doing one
job:

- **GitHub** — stores your website's files online (like Dropbox, but for
  website files, and it's what the next two services plug into).
- **Netlify** — takes those files and actually puts them on the internet as
  a working website, at your own domain.
- **DecapBridge** — gives you and Emma a simple screen where you log in,
  see boxes of text (tagline, bios, etc.), edit them, and click Publish —
  no code, ever.

You'll create a free account with each of the three. I can't create these
for you — sign-ups need to be done by a real person — but everything else
(all the actual website code) is already built and ready to go.

**Time:** the first pass takes about 45–60 minutes, done slowly. You only
do this once. After today, editing the site takes a minute.

A couple of words you'll see a lot, explained once up front:

- **Repository** ("repo") — think of it as a folder, on GitHub, that holds
  all your website's files.
- **Commit** — GitHub's word for "save." When you upload or change a file,
  you'll click a button that says something like "Commit changes" — that
  just means "save this."
- **Deploy** — the process of a service (Netlify) taking your files and
  turning them into a live, visitable website.
- **Domain** — your website address, e.g. `hereandnow.org.uk`.

---

## Part 1 — Put your website's files on GitHub

1. Open a web browser and go to **[github.com](https://github.com)**.
2. Click **Sign up**, in the top right, and create a free account (email,
   password, username). Confirm your email if it asks you to.
3. Once you're logged in, look for a green button that says **New** (or a
   **+** icon near the top right, then **New repository**). Click it.
4. You'll see a form:
   - **Repository name**: type `here-and-now-website`
   - Leave it set to **Public** (this just means the files can be seen by
     anyone — that's fine, since there's nothing private in them, and it's
     required for the free hosting in Part 2)
   - Leave every checkbox unticked (don't add a README, .gitignore, or
     license)
   - Click the green **Create repository** button
5. You'll land on a mostly-empty page for your new repository. Look for a
   link in the middle of the page that says something like **uploading an
   existing file** and click it.
6. Now open the **Here & Now Website** folder on your computer (the one
   this guide is sitting in) in a normal Finder/Explorer window. Select
   *everything* inside it — `index.html` and the other page files
   (`the-bulletin.html`, `v-is-for-victims.html`, `archive.html`,
   `about.html`), `styles.css`, `site.js`, all the `content-*.json` files,
   the `admin` folder, the logo and photo image files, all of it — and
   drag the whole selection into the browser window, onto the area that
   says "drag files here."
7. Wait for the upload to finish (a progress bar or list of file names will
   appear), then scroll down and click the green **Commit changes** button.
   Your files are now saved on GitHub.

---

## Part 2 — Put the website on the internet with Netlify

1. Go to **[netlify.com](https://netlify.com)**.
2. Click **Sign up**. Choose **Sign up with GitHub** — this links your new
   Netlify account to the GitHub account from Part 1, which makes the next
   step much easier. Approve the connection if GitHub asks you to confirm.
3. Once you're in the Netlify dashboard, look for a button like **Add new
   site**, and choose **Import an existing project**.
4. It will ask which provider your code is on — choose **GitHub**. It may
   ask you to approve access to your repositories — say yes.
5. A list of your repositories will appear. Click on
   **here-and-now-website** (the one from Part 1).
6. It will show you some "build settings" — you don't need to change or
   understand any of these. Leave everything as it is, scroll down, and
   click the button that says **Deploy site** (or similar).
7. Wait about a minute. Netlify will give you a working web address that
   looks like `something-random-1234.netlify.app`. Click it to check your
   website actually loads — you should see the Here & Now homepage.

### Connecting your real domain name (can be done now or later)

1. In your Netlify site's dashboard, find **Domain settings** (or **Domain
   management**) in the menu.
2. Click **Add a domain**, and type in your actual domain (e.g.
   `hereandnow.org.uk`).
3. Netlify will show you some instructions for "DNS records" to add. DNS
   is just the system that points a domain name at a specific website —
   think of it as the domain's forwarding address. You'll need to log into
   wherever you originally bought/registered the domain, find its DNS
   settings, and add the records Netlify shows you (Netlify's on-screen
   instructions tell you exactly what to type — just copy them across
   carefully).
4. This can take anywhere from a few minutes to a few hours to "go live."
   Once it does, Netlify automatically adds a free padlock/security
   certificate (HTTPS) — no extra step needed from you.

You can skip this bit for now and come back to it later — everything else
in this guide works fine on the temporary `netlify.app` address in the
meantime.

---

## Part 3 — Create a "key" so DecapBridge can edit your site

DecapBridge (Part 4) needs permission to make changes to the files on
GitHub on your behalf. You give it that permission with something called
an **access token** — think of it as a special password, just for this one
purpose, that you generate yourself and hand over once.

1. Go to **<https://github.com/settings/tokens>** (you'll need to be
   logged into GitHub).
2. Click **Generate new token**, then choose **Fine-grained token** from
   the options shown.
3. Fill in the form:
   - **Token name**: anything you like, e.g. `decapbridge`
   - **Expiration**: pick a long option (e.g. 1 year), or "No expiration"
     if that's offered
   - **Repository access**: choose **Only select repositories**, then pick
     `here-and-now-website`
   - Scroll to **Repository permissions**, find **Contents**, and change
     it from "No access" to **Read and write**
   - While you're in that same list, also find **Pull requests** and
     change it to **Read and write** too — DecapBridge needs both
4. Scroll down and click **Generate token**.
5. GitHub will show you a long string of letters and numbers — this is
   your token. **Copy it now and paste it somewhere safe** (a notes app is
   fine, temporarily). GitHub will never show you this exact code again
   once you leave this page.

---

## Part 4 — Set up DecapBridge (your login-and-edit screen)

1. Go to **[decapbridge.com](https://decapbridge.com)** and click to sign
   up for a free account.
2. In its dashboard, look for a button to **add a site**, and fill in the
   form it shows you:
   - **Git provider**: choose **GitHub**
   - **Git repository**: type `your-github-username/here-and-now-website`
     (replace `your-github-username` with your actual GitHub username)
   - **Git access token**: paste the long code you copied in Part 3
   - **CMS login URL**: type `https://yourdomain.com/admin/index.html` —
     use your real domain if it's connected already, otherwise use your
     `netlify.app` address from Part 2 for now (you can update this later)
   - **Auth type**: choose **Classic** — this is the simplest option and
     means you and Emma will just set a password to log in. (There's also
     a "PKCE" option that lets you log in with a Google account instead,
     if you'd prefer that.)
3. Click **Create site**. DecapBridge will now show you a box of code
   starting with the word `backend:` — leave this tab open, you need it
   in the next step.

### Pasting that code into your website's files

1. Go back to your repository on GitHub (`github.com`, then your
   `here-and-now-website` repo).
2. Click into the **admin** folder, then click on the file called
   **config.yml**.
3. Click the small pencil icon (usually top right of the file view) to
   edit it.
4. Near the top of the file, you'll see a section that starts with
   `backend:` followed by a couple of placeholder lines, and a comment in
   capital letters telling you to replace it. Select and delete just that
   `backend:` section (everything from the word `backend:` down to —  but
   not including — the line that says `media_folder:`).
5. Paste in the code DecapBridge showed you in the previous step, in its
   place.
6. Scroll down and click **Commit changes** to save.

### Inviting yourself and Emma

1. Back in DecapBridge, open your site's page and find a tab called
   **Manage collaborators**.
2. Type in your own email and Emma's email (one at a time) and click
   invite/send for each.
3. You'll each get an email with a link to set a password (or sign in with
   Google, if you chose PKCE earlier). Follow that link and set it up.

---

## Part 5 — Try it out

1. Go to `https://yourdomain.com/admin/index.html` (or your `netlify.app`
   address + `/admin/index.html` if the domain isn't connected yet).
2. Log in with the password you just set.
3. You should see a simple screen with a list of sections down the side —
   Homepage, About, The Bulletin, V is for Victims, Archive — Our Story,
   Looking Back, Shipwright Ensemble, About — Team, Mailing List — each
   one full of plain text boxes and photo-upload buttons.
4. Click into any section, change some text, and click **Publish** (or
   **Save**, then **Publish**).
5. Wait about a minute — Netlify automatically rebuilds the live site
   whenever you publish a change — then refresh your actual website in
   another tab to see the change appear.

That's it. From here on, updating the site is just: log in, edit the box,
click Publish.

---

## Still outstanding (content to add whenever you're ready — not a setup step)

- Real bios for you and Emma, and your headshot photos — easiest to just
  add these directly through the CMS once it's live.
- The mailing-list signup form still points at a placeholder web address.
  There's a copy of this form on every page (`index.html`, `about.html`,
  `the-bulletin.html`, `v-is-for-victims.html`, `archive.html`) — each one
  has a line starting `action="https://REPLACE-WITH-YOUR-BREVO-ACTION-URL`
  that needs swapping for your real Brevo sign-up link. Do a find-and-replace
  for `REPLACE-WITH-YOUR-BREVO-ACTION-URL` across all five files so they
  all point to the same real form.
- The Bulletin's venue and how-often, and V is for Victims' venue, cast
  and creatives, are all placeholders (anything in `[SQUARE BRACKETS]`) —
  fill these in through the CMS as details are confirmed.
- Typefaces are Barlow Condensed and Inter, both free via Google Fonts —
  no paid font license to buy or manage.
- `content-shows.json` is left over from an earlier version of the site
  and isn't used by any page any more — safe to ignore, or ask me to
  remove it if you'd rather tidy it away.

---

## Adding a new strand later (e.g. Peckham Public Theatre)

The site is built so a new production or venue — a fourth tile alongside
The Bulletin, V is for Victims and Archive — can be added without touching
any of the existing pages. When you're ready to announce one, come back
and ask me to do this, or follow these steps yourself:

1. **Copy a page as a template.** Duplicate `the-bulletin.html`, rename
   the copy (e.g. `peckham-public-theatre.html`), and update its `<title>`,
   the `page-hero` heading/copy, and its `window.PAGE_CONTENT_FILES` line
   to point at a new content file (e.g. `content-peckham.json`).
2. **Give it its own photo.** In the new page's `page-hero`, swap the
   `<img class="photo" src="...">` for a photo of your own (or another
   free-license stock photo).
3. **Add a content file.** Create `content-peckham.json` with whatever
   fields that strand needs (status, body, venue, tickets_url, etc.),
   following the pattern in `content-bulletin.json`.
4. **Wire it into the CMS.** In `admin/config.yml`, copy the `bulletin`
   entry, rename it, and point it at the new content file so you can edit
   the new page without touching code.
5. **Add it to navigation.** Add a new tile to the `home-tiles` block in
   `index.html` (copy one of the existing three `<a class="home-tile">`
   tiles), and a new link in the `nav-links` block at the top of every
   page.

That's the whole pattern — one new page, one new content file, one new
config entry, one new tile, one new nav link.
