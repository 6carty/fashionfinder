# FashionFinder - Social Fashion Community Platform

![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=springboot&logoColor=white&style=flat)
![JHipster](https://img.shields.io/badge/JHipster-blue?style=flat)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=flat)

An Instagram-style social platform for fashion enthusiasts. Users can post outfits, follow others, like and comment on posts, and browse a live community feed.

---

## Screenshots

> Screenshots pending

---

## Features

- Community Feed - Browse posts from other users with real-time like counts and top comments
- User Profiles - Profile pictures, post history, and personal stats
- Likes and Comments - Interact with posts in real time
- Authentication - Secure login and session management
- Responsive UI - Clean layout across screen sizes

---

## Architecture

```
FashionFinder
├── Frontend        Angular 15 + TypeScript
│   ├── Community Feed Component
│   ├── Side Navigation Component
│   ├── Post / Comment / Likes Components
│   └── User Profile Components
│
├── Backend         Spring Boot (Java)
│   ├── REST API endpoints
│   ├── JHipster entity generation
│   └── JDL data modelling
│
└── Infrastructure  Docker + Docker Compose
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular, TypeScript, SCSS |
| Backend | Spring Boot, Java |
| API | REST APIs |
| Scaffolding | JHipster, JDL |
| DevOps | Docker, Docker Compose |
| Version Control | Git |

---

## My Contribution

This was a team project built during the second year of my BSc in AI and Computer Science at the University of Birmingham.

I was responsible for the frontend community features:

- Built the Community Feed component - fetches all posts via REST API, filters out the current user's own posts, and renders a sorted feed of other users' content
- Implemented real-time like counts per post by calling the Likes API and aggregating results per post ID
- Built comment preview logic - fetches comments per post and displays the most recent one inline in the feed
- Built the Side Navigation component - displays the logged-in user's own posts and total likes received
- Integrated user profile resolution - maps post author IDs to usernames and profile pictures via chained API calls
- Handled authenticated session state using Angular's AccountService to scope all data to the logged-in user

---

## Running Locally

This project requires the JHipster backend and database to be running before the frontend will function.

```bash
# Install frontend dependencies
npm install

# Run frontend development server
ng serve

# In a separate terminal - start the backend
./mvnw
```

The application will be available at http://localhost:4200

Docker can also be used to spin up the full stack:

```bash
docker-compose up
```

---

## Lessons Learned

- Chaining multiple async API calls in Angular requires careful subscription management - nested subscriptions create race conditions and were refactored during development
- JHipster accelerates scaffolding significantly but requires time to understand what is generated and why
- Building a feature end-to-end across UI, API, and data layers gave practical insight into how full stack systems communicate

---

## Team

Built collaboratively as part of the Full Stack Programming module, University of Birmingham, 2024.

---

## Contact

Haydon Carty - [LinkedIn](https://linkedin.com/in/haydon_carty) · [GitHub](https://github.com/6carty) · haydoncarty@hotmail.co.uk
