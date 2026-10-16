# Ninja Tech

The studio website for Ninja Tech, a web and AI development studio in Lahore. It is a multi-page site covering what the studio does, the work, the team, and how to get in touch. It also hosts a couple of live demo pages for the NexaBot assistant.

Live site: https://ninjatechdev.com

## Tech

Plain HTML, CSS, and JavaScript. No framework and no build step.

## Pages

- `index.html`, the home page
- `services.html`, what the studio offers
- `portfolio.html`, selected work
- `about.html`, about the studio
- `team.html`, the team
- `contact.html`, the contact form
- `demo-nexabot.html` and `demo-vanya.html`, live chatbot demos
- `style.css` and `script.js`, shared styling and scripts

## Running it locally

Because it is a static site, you can open `index.html` in a browser. To test it the way it runs online, serve the folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Deployment

Deployed on Railway. Pushing to the main branch updates the live site.

## Author

Saima Hamid, Ninja Tech, Lahore. https://ninjatechdev.com
