# svn setup

in `sumbission/svn` directory, run the following command to checkout the plugin from the wordpress svn repository:

```bash
svn checkout https://plugins.svn.wordpress.org/scrippet scrippet
```

# Links

* [wordpress svn repository](https://plugins.svn.wordpress.org/scrippet)
* [wordpress plugin page](https://wordpress.org/plugins/scrippet/)


## initial submission

```bash
cd scrippet
➜  scrippet git:(main) ✗ svn add trunk/*
A         trunk/LICENSE.txt
A         trunk/build
A         trunk/build/view.js
A         trunk/build/index.asset.php
A         trunk/build/style-index-rtl.css
A         trunk/build/style-index.css
A         trunk/build/index-rtl.css
A         trunk/build/index.css
A         trunk/build/view.asset.php
A         trunk/build/block.json
A         trunk/build/index.js
A         trunk/readme.txt
A         trunk/scrippet-block.php
➜  scrippet git:(main) ✗ svn commit -m 'version 1.0.1'
Authentication realm: <https://plugins.svn.wordpress.org:443> Use your WordPress.org login
Password for 'pcarion':

Authentication realm: <https://plugins.svn.wordpress.org:443> Use your WordPress.org login
Username: pcarion007
Password for 'pcarion007': ********************

Adding         trunk/LICENSE.txt
Adding         trunk/build
Adding         trunk/build/block.json
Adding         trunk/build/index-rtl.css
Adding         trunk/build/index.asset.php
Adding         trunk/build/index.css
Adding         trunk/build/index.js
Adding         trunk/build/style-index-rtl.css
Adding         trunk/build/style-index.css
Adding         trunk/build/view.asset.php
Adding         trunk/build/view.js
Adding         trunk/readme.txt
Adding         trunk/scrippet-block.php
Transmitting file data ............done
Committing transaction...
Committed revision 3144509.
➜  scrippet git:(main) ✗

➜  scrippet git:(main) ✗ svn add assets/*
A  (bin)  assets/screenshot-1.png
A  (bin)  assets/screenshot-2.png
A  (bin)  assets/screenshot-3.png
A  (bin)  assets/screenshot-4.png
➜  scrippet git:(main) ✗ svn commit -m 'version 1.0.1 (assets)'
Adding  (bin)  assets/screenshot-1.png
Adding  (bin)  assets/screenshot-2.png
Adding  (bin)  assets/screenshot-3.png
Adding  (bin)  assets/screenshot-4.png
Transmitting file data ....done
Committing transaction...
Committed revision 3144510.

✗ svn copy trunk tags/1.0.1
A         tags/1.0.1
➜  scrippet git:(main) ✗ svn commit -m 'version 1.0.1 (tags)'
Adding         tags/1.0.1
Adding         tags/1.0.1/LICENSE.txt
Adding         tags/1.0.1/build
Adding         tags/1.0.1/readme.txt
Adding         tags/1.0.1/scrippet-block.php
Committing transaction...
Committed revision 3144511.
```


## reference

* github action to push to wordpress svn:	https://github.com/10up/action-wordpress-plugin-deploy
