![mocket2b](https://github.com/user-attachments/assets/bf1a9659-f7cd-430f-b181-79a5a31500cf)

# Paper Trading Web-App

## Project Structure

- Backend (Java/Spring Boot): Handles external API calls, exposed REST endpoints, and sends/fetches data from the MongoDB database.
- Database (MongoDB): Stores user information and all trade transactions.
- Frontend (JavaScript/React): Provides a simple, but effective user interface for interacting with the trading platform.

## Key Features

- Paper Trading: Users can simulate buying and selling stocks with virtual currency.
- Real-time Market Data: Fetches live price data for a realistic trading experience.
- Price Charts: Allows the user to view live and historical price data of a ticker to observe trends and track their own progress on their dashboard.
- Responsive Design: Application is easily accessible to use on both desktop and mobile devices.

## Technologies and Resources Used

- TwelveData APIs: Consumed to fetch all trade data including both historical and real-time prices.
- AWS EC2 and S3: Utilized to deploy both frontend and backend microservices as well as store project assets.
- CSS: Enabled the ability create a fully custom user interface.
- Mockito and Jest: Allowed for the creation of more effective unit tests for the backend and frontend respectively.
- ChartJS: Used to create beautiful, responsive charts with tooltips.
