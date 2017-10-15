## <> COINUP <>

#### Summary
An application in which users can voteup a coin's popularity seperated by category of interest, e.g. profitability, technology, community support, market cap, etc.

Additionally, the application will aggregate news associated with the token.

-- TODO: allow users to add links to sites
-- TODO: crawl web for keyword articles for that token
-- TODO: users can add keywords, in which to add as additional search criteria
-- TODO: modify 'TOKEN MODEL', for search functionalty


##### Requirements:
- Registration
    - Persist user details to DB (Done)
        - passwords entry in form must match (Done)
        - cannot register mulitple times (Done)
    - user model
        - add fields and defaults (In-Progress)
    - JWT authentication
        - store as local cookie (done)
        - verify authenticated token (done)
    - Add Styles to page
        - Register
    - Error page (In progress)
        - passwords do not match (done)
        - user already registered (done)
        - style error page 
        - eliminate error page, utilize session to pass result
- Login
    - Authenticate (done)
        - decrypt token fron local cookie (done)
    - Login route
        - Get Route (done)
        - Post Route (done)
        - handle invalid credentials (done)
            - invalid username / email (done)
            - invalid password (done)
    - Persist user data to other routes
        - index.hbs - GET (Done)
        - 
    - Relocate JWT Salt 
- Logout 
    - Routes
        - Get route to logout (done)
        - clear cookies (done)
- Site navbar
    - action links
        - Login (done)
        - Logout (done)
        - Register (done)
- Comments on token
    - user can post comment (depth = 1)
- Vote up coin
    - user can upvote
    - user can downvote
- Add coin (manual entry)
    - coin model (done)
    - prevent duplicate entries (in-progress - cannot set header err, when redirecting )
- Update coin
    - update coin (done)
    - route to home-index (done)
    - add PUT route (done)
    - Enhance
        - _method-override implementation
- Delete coin
    - delete coin (done)
    - route to home-index (done)
    - add Delete route (done)
    - Enhance
        - _method-override implementation
- Admin routes
    - 
- Index view
    - sidebar
        - display coin name (done)
        - display coin image (in-progress)
        - link coin to display details-view (done)


