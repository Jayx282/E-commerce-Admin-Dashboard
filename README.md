# E-commerce Admin Dashboard

An admin dashboard for an online store, built on the MERN stack. An Express and Mongoose REST API serves customer, product, transaction and sales data from MongoDB. A React client turns that data into tables, line charts, pie charts and a world map, using Material UI, Redux Toolkit Query and Nivo.

The app runs on a mock dataset that ships with the repo in `Server/data/index.js`: 300 users, 30 products, 500 transactions and a year of 2021 sales figures.

<!-- To show screenshots: save four PNGs in docs/screenshots/ with the file names used below, then delete this line and the closing comment marker after the table.

## Screenshots

| Dashboard | Geography |
|---|---|
| ![Dashboard in dark mode](docs/screenshots/dashboard.png) | ![World map of users by country](docs/screenshots/geography.png) |
| **Daily sales** | **Sales by category** |
| ![Daily sales and units chart](docs/screenshots/daily.png) | ![Donut chart of sales by category](docs/screenshots/breakdown.png) |
-->

## Features

**Dashboard.** Stat cards for total customers, today's sales, this month's sales and the year's sales, plus a running-total sales chart, a table of 50 transactions and a sales-by-category donut chart. The API fixes "today" and "this month" to 15 November 2021 so they fall inside the mock data.

**Client facing**
- **Products:** a card for each product with its category, price, rating and description. *See More* shows the product ID and how much supply is left.
- **Customers:** a table of every user with the `user` role.
- **Transactions:** a table of transactions (ID, user ID, date, number of products and cost) that the API serves one page at a time.
- **Geography:** a world choropleth showing how many users live in each country.

**Sales**
- **Overview:** the running total of sales or of units sold through 2021, month by month, with a Sales/Units switch.
- **Daily:** daily sales and units between two dates you pick.
- **Monthly:** total sales and units for each month.
- **Breakdown:** a donut chart of the year's sales by product category, with the yearly total.

**Management**
- **Admin:** a table of every user with the `admin` role.
- **Performance:** the affiliate sales recorded for the current user.

**Interface.** A light/dark theme toggle in the top bar and a collapsible sidebar. On screens narrower than 1200px the dashboard grid stacks into one column.

## How it works

- **Client data layer.** A single RTK Query API slice (`client/src/state/api.js`) defines all nine endpoints. Pages call the generated hooks, and RTK Query caches each response, so components that need the same data share one request. On the dashboard, for example, the sales chart and the category chart both read one cached `/sales/sales` response.
- **Server layers.** Requests go through routes, then controllers, then Mongoose models (`User`, `Product`, `ProductStat`, `Transaction`, `OverallStat`, `AffiliateStat`). Some controllers do more than a plain `find()`:
  - `/client/products` attaches each product's `ProductStat` records to the product.
  - `/client/geography` converts each user's two-letter country code to the three-letter code that the Nivo map expects, then counts users per country.
  - `/client/transactions` returns one page of transactions at a time (`page` and `pageSize` query parameters), and its `search` parameter matches against cost or user ID.
  - `/management/performance/:id` runs an aggregation pipeline (`$match`, then `$lookup` into `affiliatestats`, then `$unwind`) and then loads the transactions that the user's affiliate record points to.
- **Middleware.** `helmet` for security headers, `cors`, `morgan` request logging, and JSON and URL-encoded body parsing.

## API

All routes are `GET` requests.

| Route | Returns |
|---|---|
| `/general/user/:id` | One user |
| `/general/dashboard` | Totals for 2021, the stats for November 2021 and for 15 November 2021, and 50 transactions |
| `/client/products` | All products, each with its sales stats |
| `/client/customers` | Users with the `user` role, without the password field |
| `/client/transactions` | One page of transactions |
| `/client/geography` | `{ id, value }` pairs: a three-letter country code and its user count |
| `/sales/sales` | The yearly sales document: monthly and daily totals, and sales by category |
| `/management/admins` | Users with the `admin` role, without the password field |
| `/management/performance/:id` | A user, their affiliate stats and the matching transactions |

## Tech stack

- **Client:** React 18 (Create React App), React Router 6, Redux Toolkit and RTK Query, Material UI 5 and MUI X Data Grid, Nivo (line, pie and geo charts), react-datepicker
- **Server:** Node.js, Express 4, Mongoose 8 on MongoDB, helmet, cors, morgan, dotenv, country-iso-2-to-3, and nodemon for development

## Project structure

```
Server/
  index.js         Express app: middleware, routes and the MongoDB connection
  routes/          client, general, management and sales routers
  controllers/     request handlers, including the aggregation logic
  models/          Mongoose schemas
  data/index.js    mock data for seeding MongoDB
client/
  src/App.js       page routes
  src/state/       Redux slice (theme mode, current user ID) and the RTK Query API
  src/scenes/      one folder per page
  src/component/   shared UI: navbar, sidebar, charts, stat box, header
  src/theme.js     light and dark MUI palettes
```

## Getting started

### Prerequisites

- Node.js and npm. The install and start commands below were checked with Node.js 26 and npm 11.
- A MongoDB database: a local server, Docker (`docker run -d -p 27017:27017 mongo:7`) or a free MongoDB Atlas cluster.

### 1. Set up the API

```bash
cd Server
npm install
```

Create `Server/.env`:

```
MONGO_URL=
PORT=9000
```

### 2. Load the mock data (first run only)

The server doesn't seed the database by itself. In `Server/index.js`, uncomment the six `insertMany(...)` lines inside the `mongoose.connect(...).then(...)` block. Start the server once with `npm start`, wait a few seconds for the inserts to finish, then stop it and comment the lines out again so they don't run on the next start.

### 3. Start the API

```bash
npm run dev    # restarts on file changes (nodemon)
# or
npm start
```

The API listens on `http://localhost:9000`, or on `PORT` if you set it.

### 4. Set up and start the client

In a second terminal:

```bash
cd client
npm install
```

Create `client/.env.local` and set `REACT_APP_BASE_URL` to the API's address, for example `http://localhost:9000`. Then start the client:

```bash
npm start
```

The dashboard opens at `http://localhost:3000`.

## Environment variables

| Name | File | Required | Purpose |
|---|---|---|---|
| `MONGO_URL` | `Server/.env` | Yes | MongoDB connection string |
| `PORT` | `Server/.env` | No | Port for the API (defaults to 9000) |
| `REACT_APP_BASE_URL` | `client/.env.local` | Yes | Base URL of the API that the client calls |

`Server/.gitignore` already ignores `.env`. `client/.gitignore` ignores `.env.local` but not `.env`, so keep the client setting in `.env.local`.

## Limitations

- There is no authentication. The current user is a fixed user ID in `client/src/state/index.js`. The *Log Out* menu item, the top-bar search box, the settings icons and the *Download Reports* button don't do anything yet.
- The percentage changes on the dashboard's stat cards are fixed text, not calculated.
- The API is read-only: there are no create, update or delete routes.
- All figures come from the 2021 mock dataset.

## Acknowledgements

Built by following EdRoh's MERN admin dashboard tutorial ([ed-roh/fullstack-admin](https://github.com/ed-roh/fullstack-admin)). The mock dataset in `Server/data/index.js` comes from that project.
