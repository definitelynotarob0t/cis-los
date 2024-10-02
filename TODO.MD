
1. Write a README file
2. Testing (end-to-end). 
3. ESlint
4. Build
5. Deploy ** ensure API is not publicly accessible / ensure user emails are secure


* PDF of elevator pitch does not capture the entire inputs (only the first line)... but all can be seen in the pitch-card. CHange? Get rid of PDF for pitch page?
* Check compatibility with mobile phone display. NB: Header is not adjusting to full width of phone screen because it has been manually sized based on CIS website. 


post CIS meeting
- consider who has access to create an account
- take out inputs from LOS
- separate outcomes and impacts?
- one account multiple LOSes
- hover mouse over input headers and see explanation 
- what placeholder text to be used in the elevator pitch page

Could add an event listener, triggered by grabbing the answers on LOS page, to change background colour of contentEditable divs?
implement general API rate limiter ?

TBD: 
    - Add a home page?
    - multiple Loses for each user - add banner to add a section program, etc. on the same page.
    - Email for inactive accounts warning them that their data will be lost if they remain inactive
    - Login spiel
    - Update email that sends the password reset link



Commands:
flyctl proxy 5432 -a cis-los-db  
flyctl postgres connect -a cis-los-db
npm run dev