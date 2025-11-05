# 📸 ImagesBazaar - Stock Photo Marketplace

> A professional full-stack image marketplace platform where photographers can sell and buyers can purchase high-quality stock photos with integrated payment processing.

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)](https://mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-purple)](https://razorpay.com/)

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Payment Testing](#-payment-testing)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### For Buyers
- 🔍 **Browse & Search** - Explore thousands of high-quality images
- ❤️ **Wishlist** - Save favorite images for later
- 👍 **Like/Unlike** - Show appreciation for images
- 💳 **Secure Payments** - Multiple payment methods (Cards, UPI, Netbanking, Wallets)
- 📥 **Instant Download** - Download purchased images immediately
- 📊 **Purchase History** - Track all your purchases
- 👤 **Profile Management** - Manage your account settings

### For Contributors
- 📤 **Upload Images** - Share your photography with the world
- 💰 **Set Pricing** - Choose free or paid (any amount)
- 📈 **Earnings Dashboard** - Track your sales and income
- 💸 **Request Payouts** - Withdraw earnings via Bank/UPI
- 📊 **Sales Analytics** - View detailed sales history
- 🎯 **80% Revenue Share** - Keep 80% of each sale
- 🗑️ **Manage Uploads** - Delete images you no longer want (if not purchased)

### Platform Features
- 🔐 **Secure Authentication** - JWT-based auth system
- 🎨 **Modern UI** - Beautiful gradient design
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast Performance** - Optimized loading and infinite scroll
- 🔒 **Payment Security** - Razorpay integration
- 📄 **Legal Pages** - Terms, Privacy, Refund policies
- 🌐 **Professional Footer** - Complete with all links

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Custom styling with gradients

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **Razorpay Account** (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd imagesbazaar
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Environment Setup**

The project includes example environment files. Copy them:

**Server:**
```bash
cd server
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/imagesbazaar
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Client:**
```bash
cd client
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

Edit `client/.env`:
```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

5. **Create uploads directory**
```bash
mkdir server/uploads
```

6. **Seed categories** (IMPORTANT!)
```bash
cd server
npm run seed
```

You should see:
```
✓ Successfully added 15 categories
```

7. **Start the application**

**Terminal 1 - Server:**
```bash
cd server
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm start
```

8. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| GET | `/api/auth/stats` | Get user statistics | Yes |

### Images
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/images` | Get all images (with pagination) | No |
| GET | `/api/images/:id` | Get single image | No |
| POST | `/api/images` | Upload new image | Yes |
| DELETE | `/api/images/:id` | Delete image | Yes |
| GET | `/api/images/my/uploads` | Get user's uploads | Yes |
| POST | `/api/images/:id/like` | Like/Unlike image | Yes |
| GET | `/api/images/:id/liked` | Check if user liked | Yes |
| POST | `/api/images/:id/download` | Track download | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| POST | `/api/categories` | Create category | Yes |

### Payments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-order` | Create Razorpay order | Yes |
| POST | `/api/payments/verify-payment` | Verify payment | Yes |
| GET | `/api/payments/my-purchases` | Get user purchases | Yes |
| GET | `/api/payments/my-earnings` | Get contributor earnings | Yes |
| GET | `/api/payments/check-ownership/:imageId` | Check image ownership | Yes |

### Payouts
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/payouts/balance` | Get available balance | Yes |
| POST | `/api/payouts/request` | Request payout | Yes |
| GET | `/api/payouts/history` | Get payout history | Yes |
| DELETE | `/api/payouts/:id` | Cancel payout | Yes |

### Wishlist
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/wishlist/add/:imageId` | Add to wishlist | Yes |
| DELETE | `/api/wishlist/remove/:imageId` | Remove from wishlist | Yes |
| GET | `/api/wishlist` | Get user wishlist | Yes |
| GET | `/api/wishlist/check/:imageId` | Check if in wishlist | Yes |

---

## 📁 Project Structure

```
imagesbazaar/
├── client/                     # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/        # Reusable Components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ImageCard.js
│   │   │   ├── Modal.js
│   │   │   └── ScrollToTop.js
│   │   ├── context/          # Context Providers
│   │   │   └── AuthContext.js
│   │   ├── pages/            # Page Components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Upload.js
│   │   │   ├── ImageDetail.js
│   │   │   ├── Checkout.js
│   │   │   ├── MyPurchases.js
│   │   │   ├── MyUploads.js
│   │   │   ├── MyEarnings.js
│   │   │   ├── RequestPayout.js
│   │   │   ├── Profile.js
│   │   │   ├── Wishlist.js
│   │   │   └── legal/
│   │   │       ├── Terms.js
│   │   │       ├── Privacy.js
│   │   │       └── Refund.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── server/                    # Express Backend
│   ├── models/               # Mongoose Models
│   │   ├── User.js
│   │   ├── Image.js
│   │   ├── Category.js
│   │   ├── Purchase.js
│   │   ├── Payout.js
│   │   └── Wishlist.js
│   ├── routes/               # API Routes
│   │   ├── auth.js
│   │   ├── images.js
│   │   ├── categories.js
│   │   ├── payments.js
│   │   ├── payouts.js
│   │   └── wishlist.js
│   ├── middleware/
│   │   └── auth.js          # JWT Authentication
│   ├── uploads/             # Uploaded Images
│   ├── index.js             # Server Entry Point
│   ├── seedCategories.js    # Database Seeder
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 📖 Usage Guide

### For Buyers

1. **Register an Account**
   - Click "Register" in the navbar
   - Fill in your details
   - Select "User" as role
   - Click Register

2. **Browse Images**
   - Explore images on the home page
   - Use search to find specific images
   - Filter by category
   - Infinite scroll loads more images

3. **Add to Wishlist**
   - Click the heart icon on any image
   - Access your wishlist from the navbar

4. **Purchase an Image**
   - Click on an image to view details
   - Click "Purchase - ₹X" button
   - Complete payment via Razorpay
   - Download from "My Purchases"

5. **Manage Profile**
   - Click your avatar in navbar
   - Update personal information
   - Change password
   - View statistics

### For Contributors

1. **Register as Contributor**
   - Click "Register"
   - Select "Contributor" as role
   - Complete registration

2. **Upload Images**
   - Click "Upload" in navbar
   - Select image file
   - Add title, description, tags
   - Choose category
   - Set price (0 for free)
   - Click Upload

3. **Manage Uploads**
   - Go to Profile page
   - Click "My Uploads" in Quick Actions
   - View all your uploaded images
   - Delete images (if not purchased)

4. **Track Earnings**
   - Click "Earnings" in navbar
   - View total earnings (80% of sales)
   - See sales history
   - Track individual transactions

5. **Request Payout**
   - Minimum balance: ₹500
   - Click "Request Payout"
   - Choose Bank Transfer or UPI
   - Enter payment details
   - Submit request
   - Processing time: 2-3 business days

---

## 💳 Payment Testing

### Test Razorpay Credentials
The project includes test credentials in `.env.example` files.

### Test Payment Methods

**Credit/Debit Card:**
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/25` (any future date)
- CVV: `123` (any 3 digits)
- Name: Any name

**UPI:**
- UPI ID: `success@razorpay`

**Netbanking:**
- Select any bank
- Use test credentials provided by Razorpay

**Wallets:**
- Select any wallet
- Use test credentials

### Test Flow

1. Login as buyer
2. Click on any paid image
3. Click "Purchase"
4. Razorpay modal opens
5. Use test credentials above
6. Click "Pay"
7. Payment success → Redirected to "My Purchases"
8. Download the image

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/imagesbazaar.git
cd imagesbazaar
```

2. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit your changes**
```bash
git add .
git commit -m "Add: your feature description"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Submit the PR

### Contribution Guidelines

- **Code Style**: Follow existing patterns
- **Commits**: Use clear, descriptive commit messages
- **Testing**: Test all features before submitting
- **Documentation**: Update README if needed
- **Issues**: Check existing issues before creating new ones

### Areas to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🔒 Security improvements
- 🌐 Internationalization
- ♿ Accessibility features

---

## 🐛 Troubleshooting

### Common Issues

**1. Categories not showing**
```bash
cd server
npm run seed
```

**2. MongoDB connection error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `server/.env`
- For Atlas, verify network access and credentials

**3. Port already in use**
- Server: Change `PORT` in `server/.env`
- Client: React will prompt for alternative port

**4. Payment not working**
- Verify Razorpay keys in both `.env` files
- Restart server after changing `.env`
- Check browser console for errors
- Ensure internet connection

**5. Images not uploading**
- Check if `server/uploads` folder exists
- Create manually: `mkdir server/uploads`
- Verify file size (max 10MB)
- Check file format (jpg, png, gif)

**6. Login not working**
- Verify MongoDB is running
- Check `JWT_SECRET` in `server/.env`
- Clear browser cookies/cache
- Check browser console for errors

**7. Cannot delete uploaded image**
- Error: "Cannot delete image that has been purchased"
- Solution: Images with purchases cannot be deleted
- Contact support if needed

**8. Payout request failed**
- Minimum balance: ₹500
- Verify bank/UPI details
- Check available balance
- Ensure no pending payouts

### Debug Steps

1. **Check Server Logs**
   - Look at terminal running server
   - Check for error messages
   - Verify all routes loaded

2. **Check Browser Console**
   - Press F12 to open DevTools
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Verify Environment Variables**
   - Ensure all required variables are set
   - No typos in variable names
   - Restart server after changes

4. **Database Issues**
   - Check MongoDB is running
   - Verify connection string
   - Check database name
   - Ensure collections exist

5. **Clear Cache**
   - Clear browser cache
   - Delete `node_modules` and reinstall
   - Clear MongoDB cache if needed

---

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/contributor),
  bio: String,
  location: String,
  website: String,
  phone: String,
  createdAt: Date
}
```

### Image
```javascript
{
  title: String,
  description: String,
  imageUrl: String,
  thumbnailUrl: String,
  category: ObjectId (ref: Category),
  tags: [String],
  price: Number,
  contributor: ObjectId (ref: User),
  downloads: Number,
  likes: Number,
  likedBy: [ObjectId],
  createdAt: Date
}
```

### Purchase
```javascript
{
  buyer: ObjectId (ref: User),
  image: ObjectId (ref: Image),
  contributor: ObjectId (ref: User),
  amount: Number,
  commission: Number (20%),
  contributorEarning: Number (80%),
  paymentIntentId: String,
  status: String,
  purchasedAt: Date
}
```

### Payout
```javascript
{
  contributor: ObjectId (ref: User),
  amount: Number,
  method: String (bank/upi),
  bankDetails: Object,
  status: String (pending/completed/cancelled),
  transactionId: String,
  requestedAt: Date,
  completedAt: Date
}
```

---

## 💰 Revenue Model

### Platform Commission
- **20%** of each sale goes to the platform
- Example: ₹100 sale = ₹20 platform fee

### Contributor Earnings
- **80%** of each sale goes to the contributor
- Example: ₹100 sale = ₹80 to contributor
- Minimum payout: ₹500
- Processing time: 2-3 business days

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Protected API routes
- ✅ Payment signature verification
- ✅ Input validation
- ✅ XSS protection
- ✅ CORS configured
- ✅ HTTPS ready
- ✅ Secure file uploads
- ✅ Rate limiting (recommended for production)

---

## 🚀 Deployment

### Preparing for Production

1. **Environment Variables**
   - Use production MongoDB URI
   - Switch to Razorpay live keys
   - Set secure JWT_SECRET
   - Enable HTTPS

2. **Build Client**
```bash
cd client
npm run build
```

3. **Deploy Options**
   - **Frontend**: Vercel, Netlify, AWS S3
   - **Backend**: Heroku, AWS EC2, DigitalOcean
   - **Database**: MongoDB Atlas
   - **Storage**: AWS S3, Cloudinary (for images)

4. **Post-Deployment**
   - Test all features
   - Monitor error logs
   - Set up analytics
   - Configure backups

---

## 📄 License

All rights reserved © 2025 ImagesBazaar

---

## 📞 Support

- **Email**: support@imagesbazaar.com
- **Phone**: +91 1234567890
- **Address**: Mumbai, Maharashtra, India

---

## 🙏 Acknowledgments

- **Payment Gateway**: Razorpay
- **Icons**: Emoji
- **Fonts**: System Fonts
- **Framework**: React + Express
- **Database**: MongoDB

---

**Built with ❤️ for photographers and image buyers worldwide**







