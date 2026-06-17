# Secret Menu Builder

A React + Vite site with an interactive secret menu order builder, blog, about page, and privacy policy.

## Local development

```
npm install
npm run dev
```

## Build for production

```
npm run build
```

This outputs a `dist/` folder ready to deploy anywhere static (Vercel, Netlify, etc).

## Deploying to Vercel

1. Push this folder to a GitHub repo, OR drag-and-drop the whole folder into vercel.com/new
2. Vercel auto-detects Vite — no config needed
3. Click Deploy
4. Once live, go to Project Settings → Domains → Add your custom domain
5. Vercel will give you DNS records (usually an A record and/or CNAME) to add at your domain registrar

## Connecting your Name.com domain

1. In Vercel: Project → Settings → Domains → enter your domain (e.g. yourdomain.com) → Add
2. Vercel shows you DNS records to set, typically:
   - A record: `76.76.21.21` pointing to `@`
   - CNAME record: `cname.vercel-dns.com` pointing to `www`
3. Log into Name.com → My Domains → click your domain → DNS Records
4. Add the records Vercel gave you (delete any conflicting A/CNAME records on `@` or `www` first)
5. Save, then wait 10 minutes to a few hours for DNS to propagate
6. Vercel will auto-detect the change and issue a free SSL certificate (https://)
