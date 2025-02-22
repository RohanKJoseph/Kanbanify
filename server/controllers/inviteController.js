const { addInviteToDB, deleteInviteFromDB } = require("../db/inviteDB");
const { addMemberToProject } = require("../db/projectDB");
const { getUserFromDB } = require("../db/userDB");

class InviteController {
    inviteUser = async (req, res) => {
        const { projectId } = req.params;
        const { email } = req.body;
        const user = await getUserFromDB({email});
        const invite = await addInviteToDB(projectId, user.id);
        res.status(200).json(invite);
    }

    acceptInvite = async (req, res) => {
        const { projectId } = req.params;
        const userId = req.user.id;
        const invite = await addMemberToProject(projectId, userId);
        await deleteInviteFromDB(projectId, userId);
        res.status(200).json(invite);
    }

    getInvites = async (req, res) => {
        const userId = req.user.id;
        const invites = await getInvitesFromDB(userId);
        res.status(200).json(invites);
    }

    declineInvite = async (req, res) => {
        const { projectId } = req.params;
        const userId = req.user.id;
        await deleteInviteFromDB(projectId, userId);
        res.status(200).json({ message: "Invite declined" });
    }
}

module.exports = new InviteController();
