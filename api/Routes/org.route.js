const express = require("express");
const { body } = require("express-validator");
const { authenticateToken } = require("../Middleware/authToken");
const {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
} = require("../Controllers/org.controller");

const router = express.Router();

router.get("/", authenticateToken, getOrganisations);
router.get("/:orgId", authenticateToken, getOrganisation);
router.post(
  "/",
  authenticateToken,
  [body("name").notEmpty().withMessage("Organisation name is required")],
  createOrganisation
);
router.post(
  "/:orgId/users",
  authenticateToken,
  [body("userId").notEmpty().withMessage("User ID is required")],
  addUserToOrganisation
);

module.exports = router;
