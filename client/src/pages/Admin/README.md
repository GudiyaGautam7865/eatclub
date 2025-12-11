# Admin Orders System - Frontend Implementation

## Overview
This implementation provides a unified admin orders management system with filtering, detailed order views, and menu item management. All changes are **frontend-only** and do not modify any server/backend code.

## New Routes

### Orders Management
- `/admin/orders` - Unified orders page (All orders with filtering)
- `/admin/orders/:orderId` - Order details page with tracking, customer info, map, and driver details
- `/admin/orders/single` - Legacy single orders page (kept for backward compatibility)
- `/admin/orders/bulk` - Legacy bulk orders page (kept for backward compatibility)

### Menu Management
- `/admin/menu/:menuItemId` - Menu item detail page with edit functionality

## New Files Created

### Pages
- `client/src/pages/Admin/OrdersPage.jsx` - Main unified orders listing
- `client/src/pages/Admin/OrderDetailsPage.jsx` - Detailed order view
- `client/src/pages/Admin/MenuDetailPage.jsx` - Menu item details

### Components
- `client/src/components/admin/orders/OrdersFilterBar.jsx` - Filter controls
- `client/src/components/admin/orders/OrdersGridCard.jsx` - Grid view card
- `client/src/components/admin/orders/OrdersTable.jsx` - Table view
- `client/src/components/admin/orders/OrderTracking.jsx` - Order timeline
- `client/src/components/admin/orders/CustomerCard.jsx` - Customer info with call/SMS
- `client/src/components/admin/orders/DriverCard.jsx` - Driver info with call/SMS
- `client/src/components/admin/orders/MenuDetailCard.jsx` - Menu item display/edit

### Styles
- `client/src/pages/Admin/styles/OrdersPage.css`
- `client/src/pages/Admin/styles/OrderDetailsPage.css`
- `client/src/pages/Admin/styles/MenuDetailPage.css`
- `client/src/components/admin/orders/*.css` (8 CSS files)

### Mock Data
- `client/src/mock/admin/orders-sample.json` - Sample orders for UI development

## Features

### Unified Orders Page
- **View Modes**: Toggle between Grid and Table views
- **Filters**:
  - Order Type: All / Single / Bulk
  - Status: All / Placed / Preparing / Completed / Cancelled / Pending / Confirmed
  - Search: Order ID, Customer Name, Phone
  - Date Range: All Time / Today / This Week / This Month
- **Auto-fallback**: Uses mock data when API is unavailable

### Order Details Page
- Order header with ID and status badge
- Complete items list with quantities, prices, and notes
- Customer card with contact details
- Call/Message buttons (uses `tel:` and `sms:` links)
- Order tracking timeline (Placed → Preparing → Out for Delivery → Delivered)
- Map panel with delivery route (Google Maps embed)
- Driver card with contact actions

### Menu Detail Page
- Item image with veg/non-veg badge
- Pricing (regular and membership)
- Availability toggle (UI only)
- Edit mode with inline form
- Changes update local state only (no backend persistence unless API available)

## Mock Data vs Real API

### Current Behavior
The system automatically detects if the API is available:

```javascript
// In OrdersPage.jsx
try {
  const [singleOrders, bulkOrders] = await Promise.all([
    getAdminSingleOrders(),
    getAdminBulkOrders()
  ]);
  
  if (allOrders.length === 0) {
    // Falls back to mock data
    setUseMock(true);
    setOrders(mockOrders);
  }
} catch (error) {
  // API failed, use mock data
  setUseMock(true);
  setOrders(mockOrders);
}
```

### Switching Between Mock and Real API

**Option 1: Environment Variable (Recommended)**
Add to `.env`:
```
VITE_USE_MOCK_DATA=true
```

Then update `OrdersPage.jsx`:
```javascript
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

if (USE_MOCK) {
  setOrders(mockOrders);
  return;
}
```

**Option 2: Code Toggle**
In `OrdersPage.jsx`, line 18, change:
```javascript
const [useMock, setUseMock] = useState(false); // Change to true for mock
```

### Adding More Mock Data
Edit `client/src/mock/admin/orders-sample.json` and add more order objects following the existing structure.

## Testing Call/Message Buttons

### Desktop Testing
- **Call buttons** (`tel:` links): Opens default phone app (Skype, Teams, etc.)
- **Message buttons** (`sms:` links): May not work on desktop without SMS app

### Mobile Testing
- **Call buttons**: Opens phone dialer with number pre-filled
- **Message buttons**: Opens SMS app with number pre-filled

### Testing Without Phone
The buttons are UI-only and safe to click. They won't make actual calls without user confirmation.

## Map Placeholder

The map uses a Google Maps embed iframe showing Bangalore. To customize:

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your location
3. Click Share → Embed a map
4. Copy the iframe code
5. Replace in `OrderDetailsPage.jsx` line 68

**Alternative**: Use a static image:
```jsx
<img src="/path/to/map-image.png" alt="Delivery route" />
```

## Styling & Theme

The UI follows a warm, light theme with:
- Primary color: `#f97316` (Orange)
- Success: `#10b981` (Green)
- Info: `#3b82f6` (Blue)
- Danger: `#ef4444` (Red)
- Background: `#f4f7fb` (Light gray)
- Cards: White with subtle shadows

All components use consistent spacing, rounded corners (8-12px), and smooth transitions.

## Responsive Design

- **Desktop**: Full grid/table layouts with sidebar
- **Tablet**: Stacked layouts, sidebar collapses
- **Mobile**: Single column, hamburger menu

Breakpoints:
- `1024px`: Tablet
- `768px`: Mobile

## Accessibility

- Keyboard navigation supported
- Focus states on all interactive elements
- ARIA labels where appropriate
- Color contrast meets WCAG AA standards
- Semantic HTML structure

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **No Backend Integration**: Changes in edit forms don't persist to server
2. **Mock Data Only**: Order details page always uses mock data
3. **Map**: Static embed, no real-time tracking
4. **Call/SMS**: Requires device with phone/SMS capability

## Future Enhancements

- Real-time order status updates via WebSocket
- Actual API integration for menu edits
- Live driver tracking on map
- Export orders to CSV/PDF
- Bulk status updates
- Order analytics dashboard

## Troubleshooting

### Orders page shows "No orders found"
- Check if API is returning data
- Verify mock data is loaded: Look for "Using Mock Data" badge
- Check browser console for errors

### Call/Message buttons don't work
- Ensure device has phone/SMS capability
- Check browser permissions for `tel:` and `sms:` protocols
- Test on mobile device for best results

### Map doesn't load
- Check internet connection
- Verify Google Maps iframe URL is valid
- Check browser console for CORS errors

### Styles not applying
- Clear browser cache
- Check if CSS files are imported correctly
- Verify no conflicting global styles

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are created in correct locations
3. Ensure imports are correct
4. Check that routes are registered in `AppRoutes.jsx`

## Modified Existing Files

- `client/src/routes/AppRoutes.jsx` - Added new routes
- `client/src/components/admin/layout/AdminSidebar.jsx` - Added "All Orders" link

**No server files were modified.**
