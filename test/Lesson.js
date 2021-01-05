/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = "test";
const Lesson = require("../api/main_endpoints/models/Course");
const User = require("../api/main_endpoints/models/User");
// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const constants = require("../api/util/constants");
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require("./util/tools/SceApiTester");

let app = null;
let test = null;
const expect = chai.expect;
// tools for testing
const tools = require("./util/tools/tools.js");
const {
  initializeMock,
  setTokenStatus,
  resetMock,
  restoreMock
} = require("./util/mocks/TokenValidFunctions");

chai.should();
chai.use(chaiHttp);

describe("Lesson", () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(
      __dirname + "/../api/main_endpoints/routes/Lesson.js"
    );
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(Lesson);
    tools.emptySchema(User);
    done();
  });

  after(done => {
    restoreMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetMock();
  });

  const token = "";
  let lessonId = "";
  const VALID_NEW_LESSON = {
    title: "intro to react",
    link: "https://google.com"
  };
  const LESSON_WITH_INVALID_TOKEN = {
    token: "invalid"
  };
  const LESSON_WITHOUT_REQUIRED_FIELDS = {
    title: "intro to react"
  };
  const LESSON_WITH_INVALID_ID = {
    id: "strawberry"
  };
  const UPDATED_LESSON = {
    title: "intro to react",
    link: "https://google.com"
  };

  describe("/POST createLesson", () => {
    it("Should return 403 when an invalid token is supplied", async () => {
      const result = await test.sendPostRequest(
        "/api/lesson/createLesson",
        LESSON_WITH_INVALID_TOKEN
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it("Should return 400 when the required fields aren't filled in", async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        "/api/lesson/createLesson",
        LESSON_WITHOUT_REQUIRED_FIELDS
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it(
      "Should return statusCode 200 when all required " +
        "fields are filled in",
      async () => {
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token,
          "/api/lesson/createLesson",
          VALID_NEW_LESSON
        );
        expect(result).to.have.status(OK);
      }
    );
  });

  describe("/GET getLessons", () => {
    it("Should return an object of all lessons", async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest("/api/lesson/getLessons");
      expect(result).to.have.status(OK);
      const getLessonsResponse = result.body;
      getLessonsResponse.should.be.a("array");
      expect(getLessonsResponse).to.have.length(1);
      expect(getLessonsResponse[0].title).to.equal(VALID_NEW_LESSON.title);
      expect(getLessonsResponse[0].link).to.equal(VALID_NEW_LESSON.link);
      lessonId = getLessonsResponse[0]._id;
    });
  });

  describe("/POST editLesson", () => {
    it("Should return 403 when an invalid token is supplied", async () => {
      const result = await test.sendPostRequestWithToken(
        token,
        "/api/lesson/editLesson",
        LESSON_WITH_INVALID_TOKEN
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it(
      "Should return 404 when a lesson by an " + "invalid id isn't found",
      async () => {
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token,
          "/api/lesson/editLesson",
          LESSON_WITH_INVALID_ID
        );
        expect(result).to.have.status(NOT_FOUND);
      }
    );
    it("Should return 200 when a lesson is sucessfully updated", async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        "/api/lesson/editLesson",
        { id: lessonId, ...UPDATED_LESSON }
      );
      expect(result).to.have.status(OK);
    });
    it("The update should be reflected in the database", async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest("/api/lesson/getLessons");
      expect(result).to.have.status(OK);
      const getLessonsResponse = result.body;
      expect(getLessonsResponse).to.have.length(1);
      expect(getLessonsResponse[0].title).to.equal(UPDATED_LESSON.title);
      expect(getLessonsResponse[0].link).to.equal(UPDATED_LESSON.link);
    });
  });

  describe("/POST deleteLesson", () => {
    it("Should return 403 when an invalid token is supplied", async () => {
      const result = await test.sendPostRequestWithToken(
        token,
        "/api/lesson/deleteLesson",
        LESSON_WITH_INVALID_TOKEN
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it("Should return 400 when a lesson is unsucessfully deleted", async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        "/api/lesson/deleteLesson",
        LESSON_WITH_INVALID_ID
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it("Should return 200 when a lesson is sucessfully deleted", async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        "/api/lesson/deleteLesson",
        { id: lessonId }
      );
      expect(result).to.have.status(OK);
    });
    it("The deleted item should be reflected in the database", async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest("/api/lesson/getLessons");
      expect(result).to.have.status(OK);
      const getLessonsResponse = result.body;
      getLessonsResponse.should.be.a("array");
      expect(getLessonsResponse).to.have.length(0);
    });
  });
});
