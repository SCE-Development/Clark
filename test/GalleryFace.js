/* eslint-disable max-len */
/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const {
  GalleryFace,
  GalleryImage,
} = require('../api/main_endpoints/models/GalleryFace');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/util/constants');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN,
} = constants.STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
// tools for testing
const tools = require('./util/tools/tools.js');
const {
  initializeMock,
  setTokenStatus,
  resetMock,
  restoreMock,
} = require('./util/mocks/TokenValidFunctions');
const { ObjectId } = require('mongodb');

chai.should();
chai.use(chaiHttp);

describe('GalleryFace', () => {
  before((done) => {
    initializeMock();
    app = tools.initializeServer(
      __dirname + '/../api/main_endpoints/routes/GalleryFace.js'
    );
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(GalleryImage);
    tools.emptySchema(GalleryFace);
    done();
  });

  after((done) => {
    restoreMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetMock();
  });

  const token = '';

  const VALID_FACE_WITHOUT_IMAGE_ID_1 = {
    name: 'Face_1.png',
    top: 1,
    left: 1,
    width: 101,
    height: 101,
  };
  const VALID_IMAGE_WITH_NO_FACE = {
    name: 'VLD_Image_1.jpg',
    width: 1000,
    height: 1000,
    faces: [],
  };
  const FACE_WITHOUT_REQUIRED_FIELD = {};
  const IMAGE_WITHOUT_REQUIRED_FIELD = {};
  const FACE_WITH_INVALID_ID = {
    id: ObjectId('000000000000'),
  };
  const IMAGE_WITH_INVALID_ID = {
    id: ObjectId('000000000000'),
  };
  const IMAGE_WITH_WEIRD_NAME = {
    name: 'Hola Como estas? Soy bien.',
    width: 1000,
    height: 1000,
    faces: [],
  };

  describe('/POST createImage', () => {
    it('Should return sendstatus FORBIDDEN(403) when token not send', async () => {
      const result = await test.sendPostRequest(
        '/api/GalleryFace/createImage',
        IMAGE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return sendStatus UNAUTHORIZED(401) when unauthorized token send', async () => {
      setTokenStatus(false);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        IMAGE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return BAD_REQUEST(400) when required field not entered', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        IMAGE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return OK(200) when valid image informations entered', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST createAndAddFace', () => {
    it('Should return sendstatus FORBIDDEN(403) when token not send', async () => {
      const result = await test.sendPostRequest(
        '/api/GalleryFace/createAndAddFace',
        FACE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return sendStatus UNAUTHORIZED(401) when unauthorized token send', async () => {
      setTokenStatus(false);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createAndAddFace',
        FACE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return BAD_REQUEST(400) when required field not entered', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createAndAddFace',
        FACE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return NOT_FOUND(404) when GalleryImage not found with id given', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createAndAddFace',
        { id: ObjectId('000000000000'), ...VALID_FACE_WITHOUT_IMAGE_ID_1 }
      );
      expect(result).to.have.status(NOT_FOUND);
    });
    it('Should return OK(200) when GalleryFace created and successfully added to DB', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createAndAddFace',
        { id: Image['body']['_id'], ...VALID_FACE_WITHOUT_IMAGE_ID_1 }
      );
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST getImageByName', () => {
    it('Should return OK(200) when valid Image name and invalid token given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      setTokenStatus(false);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getImageByName',
        VALID_IMAGE_WITH_NO_FACE
      );
      expect(result).to.have.status(OK);
    });
    it('Should return OK(200) when valid Image name and token given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getImageByName',
        VALID_IMAGE_WITH_NO_FACE
      );
      expect(result).to.have.status(OK);
    });
    it('Should return NOT_FOUND(404) when Image with given name not found', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getImageByName',
        IMAGE_WITH_WEIRD_NAME
      );
      expect(result).to.have.status(NOT_FOUND);
    });
  });

  describe('/POST getImageByID', () => {
    it('Should return NOT_FOUND(404) when image with invalid ID given', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getImageByName',
        IMAGE_WITH_INVALID_ID
      );
      expect(result).to.have.status(NOT_FOUND);
    });
    it('Should return OK(200) when image with valid ID, valid token given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getImageByID',
        { id: Image['body']['_id'] }
      );
      expect(result).to.have.status(OK);
    });
    it('Should return OK(200) when image with valid ID, invalid token given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      setTokenStatus(false);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getImageByID',
        { id: Image['body']['_id'] }
      );
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST getFaceInformation', () => {
    it('Should Return NOT_FOUND when face with invalid ID given', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getFaceInformation',
        FACE_WITH_INVALID_ID
      );
      expect(result).to.have.status(NOT_FOUND);
    });
    it('Should return OK(200) when Face with valid ID, valid token given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      const Face = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createAndAddFace',
        { id: Image['body']['_id'], ...VALID_FACE_WITHOUT_IMAGE_ID_1 }
      );
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getFaceInformation',
        { id: Face['body']['post']['_id'] }
      );
      expect(result).to.have.status(OK);
    });
    it('Should return OK(200) when Face with valid ID, invalid token given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      const Face = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createAndAddFace',
        { id: Image['body']['_id'], ...VALID_FACE_WITHOUT_IMAGE_ID_1 }
      );
      setTokenStatus(false);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/getFaceInformation',
        { id: Face['body']['post']['_id'] }
      );
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST deleteFace', () => {
    it('Should return sendstatus FORBIDDEN(403) when token not send', async () => {
      const result = await test.sendPostRequest(
        '/api/GalleryFace/deleteFace',
        FACE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return sendStatus UNAUTHORIZED(401) when unauthorized token send', async () => {
      setTokenStatus(false);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/deleteFace',
        FACE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return OK(200) when Face with valid ID given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      const Face = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createAndAddFace',
        { id: Image['body']['_id'], ...VALID_FACE_WITHOUT_IMAGE_ID_1 }
      );
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/deleteFace',
        { id: Face['body']['post']['_id'] }
      );
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST deleteImage', () => {
    it('Should return sendstatus FORBIDDEN(403) when token not send', async () => {
      const result = await test.sendPostRequest(
        '/api/GalleryFace/deleteImage',
        IMAGE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return sendStatus UNAUTHORIZED(401) when unauthorized token send', async () => {
      setTokenStatus(false);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/deleteImage',
        IMAGE_WITHOUT_REQUIRED_FIELD
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return OK(200) when Image with valid ID given', async () => {
      setTokenStatus(true);
      const Image = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/createImage',
        VALID_IMAGE_WITH_NO_FACE
      );
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/GalleryFace/deleteImage',
        { id: Image['body']['_id'] }
      );
      expect(result).to.have.status(OK);
    });
  });
});
