
# Watchlo 🍿

Web application that allows you to streaming any movie, tv series, or even anime.

## Current Status

The project is currently in maintenance mode. The root layout renders a maintenance screen by default.

## Screenshots

![App Screenshot](https://res.cloudinary.com/de6icstca/image/upload/v1728119541/watchlo/readme/watchmilo-movies_wulwkc.png)



## Tech Stack

**Client:** NextJS (App Router), TailwindCSS, Zustand, SWR, shadcn/ui-style components (Radix UI + CVA)

**Server:** NextJS Route Handlers (`app/api/*`) as internal API proxy

**Tools:** Jest, Vercel

## Architecture Notes

- Service layer is centralized in `app/services/index.ts`.
- HTTP clients are configured in `app/lib/api.ts` (`API_V0`, `API_V1`, `API_V2`).
- Internal API proxy routes are available in `app/api/*`.
- UI primitives are centralized in `app/components/ui/*` using Radix primitives.
- DaisyUI has been removed from dependencies and Tailwind plugins after phased migration.
- Core env vars used by service clients:
  - `NEXT_PUBLIC_WATCHLO_API_V0`
  - `NEXT_PUBLIC_WATCHLO_API_V1`
  - `NEXT_PUBLIC_WATCHLO_API_V2`
  - `NEXT_PUBLIC_CUSTOM_API_KEY`
  - `NEXT_PUBLIC_GOGO_PATH`

## Migration Notes

- The UI layer was migrated in phases from DaisyUI classes to shadcn-style reusable components.
- Reusable building blocks now live under `app/components/ui/*` (`button`, `dialog`, `dropdown-menu`, `accordion`, `checkbox`, `label`, `skeleton`).
- Navigation/search, modal interactions, season accordion, and skeleton loaders were migrated to remove Daisy-specific class dependencies.



## Running Tests

To run tests, run the following command

```bash
  npm run test
```
or you can run
```bash
  npm run test:watch
```
if you want to trigger a test if there are any  changes


## Support

What it feels like asking for a star

![Meme](https://res.cloudinary.com/de6icstca/image/upload/v1728121626/watchlo/readme/meme_ie1fqr_c_fill_w_200_xkk7xg.jpg)


## Authors

- [@alfaruqi](https://www.github.com/alfaruqii)


