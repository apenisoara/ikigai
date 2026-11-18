# Ikigai Finder

**A reflective tool for exploring your interests, strengths, possible career paths, and the ways you could contribute to the world.**

Ikigai Finder is an interactive web application inspired by the concept of *Ikigai* and the book [Ikigai: The Japanese Secret to a Long and Happy Life](https://www.goodreads.com/book/show/124950497-ikigai) by Héctor García and Francesc Miralles.

The application guides users through four reflective questions and uses AI to generate a personalized reflection based on their answers.

> **Important:** Ikigai Finder is an independent project inspired by the popular Western four-circle interpretation of Ikigai. It is not an official application of the book or a definitive representation of the traditional Japanese concept.

---

## Table of Contents

- [About the Project](#about-the-project)
- [The Four Pillars of Ikigai](#the-four-pillars-of-ikigai)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [AI Integration and Security](#ai-integration-and-security)
- [Privacy and Data Handling](#privacy-and-data-handling)
- [Limitations](#limitations)
- [Credits](#credits)

---

## About the Project

Ikigai Finder was created to make personal reflection more accessible and interactive.

Instead of providing generic career recommendations, the application asks users to consider four different aspects of their lives:

- What they genuinely enjoy.
- What they are good at.
- What they could potentially earn money from.
- What they believe the world needs.

By connecting these perspectives, users can explore possible directions that combine their interests, abilities, opportunities, and sense of purpose.

The application uses an AI-powered analysis to turn these answers into a structured reflection, including possible directions, explanations, and suggested next steps.

**The goal is not to tell someone what to do with their life. It is to help them discover possibilities they might not have considered.**

## The Four Pillars of Ikigai

The application uses the popular four-circle model, with four overlapping areas:

| Pillar | Guiding question | Meaning |
|---|---|---|
| Love | What do you love? | Interests, passions, and activities that make you feel engaged. |
| Strengths | What are you good at? | Skills, talents, knowledge, and personal strengths. |
| Work | What could you be paid for? | Professional opportunities and economically valuable abilities. |
| Contribution | What does the world need? | Problems you care about and positive changes you would like to support. |

The four areas are used as a practical reflection framework. Their overlap represents a possible direction worth exploring.

**A note on the concept:** The four-circle diagram is a popular modern interpretation rather than a traditional Japanese definition of Ikigai. In Japanese usage, Ikigai has a broader meaning connected to what makes life worthwhile. It does not necessarily have to involve a career, income, or professional achievement.

## Features

### Personal reflection questionnaire
- Four guided questions based on the Ikigai framework.
- Open-ended answers instead of restrictive multiple-choice questions.
- Form validation and helpful input guidance.

### AI-powered analysis
- Generates a personalized reflection from the submitted answers.
- Identifies possible directions and connections between the four pillars.
- Provides explanations for why particular directions might fit.
- Suggests practical next steps.

### Interactive design
- Responsive interface for desktop and mobile devices.
- Interactive four-circle Ikigai diagram.
- Animated visual elements and hover interactions.
- Four supported interface languages:
  - English
  - German
  - French
  - Romanian

### Results and export
- Structured and readable analysis results.
- Streaming responses to display AI output as it arrives.
- Option to print results or save them as a PDF.
- Option to open an email draft containing the results.

### Reliability and protection
- Cloudflare Turnstile human verification.
- Request cooldowns and daily client-side limits.
- Server-provided rate-limit handling.
- Optional performance monitoring and analytics.

## How It Works

The application follows a simple workflow:

1. **Answer the questions:** Users describe their interests, strengths, possible professional opportunities, and desired contributions.
2. **Human verification:** Cloudflare Turnstile helps protect the analysis endpoint from automated abuse.
3. **Submit answers:** The frontend sends the answers to the backend API.
4. **AI analysis:** The backend processes the request and obtains an AI-generated reflection.
5. **Display results:** The frontend renders the response into readable sections and lists.
6. **Save or revisit:** Users can print, save, or email their results and reconsider their answers later.

The analysis is not a scientifically validated personality assessment, career test, or professional recommendation. Its purpose is personal exploration.

## Technology Stack

The project uses a lightweight frontend architecture and a separately hosted backend service.

| Technology | Purpose |
|---|---|
| HTML5 | Application structure and content |
| CSS3 | Styling, animations, and responsive layout |
| JavaScript (ES Modules) | Application logic, interactions, and API communication |
| Cloudflare Workers | Hosting the AI API endpoint |
| Google Gemini | AI-powered response generation |
| Cloudflare Turnstile | Human verification |
| Datadog RUM | Optional browser monitoring and performance analytics |
| GitHub Pages | Static frontend hosting |

The frontend does not require a JavaScript framework or a package installation to run its basic interface.

## Project Structure

The main frontend files are organized as follows:

```text
ikigai/
│
├── index.html                 # Main application and questionnaire
├── about.html                 # Project information and usage guide
├── privacy.html               # Privacy notice
│
├── style.css                  # Styling and responsive layout
├── script.js                  # Main application logic and API integration
├── diagram.js                 # Interactive Ikigai diagram
│
├── i18n.js                    # Main interface translations
├── about-i18n.js              # About page translations
├── privacy-i18n.js            # Privacy page translations
│
├── about.js                   # About page functionality
├── privacy.js                 # Privacy page functionality
│
├── datadog-obs-bootstrap.js   # Optional monitoring initialization
├── app-version.js             # Application version information
│
├── assets/                    # Images, icons, and other static assets
│
└── scripts/                   # Development and maintenance scripts
```

Additional localization and maintenance files may be present in the repository.

## AI Integration and Security

The AI integration is separated from the frontend.

This architecture is important because private API credentials should never be embedded in publicly accessible JavaScript files.

The frontend sends a POST request containing the four answers, selected language, human-verification token, and anonymous client identifier to the Cloudflare Worker endpoint.

The frontend supports streaming responses as well as a JSON response format. Streaming allows the application to display an interim response while the analysis is being generated.

Additional safeguards include:

- Turnstile verification before analysis.
- Client-side request cooldowns.
- A daily client-side request limit.
- Handling of server-provided retry information.
- Abortable requests to prevent outdated analysis operations from continuing unnecessarily.

The frontend's local rate limiting is an additional usability safeguard, not a substitute for server-side enforcement.

## Privacy and Data Handling

Privacy is an important part of the project.

The application includes a dedicated [Privacy Notice](privacy.html), which explains how information is handled.

The application also includes optional Datadog monitoring, with a consent interface that allows users to accept or decline optional analytics.

A few important principles:

- Do not enter sensitive personal information into the questionnaire.
- Do not include private information about other people.
- Treat AI-generated results as suggestions for reflection.
- Review the Privacy Notice for details about processing, browser storage, and optional monitoring.

The project is designed with the EU/Belgian privacy context in mind.

## Limitations

Ikigai Finder is an exploratory tool, and it has some important limitations:

- AI-generated results can be incomplete, inaccurate, or overly general.
- The quality of the reflection depends partly on the clarity and specificity of the submitted answers.
- Suggested directions are possibilities, not guaranteed career matches.
- The AI service has limited capacity, so users may occasionally encounter waiting periods or rate limits.
- The application requires an available backend service for AI analysis.
- The four-circle model simplifies a much broader concept of Ikigai.

Users should approach the results with curiosity rather than treating them as definitive answers.

## Credits

**Created by CheckerAndu and DaredCentaur802.**

Inspired by:

*Ikigai: The Japanese Secret to a Long and Happy Life*  
By Héctor García and Francesc Miralles.

This project is an independent implementation and is not affiliated with the book's authors or publishers.

---

*Explore your interests. Recognize your strengths. Discover new possibilities.*

**ikigai.finder**
