const { assert } = require('chai');

const {   generateRandomString, getUserByEmail, findUserID, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "r4n6om" : {
    longURL: "https://www.udemy.com",
    userID: "danielA"
  }
};

describe('getUserByEmail', function() {
  it('should return a true with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedResult = true;
    assert.equal(user, expectedResult);
  });
});

describe('generateRandomString', function() {
  it("it should return a 6 random number that aren't the same" , function() {
    const randomNum1 = generateRandomString();
    const randomNum2 = generateRandomString();
    assert.notEqual(randomNum1, randomNum2);
  });
});

describe('findUserId' , function() {
  it('should return the ID of the user by comparing emails' , function() {
    const userID = findUserID(testUsers, "user2@example.com");
    const expectedResult = "user2RandomID";
    assert.equal(userID, expectedResult);
  });
});

describe('urlforUser', function() {
  it("should return an object which is the same as the id of the user", function() {
    const implementTheFunction = urlsForUser("danielA", urlDatabase);
    const resultObject = {"r4n6om" : {
      longURL: "https://www.udemy.com",
      userID: "danielA"
    }};
    assert.deepEqual(implementTheFunction, resultObject);
  });
});