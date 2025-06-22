<------------------------{asyncHandler}------------------------>

# const registerUser = asyncHandler(async (req, res) => {
#  const { name, email, password } = req.body;
#  // throw error or await something here
# });

# const registerUser = async (req, res, next) => {
#  try {
#    const { name, email, password } = req.body;
#  } catch (err) {
#    next(err);
#  }
# };

# How Express Handles Errors
# When an error is passed to next(error), Express looks for an error-handling middleware like this:

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

# So if something like await User.create() fails inside your registerUser function, it will be caught and handled gracefully.


