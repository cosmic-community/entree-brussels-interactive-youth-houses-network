# Entree Brussels - Interactive Youth Houses Network

![App Preview](https://imgix.cosmicjs.com/c21917f0-8342-11f0-ae77-a10f7aa054c0-photo-1557804506-669a67965ba0-1756298319514.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A fun, interactive, and playful website for Entree Brussels that connects young people with youth houses across the city. Features an interactive Brussels map, animated project showcases, and dynamic content management.

## ✨ Features

- **🗺️ Interactive Brussels Map** - Leaflet.js powered map with animated markers for each youth house
- **🏠 Youth House Discovery** - Detailed pages with activities, contact info, and photo galleries
- **📋 Dynamic Projects** - Animated project cards with filtering and detailed views
- **🎨 Playful Animations** - Floating shapes, micro-interactions, and smooth hover effects
- **📱 Responsive Design** - Optimized for desktop and mobile experiences
- **⚡ Performance Optimized** - Built with Next.js 15 and optimized images
- **🎯 Brand-Focused** - Uses Entree's vibrant brand colors and design language
- **📞 Contact Integration** - Animated contact form with brand styling

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a fun, interactive, and playful website homepage for Entree (entree.brussels).
>
> Overall vibe
> 	•	Use Entree's brand colors throughout the site.
> 	•	Incorporate Entree's graphic shapes and assets as moving/animated elements (floating, sliding, bouncing, or gently morphing) to bring energy and playfulness.
> 	•	The design should feel dynamic and interactive, appealing to young people but still clean and professional.
> 	•	Add micro-animations on hover (e.g. buttons, cards, map markers).
> 
> Structure
> 	1.	Navigation bar (top)
> 	•	Left: "Home" and "Projects"
> 	•	Center: reserved space for the Entree logo
> 	•	Right: "About" and "Contact"
> 	•	Fun detail: shapes can move in/out of the navbar on scroll.
> 	2.	Hero section
> 	•	A large interactive map of Brussels as the main feature.
> 	•	Each youth house is marked with a custom animated marker (in Entree's style).
> 	•	Hover: small popup with name + short info.
> 	•	Click: open a new youth house detail page with full info (address, activities, contact, images, etc.).
> 	•	Background: subtle animated Entree shapes floating around the map area.
> 	3.	Projects section (under the map)
> 	•	Display as animated project cards in a playful grid or carousel.
> 	•	Each card: title, short description, image/icon, and "Read more" button.
> 	•	On hover: card pops up slightly, shapes animate around it.
> 	4.	Contact form (bottom)
> 	•	Simple, but styled with colors + animated shapes in the background.
> 	•	Fields: Name, Email, Message.
> 	•	Submit button: fun animation on hover/click (e.g. color shift, bouncing effect).
> 
> Design Guidelines
> 	•	Colors: Entree's brand palette (bright, youthful, contrasting colors).
> 	•	Shapes: use Entree's assets as playful animations that move gently in the background, on hover, and on scroll.
> 	•	Typography: bold, modern, and easy to read.
> 	•	Animations: smooth, not distracting — should feel like the site is alive.
> 	•	Responsive design: works equally well on desktop and mobile.
> 
> Technical notes
> 	•	Interactive map: use Leaflet.js, Mapbox, or a similar modern framework.
> 	•	Make animations lightweight (CSS/JS-based, optimized for performance).
> 	•	The movement of shapes should be subtle, not overwhelming."

### Code Generation Prompt

> Build a Next.js website that uses my existing objects in this bucket
> Create a fun, interactive, and playful website homepage for Entree (entree.brussels).

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom animations
- **CMS**: Cosmic headless CMS
- **Maps**: Leaflet.js with custom markers
- **Language**: TypeScript
- **Package Manager**: Bun
- **Deployment**: Vercel ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Cosmic account and bucket
- Bun package manager (recommended)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Cosmic credentials to `.env.local`:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

5. Run the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Cosmic SDK Examples

### Fetch Youth Houses with Location Data
```typescript
import { cosmic } from '@/lib/cosmic'

export async function getYouthHouses() {
  try {
    const response = await cosmic.objects
      .find({ type: 'youth-houses' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    console.error('Error fetching youth houses:', error)
    return []
  }
}
```

### Get Featured Projects
```typescript
export async function getFeaturedProjects() {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'projects',
        'metadata.featured_homepage': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}
```

## 🎨 Cosmic CMS Integration

This app integrates with four main Cosmic object types:

- **Youth Houses**: Location data, activities, contact information, and galleries
- **Projects**: Community initiatives with status, categories, and participating youth houses
- **Pages**: Static content for About and Contact pages
- **Site Settings**: Brand colors, map configuration, and contact details

The integration includes proper TypeScript interfaces, error handling, and optimized image loading with imgix parameters.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main

### Netlify
1. Connect your repository to Netlify
2. Add environment variables in site settings
3. Build command: `bun run build`
4. Publish directory: `.next`

### Environment Variables for Production
Set these in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `COSMIC_WRITE_KEY`
