# BACKEND PROJECT TIMELINE
Last updated: March 27 2026

- Storage functions handler for necessary type. 
- Define proper config for the db.
- Optimize db early with indexing
- Test for Storage functions
- Context Propagation or Request-Scoped Context for the services
- Working on the API design
- implementing a typescript BFF with better-auth as core feature.


## Services
Handled by ts-auth:
- signup account
- verify signup account using otp
- signin using otp
- change password by otp
- jwt creation
- jwt validation for the go-backend

Handled by go-backend:
- Add expenses, profile, and assets through static forms (expense, profile, revenue, assets)
- Dashboard creation, compiling, storing, and serving to the frontend.
- Show the individual expenses, revenue, as a lazy load. 
- Connect and serve the adk python chatbot functionality for all different type of data: text, file, noise, photos.
- Connect the ocr ml model to preprocess receipt picture.
- Enable two layer context function; http/middleware layer for the jwt id, storage context
