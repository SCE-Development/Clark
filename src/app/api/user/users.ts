
const ROWS_PER_PAGE = 20;

// Search for all members
router.post('/users', async function(req, res) {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req)) {
      return res.sendStatus(UNAUTHORIZED);
    }
    let maybeOr = {};
    if (req.body.query) {
      maybeOr = {
        $or: ['firstName', 'lastName', 'email'].map((fieldName) => ({
          [fieldName]: {
            // req.body, req.query, req.body.query, oh man
            $regex: RegExp(req.body.query, 'i'),
          }
        }))
      };
    }
  
    // make sure that the page we want to see is 0 by default
    // and avoid negative page numbers
    let skip = Math.max(Number(req.body.page) || 0, 0);
    skip *= ROWS_PER_PAGE;
    const total = await User.count(maybeOr);
    User.find(maybeOr, { password: 0, }, { skip, limit: ROWS_PER_PAGE, })
      .sort({ joinDate: -1 })
      .then(items => {
        res.status(OK).send({ items, total, rowsPerPage: ROWS_PER_PAGE, });
      })
      .catch((e) => {
        res.sendStatus(BAD_REQUEST);
      });
  });
  
  