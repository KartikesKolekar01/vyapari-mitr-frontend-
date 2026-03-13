# Vyapari Mitra - Frontend & Backend Connection Guide

## Project Structure

```
vyapari-mitra-frontend/   - React/Vite frontend application
```

## Frontend Running Status
✅ **Frontend is running at:** `http://localhost:5173/`

## Backend Setup

Your Java backend should run on port **8080** with base URL: `http://localhost:8080/api`

### Starting the Backend

1. Navigate to your Java backend project directory
2. Build the project:
   ```
   mvn clean build
   ```
   or
   ```
   ./mvnw clean build
   ```

3. Run the application:
   ```
   mvn spring-boot:run
   ```
   or
   ```
   java -jar target/vyapari-mitra-backend.jar
   ```

4. Backend should start on `http://localhost:8080`

## API Endpoints Connected

### Authentication APIs
- ✅ `POST /api/auth/register` - Register new shop owner
- ✅ `POST /api/auth/login` - Login shop owner
- ✅ `GET /api/auth/check-owner` - Check if owner exists
- ✅ `GET /api/auth/owner-details` - Get owner details

### Customer APIs
- ✅ `GET /api/customers` - Get all customers
- ✅ `POST /api/customers` - Create new customer
- ✅ `GET /api/customers/{id}` - Get customer by ID
- ✅ `PUT /api/customers/{id}` - Update customer
- ✅ `GET /api/customers/search?keyword=` - Search customers
- ✅ `GET /api/customers/village/{village}` - Get customers by village

### Transaction APIs
- ✅ `POST /api/transactions/credit` - Add credit (उधारी)
- ✅ `POST /api/transactions/payment` - Add payment (पैसे भरले)
- ✅ `GET /api/transactions/customer/{customerId}` - Get customer transactions
- ✅ `GET /api/transactions/today` - Get today's transactions
- ✅ `GET /api/transactions/pending` - Get pending payments
- ✅ `DELETE /api/transactions/{id}` - Delete transaction

### Dashboard APIs
- ✅ `GET /api/dashboard/home` - Get dashboard summary
- ✅ `GET /api/dashboard/stats` - Get dashboard statistics

### Reports APIs
- ✅ `GET /api/reports/daily` - Get daily report
- ✅ `GET /api/reports/monthly?year=&month=` - Get monthly report
- ✅ `GET /api/reports/yearly?year=` - Get yearly report
- ✅ `GET /api/reports/pending` - Get pending report
- ✅ `GET /api/reports/customer/{customerId}` - Get customer report

## Frontend Services

All services are located in `src/services/`:

- **authService.js** - Authentication related APIs
- **customerService.js** - Customer management APIs
- **transactionService.js** - Transaction related APIs
- **dashboardService.js** - Dashboard APIs
- **reportService.js** - Report APIs

## Configuration

API Base URL is set to: `http://localhost:8080/api`
(Located in `src/services/api.js`)

## Testing the Connection

1. Start the Java backend on port 8080
2. Frontend is already running on port 5173
3. Open browser to `http://localhost:5173/`
4. Try the Login/Register flow to test the connection

## Environment

- **Frontend**: React 18.3 + Vite + Material-UI
- **Backend**: Java Spring Boot
- **Database**: As configured in your backend
- **Language**: Marathi-enabled

## Notes

- Frontend handles authentication with login/registration
- All API calls include Authorization header with Bearer token
- Token is stored in localStorage after successful login
- The app redirects to login on 401 (Unauthorized) responses
- Error handling and toast notifications are implemented
- All locale-specific imports have been fixed for Marathi support

---

**Ready to use! Make sure your Java backend is running before testing the application.**
