# Wonderflow Chrome Extension Setup

## Installation Instructions

### 1. Build the Extension
```bash
npm run build
```

### 2. Load in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `dist` folder from this project

### 3. Pin the Extension
- Click the puzzle piece icon in Chrome's toolbar
- Find "Wonderflow" and click the pin icon to keep it visible

## Using the Extension

### First Time Setup
1. Click the Wonderflow icon in your Chrome toolbar
2. Sign in with your Supabase account credentials
3. The extension will remember your session

### Features

#### Audiences Tab
- View all your marketing audiences
- Select different audiences from the dropdown
- See audience details including name, description, and creation date

#### Messaging Tab
- View all messages associated with the selected audience
- See message titles, content, and types (email, push, SMS, etc.)
- Messages are organized by creation date

### Adding Sample Data

To test the extension with sample data, run these SQL queries in your Supabase SQL editor:

```sql
-- Insert sample audiences
INSERT INTO audiences (user_id, name, description) VALUES
  (auth.uid(), 'Premium Customers', 'High-value customers with lifetime purchases over $1000'),
  (auth.uid(), 'New Users', 'Users who signed up in the last 30 days'),
  (auth.uid(), 'Inactive Users', 'Users who haven''t logged in for 90+ days');

-- Insert sample messages (replace the audience_id with actual IDs from your audiences table)
INSERT INTO messages (audience_id, user_id, title, content, message_type) VALUES
  ((SELECT id FROM audiences WHERE name = 'Premium Customers' LIMIT 1), auth.uid(), 'Exclusive VIP Sale', 'Thank you for being a valued customer! Enjoy 30% off all products this weekend.', 'email'),
  ((SELECT id FROM audiences WHERE name = 'Premium Customers' LIMIT 1), auth.uid(), 'New Product Launch', 'Be the first to access our new premium collection launching tomorrow.', 'push'),
  ((SELECT id FROM audiences WHERE name = 'New Users' LIMIT 1), auth.uid(), 'Welcome to Wonderflow!', 'Thanks for joining! Here''s a 10% discount code for your first purchase: WELCOME10', 'email'),
  ((SELECT id FROM audiences WHERE name = 'Inactive Users' LIMIT 1), auth.uid(), 'We Miss You!', 'It''s been a while! Come back and enjoy 20% off your next order.', 'email');
```

## Troubleshooting

### Extension not loading
- Make sure you've built the project with `npm run build`
- Check that you're selecting the `dist` folder, not the project root
- Verify that manifest.json exists in the dist folder

### Authentication issues
- Ensure your Supabase environment variables are correctly set in `.env`
- Check that your Supabase project has authentication enabled
- Verify Row Level Security policies are properly configured

### Data not appearing
- Make sure you're signed in with the correct account
- Check that you have audiences and messages in your database
- Open Chrome DevTools (right-click extension popup > Inspect) to check for errors
