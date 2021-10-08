# Gestion Stock

## Install

```
git clone https://github.com/jlg-formation/njs-oct-2021.git
cd njs-oct-2021
npm install
```

## Usage

### For development

```
npm start
```

Open your browser on `http://localhost:3000`

### Configuration

The software is configurable with the following environment variables:

- GESTION_STOCK_SERVER_PORT (default to 3000)
- GESTION_STOCK_DBURI (default to mongodb://localhost:27017/gestion-client)

### Lint/Test/Build/etc.

See the `package.json`

### Production

Use pm2.
There is an ecosystem file in the project.

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
