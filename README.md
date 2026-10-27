# Security Grid frontend demo

This project runs the admin dashboard as a standalone React frontend. No backend or login page is required.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The dashboard opens at `/admin`.

## Demo data and clearance

The alert log starts with five sample Button Emergency entries: one pending and four resolved. Dashboard changes, alert status, employee records, personnel records, and settings are stored in this browser's local storage. Use **Settings → System Config → Factory Reset Grid** to restore the sample data.

The Security Personnel page has a frontend-only demo clearance screen. Use:

- Email: `admin@gmail.com`
- Password: `123`

This screen is for demonstrating the requested interface. Because the check runs in the browser, it does not provide real access control.
