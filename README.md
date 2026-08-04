# 💱 Currency Converter

A simple and clean **Currency Converter** web application built with HTML, CSS, and JavaScript. It fetches real-time exchange rates and displays country flags for a better user experience.

---

## 🌟 Features

- 🔄 Convert between 150+ world currencies
- 🚩 Auto-updates country flags based on selected currency
- 📡 Fetches live exchange rates from a free API
- 🔁 Swap between "From" and "To" currencies easily
- ⚡ Auto-calculates rate on page load
- 💻 Responsive and minimal UI

---

## 📁 Project Structure

```
Currency-converter/
│
├── index.html      # Main HTML structure
├── style.css       # Styling and layout
├── app.js          # Core logic – fetching rates, updating flags
└── codes.js        # Currency code to country code mapping
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling & layout |
| JavaScript (ES6+) | Logic & API calls |
| [Currency API](https://2024-03-06.currency-api.pages.dev) | Live exchange rates |
| [Flags API](https://flagsapi.com) | Country flag images |
| [Font Awesome 7](https://fontawesome.com) | Icons |

---

## 🚀 Getting Started

No installation required! This is a pure frontend project.

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Avesh2707/currency-converter.git
   cd currency-converter
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in any browser
   open index.html
   ```
   Or just double-click `index.html` to open it.

---

## 🔌 API Used

### Exchange Rate API
- **Base URL:** `https://2024-03-06.currency-api.pages.dev/v1/currencies/`
- **Usage:** Fetches live currency exchange rates in JSON format
- **Example:** `.../currencies/usd.json` returns all rates relative to USD
- No API key required ✅

### Flags API
- **Base URL:** `https://flagsapi.com/{COUNTRY_CODE}/flat/64.png`
- **Usage:** Displays the flag of the selected currency's country

---

## 💡 How It Works

1. On page load, the app defaults to **USD → INR** conversion with amount `100`.
2. User selects the **From** and **To** currencies from dropdowns.
3. On selecting a currency, the corresponding **country flag** updates automatically.
4. On clicking **"Get Exchange Rate"**, the app:
   - Fetches the latest rates from the API
   - Calculates: `amount × exchange_rate`
   - Displays the result in the message box

---

## 📸 Preview

```
┌─────────────────────────────────┐
│        Currency Converter       │
│                                 │
│  Enter Amount: [ 100 ]          │
│                                 │
│  From: 🇺🇸 [USD ▼]  ⇄  To: 🇮🇳 [INR ▼]  │
│                                 │
│    100 USD = 8350.00 INR        │
│                                 │
│      [ Get Exchange Rate ]      │
└─────────────────────────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/Avesh2707)

---

> ⭐ If you found this project helpful, please give it a star!
