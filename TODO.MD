
1. Write a README file
2. Testing (end-to-end). 
3. ESlint



* Should the notification banner auto-disappear or the user closes it ? 
* Opinion on notification display?
* Data persistance - currently, changes are not stored until user saves. Should changes be saved to       persist across relaods?
* Check PDFs - landscape or portrait? Including the right info? Currently, user will have to refresh page to resume typing after exporting to PDF (otherwise only first line of input is displayed)
* Ensure compatibility with mobile phone display? NB: Header is not adjusting to full width of phone screen because it has been manually sized based on CIS website. 



TBD: 
    - Add a home page?
    - multiple Loses for each user - add banner to add a section program, etc. on the same page.
    - Email for inactive accounts warning them that their data will be lost if they remain inactive
    - Login photo
    - Login spiel
    - Update email that sends the password reset link



Commands:
flyctl proxy 5432 -a cis-los-db  
flyctl postgres connect -a cis-los-db
npm run dev