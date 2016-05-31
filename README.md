# Final Project
Final project for UOM part time course in Single Page Apps

NOTE: An internet connection is required!

Persistence of data used: JSON server

You may use the following usernames and passwords as to login with different roles:
  
  * admin - admin
  * manager - manager
  * staff - staff
  
These users will have the respective role assigned to them.


One last thing. The only problem I have encountered with the login mechanism is that after user logs-in, he needs to refresh the page so in order for the menu to show up. I tried to work around this but I could not find a way how. The problem is that the main controller has $scope.authUser, which is used throughout the app, like for example to hide/show menu, hide/show certain buttons, etc... After user logs-in, I am updating this scope but for some reason, the app does not realize this. I am sure I am doing something wrong here, but can't figure out what.
