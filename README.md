# Experimental Serverless Vercel Functions (SUNO AI API + PARTY CARD)

## English Version

### Project Overview

This experimental API generates personalized party cards in JSON format. It serves as the backend for the [Party Card web application](https://party-card.vercel.app), providing structured data for digital celebration cards. This project also show example using SUNO AI API.

### Main Technologies

- **Vercel** - Hosting the API and frontend application.
- **TypeScript** - Main language of the project
- **Zod** - Validation of data structures.
- **LangChain** - Integration with language models.
- **ChatOpenAI/ChatDeepSeek** - Connection to various AI models.
- **Suno API AI** - For creating music.

### Key Features (PARTY CARD)

- Generates complete party card configurations
- Supports multiple card elements (text, tag clouds, wish walls)
- Customizable fonts, colors, and layouts
- Integration with both OpenAI and DeepSeek models
- Structured JSON output with Zod validation


### Important Notes - SUNO AI

This is an experimental project. The API endpoints hosted on Vercel require API keys to function. The project originally included music generation capabilities using sunoAI, but this feature was simplified in the final implementation.

**How it works:**
1. You describe what kind of music you want
2. Our system talks to Suno AI to create the song


**You can just see work with suno AI**


---

## Polish Version - Wykorzystane Technologie

Ten eksperymentalny interfejs API generuje spersonalizowane kartki imprezowe w formacie JSON. Służy jako zaplecze dla aplikacji [Party Card web application](https://party-card.vercel.app), dostarczając ustrukturyzowane dane dla cyfrowych kart okolicznościowych. Ten projekt pokazuje również przykład użycia SUNO AI API.

### Technologie Główne

- **Vercel** - Hosting API oraz aplikacji frontendowej
- **TypeScript** - Główny język projektu
- **Zod** - Walidacja struktur danych
- **LangChain** - Integracja z modelami językowymi
- **ChatOpenAI/ChatDeepSeek** - Połączenie z różnymi modelami AI
- **Suno API AI** - Do tworzenia muzyki

### Część Party Card

Projekt jest częściowo wykorzystywany w aplikacji [Party Card](https://party-card.vercel.app), która pozwala na tworzenie spersonalizowanych kart okolicznościowych. Co ciekawe:

- Endpointy na Vercelu wymagają kluczy API
- Generowanie kart odbywa się poprzez zaawansowane promptowanie
- System został uproszczony względem pierwotnych założeń

### Eksperymentalna Część sunoAI

Początkowo projekt zawierał integrację z sunoAI do generowania muzyki na kartach, ale ostatecznie ta funkcjonalność została uproszczona. Mimo to, kod zachował pewne elementy tego eksperymentu.

**Jak to działa:**
1. Opisujesz jaką muzykę chcesz - Poprzez API
2. Nasz system prosi Suno AI o stworzenie utworu



### Dlaczego to fajne?

Bo łączy kreatywność z technologią! Wyobraź sobie, że AI pomaga ci stworzyć idealną kartę urodzinową - wybiera kolory, czcionki i układa życzenia w artystyczny sposób. A wszystko to działa w chmurze, dzięki Vercel. To mały, ale ciekawy przykład jak AI może wspierać ludzką kreatywność zamiast ją zastępować. 🎉