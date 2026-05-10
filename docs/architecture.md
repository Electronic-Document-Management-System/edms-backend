# Architecture & Project Logic

## 🏗 Layered Pattern
Humne code ko parts mein divide kiya hai taake scalability rahe:
- **Controllers:** Request parse karte hain aur response bhejte hain.
- **Services:** Asal business logic yahan hoti hai (Pending).
- **Utils:** Global helpers (ApiError, ApiResponse, asyncHandler).

## 🛡 Security Logic
- **Validation:** Zod schemas se input data filter kiya jayega.
- **Hashing:** `bcryptjs` se passwords secure honge.