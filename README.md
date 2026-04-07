<!-- PROJECT LOGO -->

<br />
<p align="center">
    <a href="https://github.com/Droptop-Four/Droptop-Api">
        <img src="https://user-images.githubusercontent.com/66331265/229746054-eb3759dd-fb32-4f1f-9d9d-45b5f3764c33.png"
            alt="Logo" width="300" height="300">
    </a>
</p>

<!-- TITLE -->

<h1 align="center">Update Global Data</h1>

<!-- INTRO -->

<p align="center">
    This is a Cloudflare Worker for updating global data files hosted on Github from the Droptop Four API.
</p>

<!-- DROPTOP SITE -->

<p align="center">
    <a href="https://droptopfour.com"><img
            src="https://img.shields.io/static/v1?label=Droptop+Four&message=Website&color=50AE5C&style=for-the-badge" alt="Droptop Four Website"></a>
</p>

<!-- BUTTONS -->

<p align="center">
    <a href="api.droptopfour.com/v1"><img 
					 	src="https://github.com/Droptop-Four/droptop-api-update-global-data/actions/workflows/deploy.yml/badge.svg" alt="Api Status"></a>
		·
    <a href="https://github.com/Droptop-Four/droptop-api-update-global-data/stargazers"><img
            src="https://img.shields.io/github/stars/Droptop-Four/droptop-api-update-global-data.svg" alt="Stars"></a>
    ·
    <a href="https://github.com/Droptop-Four/droptop-api-update-global-data/network"><img
            src="https://img.shields.io/github/forks/Droptop-Four/droptop-api-update-global-data.svg" alt="Forks"></a>
    ·
    <a href="https://github.com/Droptop-Four/droptop-api-update-global-data/blob/master/LICENSE"><img
            src="https://img.shields.io/github/license/Droptop-Four/droptop-api-update-global-data.svg" alt="License"></a>
    ·
    <a href="https://GitHub.com/Droptop-Four/droptop-api-update-global-data/issues/"><img
            src="https://img.shields.io/github/issues/Droptop-Four/droptop-api-update-global-data.svg" alt="Issues"></a>
    ·
    <a href="https://GitHub.com/Droptop-Four/droptop-api-update-global-data/pull/"><img
            src="https://img.shields.io/github/issues-pr/Droptop-Four/droptop-api-update-global-data.svg" alt="Pull Requests"></a>
</p>

<!-- DROPTOPFOUR DOWNLOAD -->
<p align="center">
    <a href="https://github.com/Droptop-Four/Droptop-Four/releases/latest"><img
            src="https://img.shields.io/static/v1?label=Download&message=Droptop+Four&color=50AE5C&style=for-the-badge" alt="Download Droptop Four"></a>
</p>

<!-- DROPTOPFOUR DISCORD -->

<p><h2 align="center">Join the Community Now!!</h2></p>

<!-- DISCORD BANNER -->

<p align="center">
  <a href="https://discord.gg/aGQ6uE4Fgp" target="_blank">
    <img src="https://discordapp.com/api/guilds/800124057923485728/widget.png?style=banner3" alt="Discord Community Invite"/>
  </a>
</p>

<!-- DROPTOPFOUR CONTACTS -->

<p><h2 align="center">Contacts</h2></p>

<!-- CONTACTS -->

<p align="center">
    <a href="https://www.deviantart.com/cariboudjan/art/droptop-four-762812007">
      <img src="https://img.shields.io/badge/DeviantArt-05CC47?style=for-the-badge&logo=deviantart&logoColor=white" alt="deviantArt"></a>
    <a href="https://github.com/Droptop-Four">
      <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="Github"></a>
    <a href="https://cariboudjan.gumroad.com/l/droptop">
      <img src="https://img.shields.io/badge/Gumroad-36A9AE?style=for-the-badge&logo=gumroad&logoColor=white" alt="Gumroad"></a>
    <a href="https://discord.gg/aGQ6uE4Fgp">
      <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
</p><br><br>

### Use the worker

1. `npm install` to install all dependencies
2. Create `.dev.vars` for the secrets
3. `npm run dev` to start the worker with secrets
4. To test the scheduled event, you can use `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"`
5. Push to github to deploy
