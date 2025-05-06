# Gaming Website

A modern gaming website built with React, TypeScript, and Vite.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect to your Git provider and select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `Frontend`
6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify login` to authenticate
3. Navigate to the Frontend directory: `cd Frontend`
4. Run `netlify deploy` and follow the prompts
5. For production deployment, run `netlify deploy --prod`

## Environment Variables

If your application requires environment variables, you can set them in the Netlify UI under Site settings > Build & deploy > Environment variables. 