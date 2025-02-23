const { addInviteToDB, deleteInviteFromDB, getInvitesFromDB } = require("../db/inviteDB");
const { addMemberToProject } = require("../db/projectDB");
const { getUserFromDB } = require("../db/userDB");

class InviteController {
    inviteUser = async (req, res) => {
        try {
            const { projectId } = req.params;
            const { email } = req.body;
            const user = await getUserFromDB({email});
            const invite = await addInviteToDB(projectId, user.id);
            res.status(200).json({message: "Invite sent successfully", invite});
        } catch (error) {
            res.status(500).json({ error: "Error inviting user" });
        }
    }

    acceptInvite = async (req, res) => {
        try {
            const { projectId } = req.params;
            const userId = req.user.id;
            const invite = await addMemberToProject(projectId, userId);
            await deleteInviteFromDB(projectId, userId);
            res.status(200).json({message: "Invite accepted successfully", invite});
        } catch (error) {
            res.status(500).json({ error: "Error accepting invite" });
        }
    }

    getInvites = async (req, res) => {
        try {
            const userId = req.user.id;
            const invites = await getInvitesFromDB(userId);
            console.log(invites);
            res.status(200).json({message: "Invites fetched successfully", invites});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error fetching invites" });
        }
    }

    declineInvite = async (req, res) => {
        try {
            const { projectId } = req.params;
            const userId = req.user.id;
            await deleteInviteFromDB(projectId, userId);
            res.status(200).json({ message: "Invite declined" });
        } catch (error) {
            res.status(500).json({ error: "Error declining invite" });
        }
    }
}

module.exports = new InviteController();
