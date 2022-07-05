//function that generates a random string
const generateRandomString = function () {
  let randomString = '';
  const allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < 6; i++) {
    randomString += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }
  return randomString;
}

//function that will take two parameters and will compare 
const getUserByEmail = function(users, emailPassed) {
  for (let user in users) {
  if(users[user].email === emailPassed) {
    return true;
  }
  }
  return false;
};

//function that will help us find the id
const findUserID = function(users, emailPassed) {
  for (let ids in users) {
    if(users[ids].email === emailPassed) {
      return users[ids].id
    }

  }
}

//function that creates a new object userSpecificURL
const urlsForUser = function (id, urlDatabase) {
  let userSpecificURL = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userSpecificURL[shortURL] = urlDatabase[shortURL]; 

    }
  }
  return userSpecificURL;
}

module.exports = {
  generateRandomString,
  getUserByEmail,
  findUserID,
  urlsForUser
}