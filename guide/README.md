Getting started with Stickify
===================
![Stickify logo](https://raw.githubusercontent.com/ansonl/stickify-web-app/gh-pages/guide/screenshots/stickify-logo-256.png)

View your Microsoft Windows [Sticky Notes](http://windows.microsoft.com/en-us/windows7/using-sticky-notes) anywhere.

 1.  Get Stickify Pusher
===================
 - Download the pre-built Stickify binary [here](https://raw.githubusercontent.com/ansonl/stickify-pusher/master/dist/stickify.exe). 
 - Move `stickify.exe` to `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\`. Stickify will now open on login. 
    - You can find your user startup folder by copy pasting `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\` into Windows Explorer like below. 
    ![Windows 10 Explorer User Startup Folder Navigation](https://raw.githubusercontent.com/ansonl/stickify-web-app/gh-pages/guide/screenshots/win10-explorer-startup.png)
 - Run `stickify.exe` by double clicking on it.
   - ![Stickify Push screenshot](https://raw.githubusercontent.com/ansonl/stickify-web-app/gh-pages/guide/screenshots/stickify-pusher-screenshot.PNG)
	   - **Enter a nickname and PIN of choice.** You will need this information to view your stickies. 
	   - **Click the button to set your info.** 
	   - Go to step 2 below. 
- If you get an error about a missing DLL, your computer is missing the Microsoft Visual C++ Redistributable for VS 2015. The patch can be downloaded [here](http://www.microsoft.com/en-us/download/details.aspx?id=48145). 

2.  Use the Stickify web app
===================
- Go to Stickify (https://stickify.gq) on your device.

![Stickify login screen](https://raw.githubusercontent.com/ansonl/stickify-web-app/gh-pages/guide/screenshots/stickify-login.PNG)

- Enter the nickname and PIN you used in step 1 above. 
- Press the button to login.

![Stickify sample notes](https://raw.githubusercontent.com/ansonl/stickify-web-app/gh-pages/guide/screenshots/stickify-sample-notes.PNG)

- View your sticky notes. 

Notes
-------------
- `stickify.exe`connects to the *stickify.herokuapp.com* server. 
	- *stickify.herokuapp.com* is set to wipe nicknames and associated sticky notes if Sticky Pusher has not contacted the server in **24 hours**.

- Relevant code repositories on Github:  [Stickify Pusher](https://github.com/ansonl/stickify-pusher), [Stickify Server](https://github.com/ansonl/stickify-server), [Stickify web app](https://github.com/ansonl/stickify-web-app).
	- Pull requests and improvements welcome.