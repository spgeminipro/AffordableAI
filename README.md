# MultiModelLab — AI-Fiesta-like MVP

Ask once → compare answers from multiple AIs side-by-side.

## Quick Start (non-technical)

1. Create these free accounts:
   - **Vercel** (hosting): https://vercel.com/signup
   - **OpenAI** (API key): https://platform.openai.com/
   - **Anthropic** (API key): https://console.anthropic.com/
   - **Google AI Studio** (API key): https://aistudio.google.com/
2. Download this project (or clone), then create a **GitHub** account and new repo.
3. Upload all files to your GitHub repo.
4. In **Vercel**, click **New Project** → Import your GitHub repo.
5. When Vercel asks for **Environment Variables**, add:
   - `OPENAI_API_KEY` — from OpenAI
   - `ANTHROPIC_API_KEY` — from Anthropic
   - `GOOGLE_API_KEY` — from Google AI Studio
6. Click **Deploy**. After 1–2 minutes, you’ll get your live URL.
7. Open `/chat` on your site and try a question.

That’s it! You now have an AI-Fiesta-style site.
