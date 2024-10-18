- [ ] test app on securityheaders.com (make sure to select 'hide results'!!)


Commands:
 - Ubuntu - tunnelling: ssh -i ~/Desktop/SSH_keys/cis-los-key.pem -L 5432:cis-los-dbinstance.ctqqs6keejq9.ap-southeast-2.rds.amazonaws.com:5432 ubuntu@ec2-13-236-188-103.ap-southeast-2.compute.amazonaws.com
- psql -h localhost -U cisuser -d cislosdb -p 5432
