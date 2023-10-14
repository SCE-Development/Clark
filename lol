## pagination

### recon
- can we get url params as is bro
    - yes
- how to update url values?
    - option 1: state only
        - pros: built in key value manage
        - cons: cannot share urls
        - read: this.props.location.state
        - write: this.props.history.push("/user-manager", { state: 'sample data'}); 
    - option 2: query params
        - pros: can share urls
        - cons: maybe more code but does it matter
        - write this.props.history.push("/user-manager?state=idk")

### game plan
- how to render page num given number of users in db?
- refactor existing api to return "pages" when prompted
- parsing query params helper function
- updating query params helper function
- default 20 users per page?
- implement page click, call above helper to update url
- implement search, call above helper when searching
- are we done lmao


```js
// old config
let a = {
"googleApiKeys": {
   "CLIENT_ID": "701987842374-e2gvfmdg7mnp3q4kq3mbo9t596o862s5.apps.googleusercontent.com",
   "CLIENT_SECRET": "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",
   "REDIRECT_URIS": [
     "https://developers.google.com/oauthplayground"
   ],
   "USER": "evanuxd@gmail.com",
   "REFRESH_TOKEN": "1//06BT5izdOARnECgYIARAAGAYSNwF-L9Ir_zFaSZmtB8OPRp0Po_iBwLZ31VTgC1M_aiaJ9P5SZQ-Db0eNufibu4_TYGq0tO-mKbA"
 }
}
```

from https://www.google.com/recaptcha/admin/site/564915367/setup
site key
6Len7KshAAAAABjfmNxn_izrSoqyDG01pgPibF1R
secret key
6Len7KshAAAAAMjnA66JMShpYln-Fn4dPXT7SUdY

## css for user manager page
> phone views, pagination will need to fix user account list

## css for about page
> probably a media tag to adjust 9 cell box and photo




