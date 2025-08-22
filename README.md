## Instructions to run
1. Make a .env file referencing .env.sample in root
2. Add the same port for backend in frontend .env
3. You can use
   ``docker-compose up --build -d``
   for all in one set up
   
4. You can also use
   ``make setup``
   ``cd backend``
   ``go run cmd/main.go``
   for all in one set up of backend
   and 
   ``cd frontend``
   ``npm i``
   ``npm run dev``
   for frontend
