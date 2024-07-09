const express = require("express");
const { body } = require("express-validator");
const {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
} = require("../Controllers/org.controller");

const router = express.Router();

router.get("/", getOrganisations);
router.get("/:orgId", getOrganisation);
router.post(
  "/",
  [body("name").notEmpty().withMessage("Organisation name is required")],
  createOrganisation
);
router.post(
  "/:orgId/users",
  [body("userId").notEmpty().withMessage("User ID is required")],
  addUserToOrganisation
);

module.exports = router;
