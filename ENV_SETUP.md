# Quick Environment Setup Guide

## 🚀 Quick Start (30 seconds)

### 1. Copy the example file
```bash
cp .env.example .env.local
```

### 2. Add your Nightcrawler API key
Edit `.env.local` and replace `your_bearer_token_here` with your actual API key:

```env
NIGHTCRAWLER_API_KEY=your_actual_key_here
```

### 3. Restart the dev server
```bash
npm run dev
```

That's it! ✅

---

## 📋 Current Environment Variables

Your `.env.local` file should contain:

```env
# Nightcrawler API Configuration
NIGHTCRAWLER_API_URL=https://api.sendmarc.com/nightcrawler
NIGHTCRAWLER_API_KEY=your_bearer_token_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Marcy Chat API (AI summary on SPF/domain check)
# Get from Marcy/Sendmarc admin. Do not use NEXT_PUBLIC_ for the key.
MARCY_API_BASE_URL=https://your-marcy-api-host
MARCY_CHAT_API_KEY=your_marcy_chat_api_key_here

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=
```

---

## 🔑 Where to Get Your API Key

1. Log into Sendmarc dashboard
2. Navigate to API Settings or Developer Tools
3. Generate or copy your Nightcrawler API key
4. Paste it into `.env.local`

---

## ✅ Verify It's Working

### Test API Connection
Visit: http://localhost:3000/tools/dmarc-checker

Enter a domain and click "Check DMARC". If it works, your API key is configured correctly!

### Check Environment Variables
```bash
# Should show "Set"
node -e "console.log(process.env.NIGHTCRAWLER_API_KEY ? 'API Key: Set ✅' : 'API Key: Not Set ❌')"
```

---

## 🚨 Important Security Notes

**DO:**
- ✅ Keep `.env.local` on your computer only
- ✅ Use different API keys for dev/production
- ✅ Add API keys in Vercel dashboard for deployment

**DON'T:**
- ❌ Commit `.env.local` to git
- ❌ Share your API key in Slack/email
- ❌ Use `NEXT_PUBLIC_` for the API key

---

## Marcy Chat API (AI summary)

When a user runs an SPF/domain check, the app can call Marcy to get an AI summary (SPF + DMARC analysis). This requires:

- **MARCY_API_BASE_URL** – Marcy API host (e.g. `https://marcy-api.example.com`)
- **MARCY_CHAT_API_KEY** – Marcy Chat API key (separate from CRM/widget keys)

If these are not set, the AI summary area will show an error ("Marcy API not configured") and the user can still see the raw SPF results. Do not use `NEXT_PUBLIC_` for the API key so it stays server-side only.

---

## 🐛 Troubleshooting

### "NIGHTCRAWLER_API_KEY environment variable is not set"
- Check `.env.local` exists in the root directory
- Check the variable name is exactly `NIGHTCRAWLER_API_KEY`
- Restart your dev server after editing `.env.local`

### API calls failing with 401 Unauthorized
- Your API key might be invalid or expired
- Check you copied the entire key (no spaces/line breaks)
- Try generating a new API key

### Changes to .env.local not taking effect
- Restart the dev server: `npm run dev`
- Clear Next.js cache: `rm -rf .next`

---

## 📚 More Information

- Full security guidelines: See `SECURITY.md`
- Next.js env docs: https://nextjs.org/docs/basic-features/environment-variables
- Vercel deployment: https://vercel.com/docs/concepts/projects/environment-variables

---

**Need Help?** Check `SECURITY.md` for detailed information or contact the team.
