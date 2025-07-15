# 🛡️ Life Insurance MVP!

A full-stack web application for life insurance recommendations, built with **Next.js**, **Node (Express.js)**, and **PostgreSQL**. This app allows users to register, log in, add personal details like age, income, dependents and risk type. And receive personalized life insurance plans based on their profile.




## 🔧 Tech Stack

| Layer        | Technology             |
|--------------|------------------------|
| Frontend     | [Next.js](https://nextjs.org/) + Tailwind CSS |
| Backend      | [Express.js](https://expressjs.com/) with [Node.js](https://nodejs.org/) |
| Database     | [PostgreSQL](https://www.postgresql.org/) |
| ORM          | [Sequelize](https://sequelize.org/) |
| Auth         | JWT-based authentication |
| Styling      | Tailwind CSS |
| Dev Tools    | TypeScript, ESLint, VSCode |


## ✨ Features

- 🔐 User registration & login (JWT auth)
- 📊 Dynamic insurance recommendation engine
- 👨‍👩‍👧‍👦 Inputs: age, income, dependents, and risk tolerance
- 🧠 AI-style logic for recommending best-matched plans
- 📱 Fully responsive for mobile, tablet, and desktop
- ✅ Alternatives to primary insurance recommendation


## 🗂️ Project Structure

life_insurance_mvp/  
├── backend/ # Express backend with Sequelize and PostgreSQL  
├── frontend/ # Next.js app with authentication and recommendation UI  
├── .gitignore  
└── README.md

## ⚙️ Environment Setup Backend
Backend .env should look like this:

```
PORT=your_backend_port //eg:3001
NODE_ENV=your_backend_environment //eg:development
DB_HOST=your_db_host //eg:localhost
DB_PORT=your_db_port //eg:5432
DB_NAME=your_database_name
DB_USER=your_database_user_name
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
```


## ⚙️ Environment Setup Frontend
Frontend .env should look like this:

```
NEXT_PUBLIC_BASE_URL=api_adderess_to_backend //Eg:localhost:3001/api
```

## 🛠️ Getting Started

### 1. Create Database 
Run the following commands to create Postgres database with database name, database user name and database password of your choice.
```
psql postgres  
CREATE DATABASE example_db_name;  
CREATE USER example_db_user WITH PASSWORD 'example_db_password';  
GRANT ALL PRIVILEGES ON DATABASE example_db_name TO example_db_user;
```

### 2. Clone the Repo
Run the following commands in your terminal to clone the project and navigate to the project.
```
git clone https://github.com/ali-chughtai/life_insurance_mvp.git
cd life_insurance_mvp
```

### 3. Set Up PostgreSQL and Run Sql commands in Schema
Make sure PostgreSQL is running and a user & database are created as per `.env`.
Then run the SQL schema in root terminal , eg: terminal of life_insurance_mvp folder, here database_user and database_name would be the same you have configured in step 1:
```
psql -U example_db_user -d example_db_name -f backend/src/database/schema.sql
```
### 4. Start Backend
```
cd backend
npm install
npm run dev
```
Server will run on:  `http://localhost:3001/api or your provided .env port`

### 5. Start Frontend
```
cd frontend
npm install
npm run dev
```
Frontend runs on:  `http://localhost:3000`

## 🧪 Sample Recommendation Flow


-   Register or login
-   Navigate to  `Adding Details for recommendation`
-   Fill the form:
    -   Age
    -  Annual Income
    - Number of Dependents  
    -   Select Risk Tolerance
-   Submit to get personalized life insurance recommendations.

## 📄 License
This project is licensed under the MIT License.

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

## 🧑‍💻 Author
Built by  🚀
