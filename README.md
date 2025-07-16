<------------------------{asyncHandler}------------------------>

# const registerUser = asyncHandler(async (req, res) => {

# const { name, email, password } = req.body;

# // throw error or await something here

# });

# const registerUser = async (req, res, next) => {

# try {

# const { name, email, password } = req.body;

# } catch (err) {

# next(err);

# }

# };

# How Express Handles Errors

# When an error is passed to next(error), Express looks for an error-handling middleware like this:

app.use((err, req, res, next) => {
res.status(500).json({ message: err.message });
});

# So if something like await User.create() fails inside your registerUser function, it will be caught and handled gracefully.

------------------------------------<authMiddleware>------------------------------------
if (
req.headers.authorization &&
req.headers.authorization.startsWith('Bearer')
)
This is a conditional check to see if the incoming HTTP request has a valid authorization header that looks like a Bearer token.

✅ req.headers.authorization
This checks if the request has an Authorization header.

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
If the header is missing, this part will be undefined, and the condition fails.

✅ .startsWith('Bearer')
This ensures that the value of authorization starts with the word "Bearer".

JWT tokens are commonly sent like this:
Bearer <token>
So this checks whether the header follows the expected format.

--------------------------------<>---------------------------------------------------

--------------------------------<userController>-------------------------------------

const users = await User.find(keyword).find({ \_id: { $ne: req.user.\_id } }).select("-password");

✅ .find({ \_id: { $ne: req.user.\_id } })
Adds an additional filter: exclude the current user from the results.

$ne means “not equal” in MongoDB.

req.user.\_id refers to the ID of the currently logged-in user.

So this ensures the user doesn't see themselves in the search results.

✅ .select("-password")
Tells Mongoose to exclude the password field from the results.

"-password" means “do not include this field”.

Important for security reasons — you don’t want to expose user passwords (even if hashed).


<<........................................>>

| Expression                           | Sends to...                             | Includes Sender? |
| ------------------------------------ | --------------------------------------- | ---------------- |
| `io.emit(event, data)`               | **Everyone** connected                  | ✅ Yes            |
| `socket.emit(event, data)`           | **Only sender**                         | ✅ Yes            |
| `socket.broadcast.emit(event, data)` | **Everyone except sender**              | ❌ No             |
| `socket.in(room).emit(event, data)`  | **Everyone in room except sender**      | ❌ No             |
| `io.in(room).emit(event, data)`      | **Everyone in room (including sender)** | ✅ Yes            |

