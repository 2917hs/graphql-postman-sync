# GraphQL Postman Collection Generator

This project automates the generation of Postman collections from a GraphQL schema. It supports both **queries** and **mutations**, generates placeholder variables, and can **create or update** a collection in Postman automatically.

---

## **Features**

* Load GraphQL schema from `.graphql` or `.json`.
* Auto-generate Postman collection with folders for **Queries** and **Mutations**.
* Add placeholder variables for all GraphQL arguments.
* Save collection locally (`postman_collection.json`).
* Automatically import or update the collection in Postman using API key.
* Fully modular, scalable, and maintainable TypeScript code.

---

## **Folder Structure**

```
graphql-postman-generator/
│
├── src/
│   ├── index.ts                  # Entry point
│   ├── config.ts                 # Configuration & environment
│   ├── schema/
│   │   └── loader.ts             # Load GraphQL schema
│   ├── postman/
│   │   ├── collectionBuilder.ts  # Build collection JSON
│   │   ├── requestBuilder.ts     # Build individual requests
│   │   └── importer.ts           # Import/update collection in Postman
│   ├── utils/
│   │   ├── file.ts               # Read/write JSON files
│   │   └── placeholders.ts       # Placeholder values for variables
│
├── schema/                       # GraphQL schema files
│   └── schema.graphql
├── .env                           # Environment variables
├── package.json
└── tsconfig.json
```

---

## **Setup**

1. **Clone the repository**

```bash
git clone <repo-url>
cd graphql-postman-generator
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file** in root:

```
POSTMAN_API_KEY=<your_postman_api_key>
WORKSPACE_ID=<optional_workspace_id>
```

> `WORKSPACE_ID` is optional. If not provided, the collection is created in your default workspace.

---

## **Usage**

### **1. Generate and Import Collection**

```bash
npx ts-node --esm src/index.ts schema/schema.graphql
```

* Generates `postman_collection.json`.
* Automatically imports or updates the collection in Postman.
* Folders for **Queries** and **Mutations** are created.
* Variables and placeholder values are included.

### **2. Output**

* Local file: `postman_collection.json`.
* Postman collection URL:

```
https://go.postman.co/collections/<collection_uid>
```

---

## **Environment Variables**

| Variable          | Description                              | Required |
| ----------------- | ---------------------------------------- | -------- |
| POSTMAN\_API\_KEY | Postman API key                          | Yes      |
| WORKSPACE\_ID     | Workspace ID to import/update collection | No       |

---

## **Adding GraphQL Schemas**

* Place your `.graphql` or `.json` schema files inside the `schema/` folder.
* Pass the schema path as an argument:

```bash
npx ts-node src/index.ts schema/mySchema.graphql
```

---

## **Extending the Project**

* **Custom Headers:** Add headers for authentication in `requestBuilder.ts`.
* **Selection Sets:** Customize selection sets for each query/mutation.
* **Additional Request Types:** Extend `collectionBuilder.ts` to support subscriptions.

---

## **Dependencies**

* `@graphql-tools/load`
* `@graphql-tools/graphql-file-loader`
* `@graphql-tools/json-file-loader`
* `graphql`
* `postman-collection`
* `axios`
* `dotenv`

---

## **Notes**

* Supports both **GraphQL SDL** (`.graphql`) and **introspection JSON** (`.json`) schemas.
* Automatically manages Postman collection creation or update based on the collection name.