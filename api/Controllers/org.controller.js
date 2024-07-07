const Organisation = require("../Models/organisation.model");
const User = require("../Models/user.model");

const getOrganisations = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: Organisation,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Organisations fetched successfully",
      data: {
        organisations: user.Organisations,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrganisation = async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.orgId);

    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation fetched successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;

  try {
    const organisation = await Organisation.create({
      name,
      description,
    });

    await req.user.addOrganisation(organisation);

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

const addUserToOrganisation = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const organisation = await Organisation.findByPk(req.params.orgId);

    if (!user || !organisation) {
      return res
        .status(404)
        .json({ message: "User or Organisation not found" });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

module.exports = {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
};
